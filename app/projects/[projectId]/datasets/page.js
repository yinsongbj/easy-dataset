'use client';

import { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function DatasetsPage({ params }) {
  const { projectId } = params;
  const [datasets, setDatasets] = useState([
    { 
      id: '1', 
      name: '基础AI问答数据集', 
      status: 'completed', 
      questionsCount: 15, 
      format: 'JSON', 
      createdAt: '2025-03-01 14:30'
    },
    { 
      id: '2', 
      name: '高级深度学习数据集', 
      status: 'completed', 
      questionsCount: 8, 
      format: 'CSV', 
      createdAt: '2025-03-02 10:15'
    }
  ]);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newDataset, setNewDataset] = useState({
    name: '',
    format: 'JSON'
  });
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDataset(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGenerateDataset = () => {
    if (!newDataset.name) return;
    
    setGenerating(true);
    
    // 模拟数据集生成过程
    setTimeout(() => {
      const dataset = {
        id: Date.now().toString(),
        name: newDataset.name,
        status: 'completed',
        questionsCount: Math.floor(Math.random() * 20) + 5,
        format: newDataset.format,
        createdAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', '')
      };
      
      setDatasets(prev => [...prev, dataset]);
      setGenerating(false);
      handleCloseDialog();
      
      // 重置表单
      setNewDataset({
        name: '',
        format: 'JSON'
      });
    }, 2000);
  };
  
  const handleDownload = (id) => {
    // 模拟下载功能
    alert(`下载数据集 ${id}`);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'processing':
        return '处理中';
      case 'failed':
        return '失败';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          数据集
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={handleOpenDialog}
        >
          生成数据集
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>数据集名称</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>问题数量</TableCell>
              <TableCell>格式</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">暂无数据集</TableCell>
              </TableRow>
            ) : (
              datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell>{dataset.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusText(dataset.status)} 
                      color={getStatusColor(dataset.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{dataset.questionsCount}</TableCell>
                  <TableCell>{dataset.format}</TableCell>
                  <TableCell>{dataset.createdAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(dataset.id)}
                      disabled={dataset.status !== 'completed'}
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
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>生成新数据集</DialogTitle>
        <DialogContent>
          <DialogContentText>
            系统将根据您的问题列表生成数据集。请指定数据集名称和导出格式。
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="数据集名称"
            fullWidth
            variant="outlined"
            value={newDataset.name}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel id="format-label">导出格式</InputLabel>
            <Select
              labelId="format-label"
              id="format"
              name="format"
              value={newDataset.format}
              label="导出格式"
              onChange={handleInputChange}
            >
              <MenuItem value="JSON">JSON</MenuItem>
              <MenuItem value="CSV">CSV</MenuItem>
              <MenuItem value="Excel">Excel</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button 
            onClick={handleGenerateDataset} 
            variant="contained"
            disabled={!newDataset.name || generating}
            startIcon={generating ? <CircularProgress size={20} /> : null}
          >
            {generating ? '生成中...' : '生成'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
