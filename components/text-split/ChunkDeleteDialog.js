'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ChunkDeleteDialog({
  open,
  onClose,
  onConfirm
}) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        {t('common.confirmDelete')}?
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