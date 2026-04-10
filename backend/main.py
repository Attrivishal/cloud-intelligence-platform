from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import get_db
from app.routes.auth import router as auth_router

from app.services.aws.ec2_service import (
    get_ec2_instances,
    save_ec2_instances,
    get_instance_cpu_utilization,
    sync_cpu_metrics,
    get_daily_cost,
    save_daily_costs
)

app = FastAPI()

# ✅ CORS (VERY IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ INCLUDE AUTH ROUTES
app.include_router(auth_router)


# ============================
# HEALTH CHECK
# ============================
@app.get("/health")
def health():
    return {"status": "healthy"}


# ============================
# TEST ROUTES
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


@app.get("/test-cost")
def test_cost():
    return get_daily_cost()


# ============================
# MANUAL SYNC ROUTES
# ============================
@app.post("/sync-ec2")
def sync_ec2(db: Session = Depends(get_db)):
    instances = get_ec2_instances()
    save_ec2_instances(db, instances)
    return {"message": "EC2 instances synced successfully"}


@app.post("/sync-cpu")
def sync_cpu(db: Session = Depends(get_db)):
    sync_cpu_metrics(db)
    return {"message": "CPU metrics synced successfully"}


@app.post("/sync-cost")
def sync_cost(db: Session = Depends(get_db)):
    cost_data = get_daily_cost()
    save_daily_costs(db, cost_data)
    return {"message": "Cost data synced successfully"}
