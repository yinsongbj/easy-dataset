'use client';

import { Box, Typography, List, ListItem, ListItemText, Divider, IconButton, Tooltip, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileIcon from '@mui/icons-material/InsertDriveFile';

export default function FileList({
  theme,
  files = [],
  loading = false,
  onDeleteFile
}) {
  return (
    <Box
      sx={{
        height: '100%',
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        已上传文献
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : files.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            暂无上传文件
          </Typography>
        </Box>
      ) : (
        <List sx={{ maxHeight: '300px', overflow: 'auto', width: '100%' }}>
          {files.map((file, index) => (
            <Box key={index}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex' }}>
                    <Tooltip title="删除文献">
                      <IconButton
                        color="error"
                        onClick={() => onDeleteFile(file.name)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FileIcon color="primary" sx={{ mr: 1 }} />
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB · ${new Date(file.createdAt).toLocaleString()}`}
                  />
                </Box>
              </ListItem>
              {index < files.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}