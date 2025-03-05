'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TabPanel from './components/TabPanel';
import ReactMarkdown from 'react-markdown';

/**
 * 领域分析组件
 * @param {Object} props
 * @param {string} props.projectId - 项目ID
 * @param {Array} props.toc - 目录结构数组
 */
export default function DomainAnalysis({ projectId, toc = [], loading = false }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // 处理标签切换
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (toc.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <Typography variant="body1" color="textSecondary">
          暂无目录结构，请先上传并处理文献
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper
        sx={{
          p: 0,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="目录结构" />
          <Tab label="领域树" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <Box>
              <Typography variant="h6" gutterBottom>
                文档目录结构
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{
                p: 2,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1
              }}>
                <ReactMarkdown
                  components={{
                    root: ({ children }) => (
                      <div style={{
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {children}
                      </div>
                    )
                  }}
                >
                  {toc}
                </ReactMarkdown>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box>
              <Typography variant="h6" gutterBottom>
                领域知识树
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{
                p: 2,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1
              }}>
                <ReactMarkdown
                  components={{
                    root: ({ children }) => (
                      <div style={{
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {children}
                      </div>
                    )
                  }}
                >
                  {toc}
                </ReactMarkdown>
              </Box>
            </Box>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
}
