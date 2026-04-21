from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import get_db
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.forecast import router as forecast_router

# ✅ NEW AWS SERVICE ROUTERS
from app.routes.aws.ec2 import router as ec2_router
from app.routes.aws.s3 import router as s3_router
from app.routes.aws.rds import router as rds_router
from app.routes.aws.lambda_route import router as lambda_router
from app.routes.aws.risk import router as risk_router

# ✅ BACKGROUND SCHEDULER
from app.core.scheduler import start_scheduler

app = FastAPI()

# ✅ CORS (VERY IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ INCLUDE ROUTES
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(forecast_router)

# ✅ INCLUDE AWS SERVICE ROUTERS
app.include_router(ec2_router)
app.include_router(s3_router)
app.include_router(rds_router)
app.include_router(lambda_router)
app.include_router(risk_router)


# ============================
# HEALTH CHECK
# ============================
@app.get("/health")
def health():
    return {"status": "healthy"}


# ============================
# STARTUP EVENT
# ============================
@app.on_event("startup")
def startup_event():
    start_scheduler()
