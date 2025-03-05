import { NextResponse } from 'next/server';
import { saveTags } from '@/lib/db/tags';

export async function PUT(request, { params }) {
  try {
    const { projectId } = params;

    // 验证项目ID
    if (!projectId) {
      return NextResponse.json({ error: '项目ID不能为空' }, { status: 400 });
    }

    // 获取请求体
    const { tags } = await request.json();

    // 验证标签数据
    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json({ error: '标签数据格式不正确' }, { status: 400 });
    }

    // 保存更新后的标签树
    const updatedTags = await saveTags(projectId, tags);

    return NextResponse.json({ tags: updatedTags });
  } catch (error) {
    console.error('更新标签失败:', error);
    return NextResponse.json({ error: error.message || '更新标签失败' }, { status: 500 });
  }
}