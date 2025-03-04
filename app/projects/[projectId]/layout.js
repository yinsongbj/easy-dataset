import Navbar from '@/components/Navbar';

// 模拟数据
const mockProjects = [
  { id: 'project1', name: '项目一' },
  { id: 'project2', name: '项目二' }
];

const mockModels = [
  { id: 'deepseek-r1', provider: 'Ollama', name: 'DeepSeek-R1' },
  { id: 'gpt-3.5-turbo-openai', provider: 'OpenAI', name: 'gpt-3.5-turbo' },
  { id: 'gpt-3.5-turbo-guiji', provider: '硅基流动', name: 'gpt-3.5-turbo' },
  { id: 'glm-4-flash', provider: '智谱AI', name: 'GLM-4-Flash' }
];

export default function ProjectLayout({ children, params }) {
  const { projectId } = params;
  const currentProject = mockProjects.find(p => p.id === projectId) || mockProjects[0];
  
  return (
    <>
      <Navbar 
        projects={mockProjects} 
        currentProject={projectId} 
        models={mockModels} 
      />
      <main>{children}</main>
    </>
  );
}
