'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

export default function ChunkDeleteDialog({
  open,
  onClose,
  onConfirm
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        确认删除
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          您确定要删除这个文本块吗？此操作无法撤销。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          删除
        </Button>
      </DialogActions>
    </Dialog>
  );
}