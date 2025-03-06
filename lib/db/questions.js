'use server';

import fs from 'fs';
import path from 'path';
import { getProjectRoot, ensureDir, readJsonFile, writeJsonFile } from './base';

/**
 * 获取项目的所有问题
 * @param {string} projectId - 项目ID
 * @returns {Promise<Array>} - 问题列表
 */
export async function getQuestions(projectId) {
  const projectRoot = await getProjectRoot();
  const projectPath = path.join(projectRoot, projectId);
  const questionsPath = path.join(projectPath, 'questions.json');
  
  try {
    const questions = await readJsonFile(questionsPath);
    return questions || [];
  } catch (error) {
    console.error('获取问题列表失败:', error);
    return [];
  }
}

/**
 * 保存项目的问题列表
 * @param {string} projectId - 项目ID
 * @param {Array} questions - 问题列表
 * @returns {Promise<Array>} - 保存后的问题列表
 */
export async function saveQuestions(projectId, questions) {
  const projectRoot = await getProjectRoot();
  const projectPath = path.join(projectRoot, projectId);
  const questionsPath = path.join(projectPath, 'questions.json');
  
  await ensureDir(projectPath);
  
  try {
    await writeJsonFile(questionsPath, questions);
    return questions;
  } catch (error) {
    console.error('保存问题列表失败:', error);
    throw error;
  }
}

/**
 * 添加问题到项目
 * @param {string} projectId - 项目ID
 * @param {string} chunkId - 文本块ID
 * @param {Array} newQuestions - 新问题列表
 * @returns {Promise<Array>} - 更新后的问题列表
 */
export async function addQuestionsForChunk(projectId, chunkId, newQuestions) {
  const questions = await getQuestions(projectId);
  
  // 检查是否已存在该文本块的问题
  const existingIndex = questions.findIndex(item => item.chunkId === chunkId);
  
  if (existingIndex >= 0) {
    // 更新现有问题
    questions[existingIndex].questions = newQuestions;
  } else {
    // 添加新问题
    questions.push({
      chunkId,
      questions: newQuestions
    });
  }
  
  return await saveQuestions(projectId, questions);
}

/**
 * 获取指定文本块的问题
 * @param {string} projectId - 项目ID
 * @param {string} chunkId - 文本块ID
 * @returns {Promise<Array>} - 问题列表
 */
export async function getQuestionsForChunk(projectId, chunkId) {
  const questions = await getQuestions(projectId);
  const chunkQuestions = questions.find(item => item.chunkId === chunkId);
  
  return chunkQuestions ? chunkQuestions.questions : [];
}

/**
 * 删除指定文本块的问题
 * @param {string} projectId - 项目ID
 * @param {string} chunkId - 文本块ID
 * @returns {Promise<Array>} - 更新后的问题列表
 */
export async function deleteQuestionsForChunk(projectId, chunkId) {
  const questions = await getQuestions(projectId);
  const updatedQuestions = questions.filter(item => item.chunkId !== chunkId);
  
  return await saveQuestions(projectId, updatedQuestions);
}
