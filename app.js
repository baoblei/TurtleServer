const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const aiService = require('./services/aiService');
const logger = require('./logger');

// 创建Express应用
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());

// 读取故事数据
function loadStories() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'stories.json'), 'utf8');
    return JSON.parse(data).stories;
  } catch (error) {
    logger.error('读取故事数据失败:', error);
    return [];
  }
}

// API路由

// 1. 随机获取四则故事标题
app.get('/api/get-4-title', async (req, res) => {
  try {
    const stories = loadStories();
    const shuffled = stories.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    res.json(selected.map(story => story.title));
  } catch (error) {
    logger.error('获取故事标题失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 2. 随机获取单个故事标题和内容
app.get('/api/get-story', async (req, res) => {
  try {
    const stories = loadStories();
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    res.json({
      title: randomStory.title,
      story: randomStory.story
    });
  } catch (error) {
    logger.error('获取故事失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 3. 查询用户提问
app.get('/api/get-query', async (req, res) => {
  try {
    const { title, query } = req.query;
    if (!title) {
      return res.status(400).json({ error: '缺少故事标题参数' });
    }
    if (!query) {
      return res.status(400).json({ error: '缺少用户提问参数' });
    }

    const decodedTitle = decodeURIComponent(title).normalize('NFC');
    const decodedQuery = decodeURIComponent(query).normalize('NFC');
    logger.info(`解码后的标题: "${decodedTitle}", 提问: "${decodedQuery}"`);
    
    const stories = loadStories();
    const story = stories.find(s => s.title === decodedTitle);
    
    if (!story) {
      logger.error(`未找到标题为 "${decodedTitle}" 的故事`);
      return res.status(404).json({ error: '未找到相关故事' });
    }

    logger.info(`找到故事: ${JSON.stringify(story)}`);
    
    const aiResponse = await aiService.queryModel(
      story.story,
      story.answer,
      decodedQuery
    );
    res.json({ response: aiResponse.response });
  } catch (error) {
    logger.error('查询提问失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 4. 查询汤底
app.get('/api/get-answer', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: '缺少故事标题参数' });
    }

    const decodedTitle = decodeURIComponent(title).normalize('NFC');
    logger.info(`正在查询标题: "${decodedTitle}"`);
    
    const stories = loadStories();
    const story = stories.find(s => s.title === decodedTitle);

    if (!story) {
      logger.error(`未找到标题为 "${decodedTitle}" 的故事`);
      return res.status(404).json({ error: '未找到相关故事' });
    }

    logger.info(`找到故事: ${JSON.stringify(story)}`);
    res.json({ answer: story.answer });
  } catch (error) {
    logger.error('获取汤底失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 5. 获取指定故事
app.get('/api/get-select-story', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: '缺少故事标题参数' });
    }

    const decodedTitle = decodeURIComponent(title).normalize('NFC');
    logger.info(`正在查询指定标题: "${decodedTitle}"`);
    
    const stories = loadStories();
    const story = stories.find(s => s.title === decodedTitle);

    if (!story) {
      logger.error(`未找到标题为 "${decodedTitle}" 的故事`);
      return res.status(404).json({ error: '未找到相关故事' });
    }

    logger.info(`找到指定故事: ${JSON.stringify(story)}`);
    res.json({
      title: story.title,
      story: story.story
    });
  } catch (error) {
    logger.error('获取指定故事失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('应用错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`服务器运行在端口 ${PORT}`);
  console.log(`服务器运行在端口 ${PORT}`);
}); 