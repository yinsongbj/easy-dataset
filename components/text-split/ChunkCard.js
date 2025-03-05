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
        borderColor: selected
          ? theme.palette.primary.main
          : theme.palette.divider,
        bgcolor: selected
          ? `${theme.palette.primary.main}10`
          : 'transparent'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Checkbox
            checked={selected}
            onChange={onSelect}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {chunk.id}
              </Typography>
              <Box>
                <Chip
                  label={`${chunk.fileName || '未知文件'}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`${chunk.length || 0} 字符`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </Box>

            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {getTextPreview(chunk.content)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <Tooltip title="查看详情">
          <IconButton
            size="small"
            color="primary"
            onClick={onView}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="生成问题">
          <IconButton
            size="small"
            color="info"
            onClick={onGenerateQuestions}
          >
            <QuizIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="删除">
          <IconButton
            size="small"
            color="error"
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}