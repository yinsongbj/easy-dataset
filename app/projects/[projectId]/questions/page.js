'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Checkbox,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteIcon from '@mui/icons-material/Delete';

import SearchIcon from '@mui/icons-material/Search';
import QuestionListView from '@/components/questions/QuestionListView';
import QuestionTreeView from '@/components/questions/QuestionTreeView';
import TabPanel from '@/components/text-split/components/TabPanel';

export default function QuestionsPage({ params }) {
  const { projectId } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [chunks, setChunks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 获取所有数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取标签树
        const tagsResponse = await fetch(`/api/projects/${projectId}/tags`);
        if (!tagsResponse.ok) {
          throw new Error('获取标签树失败');
        }
        const tagsData = await tagsResponse.json();
        setTags(tagsData.tags || []);

        // 获取问题列表
        const questionsResponse = await fetch(`/api/projects/${projectId}/questions`);
        if (!questionsResponse.ok) {
          throw new Error('获取问题列表失败');
        }
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData || []);

        // 获取文本块列表
        const response = await fetch(`/api/projects/${projectId}/split`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '获取文本块失败');
        }
        const data = await response.json();
        setChunks(data.chunks || []);

      } catch (error) {
        console.error('获取数据失败:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // 处理标签页切换
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 处理问题选择
  const handleSelectQuestion = (questionId, chunkId, newSelected) => {
    if (newSelected) {
      // 处理批量选择的情况
      setSelectedQuestions(newSelected);
    } else {
      // 处理单个问题选择的情况
      const questionKey = `${chunkId}-${questionId}`;
      setSelectedQuestions(prev => {
        if (prev.includes(questionKey)) {
          return prev.filter(id => id !== questionKey);
        } else {
          return [...prev, questionKey];
        }
      });
    }
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedQuestions.length > 0) {
      setSelectedQuestions([]);
    } else {
      const allQuestionKeys = [];
      questions.forEach(question => {
        allQuestionKeys.push(`${question.chunkId}-${question.question}`);
      });
      setSelectedQuestions(allQuestionKeys);
    }
  };

  // 批量生成答案
  const handleBatchGenerateAnswers = async () => {
    if (selectedQuestions.length === 0) {
      setSnackbar({
        open: true,
        message: '请先选择问题',
        severity: 'warning'
      });
      return;
    }

    setSnackbar({
      open: true,
      message: `已选择 ${selectedQuestions.length} 个问题，准备生成答案`,
      severity: 'info'
    });

    // 这里是生成答案的逻辑，暂时留空
    console.log('生成答案:', selectedQuestions);
  };

  // 关闭提示框
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 处理删除问题
  const handleDeleteQuestion = async (questionId, chunkId) => {
    // 这里是删除问题的逻辑，暂时留空
    console.log('删除问题:', questionId, chunkId);
  };

  // 处理批量删除问题
  const handleBatchDeleteQuestions = async () => {
    if (selectedQuestions.length === 0) {
      setSnackbar({
        open: true,
        message: '请先选择问题',
        severity: 'warning'
      });
      return;
    }

    // 这里是批量删除问题的逻辑，暂时留空
    console.log('批量删除问题:', selectedQuestions);
  };

  // 获取文本块内容
  const getChunkContent = (chunkId) => {
    const chunk = chunks.find(c => c.id === chunkId);
    return chunk ? chunk.content : '';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // 计算问题总数
  const totalQuestions = questions.length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          问题列表 ({totalQuestions})
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color={selectedQuestions.length > 0 ? 'error' : 'primary'}
            startIcon={<DeleteIcon />}
            onClick={handleBatchDeleteQuestions}
            disabled={selectedQuestions.length === 0}
          >
            删除所选
          </Button>
          <Button
            variant="contained"
            startIcon={<AutoFixHighIcon />}
            onClick={handleBatchGenerateAnswers}
            disabled={selectedQuestions.length === 0}
          >
            生成答案
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          sx={{
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Tab label="列表视图" />
          <Tab label="领域树视图" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <TextField
                placeholder="搜索问题或标签..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{ width: { xs: '100%', sm: 300 } }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={selectedQuestions.length > 0 && selectedQuestions.length === totalQuestions}
                indeterminate={selectedQuestions.length > 0 && selectedQuestions.length < totalQuestions}
                onChange={handleSelectAll}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {selectedQuestions.length > 0 ? `已选择 ${selectedQuestions.length} 个问题` : '全选'}
                （共 {questions.filter(question =>
                  question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (question.label && question.label.toLowerCase().includes(searchTerm.toLowerCase()))
                ).length} 个问题）
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <TabPanel value={activeTab} index={0}>
          <QuestionListView
            questions={questions.filter(question =>
              question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (question.label && question.label.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            chunks={chunks}
            selectedQuestions={selectedQuestions}
            onSelectQuestion={handleSelectQuestion}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <QuestionTreeView
            questions={questions.filter(question =>
              question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (question.label && question.label.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            chunks={chunks}
            tags={tags}
            selectedQuestions={selectedQuestions}
            onSelectQuestion={handleSelectQuestion}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </TabPanel>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}