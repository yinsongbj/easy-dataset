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
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControl,
  Alert,
  Snackbar,
  Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MODEL_PROVIDERS } from '@/constant/model';

const providerOptions = MODEL_PROVIDERS.map(provider => ({
  id: provider.id,
  label: provider.name
}));

export default function ModelSettings({ projectId }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [ollamaModels, setOllamaModels] = useState([]);

  // 获取 Ollama 模型列表
  const fetchOllamaModels = async (endpoint) => {
    try {
      // 从 endpoint 中提取 host 和 port
      let host = '127.0.0.1';
      let port = '11434';

      if (endpoint) {
        const url = new URL(endpoint);
        host = url.hostname;
        port = url.port || '11434';
      }

      const response = await fetch(`/api/llm/ollama/models?host=${host}&port=${port}`);

      if (!response.ok) {
        throw new Error('获取 Ollama 模型列表失败');
      }

      const data = await response.json();
      setOllamaModels(data.map(model => model.name));
    } catch (error) {
      console.error('获取 Ollama 模型列表出错:', error);
      setOllamaModels([]);
    }
  };

  // 模型对话框状态
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [modelForm, setModelForm] = useState({
    provider: '',
    providerId: '',
    name: '',
    endpoint: '',
    apiKey: ''
  });

  useEffect(() => {
    async function fetchModelSettings() {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}/models`);

        if (!response.ok) {
          throw new Error('获取模型配置失败');
        }

        const data = await response.json();

        // 如果没有配置任何模型，添加默认模型
        if (data.length === 0) {
          const defaultModels = MODEL_PROVIDERS.map((provider, index) => ({
            id: `default-${index + 1}`,
            provider: provider.name,
            providerId: provider.id,
            name: provider.defaultModels[0],
            endpoint: provider.defaultEndpoint,
            apiKey: ''
          }));
          setModels(defaultModels);
        } else {
          setModels(data);
        }
      } catch (error) {
        console.error('获取模型配置出错:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchModelSettings();
  }, [projectId]);

  // 当组件挂载或模型列表变化时，检查是否有 Ollama 模型
  useEffect(() => {
    const ollamaModel = models.find(m => m.providerId === 'ollama');
    if (ollamaModel) {
      fetchOllamaModels(ollamaModel.endpoint)
        .then(() => {
          // 如果获取到了模型列表，并且当前 Ollama 模型不在列表中，更新为列表中的第一个模型
          if (ollamaModels.length > 0 && !ollamaModels.includes(ollamaModel.name)) {
            const updatedModels = models.map(m =>
              m.id === ollamaModel.id
                ? { ...m, name: ollamaModels[0] }
                : m
            );
            setModels(updatedModels);
          }
        });
    }
  }, [models]);

  // 保存所有模型配置
  const saveAllModels = async () => {
    try {
      console.log('开始保存模型配置...');
      const response = await fetch(`/api/projects/${projectId}/models`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(models),
      });

      if (!response.ok) {
        throw new Error('保存模型配置失败');
      }

      console.log('模型配置保存成功');
      setSuccess(true);
      return true; // 返回成功状态
    } catch (error) {
      console.error('保存模型配置出错:', error);
      setError(error.message);
      return false; // 返回失败状态
    }
  };

  // 打开模型对话框
  const handleOpenModelDialog = (model = null) => {
    if (model) {
      setEditingModel(model);
      setModelForm({
        provider: model.provider,
        providerId: model.providerId,
        name: model.name,
        endpoint: model.endpoint,
        apiKey: model.apiKey
      });

      // 如果是 Ollama 提供商，获取模型列表
      if (model.providerId === 'ollama') {
        fetchOllamaModels(model.endpoint);
      }
    } else {
      setEditingModel(null);

      // 默认选择第一个提供商
      const defaultProvider = MODEL_PROVIDERS[0];

      // 如果默认提供商是 Ollama，获取模型列表
      if (defaultProvider.id === 'ollama') {
        setModelForm({
          provider: defaultProvider.name,
          providerId: defaultProvider.id,
          endpoint: defaultProvider.defaultEndpoint,
          apiKey: ''
          // 不设置 name，等待获取模型列表后再设置
        });

        fetchOllamaModels(defaultProvider.defaultEndpoint)
          .then(() => {
            // 获取成功后，使用第一个可用的模型
            if (ollamaModels.length > 0) {
              setModelForm(prev => ({
                ...prev,
                name: ollamaModels[0]
              }));
            } else {
              // 如果没有获取到模型，使用默认模型
              setModelForm(prev => ({
                ...prev,
                name: defaultProvider.defaultModels[0]
              }));
            }
          })
          .catch(() => {
            // 获取失败时，使用默认模型
            setModelForm(prev => ({
              ...prev,
              name: defaultProvider.defaultModels[0]
            }));
          });
      } else {
        // 非 Ollama 提供商，直接使用预定义的默认模型
        setModelForm({
          provider: defaultProvider.name,
          providerId: defaultProvider.id,
          name: defaultProvider.defaultModels[0],
          endpoint: defaultProvider.defaultEndpoint,
          apiKey: ''
        });
      }
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

    if (name === 'providerId') {
      // 当选择提供商时，自动填充相关信息
      const selectedProvider = MODEL_PROVIDERS.find(p => p.id === value);
      if (selectedProvider) {
        // 如果选择的是 Ollama，获取本地模型列表后再设置模型
        if (value === 'ollama') {
          // 先设置基本信息，但不设置模型名称
          setModelForm(prev => ({
            ...prev,
            providerId: value,
            provider: selectedProvider.name,
            endpoint: selectedProvider.defaultEndpoint,
          }));

          // 获取 Ollama 模型列表
          fetchOllamaModels(selectedProvider.defaultEndpoint)
            .then(() => {
              // 获取成功后，使用第一个可用的模型
              if (ollamaModels.length > 0) {
                setModelForm(prev => ({
                  ...prev,
                  name: ollamaModels[0]
                }));
              } else {
                // 如果没有获取到模型，使用默认模型
                setModelForm(prev => ({
                  ...prev,
                  name: selectedProvider.defaultModels[0]
                }));
              }
            })
            .catch(() => {
              // 获取失败时，使用默认模型
              setModelForm(prev => ({
                ...prev,
                name: selectedProvider.defaultModels[0]
              }));
            });
        } else {
          // 非 Ollama 提供商，直接使用预定义的默认模型
          setModelForm({
            ...modelForm,
            providerId: value,
            provider: selectedProvider.name,
            endpoint: selectedProvider.defaultEndpoint,
            name: selectedProvider.defaultModels[0]
          });
        }
      }
    } else if (name === 'endpoint' && modelForm.providerId === 'ollama') {
      // 当修改 Ollama 端点时，重新获取模型列表
      setModelForm(prev => ({
        ...prev,
        [name]: value
      }));
      fetchOllamaModels(value);
    } else {
      setModelForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 保存模型
  const handleSaveModel = () => {
    if (editingModel) {
      // 更新现有模型
      setModels(prev => {
        const updatedModels = prev.map(m =>
          m.id === editingModel.id
            ? { ...m, ...modelForm }
            : m
        );
        return updatedModels;
      });
    } else {
      // 添加新模型
      setModels(prev => {
        const updatedModels = [...prev, { id: `model-${Date.now()}`, ...modelForm }];
        return updatedModels;
      });
    }

    handleCloseModelDialog();
  };

  // 删除模型
  const handleDeleteModel = (id) => {
    setModels(prev => {
      const updatedModels = prev.filter(m => m.id !== id);
      return updatedModels;
    });
  };

  // 监听 models 变化并保存
  useEffect(() => {
    console.log('models 发生变化:', models);
    // 跳过初始加载时的保存
    if (!loading) {
      console.log('触发保存操作...');
      saveAllModels().then(() => {
        // 保存成功后，触发自定义事件通知 layout.js 刷新模型数据
        console.log('触发模型配置变化事件');
        const event = new CustomEvent('model-config-changed');
        window.dispatchEvent(event);
        
        // 如果有选中的模型，需要检查它是否还存在
        const selectedModelId = localStorage.getItem('selectedModelId');
        if (selectedModelId) {
          const modelExists = models.some(m => m.id === selectedModelId);
          if (!modelExists && models.length > 0) {
            // 如果选中的模型不存在了，选择第一个模型
            const defaultModel = models[0];
            localStorage.setItem('selectedModelId', defaultModel.id);
            localStorage.setItem('selectedModelInfo', JSON.stringify(defaultModel));
          }
        }
      });
    }
  }, [models]);

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
                      disabled={models.length <= 1} // 至少保留一个模型
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={`${model.provider}: ${model.name}`}
                  secondary={`${model.endpoint}`}
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={saveAllModels}
          >
            保存所有模型配置
          </Button>
        </Box>
      </CardContent>

      {/* 模型表单对话框 */}
      <Dialog open={openModelDialog} onClose={handleCloseModelDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingModel ? '编辑模型' : '添加模型'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  freeSolo
                  options={providerOptions}
                  getOptionLabel={(option) => option.label}
                  value={providerOptions.find(p => p.id === modelForm.providerId) || { id: 'custom', label: modelForm.provider }}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      // 用户手动输入了自定义提供商
                      setModelForm(prev => ({
                        ...prev,
                        providerId: 'custom',
                        provider: newValue,
                        endpoint: '',
                        name: ''
                      }));
                    } else if (newValue && newValue.id) {
                      // 用户从下拉列表中选择了一个提供商
                      const selectedProvider = MODEL_PROVIDERS.find(p => p.id === newValue.id);
                      if (selectedProvider) {
                        setModelForm(prev => ({
                          ...prev,
                          providerId: selectedProvider.id,
                          provider: selectedProvider.name,
                          endpoint: selectedProvider.defaultEndpoint,
                          name: selectedProvider.defaultModels[0]
                        }));

                        // 如果选择的是 Ollama，获取本地模型列表
                        if (selectedProvider.id === 'ollama') {
                          fetchOllamaModels(selectedProvider.defaultEndpoint);
                        }
                      }
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="模型提供商"
                      onChange={(e) => {
                        // 当用户手动输入时，更新 provider 字段
                        setModelForm(prev => ({
                          ...prev,
                          providerId: 'custom',
                          provider: e.target.value
                        }));
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  freeSolo
                  options={modelForm.providerId === 'ollama' ? ollamaModels : MODEL_PROVIDERS.find(p => p.id === modelForm.providerId)?.defaultModels || []}
                  value={modelForm.name}
                  onChange={(event, newValue) => {
                    setModelForm(prev => ({
                      ...prev,
                      name: newValue
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="模型名称"
                      onChange={(e) => {
                        setModelForm(prev => ({
                          ...prev,
                          name: e.target.value
                        }));
                      }}
                    />
                  )}
                />
              </FormControl>
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

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          模型配置已成功保存
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
