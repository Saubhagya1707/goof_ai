from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from routes.agent_routes import agent_router


app = FastAPI(prefix="/goof-ai")

app.include_router(agent_router)

@app.get("/")
async def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)