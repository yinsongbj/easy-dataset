'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ContentCutIcon from '@mui/icons-material/ContentCut';

export default function TextSplitPage({ params }) {
  const { projectId } = params;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [splitStatus, setSplitStatus] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const handleSplitText = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setSplitStatus('正在处理...');

    // 这里模拟文本分割处理
    setTimeout(() => {
      setLoading(false);
      setSplitStatus('文本分割完成！共生成 25 个文本片段。');
    }, 2000);

    // 实际项目中，这里应该有上传文件和处理的逻辑
    // const formData = new FormData();
    // files.forEach(file => formData.append('files', file));
    // const response = await fetch(`/api/projects/${projectId}/text-split`, {
    //   method: 'POST',
    //   body: formData
    // });
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        文献处理
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, border: '2px dashed #ccc' }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<UploadFileIcon />}
            sx={{ mb: 2 }}
          >
            上传文件
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileUpload}
            />
          </Button>
          <Typography variant="body2" color="textSecondary">
            支持上传 TXT, PDF, DOCX, MD 等格式文件
          </Typography>
        </Box>

        {files.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              已上传文件（{files.length}）
            </Typography>
            <List>
              {files.map((file, index) => (
                <Box key={index}>
                  <ListItem
                    secondaryAction={
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeFile(index)}
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
                color="secondary"
                startIcon={<ContentCutIcon />}
                onClick={handleSplitText}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : '开始分割'}
              </Button>
            </Box>
          </Box>
        )}

        {splitStatus && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography>{splitStatus}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
