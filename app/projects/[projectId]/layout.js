'use client';

import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

// 默认模型列表
const defaultModels = [
  { id: 'deepseek-r1', provider: 'Ollama', name: 'DeepSeek-R1' },
  { id: 'gpt-3.5-turbo-openai', provider: 'OpenAI', name: 'gpt-3.5-turbo' },
  { id: 'gpt-3.5-turbo-guiji', provider: '硅基流动', name: 'gpt-3.5-turbo' },
  { id: 'glm-4-flash', provider: '智谱AI', name: 'GLM-4-Flash' }
];

export default function ProjectLayout({ children, params }) {
  const router = useRouter();
  const { projectId } = params;
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [models, setModels] = useState(defaultModels);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 获取所有项目
        const projectsResponse = await fetch('/api/projects');
        if (!projectsResponse.ok) {
          throw new Error('获取项目列表失败');
        }
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        
        // 获取当前项目详情
        const projectResponse = await fetch(`/api/projects/${projectId}`);
        if (!projectResponse.ok) {
          // 如果项目不存在，跳转到首页
          if (projectResponse.status === 404) {
            router.push('/');
            return;
          }
          throw new Error('获取项目详情失败');
        }
        const projectData = await projectResponse.json();
        setCurrentProject(projectData);
        
        // 如果项目有模型配置，使用项目的模型配置
        if (projectData.modelConfig && projectData.modelConfig.provider) {
          const customModel = {
            id: `${projectData.modelConfig.modelName}-${projectData.modelConfig.provider.toLowerCase()}`,
            provider: projectData.modelConfig.provider,
            name: projectData.modelConfig.modelName
          };
          
          // 确保模型列表中包含当前项目的模型
          setModels(prevModels => {
            const modelExists = prevModels.some(m => 
              m.provider === customModel.provider && m.name === customModel.name
            );
            
            return modelExists ? prevModels : [customModel, ...prevModels];
          });
        }
  
      } catch (error) {
        console.error('加载项目数据出错:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [projectId, router]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>加载项目数据...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Typography color="error">出错了: {error}</Typography>
        <Button variant="contained" onClick={() => router.push('/')} sx={{ mt: 2 }}>
          返回首页
        </Button>
      </Box>
    );
  }
  
  return (
    <>
      <Navbar 
        projects={projects} 
        currentProject={projectId} 
        models={models} 
      />
      <main>{children}</main>
    </>
  );
}
