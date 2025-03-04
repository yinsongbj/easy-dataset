'use client';

import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid
} from '@mui/material';
import { useRouter } from 'next/navigation';

const steps = ['项目信息', '模型配置', '完成'];

export default function NewProjectPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    description: ''
  });
  const [modelConfig, setModelConfig] = useState({
    provider: 'OpenAI',
    modelName: 'gpt-3.5-turbo',
    apiEndpoint: 'https://api.openai.com/v1',
    apiKey: ''
  });
  
  const handleProjectInfoChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleModelConfigChange = (e) => {
    const { name, value } = e.target;
    setModelConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleCreateProject = () => {
    // 这里应该有创建项目的逻辑
    
    // 模拟创建项目后跳转
    router.push('/projects/project1');
  };
  
  const isStepValid = (step) => {
    if (step === 0) {
      return projectInfo.name.trim() !== '';
    }
    if (step === 1) {
      return modelConfig.provider !== '' && modelConfig.modelName !== '';
    }
    return true;
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="项目名称"
                  name="name"
                  value={projectInfo.name}
                  onChange={handleProjectInfoChange}
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
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="提供商"
                  name="provider"
                  value={modelConfig.provider}
                  onChange={handleModelConfigChange}
                  placeholder="例如: OpenAI, Ollama"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="模型名称"
                  name="modelName"
                  value={modelConfig.modelName}
                  onChange={handleModelConfigChange}
                  placeholder="例如: gpt-3.5-turbo"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="API 端点"
                  name="apiEndpoint"
                  value={modelConfig.apiEndpoint}
                  onChange={handleModelConfigChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="API 密钥"
                  name="apiKey"
                  type="password"
                  value={modelConfig.apiKey}
                  onChange={handleModelConfigChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              项目配置摘要
            </Typography>
            <Box sx={{ mt: 2, textAlign: 'left', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body1">
                <strong>项目名称:</strong> {projectInfo.name}
              </Typography>
              {projectInfo.description && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>项目描述:</strong> {projectInfo.description}
                </Typography>
              )}
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>模型:</strong> {modelConfig.provider} - {modelConfig.modelName}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 3 }}>
              点击 "创建项目" 按钮完成项目创建
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          创建新项目
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep > 0 && (
            <Button 
              variant="outlined" 
              onClick={handleBack} 
              sx={{ mr: 1 }}
            >
              上一步
            </Button>
          )}
          
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
            >
              下一步
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateProject}
            >
              创建项目
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
