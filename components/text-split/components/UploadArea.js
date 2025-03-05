'use client';

import { Box, Button, Typography, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { alpha } from '@mui/material/styles';

export default function UploadArea({
  theme,
  files,
  uploading,
  uploadedFiles,
  onFileSelect,
  onRemoveFile,
  onUpload
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        height: '100%',
        border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.05),
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          borderColor: alpha(theme.palette.primary.main, 0.3),
        }
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        上传新文献
      </Typography>

      <Button
        component="label"
        variant="contained"
        startIcon={<UploadFileIcon />}
        sx={{ mb: 2, mt: 2 }}
        disabled={uploading || uploadedFiles.length > 0}
      >
        选择文件
        <input
          type="file"
          hidden
          accept=".md"
          multiple
          onChange={onFileSelect}
          disabled={uploadedFiles.length > 0}
        />
      </Button>

      <Typography variant="body2" color="textSecondary">
        {uploadedFiles.length > 0 ? (
          "一个项目限制处理一个文件，如需上传新文件请先删除现有文件"
        ) : (
          "目前仅支持上传 Markdown (.md) 格式文件"
        )}
      </Typography>

      {files.length > 0 && (
        <Box sx={{ mt: 3, width: '100%' }}>
          <Typography variant="subtitle2" gutterBottom>
            已选择文件（{files.length}）
          </Typography>

          <List sx={{ bgcolor: theme.palette.background.paper, borderRadius: 1, maxHeight: '200px', overflow: 'auto' }}>
            {files.map((file, index) => (
              <Box key={index}>
                <ListItem
                  secondaryAction={
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => onRemoveFile(index)}
                      disabled={uploading}
                    >
                      删除
                    </Button>
                  }
                >
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(2)} KB`}
                  />
                </ListItem>
                {index < files.length - 1 && <Divider />}
              </Box>
            ))}
          </List>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={onUpload}
              disabled={uploading}
              sx={{ minWidth: 120 }}
            >
              {uploading ? <CircularProgress size={24} /> : '上传并处理文件'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}