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
  const [error, setError] = useState(null);

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
    console.log(111, model);
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
  const handleGenerateQuestions = (chunkIds) => {
    console.log('生成问题:', chunkIds);
    // TODO: 实现生成问题功能
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
          <Typography variant="body2" color="text.secondary">正在处理文献，请稍候</Typography>
        </Paper>
      </Backdrop>

      {/* 错误提示 */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
