'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Collapse,
  Chip,
  Tooltip,
  Divider,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FolderIcon from '@mui/icons-material/Folder';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

/**
 * 问题树视图组件
 * @param {Object} props
 * @param {Array} props.questions - 问题列表
 * @param {Array} props.chunks - 文本块列表
 * @param {Array} props.tags - 标签树
 * @param {Array} props.selectedQuestions - 已选择的问题ID列表
 * @param {Function} props.onSelectQuestion - 选择问题的回调函数
 * @param {Function} props.onDeleteQuestion - 删除问题的回调函数
 * @param {Function} props.onGenerateDataset - 生成数据集的回调函数
 */
export default function QuestionTreeView({
  questions = [],
  chunks = [],
  tags = [],
  selectedQuestions = [],
  onSelectQuestion,
  onDeleteQuestion,
  onGenerateDataset
}) {
  const [expandedTags, setExpandedTags] = useState({});
  const [questionsByTag, setQuestionsByTag] = useState({});
  const [processingQuestions, setProcessingQuestions] = useState({});

  // 初始化时，将所有标签设置为展开状态
  useEffect(() => {
    const initialExpandedState = {};
    const processTag = (tag) => {
      initialExpandedState[tag.label] = true;
      if (tag.child && tag.child.length > 0) {
        tag.child.forEach(processTag);
      }
    };

    tags.forEach(processTag);
    setExpandedTags(initialExpandedState);
  }, [tags]);

  // 根据标签对问题进行分类
  useEffect(() => {
    const taggedQuestions = {};

    // 初始化标签映射
    const initTagMap = (tag) => {
      taggedQuestions[tag.label] = [];
      if (tag.child && tag.child.length > 0) {
        tag.child.forEach(initTagMap);
      }
    };

    tags.forEach(initTagMap);

    // 将问题分配到对应的标签下
    questions.forEach(question => {
      // 如果问题没有标签，添加到"未分类"
      if (!question.label) {
        if (!taggedQuestions['uncategorized']) {
          taggedQuestions['uncategorized'] = [];
        }
        taggedQuestions['uncategorized'].push(question);
        return;
      }

      // 将问题添加到匹配的标签下
      const questionLabel = question.label;

      // 查找最精确匹配的标签
      // 使用一个数组来存储所有匹配的标签路径，以便找到最精确的匹配
      const findAllMatchingTags = (tag, path = []) => {
        const currentPath = [...path, tag.label];

        // 存储所有匹配结果
        const matches = [];

        // 精确匹配当前标签
        if (tag.label === questionLabel) {
          matches.push({ label: tag.label, depth: currentPath.length });
        }

        // 检查子标签
        if (tag.child && tag.child.length > 0) {
          for (const childTag of tag.child) {
            const childMatches = findAllMatchingTags(childTag, currentPath);
            matches.push(...childMatches);
          }
        }

        return matches;
      };

      // 在所有根标签中查找所有匹配
      let allMatches = [];
      for (const rootTag of tags) {
        const matches = findAllMatchingTags(rootTag);
        allMatches.push(...matches);
      }

      // 找到深度最大的匹配（最精确的匹配）
      let matchedTagLabel = null;
      if (allMatches.length > 0) {
        // 按深度排序，深度最大的是最精确的匹配
        allMatches.sort((a, b) => b.depth - a.depth);
        matchedTagLabel = allMatches[0].label;
      }

      if (matchedTagLabel) {
        // 如果找到匹配的标签，将问题添加到该标签下
        if (!taggedQuestions[matchedTagLabel]) {
          taggedQuestions[matchedTagLabel] = [];
        }
        taggedQuestions[matchedTagLabel].push(question);
      } else {
        // 如果找不到匹配的标签，添加到"未分类"
        if (!taggedQuestions['uncategorized']) {
          taggedQuestions['uncategorized'] = [];
        }
        taggedQuestions['uncategorized'].push(question);
      }
    });

    setQuestionsByTag(taggedQuestions);
  }, [questions, tags]);

  // 处理展开/折叠标签
  const handleToggleExpand = (tagLabel) => {
    setExpandedTags(prev => ({
      ...prev,
      [tagLabel]: !prev[tagLabel]
    }));
  };

  // 检查问题是否被选中
  const isQuestionSelected = (questionId, chunkId) => {
    return selectedQuestions.includes(`${chunkId}-${questionId}`);
  };

  // 处理生成数据集
  const handleGenerateDataset = async (questionId, chunkId) => {
    // 如果没有提供回调函数，则直接返回
    if (!onGenerateDataset) return;

    // 设置处理状态
    setProcessingQuestions(prev => ({
      ...prev,
      [`${chunkId}-${questionId}`]: true
    }));

    try {
      // 调用回调函数生成数据集
      await onGenerateDataset(questionId, chunkId);
    } catch (error) {
      console.error('生成数据集失败:', error);
    } finally {
      // 清除处理状态
      setProcessingQuestions(prev => {
        const newState = { ...prev };
        delete newState[`${chunkId}-${questionId}`];
        return newState;
      });
    }
  };

  // 渲染单个问题项
  const renderQuestionItem = (question, index, total) => {
    return (
      <Box key={`${question.chunkId}-${question.question}`}>
        <ListItem
          sx={{
            pl: 4,
            py: 1,
            borderRadius: '4px',
            ml: 2,
            mr: 1,
            mb: 0.5,
            bgcolor: isQuestionSelected(question.question, question.chunkId) ? 'action.selected' : 'transparent',
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <Checkbox
            checked={isQuestionSelected(question.question, question.chunkId)}
            onChange={() => onSelectQuestion(question.question, question.chunkId)}
            sx={{ mr: 1 }}
          />
          <QuestionMarkIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: 400 }}>
                {question.question}
                {question.dataSites && question.dataSites.length > 0 && (
                  <Chip
                    label={question.dataSites.length + '个答案'}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1, fontSize: '0.75rem', maxWidth: 150 }}
                  />
                )}
              </Typography>
            }
            secondary={
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                来源: {chunks.find(c => c.id === question.chunkId)?.title || question.chunkId}
              </Typography>
            }
          />
          <Box>
            <Tooltip title="生成数据集">
              <IconButton
                size="small"
                sx={{ mr: 1 }}
                onClick={() => handleGenerateDataset(question.question, question.chunkId)}
                disabled={processingQuestions[`${question.chunkId}-${question.question}`]}
              >
                {processingQuestions[`${question.chunkId}-${question.question}`] ? (
                  <CircularProgress size={16} />
                ) : (
                  <AutoFixHighIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="删除问题">
              <IconButton
                size="small"
                onClick={() => onDeleteQuestion(question.question, question.chunkId)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </ListItem>
        {index < total - 1 && <Divider component="li" variant="inset" sx={{ ml: 6 }} />}
      </Box>
    );
  };

  // 计算标签及其子标签下的所有问题数量
  const countTotalQuestions = (tag) => {
    // 当前标签下的问题数量
    const directQuestions = questionsByTag[tag.label] || [];
    let total = directQuestions.length;

    // 如果有子标签，递归计算子标签下的问题数量
    if (tag.child && tag.child.length > 0) {
      for (const childTag of tag.child) {
        total += countTotalQuestions(childTag);
      }
    }

    return total;
  };

  // 递归渲染标签树
  const renderTagTree = (tag, level = 0) => {
    const questions = questionsByTag[tag.label] || [];
    const hasQuestions = questions.length > 0;
    const hasChildren = tag.child && tag.child.length > 0;
    const isExpanded = expandedTags[tag.label];

    // 计算标签及其子标签下的所有问题数量
    const totalQuestions = countTotalQuestions(tag);

    return (
      <Box key={tag.label}>
        <ListItem
          button
          onClick={() => handleToggleExpand(tag.label)}
          sx={{
            pl: level * 2 + 1,
            py: 1,
            bgcolor: level === 0 ? 'primary.light' : 'background.paper',
            color: level === 0 ? 'primary.contrastText' : 'inherit',
            '&:hover': {
              bgcolor: level === 0 ? 'primary.main' : 'action.hover',
            },
            borderRadius: '4px',
            mb: 0.5,
            pr: 1
          }}
        >
          <FolderIcon fontSize="small" sx={{ mr: 1, color: level === 0 ? 'inherit' : 'primary.main' }} />
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: level === 0 ? 600 : 400,
                    fontSize: level === 0 ? '1rem' : '0.9rem'
                  }}
                >
                  {tag.label}
                </Typography>
                {totalQuestions > 0 && (
                  <Chip
                    label={`${totalQuestions} 个问题`}
                    size="small"
                    color={level === 0 ? 'default' : 'primary'}
                    variant={level === 0 ? 'default' : 'outlined'}
                    sx={{ ml: 1, height: 20, fontSize: '0.7rem', color: '#fff', backgroundColor: '#333' }}
                  />
                )}
              </Box>
            }
          />
          {(hasQuestions || hasChildren) && (
            <IconButton
              size="small"
              edge="end"
              sx={{ color: level === 0 ? 'inherit' : 'action.active' }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </ListItem>

        <Collapse in={isExpanded}>
          {/* 先渲染子标签，让二级标签排在问题前面 */}
          {hasChildren && (
            <List disablePadding>
              {tag.child.map(childTag => renderTagTree(childTag, level + 1))}
            </List>
          )}

          {/* 再渲染当前标签下的问题 */}
          {hasQuestions && (
            <List disablePadding sx={{ mt: hasChildren ? 1 : 0 }}>
              {questions.map((question, index) =>
                renderQuestionItem(question, index, questions.length)
              )}
            </List>
          )}
        </Collapse>
      </Box>
    );
  };

  // 渲染未分类问题
  const renderUncategorizedQuestions = () => {
    const uncategorizedQuestions = questionsByTag['uncategorized'] || [];
    if (uncategorizedQuestions.length === 0) return null;

    return (
      <Box>
        <ListItem
          button
          onClick={() => handleToggleExpand('uncategorized')}
          sx={{
            py: 1,
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.main',
            },
            borderRadius: '4px',
            mb: 0.5,
            pr: 1
          }}
        >
          <FolderIcon fontSize="small" sx={{ mr: 1, color: 'inherit' }} />
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontSize: '1rem' }}
                >
                  未分类问题
                </Typography>
                <Chip
                  label={`${uncategorizedQuestions.length} 个问题`}
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem', color: '#fff', backgroundColor: '#333' }}
                />
              </Box>
            }
          />
          <IconButton size="small" edge="end" sx={{ color: 'inherit' }}>
            {expandedTags['uncategorized'] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </ListItem>

        <Collapse in={expandedTags['uncategorized']}>
          <List disablePadding>
            {uncategorizedQuestions.map((question, index) =>
              renderQuestionItem(question, index, uncategorizedQuestions.length)
            )}
          </List>
        </Collapse>
      </Box>
    );
  };

  // 如果没有标签和问题，显示空状态
  if (tags.length === 0 && Object.keys(questionsByTag).length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          暂无领域标签和问题数据
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'auto',
        p: 2,
        maxHeight: '75vh'
      }}
    >
      <List disablePadding>
        {renderUncategorizedQuestions()}
        {tags.map(tag => renderTagTree(tag))}
      </List>
    </Paper>
  );
}
