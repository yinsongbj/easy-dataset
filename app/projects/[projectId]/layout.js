'use client';

import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ProjectLayout({ children, params }) {
  const router = useRouter();
  const { projectId } = params;
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [models, setModels] = useState([]);
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

        // 获取当前项目的模型配置
        const modelsResponse = await fetch(`/api/projects/${projectId}/models`);
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          if (modelsData && modelsData.length > 0) {
            // 将 API 返回的模型配置转换为 Navbar 需要的格式
            const formattedModels = modelsData.map(model => ({
              id: `${model.name}-${model.providerId}`,
              provider: model.provider,
              name: model.name,
              ...model
            }));
            setModels(formattedModels);
          }
        } else {
          console.warn('获取模型配置失败，使用默认配置');
          // 如果项目有旧的模型配置，使用项目的模型配置
          if (projectData.modelConfig && projectData.modelConfig.provider) {
            const customModel = {
              id: `${projectData.modelConfig.modelName}-${projectData.modelConfig.provider.toLowerCase()}`,
              provider: projectData.modelConfig.provider,
              name: projectData.modelConfig.modelName
            };
            setModels([customModel]);
          }
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