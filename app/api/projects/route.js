import { createProject, getProjects, deleteProject } from '@/lib/db/index';

export async function POST(request) {
  try {
    const projectData = await request.json();

    // 验证必要的字段
    if (!projectData.name) {
      return Response.json({ error: '项目名称不能为空' }, { status: 400 });
    }

    // 创建项目
    const newProject = await createProject(projectData);
    return Response.json(newProject, { status: 201 });
  } catch (error) {
    console.error('创建项目出错:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projects = await getProjects();
    return Response.json(projects);
  } catch (error) {
    console.error('获取项目列表出错:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
