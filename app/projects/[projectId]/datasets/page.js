'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function DatasetsPage({ params }) {
  const { projectId } = params;
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // 获取数据集列表
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}/datasets`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '获取数据集失败');
        }

        const data = await response.json();
        setDatasets(data || []);
      } catch (error) {
        console.error('获取数据集失败:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [projectId]);

  // 处理下载数据集
  const handleDownload = async (id) => {
    try {
      const dataset = datasets.find(d => d.id === id);
      if (!dataset) {
        throw new Error('数据集不存在');
      }

      // 创建下载内容
      const content = {
        id: dataset.id,
        question: dataset.question,
        answer: dataset.answer,
        createdAt: dataset.createdAt,
        questionLabel: dataset.questionLabel
      };

      // 创建下载链接
      const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dataset-${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: '数据集下载成功',
        severity: 'success'
      });
    } catch (error) {
      console.error('下载数据集失败:', error);
      setSnackbar({
        open: true,
        message: error.message || '下载数据集失败',
        severity: 'error'
      });
    }
  };

  // 关闭提示框
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          数据集
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>问题</TableCell>
              <TableCell>答案</TableCell>
              <TableCell>标签</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">暂无数据集</TableCell>
              </TableRow>
            ) : (
              datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell sx={{ maxWidth: 300, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {dataset.question}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 400, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {dataset.answer}
                  </TableCell>
                  <TableCell>
                    {dataset.questionLabel ? (
                      <Chip
                        label={dataset.questionLabel}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        无标签
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(dataset.createdAt).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(dataset.id)}
                    >
                      下载
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}