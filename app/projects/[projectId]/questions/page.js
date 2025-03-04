'use client';

import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function QuestionsPage({ params }) {
  const { projectId } = params;
  const [questions, setQuestions] = useState([
    { id: '1', content: '什么是神经网络？', tags: ['AI', '基础'] },
    { id: '2', content: '解释卷积神经网络的原理', tags: ['AI', '进阶', 'CNN'] }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionContent, setQuestionContent] = useState('');
  const [questionTags, setQuestionTags] = useState('');
  
  const handleOpenDialog = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionContent(question.content);
      setQuestionTags(question.tags.join(', '));
    } else {
      setEditingQuestion(null);
      setQuestionContent('');
      setQuestionTags('');
    }
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleSaveQuestion = () => {
    const tagsArray = questionTags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    if (editingQuestion) {
      setQuestions(prev => 
        prev.map(q => 
          q.id === editingQuestion.id
            ? { ...q, content: questionContent, tags: tagsArray }
            : q
        )
      );
    } else {
      const newQuestion = {
        id: Date.now().toString(),
        content: questionContent,
        tags: tagsArray
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
    
    handleCloseDialog();
  };
  
  const handleDeleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          问题列表
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          添加问题
        </Button>
      </Box>
      
      <Paper>
        <List>
          {questions.length === 0 ? (
            <ListItem>
              <ListItemText primary="暂无问题" />
            </ListItem>
          ) : (
            questions.map((question, index) => (
              <Box key={question.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton 
                        edge="end" 
                        aria-label="edit"
                        onClick={() => handleOpenDialog(question)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={question.content}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {question.tags.map(tag => (
                          <Box 
                            key={tag} 
                            sx={{ 
                              bgcolor: 'primary.light', 
                              color: 'white', 
                              px: 1, 
                              borderRadius: 1,
                              fontSize: '0.8rem' 
                            }}
                          >
                            {tag}
                          </Box>
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
                {index < questions.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>
      </Paper>
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingQuestion ? '编辑问题' : '添加问题'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="问题内容"
            fullWidth
            multiline
            rows={3}
            value={questionContent}
            onChange={(e) => setQuestionContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="标签 (以逗号分隔)"
            fullWidth
            value={questionTags}
            onChange={(e) => setQuestionTags(e.target.value)}
            helperText="例如: AI, 基础, 神经网络"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button 
            onClick={handleSaveQuestion} 
            variant="contained"
            disabled={!questionContent.trim()}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
