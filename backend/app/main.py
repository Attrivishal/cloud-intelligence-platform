from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# ============================
# DB + AUTH
# ============================
from app.db.database import get_db
from app.routes.auth import router as auth_router

# ============================
# EC2 SERVICES
# ============================
from app.services.aws.ec2_service import (
    get_ec2_instances,
    save_ec2_instances,
    get_instance_cpu_utilization,
    sync_cpu_metrics,
    get_ec2_dashboard
)

# ============================
# S3 SERVICES
# ============================
from app.services.aws.s3_service import (
    get_s3_buckets,
    save_s3_buckets,
    get_s3_dashboard
)

# ============================
# RDS SERVICES
# ============================
from app.services.aws.rds_service import (
    get_rds_instances,
    save_rds_instances,
    get_rds_dashboard
)

# ============================
# LAMBDA SERVICES
# ============================
from app.services.aws.lambda_service import (
    get_lambda_functions,
    save_lambda_functions,
    get_lambda_dashboard
)

# ============================
# FASTAPI INIT
# ============================
app = FastAPI()

# ============================
# CORS (Frontend connection)
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================
# ROUTES
# ============================
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.forecast import router as forecast_router
from app.routes.aws.ec2 import router as ec2_router
from app.routes.aws.s3 import router as s3_router
from app.routes.aws.rds import router as rds_router
from app.routes.aws.lambda_route import router as lambda_router
from app.routes.aws.risk import router as risk_router

app.include_router(auth_router)
app.include_router(dashboard_router)
# app.include_router(forecast_router) # Dashboard router already has a forecast route
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

