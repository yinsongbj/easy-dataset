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
  Slider,
  InputAdornment,
  Alert,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export default function TaskSettings({ projectId }) {
  const [taskSettings, setTaskSettings] = useState({
    textSplitMinLength: 1500,
    textSplitMaxLength: 2000,
    questionGenerationLength: 240,
    huggingfaceToken: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchTaskSettings() {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        
        if (!response.ok) {
          throw new Error('获取任务配置失败');
        }
        
        const data = await response.json();
        
        // 如果没有配置，使用默认值
        if (Object.keys(data).length === 0) {
          setTaskSettings({
            textSplitMinLength: 1500,
            textSplitMaxLength: 2000,
            questionGenerationLength: 240,
            huggingfaceToken: ''
          });
        } else {
          setTaskSettings(data);
        }
      } catch (error) {
        console.error('获取任务配置出错:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTaskSettings();
  }, [projectId]);

  // 处理设置变更
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setTaskSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 处理滑块变更
  const handleSliderChange = (name) => (event, newValue) => {
    setTaskSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // 保存任务配置
  const handleSaveTaskSettings = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskSettings),
      });
      
      if (!response.ok) {
        throw new Error('保存任务配置失败');
      }
      
      setSuccess(true);
    } catch (error) {
      console.error('保存任务配置出错:', error);
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
          任务配置
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              文本分段设置
            </Typography>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography id="text-split-min-length-slider" gutterBottom>
                最小字数: {taskSettings.textSplitMinLength}
              </Typography>
              <Slider
                value={taskSettings.textSplitMinLength}
                onChange={handleSliderChange('textSplitMinLength')}
                aria-labelledby="text-split-min-length-slider"
                valueLabelDisplay="auto"
                step={100}
                marks
                min={500}
                max={3000}
              />
              
              <Typography id="text-split-max-length-slider" gutterBottom sx={{ mt: 3 }}>
                最大字数: {taskSettings.textSplitMaxLength}
              </Typography>
              <Slider
                value={taskSettings.textSplitMaxLength}
                onChange={handleSliderChange('textSplitMaxLength')}
                aria-labelledby="text-split-max-length-slider"
                valueLabelDisplay="auto"
                step={100}
                marks
                min={1000}
                max={5000}
              />
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                文本分割时，系统会尝试将文本分割成字数在最小值和最大值之间的片段。
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              问题生成设置
            </Typography>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography id="question-generation-length-slider" gutterBottom>
                每 {taskSettings.questionGenerationLength} 字符生成一个问题
              </Typography>
              <Slider
                value={taskSettings.questionGenerationLength}
                onChange={handleSliderChange('questionGenerationLength')}
                aria-labelledby="question-generation-length-slider"
                valueLabelDisplay="auto"
                step={20}
                marks
                min={100}
                max={500}
              />
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                系统会根据文本长度自动计算需要生成的问题数量，每 N 个字符生成一个问题。
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              HuggingFace 设置
            </Typography>
            <TextField
              fullWidth
              label="HuggingFace Token"
              name="huggingfaceToken"
              value={taskSettings.huggingfaceToken}
              onChange={handleSettingChange}
              type="password"
              helperText="此功能暂未实现，仅作展示用途"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">hf_</InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveTaskSettings}
            >
              保存任务配置
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
          任务配置已成功保存
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
