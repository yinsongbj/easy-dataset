'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Alert,
  Snackbar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import UploadArea from './components/UploadArea';
import FileList from './components/FileList';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import ModelSelect from '@/components/ModelSelect';

/**
 * 文件上传组件
 * @param {Object} props
 * @param {string} props.projectId - 项目ID
 * @param {Function} props.onUploadSuccess - 上传成功回调
 * @param {Function} props.onProcessStart - 处理开始回调
 */
export default function FileUploader({ projectId, onUploadSuccess, onProcessStart, onFileDeleted }) {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([]);

  // 加载模型列表
  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(`/api/projects/${projectId}/models`);
        if (!response.ok) {
          throw new Error('获取模型列表失败');
        }
        const data = await response.json();
        setModels(data);
      } catch (error) {
        console.error('获取模型列表出错:', error);
        setError(error.message);
      }
    }
    fetchModels();
  }, [projectId]);

  // 加载已上传的文件列表
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  // 获取已上传的文件列表
  const fetchUploadedFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/files`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取文件列表失败');
      }

      const data = await response.json();
      setUploadedFiles(data.files || []);
    } catch (error) {
      console.error('获取文件列表出错:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 处理文件选择
  const handleFileSelect = (event) => {
    // 如果已有上传文件，不允许选择新文件
    if (uploadedFiles.length > 0) {
      setError("一个项目限制处理一个文件，如需上传新文件请先删除现有文件");
      return;
    }
    const selectedFiles = Array.from(event.target.files);

    // 检查文件类型
    const validFiles = selectedFiles.filter(file => file.name.endsWith('.md'));
    const invalidFiles = selectedFiles.filter(file => !file.name.endsWith('.md'));

    if (invalidFiles.length > 0) {
      setError(`不支持的文件格式: ${invalidFiles.map(f => f.name).join(', ')}。目前仅支持Markdown文件。`);
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  // 移除文件
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 上传文件
  const uploadFiles = async () => {
    if (files.length === 0) return;

    // 打开模型选择对话框
    setModelDialogOpen(true);
  };

  // 处理模型选择
  const handleModelSelect = async (event) => {
    setSelectedModel(event.target.value);
  };

  // 确认模型选择并开始上传
  const handleConfirmModelSelect = async () => {
    setModelDialogOpen(false);
    setUploading(true);
    setError(null);

    try {
      const uploadedFileNames = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/projects/${projectId}/files`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '上传文件失败');
        }

        const data = await response.json();
        uploadedFileNames.push(data.fileName);
      }

      setSuccessMessage(`成功上传 ${files.length} 个文件`);
      setSuccess(true);
      setFiles([]);

      await fetchUploadedFiles();

      // 获取选中模型的详细信息
      const selectedModelInfo = models.find(m => m.id === selectedModel);

      // 上传成功后，返回文件名列表和选中的模型信息
      if (onUploadSuccess) {
        onUploadSuccess(uploadedFileNames, selectedModelInfo);
      }
    } catch (err) {
      setError(err.message || '上传文件失败');
    } finally {
      setUploading(false);
    }
  };

  // 打开删除确认对话框
  const openDeleteConfirm = (fileName) => {
    setFileToDelete(fileName);
    setDeleteConfirmOpen(true);
  };

  // 关闭删除确认对话框
  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setFileToDelete(null);
  };

  // 处理删除文件
  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      setLoading(true);
      closeDeleteConfirm();

      const response = await fetch(`/api/projects/${projectId}/files?fileName=${encodeURIComponent(fileToDelete)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除文件失败');
      }

      // 刷新文件列表
      await fetchUploadedFiles();

      // 通知父组件文件已删除，需要刷新文本块列表
      if (onFileDeleted) {
        onFileDeleted(fileToDelete);
      }

      setSuccessMessage(`成功删除文件 ${fileToDelete}`);
      setSuccess(true);
      location.reload();
    } catch (error) {
      console.error('删除文件出错:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setFileToDelete(null);
    }
  };

  // 关闭错误提示
  const handleCloseError = () => {
    setError(null);
  };

  // 关闭成功提示
  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2
      }}
    >
      <Grid container spacing={3}>
        {/* 左侧：上传文件区域 */}
        <Grid item xs={12} md={6} sx={{ maxWidth: '100%', width: '100%' }}>
          <UploadArea
            theme={theme}
            files={files}
            uploading={uploading}
            uploadedFiles={uploadedFiles}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeFile}
            onUpload={uploadFiles}
          />
        </Grid>

        {/* 右侧：已上传文件列表 */}
        <Grid item xs={12} md={6} sx={{ maxWidth: '100%', width: '100%' }}>
          <FileList
            theme={theme}
            files={uploadedFiles}
            loading={loading}
            onDeleteFile={openDeleteConfirm}
          />
        </Grid>
      </Grid>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={success} autoHideDuration={3000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={modelDialogOpen}
        onClose={() => setModelDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2A5CAA',
            color: 'white',
            minHeight: '200px',
            minWidth: '100px',
            '& .MuiDialogTitle-root': {
              color: 'white',
              padding: '20px 24px'
            },
            '& .MuiDialogContent-root': {
              color: 'white',
              padding: '20px 24px'
            },
            '& .MuiDialogActions-root': {
              padding: '20px 24px'
            }
          }
        }}>
        <DialogTitle>选择模型（用于构建领域标签）</DialogTitle>
        <DialogContent>
          <ModelSelect
            models={models}
            selectedModel={selectedModel}
            onChange={handleModelSelect}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModelDialogOpen(false)} sx={{ color: 'white' }}>取消</Button>
          <Button
            onClick={handleConfirmModelSelect}
            variant="contained"
            disabled={!selectedModel}
            sx={{
              bgcolor: 'white',
              color: '#2A5CAA',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            确认并上传
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        fileName={fileToDelete}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteFile}
      />
    </Paper>
  );
}
