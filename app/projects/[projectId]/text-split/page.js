'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Snackbar,
  Backdrop,
  Paper
} from '@mui/material';
import FileUploader from '@/components/text-split/FileUploader';
import ChunkList from '@/components/text-split/ChunkList';
import DomainAnalysis from '@/components/text-split/DomainAnalysis';

export default function TextSplitPage({ params }) {
  const { projectId } = params;
  const [activeTab, setActiveTab] = useState(0);
  const [chunks, setChunks] = useState([]);
  const [tocData, setTocData] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null); // 可以是字符串或对象 { severity, message }

  // 加载文本块数据
  useEffect(() => {
    fetchChunks();
  }, []);

  // 获取文本块列表
  const fetchChunks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/split`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取文本块失败');
      }

      const data = await response.json();
      setChunks(data.chunks || []);

      // 如果有文件结果，处理详细信息
      if (data.toc) {
        console.log('获取到文件结果:', data.fileResult);
        // 如果有目录结构，设置目录数据
        setTocData(data.toc);
      }

      // 如果有标签，设置标签数据
      if (data.tags) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error('获取文本块出错:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 处理标签切换
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 处理文件上传成功
  const handleUploadSuccess = (fileNames, model) => {
    console.log(`文件上传成功:`, fileNames);
    // 如果有文件上传成功，自动处理第一个文件
    if (fileNames && fileNames.length > 0) {
      handleSplitText(fileNames[0], model);
    }
  };

  // 处理文本分割
  const handleSplitText = async (fileName, model) => {
    try {
      setProcessing(true);

      const response = await fetch(`/api/projects/${projectId}/split`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName, model })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '文本分割失败');
      }

      const data = await response.json();

      // 更新文本块列表
      setChunks(prev => {
        const newChunks = [...prev];
        data.chunks.forEach(chunk => {
          if (!newChunks.find(c => c.id === chunk.id)) {
            newChunks.push(chunk);
          }
        });
        return newChunks;
      });

      // 更新目录结构
      if (data.toc) {
        setTocData(data.toc);
      }

      // 自动切换到智能分割标签
      setActiveTab(0);
    } catch (error) {
      console.error('文本分割出错:', error);
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  // 处理删除文本块
  const handleDeleteChunk = async (chunkId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/chunks/${chunkId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除文本块失败');
      }

      // 更新文本块列表
      setChunks(prev => prev.filter(chunk => chunk.id !== chunkId));
    } catch (error) {
      console.error('删除文本块出错:', error);
      setError(error.message);
    }
  };

  // 处理生成问题
  const handleGenerateQuestions = async (chunkIds) => {
    try {
      setProcessing(true);
      setError(null);

      // 从 localStorage 获取当前选择的模型信息
      const selectedModelId = localStorage.getItem('selectedModelId');
      let model = null;

      // 尝试从 localStorage 获取完整的模型信息
      const modelInfoStr = localStorage.getItem('selectedModelInfo');

      if (modelInfoStr) {
        try {
          model = JSON.parse(modelInfoStr);
        } catch (e) {
          console.error('解析模型信息出错:', e);
          // 继续执行，将在下面尝试获取模型信息
        }
      }

      // 如果仍然没有模型信息，抛出错误
      if (!selectedModelId) {
        throw new Error('请先选择一个模型，可以在顶部导航栏选择');
      }

      if (!model) {
        throw new Error('选择的模型不可用，请重新选择');
      }

      // 如果是单个文本块，直接调用单个生成接口
      if (chunkIds.length === 1) {
        const chunkId = chunkIds[0];
        const response = await fetch(`/api/projects/${projectId}/chunks/${chunkId}/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ model })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `为文本块 ${chunkId} 生成问题失败`);
        }

        const data = await response.json();
        console.log(`为文本块 ${chunkId} 生成了 ${data.total} 个问题`);
        setError({ severity: 'success', message: `成功为文本块生成了 ${data.total} 个问题` });
      } else {
        // 如果是多个文本块，调用批量生成接口
        const response = await fetch(`/api/projects/${projectId}/generate-questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ model, chunkIds })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '批量生成问题失败');
        }

        const data = await response.json();
        console.log(`批量生成问题成功: ${data.totalSuccess} 个成功，${data.totalErrors} 个失败`);

        if (data.totalErrors > 0) {
          setError({
            severity: 'warning',
            message: `部分文本块生成问题成功 (${data.totalSuccess}/${data.totalChunks})，${data.totalErrors} 个文本块失败`
          });
        } else {
          setError({
            severity: 'success',
            message: `成功为 ${data.totalSuccess} 个文本块生成问题`
          });
        }
      }

      // 刷新文本块列表
      fetchChunks();
    } catch (error) {
      console.error('生成问题出错:', error);
      setError({ severity: 'error', message: error.message });
    } finally {
      setProcessing(false);
    }
  };

  // 处理文件删除
  const handleFileDeleted = (fileName) => {
    console.log(`文件 ${fileName} 已删除，刷新文本块列表`);
    // 刷新文本块列表
    fetchChunks();
  };

  // 关闭错误提示
  const handleCloseError = () => {
    setError(null);
  };

  // 处理错误或成功提示
  const renderAlert = () => {
    if (!error) return null;

    const severity = error.severity || 'error';
    const message = typeof error === 'string' ? error : error.message;

    return (
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8, position: 'relative' }}>
      {/* 文件上传组件 */}
      <FileUploader
        projectId={projectId}
        onUploadSuccess={handleUploadSuccess}
        onProcessStart={handleSplitText}
        onFileDeleted={handleFileDeleted}
      />

      {/* 标签页 */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="智能分割" />
          <Tab label="领域分析" />
        </Tabs>

        {/* 智能分割标签内容 */}
        {activeTab === 0 && (
          <ChunkList
            projectId={projectId}
            chunks={chunks}
            onDelete={handleDeleteChunk}
            onGenerateQuestions={handleGenerateQuestions}
            loading={loading}
          />
        )}

        {/* 领域分析标签内容 */}
        {activeTab === 1 && (
          <DomainAnalysis
            projectId={projectId}
            toc={tocData}
            loading={loading}
            tags={tags}
          />
        )}
      </Box>

      {/* 加载中蒙版 */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'fixed',
          backdropFilter: 'blur(3px)'
        }}
        open={loading}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            minWidth: 200
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6">加载中...</Typography>
          <Typography variant="body2" color="text.secondary">正在获取文献数据</Typography>
        </Paper>
      </Backdrop>

      {/* 处理中蒙版 */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'fixed',
          backdropFilter: 'blur(3px)'
        }}
        open={processing}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            minWidth: 200
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6">处理中...</Typography>
          <Typography variant="body2" color="text.secondary">正在努力处理中，请稍候！</Typography>
        </Paper>
      </Backdrop>

      {/* 错误或成功提示 */}
      {renderAlert()}
    </Container>
  );
}
