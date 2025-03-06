import { NextResponse } from 'next/server';
import { getQuestions } from '@/lib/db/questions';
import { getDatasets } from '@/lib/db/datasets';


// 获取项目的所有问题
export async function GET(request, { params }) {
  try {
    const { projectId } = params;

    // 验证项目ID
    if (!projectId) {
      return NextResponse.json({ error: '项目ID不能为空' }, { status: 400 });
    }

    // 获取问题列表
    const nestedQuestions = await getQuestions(projectId);

    // 获取数据集
    const datasets = await getDatasets(projectId);

    // 将嵌套的问题数据结构拍平
    const flattenedQuestions = [];

    nestedQuestions.forEach(item => {
      const { chunkId, questions } = item;

      if (questions && Array.isArray(questions)) {
        questions.forEach(question => {
          const dataSites = datasets.filter(dataset => dataset.question === question.question);
          flattenedQuestions.push({
            ...question,
            chunkId,
            dataSites
          });
        });
      }
    });

    return NextResponse.json(flattenedQuestions);
  } catch (error) {
    console.error('获取问题列表失败:', error);
    return NextResponse.json({ error: error.message || '获取问题列表失败' }, { status: 500 });
  }
}
