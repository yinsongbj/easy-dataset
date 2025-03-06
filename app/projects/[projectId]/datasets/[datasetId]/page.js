'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  Chip,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

// 编辑区域组件
const EditableField = ({
  label,
  value,
  multiline = true,
  editing,
  onEdit,
  onChange,
  onSave,
  onCancel
}) => {

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mr: 1 }}>
          {label}
        </Typography>
        {!editing && (
          <IconButton size="small" onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      {editing ? (
        <Box>
          <TextField
            fullWidth
            multiline={multiline}
            rows={multiline ? 10 : 1}
            value={value}
            onChange={onChange}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={onCancel}>取消</Button>
            <Button size="small" variant="contained" onClick={onSave}>保存</Button>
          </Box>
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            bgcolor: 'grey.50',
            p: 2,
            borderRadius: 1
          }}
        >
          {value || '无'}
        </Typography>
      )}
    </Box>
  );
};

export default function DatasetDetailsPage({ params }) {
  const { projectId, datasetId } = params;
  const router = useRouter();
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingAnswer, setEditingAnswer] = useState(false);
  const [editingCot, setEditingCot] = useState(false);
  const [answerValue, setAnswerValue] = useState('');
  const [cotValue, setCotValue] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirming, setConfirming] = useState(false);
  const theme = useTheme();
  // 获取数据集列表（用于导航）
  const [datasets, setDatasets] = useState([]);

  // 获取所有数据集
  const fetchDatasets = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/datasets`);
      if (!response.ok) throw new Error('获取数据集列表失败');
      const data = await response.json();
      setDatasets(data);

      // 找到当前数据集
      const currentDataset = data.find(d => d.id === datasetId);
      if (currentDataset) {
        setDataset(currentDataset);
        setAnswerValue(currentDataset.answer);
        setCotValue(currentDataset.cot || '');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      const response = await fetch(`/api/projects/${projectId}/datasets?id=${datasetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          confirmed: true
        })
      });

      if (!response.ok) {
        throw new Error('确认保留失败');
      }

      setDataset(prev => ({ ...prev, confirmed: true }));

      setSnackbar({
        open: true,
        message: '已确认保留',
        severity: 'success'
      });

      // 导航到下一个数据集
      handleNavigate('next');
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || '确认保留失败',
        severity: 'error'
      });
    } finally {
      setConfirming(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, [projectId, datasetId]);

  // 导航到其他数据集
  const handleNavigate = (direction) => {
    const currentIndex = datasets.findIndex(d => d.id === datasetId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + datasets.length) % datasets.length
      : (currentIndex + 1) % datasets.length;

    const newDataset = datasets[newIndex];
    router.push(`/projects/${projectId}/datasets/${newDataset.id}`);
  };

  // 保存编辑
  const handleSave = async (field, value) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/datasets?id=${datasetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [field]: value
        })
      });

      if (!response.ok) {
        throw new Error('保存失败');
      }

      const data = await response.json();
      setDataset(prev => ({ ...prev, [field]: value }));

      setSnackbar({
        open: true,
        message: '保存成功',
        severity: 'success'
      });

      // 重置编辑状态
      if (field === 'answer') setEditingAnswer(false);
      if (field === 'cot') setEditingCot(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || '保存失败',
        severity: 'error'
      });
    }
  };

  // 删除数据集
  const handleDelete = async () => {
    if (!confirm('确定要删除这个数据集吗？')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/datasets?id=${datasetId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      router.push(`/projects/${projectId}/datasets`);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || '删除失败',
        severity: 'error'
      });
    }
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

  if (!dataset) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">数据集不存在</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* 顶部导航栏 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<NavigateBeforeIcon />}
              onClick={() => router.push(`/projects/${projectId}/datasets`)}
            >
              返回列表
            </Button>
            <Divider orientation="vertical" flexItem />
            <Typography variant="h6">数据集详情</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => handleNavigate('prev')}>
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={() => handleNavigate('next')}>
              <NavigateNextIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <Button
              variant="contained"
              color="primary"
              disabled={confirming || dataset.confirmed}
              onClick={handleConfirm}
              sx={{ mr: 1 }}
            >
              {confirming ? <CircularProgress size={24} /> : dataset.confirmed ? '已确认' : '确认保留'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              删除
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* 主要内容 */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            问题
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {dataset.question}
          </Typography>
        </Box>

        <EditableField
          label="回答"
          value={answerValue}
          editing={editingAnswer}
          onEdit={() => setEditingAnswer(true)}
          onChange={(e) => setAnswerValue(e.target.value)}
          onSave={() => handleSave('answer', answerValue)}
          onCancel={() => {
            setEditingAnswer(false);
            setAnswerValue(dataset.answer);
          }}
        />

        <EditableField
          label="思维链"
          value={cotValue}
          editing={editingCot}
          onEdit={() => setEditingCot(true)}
          onChange={(e) => setCotValue(e.target.value)}
          onSave={() => handleSave('cot', cotValue)}
          onCancel={() => {
            setEditingCot(false);
            setCotValue(dataset.cot || '');
          }}
        />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            元数据
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`使用模型: ${dataset.model}`}
              variant="outlined"
            />
            {dataset.questionLabel && (
              <Chip
                label={`标签: ${dataset.questionLabel}`}
                color="primary"
                variant="outlined"
              />
            )}
            <Chip
              label={`创建时间: ${new Date(dataset.createdAt).toLocaleString('zh-CN')}`}
              variant="outlined"
            />
            {dataset.confirmed && (
              <Chip
                label={'已确认'}
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.dark,
                  fontWeight: 'medium',
                }}
              />
            )}
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
