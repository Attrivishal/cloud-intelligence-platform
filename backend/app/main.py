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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# AUTH ROUTES
# ============================
app.include_router(auth_router)


# ============================
# HEALTH CHECK
# ============================
@app.get("/health")
def health():
    return {"status": "healthy"}


# ============================
# TEST ROUTES (for debugging)
# ============================
@app.get("/test-ec2")
def test_ec2():
    return get_ec2_instances()


@app.get("/test-cpu/{instance_id}")
def test_cpu(instance_id: str):
    return {
        "instance_id": instance_id,
        "cpu": get_instance_cpu_utilization(instance_id)
    }


@app.get("/test-s3")
def test_s3():
    return get_s3_buckets()


@app.get("/test-rds")
def test_rds():
    return get_rds_instances()


@app.get("/test-lambda")
def test_lambda():
    return get_lambda_functions()


# ============================
# DASHBOARD ROUTES
# ============================

# 🔥 MAIN OVERVIEW (ALL SERVICES)
@app.get("/dashboard/overview")
def overview(db: Session = Depends(get_db)):
    return {
        "ec2": get_ec2_dashboard(db),
        "s3": get_s3_dashboard(db),
        "rds": get_rds_dashboard(db),
        "lambda": get_lambda_dashboard(db)
    }


# 🔹 RDS ONLY (optional detailed page)
@app.get("/dashboard/rds")
def rds_dashboard(db: Session = Depends(get_db)):
    return get_rds_dashboard(db)


# ============================
# SYNC ROUTES (CORE LOGIC)
# ============================

# 🔹 EC2 SYNC
@app.post("/sync-ec2")
def sync_ec2(db: Session = Depends(get_db)):
    data = get_ec2_instances()
    save_ec2_instances(db, data)
    return {"message": "EC2 instances synced successfully"}


# 🔹 CPU SYNC
@app.post("/sync-cpu")
def sync_cpu(db: Session = Depends(get_db)):
    sync_cpu_metrics(db)
    return {"message": "CPU metrics synced successfully"}


# 🔹 S3 SYNC
@app.post("/sync-s3")
def sync_s3(db: Session = Depends(get_db)):
    data = get_s3_buckets()
    save_s3_buckets(db, data)
    return {"message": "S3 synced successfully"}


# 🔹 RDS SYNC
@app.post("/sync-rds")
def sync_rds(db: Session = Depends(get_db)):
    data = get_rds_instances()
    save_rds_instances(db, data)
    return {"message": "RDS synced successfully"}


# 🔹 LAMBDA SYNC
@app.post("/sync-lambda")
def sync_lambda(db: Session = Depends(get_db)):
    data = get_lambda_functions()
    save_lambda_functions(db, data)
    return {"message": "Lambda synced successfully"}
