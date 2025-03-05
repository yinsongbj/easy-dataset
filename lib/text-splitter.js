'use server';

import fs from 'fs';
import path from 'path';
import {
  getProjectRoot,
  ensureDir,
  readJsonFile
} from './db/base';
import { saveTextChunk } from './db/texts';

// 导入Markdown分割工具
const markdownSplitter = require('./split-mardown/index');

/**
 * 分割项目中的Markdown文件
 * @param {string} projectId - 项目ID
 * @param {string} fileName - 文件名
 * @returns {Promise<Array>} - 分割结果数组
 */
export async function splitProjectFile(projectId, fileName) {
  try {
    // 获取项目根目录
    const projectRoot = await getProjectRoot();
    const projectPath = path.join(projectRoot, projectId);

    // 获取文件路径
    const filePath = path.join(projectPath, 'files', fileName);

    // 检查文件是否存在
    try {
      await fs.promises.access(filePath);
    } catch (error) {
      throw new Error(`文件 ${fileName} 不存在`);
    }

    // 读取文件内容
    const fileContent = await fs.promises.readFile(filePath, 'utf8');

    // 获取任务配置
    const taskConfigPath = path.join(projectPath, 'task-config.json');
    let taskConfig;

    try {
      await fs.promises.access(taskConfigPath);
      const taskConfigData = await fs.promises.readFile(taskConfigPath, 'utf8');
      taskConfig = JSON.parse(taskConfigData);
    } catch (error) {
      // 如果配置文件不存在，使用默认配置
      taskConfig = {
        textSplitMinLength: 1500,
        textSplitMaxLength: 2000
      };
    }

    // 获取分割参数
    const minLength = taskConfig.textSplitMinLength || 1500;
    const maxLength = taskConfig.textSplitMaxLength || 2000;

    // 分割文本
    const splitResult = markdownSplitter.splitMarkdown(fileContent, minLength, maxLength);

    // 提取目录结构
    const tocJSON = markdownSplitter.extractTableOfContents(fileContent);

    const toc = markdownSplitter.tocToMarkdown(tocJSON, { isNested: false });

    // 确保chunks目录存在
    const chunksDir = path.join(projectPath, 'chunks');
    await ensureDir(chunksDir);

    // 保存分割结果到chunks目录
    const savedChunks = await Promise.all(
      splitResult.map(async (part, index) => {
        const chunkId = `${path.basename(fileName, path.extname(fileName))}-part-${index + 1}`;
        await saveTextChunk(projectId, chunkId, part.result);

        return {
          id: chunkId,
          content: part.content,
          summary: part.summary,
          length: part.content.length,
          fileName: fileName
        };
      })
    );

    // 保存目录结构到单独的toc文件夹
    const tocDir = path.join(projectPath, 'toc');
    await ensureDir(tocDir);
    const tocPath = path.join(tocDir, `${path.basename(fileName, path.extname(fileName))}-toc.json`);
    await fs.promises.writeFile(tocPath, JSON.stringify(toc, null, 2));

    return {
      fileName,
      totalChunks: savedChunks.length,
      chunks: savedChunks,
      toc
    };

  } catch (error) {
    console.error('文本分割出错:', error);
    throw error;
  }
}

/**
 * 获取项目中的所有文本块
 * @param {string} projectId - 项目ID
 * @returns {Promise<Array>} - 文本块详细信息数组
 */
export async function getProjectChunks(projectId) {
  try {
    const projectRoot = await getProjectRoot();
    const projectPath = path.join(projectRoot, projectId);
    const chunksDir = path.join(projectPath, 'chunks');
    const tocDir = path.join(projectPath, 'toc');

    // 检查chunks目录是否存在
    try {
      await fs.promises.access(chunksDir);
    } catch (error) {
      return { chunks: [] };
    }

    // 读取所有文本块文件
    const files = await fs.promises.readdir(chunksDir);
    const chunkFiles = files.filter(file => file.endsWith('.txt'));

    // 按文件名分组文本块
    const chunksByFile = {};

    for (const chunkFile of chunkFiles) {
      const chunkId = chunkFile.replace('.txt', '');
      const chunkPath = path.join(chunksDir, chunkFile);
      const content = await fs.promises.readFile(chunkPath, 'utf8');

      // 从文本块ID中提取文件名
      // 格式为: filename-part-X
      const fileNameMatch = chunkId.match(/(.+)-part-\d+/);
      const fileName = fileNameMatch ? `${fileNameMatch[1]}.md` : null;

      if (fileName) {
        if (!chunksByFile[fileName]) {
          chunksByFile[fileName] = [];
        }

        chunksByFile[fileName].push({
          id: chunkId,
          content: content.substring(0, 200) + (content.length > 200 ? '...' : ''), // 只返回前200个字符作为预览
          summary: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          length: content.length,
          fileName: fileName
        });
      }
    }

    // 读取所有TOC文件
    const tocByFile = {};
    try {
      await fs.promises.access(tocDir);
      const tocFiles = await fs.promises.readdir(tocDir);

      for (const tocFile of tocFiles) {
        if (tocFile.endsWith('-toc.json')) {
          const tocPath = path.join(tocDir, tocFile);
          const tocContent = await fs.promises.readFile(tocPath, 'utf8');
          const fileName = tocFile.replace('-toc.json', '.md');

          try {
            tocByFile[fileName] = JSON.parse(tocContent);
          } catch (e) {
            console.error(`解析TOC文件 ${tocFile} 出错:`, e);
          }
        }
      }
    } catch (error) {
      // TOC目录不存在或读取出错，继续处理
    }

    // 整合结果 - 因为一个项目只允许上传一个文件，所以只取第一个文件的结果
    let fileResult = null;

    // 取第一个文件的结果
    for (const fileName in chunksByFile) {
      const chunks = chunksByFile[fileName];
      const tocJSON = tocByFile[fileName] || [];

      const toc = markdownSplitter.tocToMarkdown(tocJSON, { isNested: true });

      fileResult = {
        fileName,
        totalChunks: chunks.length,
        chunks: chunks,
        toc: toc
      };

      // 只取第一个文件
      break;
    }

    return {
      fileResult, // 单个文件结果，而不是数组
      chunks: chunkFiles.map(file => file.replace('.txt', ''))
    };
  } catch (error) {
    console.error('获取文本块出错:', error);
    throw error;
  }
}

/**
 * 获取文本块内容
 * @param {string} projectId - 项目ID
 * @param {string} chunkId - 文本块ID
 * @returns {Promise<Object>} - 文本块内容
 */
export async function getChunkContent(projectId, chunkId) {
  try {
    const projectRoot = await getProjectRoot();
    const projectPath = path.join(projectRoot, projectId);
    const chunkPath = path.join(projectPath, 'chunks', `${chunkId}.txt`);

    try {
      await fs.promises.access(chunkPath);
    } catch (error) {
      throw new Error(`文本块 ${chunkId} 不存在`);
    }

    const content = await fs.promises.readFile(chunkPath, 'utf8');

    return {
      id: chunkId,
      content
    };
  } catch (error) {
    console.error('获取文本块内容出错:', error);
    throw error;
  }
}
