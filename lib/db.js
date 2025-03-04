'use server';

import fs from 'fs';
import path from 'path';

// 项目根目录
const PROJECT_ROOT = path.join(process.cwd(), 'db');

// 确保数据库目录存在
export function ensureDbExists() {
  if (!fs.existsSync(PROJECT_ROOT)) {
    fs.mkdirSync(PROJECT_ROOT, { recursive: true });
  }
}

// 创建新项目
export async function createProject(projectData) {
  ensureDbExists();
  
  const projectId = Date.now().toString();
  const projectDir = path.join(PROJECT_ROOT, projectId);
  
  // 创建项目目录
  fs.mkdirSync(projectDir, { recursive: true });
  
  // 创建子目录
  fs.mkdirSync(path.join(projectDir, 'files'), { recursive: true }); // 原始文件
  fs.mkdirSync(path.join(projectDir, 'chunks'), { recursive: true }); // 分割后的文本片段
  
  // 创建项目配置文件
  const configPath = path.join(projectDir, 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(projectData, null, 2));
  
  // 创建空的问题列表文件
  const questionsPath = path.join(projectDir, 'questions.json');
  fs.writeFileSync(questionsPath, JSON.stringify([], null, 2));
  
  // 创建空的标签树文件
  const tagsPath = path.join(projectDir, 'tags.json');
  fs.writeFileSync(tagsPath, JSON.stringify([], null, 2));
  
  // 创建空的数据集结果文件
  const datasetsPath = path.join(projectDir, 'datasets.json');
  fs.writeFileSync(datasetsPath, JSON.stringify([], null, 2));
  
  return { id: projectId, ...projectData };
}

// 获取所有项目
export async function getProjects() {
  ensureDbExists();
  
  const projects = [];
  
  // 读取所有项目目录
  const items = fs.readdirSync(PROJECT_ROOT);
  
  for (const item of items) {
    const projectPath = path.join(PROJECT_ROOT, item);
    const stat = fs.statSync(projectPath);
    
    if (stat.isDirectory()) {
      const configPath = path.join(projectPath, 'config.json');
      
      if (fs.existsSync(configPath)) {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        projects.push({
          id: item,
          ...configData
        });
      }
    }
  }
  
  return projects;
}

// 获取项目详情
export async function getProject(projectId) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const configPath = path.join(projectPath, 'config.json');
  
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return {
    id: projectId,
    ...configData
  };
}

// 更新项目配置
export async function updateProject(projectId, projectData) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const configPath = path.join(projectPath, 'config.json');
  
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  fs.writeFileSync(configPath, JSON.stringify(projectData, null, 2));
  
  return {
    id: projectId,
    ...projectData
  };
}

// 删除项目
export async function deleteProject(projectId) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  
  if (!fs.existsSync(projectPath)) {
    return false;
  }
  
  fs.rmSync(projectPath, { recursive: true, force: true });
  
  return true;
}

// 获取问题列表
export async function getQuestions(projectId) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const questionsPath = path.join(projectPath, 'questions.json');
  
  if (!fs.existsSync(questionsPath)) {
    return [];
  }
  
  return JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
}

// 保存问题列表
export async function saveQuestions(projectId, questions) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const questionsPath = path.join(projectPath, 'questions.json');
  
  fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
  
  return questions;
}

// 获取标签树
export async function getTags(projectId) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const tagsPath = path.join(projectPath, 'tags.json');
  
  if (!fs.existsSync(tagsPath)) {
    return [];
  }
  
  return JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
}

// 保存标签树
export async function saveTags(projectId, tags) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const tagsPath = path.join(projectPath, 'tags.json');
  
  fs.writeFileSync(tagsPath, JSON.stringify(tags, null, 2));
  
  return tags;
}

// 获取数据集列表
export async function getDatasets(projectId) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const datasetsPath = path.join(projectPath, 'datasets.json');
  
  if (!fs.existsSync(datasetsPath)) {
    return [];
  }
  
  return JSON.parse(fs.readFileSync(datasetsPath, 'utf8'));
}

// 保存数据集列表
export async function saveDatasets(projectId, datasets) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const datasetsPath = path.join(projectPath, 'datasets.json');
  
  fs.writeFileSync(datasetsPath, JSON.stringify(datasets, null, 2));
  
  return datasets;
}

// 保存文本片段
export async function saveTextChunk(projectId, chunkId, content) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const chunksDir = path.join(projectPath, 'chunks');
  
  if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
  }
  
  const chunkPath = path.join(chunksDir, `${chunkId}.txt`);
  fs.writeFileSync(chunkPath, content);
  
  return { id: chunkId, path: chunkPath };
}

// 获取文本片段
export async function getTextChunk(projectId, chunkId) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const chunkPath = path.join(projectPath, 'chunks', `${chunkId}.txt`);
  
  if (!fs.existsSync(chunkPath)) {
    return null;
  }
  
  const content = fs.readFileSync(chunkPath, 'utf8');
  
  return {
    id: chunkId,
    content,
    path: chunkPath
  };
}

// 获取项目中所有文本片段的ID
export async function getTextChunkIds(projectId) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const chunksDir = path.join(projectPath, 'chunks');
  
  if (!fs.existsSync(chunksDir)) {
    return [];
  }
  
  const files = fs.readdirSync(chunksDir);
  return files
    .filter(file => file.endsWith('.txt'))
    .map(file => file.replace('.txt', ''));
}

// 保存上传的原始文件
export async function saveFile(projectId, fileBuffer, fileName) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const filesDir = path.join(projectPath, 'files');
  
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
  }
  
  const filePath = path.join(filesDir, fileName);
  fs.writeFileSync(filePath, fileBuffer);
  
  return {
    name: fileName,
    path: filePath
  };
}

// 获取项目中所有原始文件
export async function getFiles(projectId) {
  const projectPath = path.join(PROJECT_ROOT, projectId);
  const filesDir = path.join(projectPath, 'files');
  
  if (!fs.existsSync(filesDir)) {
    return [];
  }
  
  const files = fs.readdirSync(filesDir);
  return files.map(fileName => {
    const filePath = path.join(filesDir, fileName);
    const stats = fs.statSync(filePath);
    
    return {
      name: fileName,
      path: filePath,
      size: stats.size,
      createdAt: stats.birthtime
    };
  });
}
