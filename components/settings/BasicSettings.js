'use client';

import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Card,
  CardContent,
  Alert,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export default function BasicSettings({ projectId }) {
  const [projectInfo, setProjectInfo] = useState({
    id: '',
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchProjectInfo() {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error('获取项目信息失败');
        }
        
        const data = await response.json();
        setProjectInfo(data);
      } catch (error) {
        console.error('获取项目信息出错:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjectInfo();
  }, [projectId]);

  // 处理项目信息变更
  const handleProjectInfoChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 保存项目信息
  const handleSaveProjectInfo = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectInfo.name,
          description: projectInfo.description
        }),
      });
      
      if (!response.ok) {
        throw new Error('保存项目信息失败');
      }
      
      setSuccess(true);
    } catch (error) {
      console.error('保存项目信息出错:', error);
      setError(error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  if (loading) {
    return <Typography>加载中...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          基本信息
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="项目ID"
              value={projectInfo.id}
              disabled
              helperText="项目ID不可更改"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="项目名称"
              name="name"
              value={projectInfo.name}
              onChange={handleProjectInfoChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="项目描述"
              name="description"
              value={projectInfo.description}
              onChange={handleProjectInfoChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveProjectInfo}
            >
              保存基本信息
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          项目信息已成功保存
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Card>
  );
}
