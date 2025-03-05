'use client';

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

export default function ChunkViewDialog({
  open,
  chunk,
  onClose
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        文本块详情: {chunk?.id}
      </DialogTitle>
      <DialogContent dividers>
        {chunk ? (
          <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            <ReactMarkdown>
              {chunk.content}
            </ReactMarkdown>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}