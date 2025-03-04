'use server';

import fs from 'fs';
import path from 'path';
import { getProjectRoot, ensureDir } from './base';

// 保存文本片段
export async function saveTextChunk(projectId, chunkId, content) {
  const projectRoot = await getProjectRoot();
  const projectPath = path.join(projectRoot, projectId);
  const chunksDir = path.join(projectPath, 'chunks');
  
  await ensureDir(chunksDir);
  
  const chunkPath = path.join(chunksDir, `${chunkId}.txt`);
  await fs.promises.writeFile(chunkPath, content);
  
  return { id: chunkId, path: chunkPath };
}

// 获取文本片段
export async function getTextChunk(projectId, chunkId) {
  const projectRoot = await getProjectRoot();
  const projectPath = path.join(projectRoot, projectId);
  const chunkPath = path.join(projectPath, 'chunks', `${chunkId}.txt`);
  
  try {
    await fs.promises.access(chunkPath);
    const content = await fs.promises.readFile(chunkPath, 'utf8');
    return {
      id: chunkId,
      content,
      path: chunkPath
    };
  } catch (error) {
    return null;
  }
}

// 获取项目中所有文本片段的ID
export async function getTextChunkIds(projectId) {
  const projectRoot = await getProjectRoot();
  const projectPath = path.join(projectRoot, projectId);
  const chunksDir = path.join(projectPath, 'chunks');
  
  try {
    await fs.promises.access(chunksDir);
  } catch (error) {
    return [];
  }
  
  const files = await fs.promises.readdir(chunksDir);
  return files
    .filter(file => file.endsWith('.txt'))
    .map(file => file.replace('.txt', ''));
}

// 保存上传的原始文件
export async function saveFile(projectId, fileBuffer, fileName) {
  const projectRoot = await getProjectRoot();
  const projectPath = path.join(projectRoot, projectId);
  const filesDir = path.join(projectPath, 'files');
  
  await ensureDir(filesDir);
  
  const filePath = path.join(filesDir, fileName);
  await fs.promises.writeFile(filePath, fileBuffer);
  
  return {
    name: fileName,
    path: filePath
  };
}

// 获取项目中所有原始文件
export async function getFiles(projectId) {
  const projectRoot = await getProjectRoot();
  const projectPath = path.join(projectRoot, projectId);
  const filesDir = path.join(projectPath, 'files');
  
  try {
    await fs.promises.access(filesDir);
  } catch (error) {
    return [];
  }
  
  const files = await fs.promises.readdir(filesDir);
  const fileStats = await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(filesDir, fileName);
      const stats = await fs.promises.stat(filePath);
      
      return {
        name: fileName,
        path: filePath,
        size: stats.size,
        createdAt: stats.birthtime
      };
    })
  );
  return fileStats;
}
