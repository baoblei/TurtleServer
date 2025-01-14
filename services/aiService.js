const axios = require('axios');
const config = require('../config');
const logger = require('../logger');

class AIService {
  constructor() {
    this.client = axios.create({
      baseURL: config.aiService.baseUrl,
      timeout: config.aiService.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    logger.info('AI服务初始化完成，配置:', {
      baseURL: config.aiService.baseUrl,
      timeout: config.aiService.timeout
    });
  }

  async queryModel(story, answer, query) {
    try {
      logger.info('准备发送请求到AI服务:', {
        url: `${config.aiService.baseUrl}${config.aiService.endpoints.query}`,
        data: { story, answer, query }
      });

      const response = await this.client.post(config.aiService.endpoints.query, {
        story,
        answer,
        query
      });

      logger.info('AI模型响应成功:', response.data);
      return response.data;
    } catch (error) {
      logger.error('AI服务调用失败:', {
        error: error.message,
        code: error.code,
        response: error.response?.data,
        config: error.config,
        baseURL: this.client.defaults.baseURL
      });

      if (error.response) {
        throw new Error(`AI服务响应错误: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        throw new Error(`AI服务无响应: ${error.message}`);
      } else {
        throw new Error(`请求配置错误: ${error.message}`);
      }
    }
  }

  // 添加健康检查方法
  async checkHealth() {
    try {
      logger.info('正在检查AI服务健康状态');
      const response = await this.client.get('/health');
      logger.info('AI服务健康检查成功:', response.data);
      return true;
    } catch (error) {
      logger.error('AI服务健康检查失败:', error);
      return false;
    }
  }
}

module.exports = new AIService(); 