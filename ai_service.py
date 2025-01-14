from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import uvicorn

app = FastAPI()

class QueryRequest(BaseModel):
    story: str
    answer: str
    query: str

class QueryResponse(BaseModel):
    response: str

# 加载模型（建议使用单例模式）
model = None
tokenizer = None

def load_model():
    global model, tokenizer
    if model is None:
        model = AutoModelForCausalLM.from_pretrained("your-qwen-model-path")
        tokenizer = AutoTokenizer.from_pretrained("your-qwen-model-path")

@app.on_event("startup")
async def startup_event():
    load_model()

@app.post("/api/query")
async def query(request: QueryRequest):
    try:
        # 构造提示词
        prompt = f"""
        故事：{request.story}
        答案：{request.answer}
        问题：{request.query}
        请只回答：对、错、不相关、猜对了 中的一个
        """
        
        # 使用模型进行推理
        inputs = tokenizer(prompt, return_tensors="pt")
        outputs = model.generate(**inputs, max_length=100)
        response = tokenizer.decode(outputs[0])
        
        # 处理响应，确保符合要求
        valid_responses = ["对", "错", "不相关", "猜对了"]
        processed_response = process_response(response, valid_responses)
        
        return QueryResponse(response=processed_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000) 