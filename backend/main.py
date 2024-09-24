# main.py

from fastapi import FastAPI

# 創建一個 FastAPI 應用
app = FastAPI()

# 定義一個根端點
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

# 定義一個動態路由端點
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
