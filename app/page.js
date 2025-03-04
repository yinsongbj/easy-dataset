'use client';

import Navbar from '@/components/Navbar';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Paper, 
  Stack,
  Divider,
  useTheme,
  CardActionArea,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CreateProjectDialog from '@/components/CreateProjectDialog';

// 图标
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DatasetIcon from '@mui/icons-material/Dataset';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// 默认模型列表
const mockModels = [
  { id: 'deepseek-r1', provider: 'Ollama', name: 'DeepSeek-R1' },
  { id: 'gpt-3.5-turbo-openai', provider: 'OpenAI', name: 'gpt-3.5-turbo' },
  { id: 'gpt-3.5-turbo-guiji', provider: '硅基流动', name: 'gpt-3.5-turbo' },
  { id: 'glm-4-flash', provider: '智谱AI', name: 'GLM-4-Flash' }
];

export default function Home() {
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('获取项目列表失败');
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('获取项目列表出错:', error);
        setError(error.message);
        // 出错时使用演示数据
        setProjects(demoProjects);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);
  
  return (
    <main>
      <Navbar projects={projects} models={mockModels} />
      
      {/* 英雄区 */}
      <Box 
        sx={{ 
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(42, 92, 170, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)' 
            : 'linear-gradient(135deg, rgba(42, 92, 170, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          pt: 8,
          pb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 装饰元素 */}
        <Box 
          sx={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(42, 92, 170, 0) 70%)',
            top: '-200px',
            right: '-100px',
            zIndex: 0
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              fontWeight="bold"
              sx={{
                mb: 2,
                background: theme.palette.gradient.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
              }}
            >
              Easy DataSet
            </Typography>
            
            <Typography variant="h5" color="text.secondary" paragraph>
              简单高效地处理文本、创建问题并生成高质量数据集
            </Typography>
            
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => setCreateDialogOpen(true)}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ 
                mt: 3,
                px: 4,
                py: 1.2,
                borderRadius: '12px',
                fontSize: '1rem',
                background: theme.palette.gradient.primary,
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              创建新项目
            </Button>
          </Box>
          
          {/* 数据统计卡片 */}
          <Paper 
            elevation={0}
            sx={{ 
              mt: 6, 
              p: { xs: 2, md: 4 }, 
              borderRadius: '16px',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 24px rgba(0, 0, 0, 0.2)'
                : '0 8px 24px rgba(0, 0, 0, 0.05)',
              background: theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.6)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography color="primary" variant="h2" fontWeight="bold">
                    {projects.length}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    进行中的项目
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography color="secondary" variant="h2" fontWeight="bold">
                    {projects.reduce((sum, project) => sum + (project.questionsCount || 0), 0)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    问题数量
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography sx={{ color: theme.palette.success.main }} variant="h2" fontWeight="bold">
                    {projects.reduce((sum, project) => sum + (project.datasetsCount || 0), 0)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    生成的数据集
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography sx={{ color: theme.palette.warning.main }} variant="h2" fontWeight="bold">
                    {mockModels.length}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    支持的模型
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      
      {/* 项目列表区域 */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" fontWeight="600" color="text.primary">
            您的项目
          </Typography>
          

        </Box>
        
        {/* 加载状态 */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 6 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* 错误提示 */}
        {error && !loading && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'error.light', borderRadius: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ErrorOutlineIcon color="error" />
              <Typography color="error.dark">
                获取项目列表失败: {error}
              </Typography>
            </Stack>
          </Box>
        )}
        
        {/* 项目列表 */}
        {!loading && (
          <Grid container spacing={3}>
            {projects.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    还没有创建任何项目
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => setCreateDialogOpen(true)}
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ mt: 2 }}
                  >
                    创建第一个项目
                  </Button>
                </Paper>
              </Grid>
            ) : (
              projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card 
                className="hover-card"
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  overflow: 'visible',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -16,
                    left: 24,
                    zIndex: 1
                  }}
                >
                  <Avatar
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <DataObjectIcon />
                  </Avatar>
                </Box>
                <CardActionArea 
                  component={Link} 
                  href={`/projects/${project.id}`}
                  sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    pt: 4
                  }}
                >
                  <CardContent sx={{ width: '100%', pb: 1 }}>
                    <Box 
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 0.5
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        component="div"
                        fontWeight="600"
                        sx={{ mt: 1 }}
                      >
                        {project.name}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={`${project.questionsCount} 问题`}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: '40px'
                      }}
                    >
                      {project.description}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                      >
                        上次更新: {project.lastUpdated}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="primary"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        查看详情
                        <ArrowForwardIcon fontSize="small" sx={{ fontSize: '16px' }} />
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )))
            }
          </Grid>
        )}
      </Container>
      
      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </main>
  );
}
