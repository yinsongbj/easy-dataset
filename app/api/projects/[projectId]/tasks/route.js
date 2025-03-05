import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getProjectRoot } from '@/lib/db/base';

// 获取任务配置
export async function GET(request, { params }) {
  try {
    const { projectId } = params;
    
    // 验证项目 ID
    if (!projectId) {
      return NextResponse.json({ error: '项目 ID 不能为空' }, { status: 400 });
    }
    
    // 获取项目根目录
    const projectRoot = await getProjectRoot();
    const projectPath = path.join(projectRoot, projectId);
    
    // 检查项目是否存在
    try {
      await fs.access(projectPath);
    } catch (error) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }
    
    // 获取任务配置文件路径
    const taskConfigPath = path.join(projectPath, 'task-config.json');
    
    // 检查任务配置文件是否存在
    try {
      await fs.access(taskConfigPath);
    } catch (error) {
      // 如果配置文件不存在，返回默认配置
      return NextResponse.json({
        textSplitMinLength: 1500,
        textSplitMaxLength: 2000,
        questionGenerationLength: 240,
        huggingfaceToken: ''
      });
    }
    
    // 读取任务配置文件
    const taskConfigData = await fs.readFile(taskConfigPath, 'utf-8');
    const taskConfig = JSON.parse(taskConfigData);
    
    return NextResponse.json(taskConfig);
  } catch (error) {
    console.error('获取任务配置出错:', error);
    return NextResponse.json({ error: '获取任务配置失败' }, { status: 500 });
  }
}

// 更新任务配置
export async function PUT(request, { params }) {
  try {
    const { projectId } = params;
    
    // 验证项目 ID
    if (!projectId) {
      return NextResponse.json({ error: '项目 ID 不能为空' }, { status: 400 });
    }
    
    // 获取请求体
    const taskConfig = await request.json();
    
    // 验证请求体
    if (!taskConfig) {
      return NextResponse.json({ error: '任务配置不能为空' }, { status: 400 });
    }
    
    // 获取项目根目录
    const projectRoot = await getProjectRoot();
    const projectPath = path.join(projectRoot, projectId);
    
    // 检查项目是否存在
    try {
      await fs.access(projectPath);
    } catch (error) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 });
    }
    
    // 获取任务配置文件路径
    const taskConfigPath = path.join(projectPath, 'task-config.json');
    
    // 写入任务配置文件
    await fs.writeFile(taskConfigPath, JSON.stringify(taskConfig, null, 2), 'utf-8');
    
    return NextResponse.json({ message: '任务配置已更新' });
  } catch (error) {
    console.error('更新任务配置出错:', error);
    return NextResponse.json({ error: '更新任务配置失败' }, { status: 500 });
  }
}
