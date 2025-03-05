'use client';

import {
  Box,
  Typography,
  Checkbox,
  Button
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';

export default function ChunkListHeader({ 
  totalChunks, 
  selectedChunks, 
  onSelectAll, 
  onBatchGenerateQuestions 
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={selectedChunks.length === totalChunks}
          indeterminate={selectedChunks.length > 0 && selectedChunks.length < totalChunks}
          onChange={onSelectAll}
        />
        <Typography variant="body1">
          已选择 {selectedChunks.length} / {totalChunks} 个文本块
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        startIcon={<QuizIcon />}
        disabled={selectedChunks.length === 0}
        onClick={onBatchGenerateQuestions}
      >
        批量生成问题
      </Button>
    </Box>
  );
}