'use client';

import { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import StatsCard from '@/components/home/StatsCard';
import ProjectList from '@/components/home/ProjectList';
import CreateProjectDialog from '@/components/home/CreateProjectDialog';

export default function Home() {
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
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <main>
      <Navbar projects={projects} models={[]} />

      <HeroSection onCreateProject={() => setCreateDialogOpen(true)} />

      <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }}>
        <StatsCard projects={projects} />

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          mt: 8
        }}>
          <Typography variant="h4" fontWeight="600" color="text.primary">
            您的项目
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 6 }}>
            <CircularProgress />
          </Box>
        )}

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

        {!loading && (
          <ProjectList
            projects={projects}
            onCreateProject={() => setCreateDialogOpen(true)}
          />
        )}
      </Container>

      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </main>
  );
}