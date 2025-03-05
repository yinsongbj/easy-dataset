'use client';

import {
  Box,
  Typography,
  IconButton,
  Chip,
  Checkbox,
  Tooltip,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuizIcon from '@mui/icons-material/Quiz';
import { useTheme } from '@mui/material/styles';

export default function ChunkCard({
  chunk,
  selected,
  onSelect,
  onView,
  onDelete,
  onGenerateQuestions
}) {
  const theme = useTheme();

  // 获取文本预览
  const getTextPreview = (content, maxLength = 150) => {
    if (!content) return '';
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        borderColor: selected
          ? theme.palette.primary.main
          : theme.palette.divider,
        bgcolor: selected
          ? `${theme.palette.primary.main}10`
          : 'transparent',
        borderRadius: 2,
        '&:hover': {
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
        }
      }}
    >
      <CardContent sx={{ pt: 2.5, px: 2.5, pb: '16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Checkbox
            checked={selected}
            onChange={onSelect}
            sx={{
              mr: 1,
              '&.Mui-checked': {
                color: theme.palette.primary.main
              }
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5,
              flexWrap: 'wrap',
              gap: 1
            }}>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                sx={{
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
                }}
              >
                {chunk.id}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`${chunk.fileName || '未知文件'}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
                <Chip
                  label={`${chunk.length || 0} 字符`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              </Box>
            </Box>

            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                opacity: 0.85
              }}
            >
              {getTextPreview(chunk.content)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: 'flex-end',
          px: 2.5,
          pb: 2,
          gap: 1,
          '& .MuiIconButton-root': {
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }
        }}
      >
        <Tooltip title="查看详情">
          <IconButton
            size="small"
            color="primary"
            onClick={onView}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(33, 150, 243, 0.08)'
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="生成问题">
          <IconButton
            size="small"
            color="info"
            onClick={onGenerateQuestions}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(41, 182, 246, 0.08)' : 'rgba(2, 136, 209, 0.08)'
            }}
          >
            <QuizIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="删除">
          <IconButton
            size="small"
            color="error"
            onClick={onDelete}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.08)' : 'rgba(211, 47, 47, 0.08)'
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}