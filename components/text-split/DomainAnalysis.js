'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TabPanel from './components/TabPanel';
import ReactMarkdown from 'react-markdown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

/**
 * 领域分析组件
 * @param {Object} props
 * @param {string} props.projectId - 项目ID
 * @param {Array} props.toc - 目录结构数组
 * @param {Array} props.tags - 标签树数组
 * @param {boolean} props.loading - 是否加载中
 */

// 领域树节点组件
function TreeNode({ node, level = 0 }) {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const hasChildren = node.child && node.child.length > 0;
  
  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    }
  };

  return (
    <>
      <ListItem 
        button 
        onClick={handleClick}
        sx={{
          pl: level * 2 + 1,
          bgcolor: level === 0 ? theme.palette.primary.light : 'transparent',
          color: level === 0 ? theme.palette.primary.contrastText : 'inherit',
          '&:hover': {
            bgcolor: level === 0 ? theme.palette.primary.main : theme.palette.action.hover,
          },
          borderRadius: '4px',
          mb: 0.5
        }}
      >
        <ListItemText 
          primary={node.label} 
          primaryTypographyProps={{
            fontWeight: level === 0 ? 600 : 400,
            fontSize: level === 0 ? '1rem' : '0.9rem'
          }}
        />
        {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.child.map((childNode, index) => (
              <TreeNode key={index} node={childNode} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

// 领域树组件
function DomainTree({ tags }) {
  return (
    <List component="nav" aria-label="domain tree">
      {tags.map((node, index) => (
        <TreeNode key={index} node={node} />
      ))}
    </List>
  );
}

export default function DomainAnalysis({ projectId, toc = '', tags = [], loading = false }) {
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
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2
          }}
        >
          <Tab label="领域树" />
          <Tab label="目录结构" />
        </Tabs>

        <Box sx={{
          p: 3,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)',
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)'
        }}>
          <TabPanel value={activeTab} index={0}>
            <Box>
              <Typography variant="h6" gutterBottom>
                领域知识树
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{
                p: 2,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
                maxHeight: '600px',
                overflow: 'auto'
              }}>
                {tags && tags.length > 0 ? (
                  <DomainTree tags={tags} />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    暂无领域标签树数据
                  </Typography>
                )}
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <Box>
              <Typography variant="h6" gutterBottom>
                文档目录结构
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{
                p: 2,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
                maxHeight: '600px',
                overflow: 'auto'
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
