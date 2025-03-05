'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Pagination,
  Grid
} from '@mui/material';
import ChunkListHeader from './ChunkListHeader';
import ChunkCard from './ChunkCard';
import ChunkViewDialog from './ChunkViewDialog';
import ChunkDeleteDialog from './ChunkDeleteDialog';
import { useTheme } from '@mui/material/styles';

/**
 * 文本块列表组件
 * @param {Object} props
 * @param {string} props.projectId - 项目ID
 * @param {Array} props.chunks - 文本块数组
 * @param {Function} props.onDelete - 删除回调
 * @param {Function} props.onGenerateQuestions - 生成问题回调
 */
export default function ChunkList({ projectId, chunks = [], onDelete, onGenerateQuestions, loading = false }) {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [selectedChunks, setSelectedChunks] = useState([]);
  const [viewChunk, setViewChunk] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chunkToDelete, setChunkToDelete] = useState(null);

  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedChunks = chunks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(chunks.length / itemsPerPage);

  // 处理页面变化
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // 查看文本块详情
  const handleViewChunk = async (chunkId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/chunks/${chunkId}`);
      if (!response.ok) {
        throw new Error('获取文本块内容失败');
      }

      const data = await response.json();
      setViewChunk(data);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('获取文本块内容出错:', error);
    }
  };

  // 关闭详情对话框
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  // 打开删除确认对话框
  const handleOpenDeleteDialog = (chunkId) => {
    setChunkToDelete(chunkId);
    setDeleteDialogOpen(true);
  };

  // 关闭删除确认对话框
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setChunkToDelete(null);
  };

  // 确认删除文本块
  const handleConfirmDelete = () => {
    if (chunkToDelete && onDelete) {
      onDelete(chunkToDelete);
    }
    handleCloseDeleteDialog();
  };

  // 处理选择文本块
  const handleSelectChunk = (chunkId) => {
    setSelectedChunks(prev => {
      if (prev.includes(chunkId)) {
        return prev.filter(id => id !== chunkId);
      } else {
        return [...prev, chunkId];
      }
    });
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedChunks.length === chunks.length) {
      setSelectedChunks([]);
    } else {
      setSelectedChunks(chunks.map(chunk => chunk.id));
    }
  };

  // 批量生成问题
  const handleBatchGenerateQuestions = () => {
    if (onGenerateQuestions && selectedChunks.length > 0) {
      onGenerateQuestions(selectedChunks);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (chunks.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <Typography variant="body1" color="textSecondary">
          暂无文本块，请先上传并处理文献
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <ChunkListHeader
        totalChunks={chunks.length}
        selectedChunks={selectedChunks}
        onSelectAll={handleSelectAll}
        onBatchGenerateQuestions={handleBatchGenerateQuestions}
      />

      <Grid container spacing={2}>
        {displayedChunks.map((chunk) => (
          <Grid item xs={12} key={chunk.id}>
            <ChunkCard
              chunk={chunk}
              selected={selectedChunks.includes(chunk.id)}
              onSelect={() => handleSelectChunk(chunk.id)}
              onView={() => handleViewChunk(chunk.id)}
              onDelete={() => handleOpenDeleteDialog(chunk.id)}
              onGenerateQuestions={() => onGenerateQuestions && onGenerateQuestions([chunk.id])}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* 文本块详情对话框 */}
      <ChunkViewDialog
        open={viewDialogOpen}
        chunk={viewChunk}
        onClose={handleCloseViewDialog}
      />

      {/* 删除确认对话框 */}
      <ChunkDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
