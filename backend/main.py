from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, tasks, leaderboard, ai, pdf, plans, dashboard
import config 

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Study Planner")

# --- Integration ---
origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(plans.router)
app.include_router(leaderboard.router)
app.include_router(ai.router)
app.include_router(pdf.router)
app.include_router(dashboard.router)
