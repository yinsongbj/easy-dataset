import { NextResponse } from 'next/server';
import { splitProjectFile, getProjectChunks } from '@/lib/text-splitter';

// 处理文本分割请求
export async function POST(request, { params }) {
  try {
    const { projectId } = params;

    // 验证项目ID
    if (!projectId) {
      return NextResponse.json({ error: '项目ID不能为空' }, { status: 400 });
    }

    // 获取请求体
    const { fileName } = await request.json();

    // 验证文件名
    if (!fileName) {
      return NextResponse.json({ error: '文件名不能为空' }, { status: 400 });
    }

    // 分割文本
    const result = await splitProjectFile(projectId, fileName);

    return NextResponse.json(result);
  } catch (error) {
    console.error('文本分割出错:', error);
    return NextResponse.json({ error: error.message || '文本分割失败' }, { status: 500 });
  }
}

// 获取项目中的所有文本块
export async function GET(request, { params }) {
  try {
    const { projectId } = params;

    // 验证项目ID
    if (!projectId) {
      return NextResponse.json({ error: '项目ID不能为空' }, { status: 400 });
    }

    // 获取文本块详细信息
    const result = await getProjectChunks(projectId);

    // 返回详细的文本块信息和文件结果（单个文件）
    return NextResponse.json({
      chunks: result.chunks,
      ...result.fileResult // 单个文件结果，而不是数组
    });
  } catch (error) {
    console.error('获取文本块出错:', error);
    return NextResponse.json({ error: error.message || '获取文本块失败' }, { status: 500 });
  }
}
