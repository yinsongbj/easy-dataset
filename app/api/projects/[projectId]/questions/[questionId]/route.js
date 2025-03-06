import { NextResponse } from 'next/server';
import { deleteQuestion } from '@/lib/db/questions';

// 删除单个问题
export async function DELETE(request, { params }) {
  try {
    const { projectId, questionId } = params;
    
    // 验证参数
    if (!projectId) {
      return NextResponse.json({ error: '项目ID不能为空' }, { status: 400 });
    }
    
    if (!questionId) {
      return NextResponse.json({ error: '问题ID不能为空' }, { status: 400 });
    }
    
    // 从请求体中获取 chunkId
    const { chunkId } = await request.json();
    
    if (!chunkId) {
      return NextResponse.json({ error: '文本块ID不能为空' }, { status: 400 });
    }
    
    // 删除问题
    await deleteQuestion(projectId, questionId, chunkId);
    
    return NextResponse.json({ success: true, message: '问题删除成功' });
  } catch (error) {
    console.error('删除问题失败:', error);
    return NextResponse.json({ error: error.message || '删除问题失败' }, { status: 500 });
  }
}
