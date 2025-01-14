from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import random
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class QueryRequest(BaseModel):
    story: str
    answer: str
    query: str

class QueryResponse(BaseModel):
    response: str

@app.post("/api/query")
async def query(request: QueryRequest):
    try:
        logger.info(f"收到请求：\n故事：{request.story}\n答案：{request.answer}\n问题：{request.query}")
        
        # 构造提示词
        prompt = f"""
        故事：{request.story}
        答案：{request.answer}
        问题：{request.query}
        请只回答：对、错、不相关、猜对了 中的一个
        """
        
        # 随机返回一个响应（测试用）
        valid_responses = ["对", "错", "不相关", "猜对了"]
        processed_response = random.choice(valid_responses)
        
        logger.info(f"返回响应：{processed_response}")
        return QueryResponse(response=processed_response)
    except Exception as e:
        logger.error(f"处理请求时发生错误：{str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    logger.info("收到健康检查请求")
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    logger.info("服务启动")
    logger.info(f"API endpoints: /api/query (POST), /health (GET)")

if __name__ == "__main__":
    logger.info("正在启动服务...")
    uvicorn.run(
        app, 
        host="0.0.0.0",  # 监听所有地址
        port=5233, 
        log_level="info",
        access_log=True  # 启用访问日志
    ) 