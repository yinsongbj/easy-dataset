'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Card,
  Divider,
  useTheme,
  alpha,
  InputBase,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useRouter } from 'next/navigation';

// 数据集列表组件
const DatasetList = ({
  datasets,
  onViewDetails,
  onDelete,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  total
}) => {
  const theme = useTheme();

  const bgColor = theme.palette.mode === 'dark'
    ? theme.palette.primary.dark
    : theme.palette.primary.light
  const color = theme.palette.mode === 'dark'
    ? theme.palette.getContrastText(theme.palette.primary.main)
    : theme.palette.getContrastText(theme.palette.primary.contrastText)

  return (
    <Card elevation={2}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 750 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: bgColor,
                  color: color,
                  fontWeight: 'bold',
                  padding: '16px 8px',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                问题
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: bgColor,
                  color: color,
                  fontWeight: 'bold',
                  padding: '16px 8px',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                创建时间
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: bgColor,
                  color: color,
                  fontWeight: 'bold',
                  padding: '16px 8px',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                使用模型
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: bgColor,
                  color: color,
                  fontWeight: 'bold',
                  padding: '16px 8px',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                标签
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: bgColor,
                  color: color,
                  fontWeight: 'bold',
                  padding: '16px 8px',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                思维链
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: bgColor,
                  color: color,
                  fontWeight: 'bold',
                  padding: '16px 8px',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                回答
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: bgColor,
                  color: color,
                  fontWeight: 'bold',
                  padding: '16px 8px',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                }}
              >
                操作
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.map((dataset, index) => (
              <TableRow
                key={dataset.id}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.primary.light, 0.05) },
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.light, 0.1) },
                  cursor: 'pointer',
                }}
                onClick={() => onViewDetails(dataset.id)}
              >
                <TableCell
                  sx={{
                    maxWidth: 300,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    py: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {dataset.question}
                    {dataset.confirmed && (
                      <Chip
                        label={'已确认'}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.dark,
                          fontWeight: 'medium',
                        }}
                      />
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(dataset.createdAt).toLocaleString('zh-CN')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={dataset.model}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.dark,
                      fontWeight: 'medium',
                    }}
                  />
                </TableCell>
                <TableCell>
                  {dataset.questionLabel ? (
                    <Chip
                      label={dataset.questionLabel}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.dark,
                        fontWeight: 'medium',
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.disabled">无标签</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={dataset.cot ? '有' : '无'}
                    size="small"
                    sx={{
                      backgroundColor: dataset.cot
                        ? alpha(theme.palette.success.main, 0.1)
                        : alpha(theme.palette.grey[500], 0.1),
                      color: dataset.cot
                        ? theme.palette.success.dark
                        : theme.palette.grey[700],
                      fontWeight: 'medium',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {dataset.answer}
                  </Typography>
                </TableCell>
                <TableCell sx={{ width: 120 }}>
                  <Box sx={{ display: 'flex' }}>
                    <Tooltip title="查看详情">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(dataset.id);
                        }}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(dataset);
                        }}
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {datasets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    暂无数据
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="每页行数"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count}`}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontWeight: 'medium',
          }
        }}
      />
    </Card>
  );
};

// 删除确认对话框
const DeleteConfirmDialog = ({ open, dataset, onClose, onConfirm }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">确认删除</Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 2, pt: 1 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          确定要删除这个数据集吗？这个操作不可撤销。
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            backgroundColor: alpha(theme.palette.warning.light, 0.1),
            borderColor: theme.palette.warning.light,
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
            问题：
          </Typography>
          <Typography variant="body2">
            {dataset?.question}
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          取消
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{ borderRadius: 2 }}
        >
          删除
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 主页面组件
export default function DatasetsPage({ params }) {
  const { projectId } = params;
  const router = useRouter();
  const theme = useTheme();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    dataset: null
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // 获取数据集列表
  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/datasets`);
      if (!response.ok) throw new Error('获取数据集失败');
      const data = await response.json();
      setDatasets(data);
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

  useEffect(() => {
    fetchDatasets();
  }, [projectId]);

  // 处理页码变化
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // 处理每页行数变化
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 过滤数据
  const filteredDatasets = datasets.filter(dataset =>
    dataset.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dataset.questionLabel && dataset.questionLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
    dataset.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 获取当前页的数据
  const getCurrentPageData = () => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredDatasets.slice(start, end);
  };

  // 打开删除确认框
  const handleOpenDeleteDialog = (dataset) => {
    setDeleteDialog({
      open: true,
      dataset
    });
  };

  // 关闭删除确认框
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      dataset: null
    });
  };

  // 删除数据集
  const handleDelete = async () => {
    const dataset = deleteDialog.dataset;
    if (!dataset) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/datasets?id=${dataset.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('删除数据集失败');

      setSnackbar({
        open: true,
        message: '删除成功',
        severity: 'success'
      });

      // 刷新数据
      fetchDatasets();
      // 关闭确认框
      handleCloseDeleteDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  };

  // 导出数据集
  const handleExportDatasets = () => {
    try {
      // 准备导出数据
      const dataToExport = filteredDatasets.map(({ question, answer, cot, model, questionLabel }) => ({
        question,
        answer,
        cot: cot || '',
        model,
        label: questionLabel || ''
      }));

      // 创建 Blob 对象
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `datasets-${projectId}-${new Date().toISOString().slice(0, 10)}.json`;

      // 触发下载
      document.body.appendChild(a);
      a.click();

      // 清理
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: '数据集导出成功',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: '导出失败: ' + error.message,
        severity: 'error'
      });
    }
  };

  // 查看详情
  const handleViewDetails = (id) => {
    router.push(`/projects/${projectId}/datasets/${id}`);
  };

  // 关闭提示框
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh'
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            加载数据集...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          backgroundColor: alpha(theme.palette.primary.light, 0.05),
          borderRadius: 2,
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              数据集管理
            </Typography>
            <Typography variant="body1" color="text.secondary">
              共 {datasets.length} 个数据集
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 300,
                borderRadius: 2,
              }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="搜索数据集..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
              />
            </Paper>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              sx={{ borderRadius: 2 }}
              onClick={handleExportDatasets}
            >
              导出数据集
            </Button>
          </Box>
        </Box>
      </Card>

      <DatasetList
        datasets={getCurrentPageData()}
        onViewDetails={handleViewDetails}
        onDelete={handleOpenDeleteDialog}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        total={filteredDatasets.length}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        dataset={deleteDialog.dataset}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}