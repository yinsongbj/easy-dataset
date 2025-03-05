/**
 * LLM API 统一调用工具类
 * 支持多种模型提供商：OpenAI、Ollama、智谱AI等
 */
const OllamaAPI = require('./ollama');
const http = require('http');
const https = require('https');

class LLMClient {
    /**
     * 创建 LLM 客户端实例
     * @param {Object} config - 配置信息
     * @param {string} config.provider - 提供商名称，如 'openai', 'ollama', 'zhipu' 等
     * @param {string} config.endpoint - API 端点，如 'https://api.openai.com/v1/'
     * @param {string} config.apiKey - API 密钥（如果需要）
     * @param {string} config.model - 模型名称，如 'gpt-3.5-turbo', 'llama2' 等
     */
    constructor(config = {}) {
        this.provider = config.provider || 'openai';
        this.endpoint = config.endpoint || '';
        this.apiKey = config.apiKey || '';
        this.model = config.model || '';

        // 对于 Ollama，使用专门的客户端
        if (this.provider.toLowerCase() === 'ollama') {
            const url = new URL(this.endpoint);
            this.client = new OllamaAPI({
                host: url.hostname,
                port: url.port || 11434,
                model: this.model
            });
        }
    }

    /**
     * 生成对话响应
     * @param {string|Array} prompt - 用户输入的提示词或对话历史
     * @param {Object} options - 可选参数
     * @returns {Promise<Object>} 返回模型响应
     */
    async chat(prompt, options = {}) {
        // 处理不同格式的 prompt
        const messages = Array.isArray(prompt)
            ? prompt
            : [{ role: 'user', content: prompt }];

        // 根据不同提供商调用不同的 API
        switch (this.provider.toLowerCase()) {
            case 'ollama':
                return this._chatOllama(messages, options);
            case 'openai':
            case 'siliconflow': // 硅基流动兼容 OpenAI 接口
            case 'deepseek': // 深度求索兼容 OpenAI 接口
                return this._chatOpenAI(messages, options);
            case 'zhipu': // 智谱 AI
                return this._chatZhipu(messages, options);
            default:
                // 默认尝试 OpenAI 兼容接口
                return this._chatOpenAI(messages, options);
        }
    }

    /**
     * 调用 Ollama API
     * @private
     */
    async _chatOllama(messages, options) {
        try {
            // 将消息格式转换为 Ollama 格式
            const lastMessage = messages[messages.length - 1];
            const prompt = lastMessage.content;

            // 使用 Ollama 客户端
            return await this.client.chat(prompt, {
                ...options,
                model: this.model || this.client.model
            });
        } catch (error) {
            console.error('Ollama API 调用出错:', error);
            throw error;
        }
    }

    /**
     * 调用 OpenAI 兼容的 API
     * @private
     */
    async _chatOpenAI(messages, options) {
        try {
            const url = new URL(this.endpoint);
            url.pathname = url.pathname.endsWith('/')
                ? `${url.pathname}chat/completions`
                : `${url.pathname}/chat/completions`;

            const requestOptions = {
                temperature: options.temperature || 0.7,
                top_p: options.top_p || 0.9,
                max_tokens: options.max_tokens || 2048,
                model: this.model,
                messages: messages
            };

            const response = await this._makeHttpRequest(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestOptions)
            });

            return response;
        } catch (error) {
            console.error('OpenAI 兼容 API 调用出错:', error);
            throw error;
        }
    }

    /**
     * 调用智谱 AI API
     * @private
     */
    async _chatZhipu(messages, options) {
        try {
            const url = new URL(this.endpoint);

            // 智谱 AI 的消息格式转换
            const zhipuMessages = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            }));

            const requestOptions = {
                temperature: options.temperature || 0.7,
                top_p: options.top_p || 0.9,
                max_tokens: options.max_tokens || 2048,
                model: this.model,
                messages: zhipuMessages
            };

            const response = await this._makeHttpRequest(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestOptions)
            });

            return response;
        } catch (error) {
            console.error('智谱 AI API 调用出错:', error);
            throw error;
        }
    }

    /**
     * 发送 HTTP 请求
     * @private
     */
    _makeHttpRequest(url, options) {
        return new Promise((resolve, reject) => {
            const isHttps = url.startsWith('https');
            const client = isHttps ? https : http;

            const urlObj = new URL(url);
            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: `${urlObj.pathname}${urlObj.search}`,
                method: options.method,
                headers: options.headers
            };

            const req = client.request(requestOptions, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(JSON.parse(data));
                        } else {
                            reject(new Error(`请求失败，状态码: ${res.statusCode}, 响应: ${data}`));
                        }
                    } catch (error) {
                        reject(new Error('响应解析失败'));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (options.body) {
                req.write(options.body);
            }

            req.end();
        });
    }

    /**
     * 获取模型列表（仅支持 Ollama）
     * @returns {Promise<Array>} 返回模型列表
     */
    async getModels() {
        if (this.provider.toLowerCase() === 'ollama') {
            return this.client.getModels();
        } else {
            throw new Error('当前提供商不支持获取模型列表');
        }
    }
}

module.exports = LLMClient;