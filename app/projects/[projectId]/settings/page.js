'use client';

import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  TextField, 
  Grid, 
  Divider,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function SettingsPage({ params }) {
  const { projectId } = params;
  
  // 项目基本信息状态
  const [projectInfo, setProjectInfo] = useState({
    name: '项目一',
    description: '这是一个示例项目，用于演示各种功能。'
  });
  
  // 模型配置状态
  const [models, setModels] = useState([
    { id: '1', provider: 'Ollama', name: 'DeepSeek-R1', endpoint: 'http://localhost:11434', apiKey: '' },
    { id: '2', provider: 'OpenAI', name: 'gpt-3.5-turbo', endpoint: 'https://api.openai.com/v1', apiKey: 'sk-...' },
    { id: '3', provider: '硅基流动', name: 'gpt-3.5-turbo', endpoint: 'https://api.guijitech.com/v1', apiKey: 'sk-...' },
    { id: '4', provider: '智谱AI', name: 'GLM-4-Flash', endpoint: 'https://open.bigmodel.cn/api/paas/v4', apiKey: 'sk-...' }
  ]);
  
  // 模型对话框状态
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [modelForm, setModelForm] = useState({
    provider: '',
    name: '',
    endpoint: '',
    apiKey: ''
  });
  
  // 处理项目信息变更
  const handleProjectInfoChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 保存项目信息
  const handleSaveProjectInfo = () => {
    // 这里应该有保存到服务器的逻辑
    alert('项目信息已保存');
  };
  
  // 打开模型对话框
  const handleOpenModelDialog = (model = null) => {
    if (model) {
      setEditingModel(model);
      setModelForm({
        provider: model.provider,
        name: model.name,
        endpoint: model.endpoint,
        apiKey: model.apiKey
      });
    } else {
      setEditingModel(null);
      setModelForm({
        provider: '',
        name: '',
        endpoint: '',
        apiKey: ''
      });
    }
    setOpenModelDialog(true);
  };
  
  // 关闭模型对话框
  const handleCloseModelDialog = () => {
    setOpenModelDialog(false);
  };
  
  // 处理模型表单变更
  const handleModelFormChange = (e) => {
    const { name, value } = e.target;
    setModelForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 保存模型
  const handleSaveModel = () => {
    if (editingModel) {
      // 更新现有模型
      setModels(prev => 
        prev.map(m => 
          m.id === editingModel.id
            ? { ...m, ...modelForm }
            : m
        )
      );
    } else {
      // 添加新模型
      const newModel = {
        id: Date.now().toString(),
        ...modelForm
      };
      setModels(prev => [...prev, newModel]);
    }
    
    handleCloseModelDialog();
  };
  
  // 删除模型
  const handleDeleteModel = (id) => {
    setModels(prev => prev.filter(m => m.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        项目设置
      </Typography>
      
      <Grid container spacing={4}>
        {/* 项目基本信息 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                基本信息
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
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
          </Card>
        </Grid>
        
        {/* 模型配置 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  模型配置
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenModelDialog()}
                >
                  添加模型
                </Button>
              </Box>
              
              <List>
                {models.map((model) => (
                  <Box key={model.id}>
                    <ListItem
                      secondaryAction={
                        <Box>
                          <IconButton 
                            edge="end" 
                            aria-label="edit"
                            onClick={() => handleOpenModelDialog(model)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleDeleteModel(model.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={`${model.provider}: ${model.name}`}
                        secondary={model.endpoint}
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* 模型表单对话框 */}
      <Dialog open={openModelDialog} onClose={handleCloseModelDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingModel ? '编辑模型' : '添加模型'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="提供商"
                name="provider"
                value={modelForm.provider}
                onChange={handleModelFormChange}
                placeholder="例如: OpenAI, Ollama, 智谱AI"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="模型名称"
                name="name"
                value={modelForm.name}
                onChange={handleModelFormChange}
                placeholder="例如: gpt-3.5-turbo, DeepSeek-R1"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API 端点"
                name="endpoint"
                value={modelForm.endpoint}
                onChange={handleModelFormChange}
                placeholder="例如: https://api.openai.com/v1"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API 密钥"
                name="apiKey"
                type="password"
                value={modelForm.apiKey}
                onChange={handleModelFormChange}
                placeholder="例如: sk-..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModelDialog}>取消</Button>
          <Button 
            onClick={handleSaveModel} 
            variant="contained"
            disabled={!modelForm.provider || !modelForm.name || !modelForm.endpoint}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
