'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { useTheme, alpha } from '@mui/material/styles';

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

    setUploading(true);
    setError(null);

    try {
      // 逐个上传文件
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

      // 刷新文件列表
      await fetchUploadedFiles();

      // 上传成功后，返回文件名列表
      if (onUploadSuccess) {
        onUploadSuccess(uploadedFileNames);
      }
    } catch (err) {
      setError(err.message || '上传文件失败');
    } finally {
      setUploading(false);
    }
  };

  // 处理分割文本
  const handleSplitText = (fileName) => {
    if (onProcessStart) {
      onProcessStart(fileName);
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              height: '100%',
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                borderColor: alpha(theme.palette.primary.main, 0.3),
              }
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              上传新文献
            </Typography>

            <Button
              component="label"
              variant="contained"
              startIcon={<UploadFileIcon />}
              sx={{ mb: 2, mt: 2 }}
              disabled={uploading || uploadedFiles.length > 0}
            >
              选择文件
              <input
                type="file"
                hidden
                accept=".md"
                multiple
                onChange={handleFileSelect}
                disabled={uploadedFiles.length > 0}
              />
            </Button>

            <Typography variant="body2" color="textSecondary">
              {uploadedFiles.length > 0 ? (
                "一个项目限制处理一个文件，如需上传新文件请先删除现有文件"
              ) : (
                "目前仅支持上传 Markdown (.md) 格式文件"
              )}
            </Typography>

            {files.length > 0 && (
              <Box sx={{ mt: 3, width: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  已选择文件（{files.length}）
                </Typography>

                <List sx={{ bgcolor: theme.palette.background.paper, borderRadius: 1, maxHeight: '200px', overflow: 'auto' }}>
                  {files.map((file, index) => (
                    <Box key={index}>
                      <ListItem
                        secondaryAction={
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => removeFile(index)}
                            disabled={uploading}
                          >
                            删除
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(2)} KB`}
                        />
                      </ListItem>
                      {index < files.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={uploadFiles}
                    disabled={uploading}
                    sx={{ minWidth: 120 }}
                  >
                    {uploading ? <CircularProgress size={24} /> : '上传文件'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        {/* 右侧：已上传文件列表 */}
        <Grid item xs={12} md={6} sx={{ maxWidth: '100%', width: '100%' }}>
          <Box
            sx={{
              height: '100%',
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              已上传文献
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : uploadedFiles.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  暂无上传文件
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: '300px', overflow: 'auto', width: '100%' }}>
                {uploadedFiles.map((file, index) => (
                  <Box key={index}>
                    <ListItem
                      secondaryAction={
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="删除文献">
                            <IconButton
                              color="error"
                              onClick={() => openDeleteConfirm(file.name)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileIcon color="primary" sx={{ mr: 1 }} />
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB · ${new Date(file.createdAt).toLocaleString()}`}
                        />
                      </Box>
                    </ListItem>
                    {index < uploadedFiles.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </Box>
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

      {/* 删除确认对话框 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={closeDeleteConfirm}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          确认删除文献
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            您确定要删除文献「{fileToDelete}」吗？删除后将同时删除所有相关的文本块和目录结构。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm} color="primary">
            取消
          </Button>
          <Button onClick={handleDeleteFile} color="error" variant="contained">
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
