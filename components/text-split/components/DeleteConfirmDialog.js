'use client';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function DeleteConfirmDialog({
  open,
  fileName,
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
        确认删除文献
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          您确定要删除文献「{fileName}」吗？删除后将同时删除所有相关的文本块和目录结构。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          确认删除
        </Button>
      </DialogActions>
    </Dialog>
  );
}