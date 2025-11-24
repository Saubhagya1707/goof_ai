from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agent_routes import agent_router
from routes.oauth2_routes import oauth2_router
from auth.router import user_admin_router
from routes.tool_routes import tool_router


app = FastAPI()

# CORS configuration
# Allow common local/dev origins and docker service names via a regex to avoid
# subtle mismatches (like trailing slashes) that can cause preflight errors.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^(https?://localhost(:[0-9]+)?|https?://127\.0\.0\.1(:[0-9]+)?|https?://frontend(:[0-9]+)?)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Simple request logger to help debug CORS/preflight issues
@app.middleware("http")
async def log_requests(request, call_next):
    # Log method + path + origin header (if present)
    origin = request.headers.get('origin')
    print(f"REQ --> {request.method} {request.url.path} Origin={origin}")
    response = await call_next(request)
    print(f"RESP <-- {request.method} {request.url.path} Status={response.status_code}")
    return response

app.include_router(agent_router, prefix="/goof-ai/v1")
app.include_router(oauth2_router, prefix="/goof-ai/v1")
app.include_router(user_admin_router, prefix="/goof-ai/v1")
app.include_router(tool_router, prefix="/goof-ai/v1")

@app.get("/")
async def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)