'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';

// 导入设置组件
import BasicSettings from '@/components/settings/BasicSettings';
import ModelSettings from '@/components/settings/ModelSettings';
import TaskSettings from '@/components/settings/TaskSettings';

// 定义 TAB 枚举
const TABS = {
  BASIC: 'basic',
  MODEL: 'model',
  TASK: 'task'
};

export default function SettingsPage({ params }) {
  const { projectId } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS.BASIC);
  const [projectExists, setProjectExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 从 URL hash 中获取当前 tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && Object.values(TABS).includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // 检查项目是否存在
  useEffect(() => {
    async function checkProject() {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setProjectExists(false);
          } else {
            throw new Error('获取项目详情失败');
          }
        } else {
          setProjectExists(true);
        }
      } catch (error) {
        console.error('获取项目详情出错:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkProject();
  }, [projectId]);

  // 处理 tab 切换
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // 更新 URL hash
    router.push(`/projects/${projectId}/settings?tab=${newValue}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!projectExists) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">项目不存在或已被删除</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        项目设置
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          aria-label="项目设置选项卡"
        >
          <Tab value={TABS.BASIC} label="基本信息" />
          <Tab value={TABS.MODEL} label="模型配置" />
          <Tab value={TABS.TASK} label="任务配置" />
        </Tabs>
      </Paper>
      
      {activeTab === TABS.BASIC && (
        <BasicSettings projectId={projectId} />
      )}
      
      {activeTab === TABS.MODEL && (
        <ModelSettings projectId={projectId} />
      )}
      
      {activeTab === TABS.TASK && (
        <TaskSettings projectId={projectId} />
      )}
    </Container>
  );
}
