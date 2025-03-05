
export const MODEL_PROVIDERS = [
    {
        id: 'ollama',
        name: 'Ollama',
        defaultEndpoint: 'http://127.0.0.1:11434/v1/',
        defaultModels: ['DeepSeek-R1', 'llama2', 'mistral']
    },
    {
        id: 'openai',
        name: 'OpenAI',
        defaultEndpoint: 'https://api.openai.com/v1/',
        defaultModels: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo']
    },
    {
        id: 'siliconflow',
        name: '硅基流动',
        defaultEndpoint: 'https://api.siliconflow.cn/v1/',
        defaultModels: ['gpt-3.5-turbo', 'gpt-4']
    },
    {
        id: 'deepseek',
        name: '深度求索',
        defaultEndpoint: 'https://api.deepseek.com/v1/',
        defaultModels: ['DeepSeek-R1', 'DeepSeek-Coder']
    },
    {
        id: 'zhipu',
        name: '智谱AI',
        defaultEndpoint: 'https://open.bigmodel.cn/api/paas/v4/',
        defaultModels: ['GLM-4-Flash', 'GLM-4']
    }
];