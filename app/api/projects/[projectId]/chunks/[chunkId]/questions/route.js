import { NextResponse } from 'next/server';
import { getTextChunk } from '@/lib/db/texts';
import LLMClient from '@/lib/llm/core/index';
import getQuestionPrompt from '@/lib/llm/prompts/question';
import getAddLabelPrompt from '@/lib/llm/prompts/addLabel';
import { addQuestionsForChunk, getQuestionsForChunk } from '@/lib/db/questions';
import { extractJsonFromLLMOutput } from '@/lib/llm/common/util';
import { getTaskConfig } from '@/lib/db/projects';
import { getTags } from '@/lib/db/tags';

// 为指定文本块生成问题
export async function POST(request, { params }) {
  try {
    const { projectId, chunkId } = params;

    // 验证项目ID和文本块ID
    if (!projectId || !chunkId) {
      return NextResponse.json({ error: '项目ID或文本块ID不能为空' }, { status: 400 });
    }

    // 获取请求体
    const { model, language = '中文', number } = await request.json();

    if (!model) {
      return NextResponse.json({ error: '请选择模型' }, { status: 400 });
    }

    // 获取文本块内容
    const chunk = await getTextChunk(projectId, chunkId);
    if (!chunk) {
      return NextResponse.json({ error: '文本块不存在' }, { status: 404 });
    }

    // 获取项目 task-config 信息
    const taskConfig = await getTaskConfig(projectId);
    const { questionGenerationLength } = taskConfig;

    // 创建LLM客户端
    const llmClient = new LLMClient({
      provider: model.provider,
      endpoint: model.endpoint,
      apiKey: model.apiKey,
      model: model.name,
    });

    // 生成问题的数量，如果未指定，则根据文本长度自动计算
    const questionNumber = number || Math.floor(chunk.content.length / questionGenerationLength);

    // 生成问题
    const prompt = getQuestionPrompt(chunk.content, questionNumber, language);
    const llmRes = await llmClient.chat(prompt);

    const response = llmRes.choices?.[0]?.message?.content ||
      llmRes.response ||
      '';

    // 从LLM输出中提取JSON格式的问题列表
    const questions = extractJsonFromLLMOutput(response);

    console.log(projectId, chunkId, '生成问题：', questions);

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: '生成问题失败，请重试' }, { status: 500 });
    }

    // 打标签
    const tags = await getTags(projectId);
    const labelPrompt = getAddLabelPrompt(JSON.stringify(tags), JSON.stringify(questions));
    const llmLabelRes = await llmClient.chat(labelPrompt);
    const labelResponse = llmLabelRes.choices?.[0]?.message?.content ||
      llmLabelRes.response ||
      '';
    // 从LLM输出中提取JSON格式的问题列表
    const labelQuestions = extractJsonFromLLMOutput(labelResponse);
    console.log(projectId, chunkId, '打标签：', labelQuestions);

    // 保存问题到数据库
    await addQuestionsForChunk(projectId, chunkId, labelQuestions);

    // 返回生成的问题
    return NextResponse.json({
      chunkId,
      labelQuestions,
      total: labelQuestions.length
    });
  } catch (error) {
    console.error('生成问题出错:', error);
    return NextResponse.json({ error: error.message || '生成问题失败' }, { status: 500 });
  }
}

// 获取指定文本块的问题
export async function GET(request, { params }) {
  try {
    const { projectId, chunkId } = params;

    // 验证项目ID和文本块ID
    if (!projectId || !chunkId) {
      return NextResponse.json({ error: '项目ID或文本块ID不能为空' }, { status: 400 });
    }

    // 获取文本块的问题
    const questions = await getQuestionsForChunk(projectId, chunkId);

    // 返回问题列表
    return NextResponse.json({
      chunkId,
      questions,
      total: questions.length
    });
  } catch (error) {
    console.error('获取问题出错:', error);
    return NextResponse.json({ error: error.message || '获取问题失败' }, { status: 500 });
  }
}
