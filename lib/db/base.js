'use server';

import fs from 'fs';
import path from 'path';

// 项目根目录
const PROJECT_ROOT = path.join(process.cwd(), 'local-db');

// 获取项目根目录
export async function getProjectRoot() {
  return PROJECT_ROOT;
}

// 确保数据库目录存在
export async function ensureDbExists() {
  try {
    await fs.promises.access(PROJECT_ROOT);
  } catch (error) {
    await fs.promises.mkdir(PROJECT_ROOT, { recursive: true });
  }
}

// 读取JSON文件
export async function readJsonFile(filePath) {
  try {
    await fs.promises.access(filePath);
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// 写入JSON文件
export async function writeJsonFile(filePath, data) {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  return data;
}

// 确保目录存在
export async function ensureDir(dirPath) {
  try {
    await fs.promises.access(dirPath);
  } catch (error) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
}
