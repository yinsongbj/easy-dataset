export const MODEL_PROVIDERS = [
  {
    id: 'ollama',
    name: 'Ollama',
    defaultEndpoint: 'http://127.0.0.1:11434/api',
    defaultModels: []
  },
  {
    id: 'openai',
    name: 'OpenAI',
    defaultEndpoint: 'https://api.openai.com/v1/',
    defaultModels: ['gpt-4o', 'gpt-4o-mini', 'o1-mini']
  },
  {
    id: 'siliconflow',
    name: '硅基流动',
    defaultEndpoint: 'https://api.siliconflow.cn/v1/',
    defaultModels: [
      'deepseek-ai/DeepSeek-R1',
      'deepseek-ai/DeepSeek-V3',
      'Qwen2.5-7B-Instruct',
      'meta-llama/Llama-3.3-70B-Instruct'
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    defaultEndpoint: 'https://api.deepseek.com/v1/',
    defaultModels: ['deepseek-chat', 'deepseek-reasoner']
  },
  {
    id: '302ai',
    name: '302.AI',
    defaultEndpoint: 'https://api.302.ai/v1/',
    defaultModels: ['Doubao-pro-128k', 'deepseek-r1', 'kimi-latest', 'qwen-max']
  },
  {
    id: 'zhipu',
    name: '智谱AI',
    defaultEndpoint: 'https://open.bigmodel.cn/api/paas/v4/',
    defaultModels: ['glm-4-flash', 'glm-4-flashx', 'glm-4-plus', 'glm-4-long']
  },
  {
    id: 'huoshan',
    name: '火山引擎',
    defaultEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/',
    defaultModels: []
  },
  {
    id: 'groq',
    name: 'Groq',
    defaultEndpoint: 'https://api.groq.com/openai',
    defaultModels: ['Gemma 7B', 'LLaMA3 8B', 'LLaMA3 70B']
  },
  {
    id: 'grok',
    name: 'Grok',
    defaultEndpoint: 'https://api.x.ai',
    defaultModels: ['Grok Beta']
  },
  {
    id: 'OpenRouter',
    name: 'OpenRouter',
    defaultEndpoint: 'https://openrouter.ai/api/v1/',
    defaultModels: [
      'google/gemma-2-9b-it:free',
      'meta-llama/llama-3-8b-instruct:free',
      'microsoft/phi-3-mini-128k-instruct:free'
    ]
  },
  {
    id: 'alibailian',
    name: '阿里云百炼',
    defaultEndpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModels: ['qwen-max-latest', 'qwen-max-2025-01-25']
  }
];

export const DEFAULT_MODEL_SETTINGS = {
  temperature: 0.7,
  maxTokens: 4096
};
