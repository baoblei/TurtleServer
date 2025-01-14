# 海龟汤游戏后端服务

这是一个基于 Node.js 和 Python FastAPI 的海龟汤游戏后端服务。项目包含两个主要部分：Node.js Web 服务和 Python AI 服务。

## 技术栈

### Node.js 服务
- Express.js - Web 框架
- Winston - 日志管理
- Axios - HTTP 客户端
- CORS - 跨域资源共享
- Nodemon - 开发环境热重载

### Python 服务
- FastAPI - Web 框架
- Uvicorn - ASGI 服务器
- Pydantic - 数据验证

## 环境要求

- Node.js >= 14.0.0
- Python >= 3.8
- npm 或 yarn 包管理器
- pip 包管理器

## 相关项目
- 前端项目地址：[TurtleGameWeb](https://github.com/baoblei/TurtleGameWeb)
## 安装步骤

1. 克隆项目：
```shell
git clone https://github.com/baoblei/TurtleServer.git
cd TurtleServer
```

2. 安装 Node.js 依赖：
```shell
npm install
```

3. 安装 Python 依赖：
```shell
pip install fastapi uvicorn
```

## 运行服务

1. 启动 Python AI 服务：
```shell
python ai_service_test.py
# 缺少模型推理实现，只提供一个示例
```
服务将在 http://127.0.0.1:5233 上运行

2. 在新的终端中启动 Node.js 服务：
```shell
npm run dev
```
服务将在 http://127.0.0.1:3000 上运行

## 项目结构
```
TurtleServer/
├── app.js # Node.js 主服务
├── config.js # 配置文件
├── logger.js # 日志配置
├── ai_service_test.py # Python AI 服务
├── services/
│ └── aiService.js # AI 服务客户端
└── data/
└── stories.json # 故事数据
```


## API 接口

### 1. 随机获取四则故事标题
- GET /api/get-4-title
- 返回四个故事标题的数组

### 2. 随机获取单个故事
- GET /api/get-story
- 返回包含标题和故事内容的对象

### 3. 查询用户提问
- GET /api/get-query?title={title}&query={query}
- 返回 AI 模型的回答（"对"，"错"，"不相关"，"猜对了"之一）

### 4. 查询汤底
- GET /api/get-answer?title={title}
- 返回故事的答案

### 5. 获取指定故事
- GET /api/get-select-story?title={title}
- 返回指定故事的标题和内容

## 开发调试

VS Code 调试配置已包含在 .vscode/launch.json 中：

1. 调试 Python 服务：
- 在 VS Code 中打开项目
- 选择 "Python: FastAPI" 配置
- 按 F5 启动调试

2. 调试 Node.js 服务：
- 使用 nodemon 启动：`npm run dev`
- 或直接运行：`node app.js`

## 注意事项

1. 确保先启动 Python AI 服务，再启动 Node.js 服务
2. 检查 config.js 中的 AI 服务地址配置是否正确
3. 确保 data/stories.json 文件存在且格式正确
4. 日志文件将自动生成在 logs 目录下
