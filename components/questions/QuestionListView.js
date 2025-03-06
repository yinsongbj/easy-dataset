'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  IconButton,
  Chip,
  Tooltip,
  Pagination,
  Divider,
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

/**
 * 问题列表视图组件
 * @param {Object} props
 * @param {Array} props.questions - 问题列表
 * @param {Array} props.chunks - 文本块列表
 * @param {Array} props.selectedQuestions - 已选择的问题ID列表
 * @param {Function} props.onSelectQuestion - 选择问题的回调函数
 * @param {Function} props.onDeleteQuestion - 删除问题的回调函数
 */
export default function QuestionListView({
  questions = [],
  chunks = [],
  selectedQuestions = [],
  onSelectQuestion,
  onDeleteQuestion
}) {
  // 分页状态
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // 批量操作显示提示
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 获取文本块的标题
  const getChunkTitle = (chunkId) => {
    const chunk = chunks.find(c => c.id === chunkId);
    if (!chunk) return `文本块 ${chunkId}`;

    // 尝试从内容中提取标题
    const content = chunk.content || '';
    const firstLine = content.split('\n')[0].trim();
    if (firstLine.startsWith('# ')) {
      return firstLine.substring(2);
    } else if (firstLine.length > 0) {
      return firstLine.length > 200 ? firstLine.substring(0, 200) + '...' : firstLine;
    }

    return `文本块 ${chunkId}`;
  };

  // 检查问题是否被选中
  const isQuestionSelected = (questionId, chunkId) => {
    const questionKey = `${chunkId}-${questionId}`;
    return selectedQuestions.includes(questionKey);
  };

  // 处理分页变化
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // 使用传入的问题列表
  const filteredQuestions = questions;

  // 计算当前页的问题
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  return (
    <Box style={{ padding: '20px' }}>


      {/* 问题列表 */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', bgcolor: 'background.paper' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, ml: 1 }}>
            问题内容
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mr: 2, display: { xs: 'none', sm: 'block' } }}>
              标签
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, width: 150, mr: 2, display: { xs: 'none', md: 'block' } }}>
              文本块
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, width: 100, textAlign: 'center' }}>
              操作
            </Typography>
          </Box>
        </Box>

        <Divider />

        {currentQuestions.map((question, index) => {
          // 明确计算每个问题的选中状态
          const isSelected = isQuestionSelected(question.question, question.chunkId);

          return (
            <Box key={`${question.chunkId}-${question.question}`}>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: isSelected ? 'action.selected' : 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => onSelectQuestion(question.question, question.chunkId)}
                  size="small"
                />

                <Box sx={{ ml: 1, flex: 1, mr: 2 }}>
                  <Typography variant="body2">{question.question}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
                    {question.label || '无标签'} • ID: {(question.question || '').substring(0, 8)}
                  </Typography>
                </Box>

                <Box sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
                  {question.label ? (
                    <Chip
                      label={question.label}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem', maxWidth: 150 }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.disabled">无标签</Typography>
                  )}
                </Box>

                <Box sx={{ width: 150, mr: 2, display: { xs: 'none', md: 'block' } }}>
                  <Tooltip title={getChunkTitle(question.chunkId)}>
                    <Chip
                      label={question.chunkId}
                      size="small"
                      variant="outlined"
                      color="info"
                      sx={{
                        fontSize: '0.75rem',
                        maxWidth: '100%',
                        textOverflow: 'ellipsis'
                      }}
                    />
                  </Tooltip>
                </Box>

                <Box sx={{ width: 100, display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="生成答案">
                    <IconButton size="small" color="primary">
                      <AutoFixHighIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="删除问题">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDeleteQuestion(question.question, question.chunkId)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              {index < currentQuestions.length - 1 && <Divider />}
            </Box>
          );
        })}
      </Paper>

      {/* 分页 */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            shape="rounded"
            size="medium"
          />
        </Box>
      )}

      {/* 操作提示 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}