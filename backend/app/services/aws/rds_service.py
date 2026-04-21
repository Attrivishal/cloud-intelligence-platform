import boto3
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.models.rds_instance import RDSInstance

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")

rds = boto3.client("rds", region_name=AWS_REGION)


# ============================
# 1. COST ESTIMATION
# ============================
def estimate_rds_cost(instance_class, storage_gb):
    pricing = {
        "db.t3.micro": 0.017,
        "db.t2.micro": 0.018
    }

    instance_cost = pricing.get(instance_class, 0.02) * 24
    storage_cost = storage_gb * 0.10  # approx per GB/month simplified

    return instance_cost + storage_cost


# ============================
# 2. RISK ANALYSIS
# ============================
def analyze_rds_risk(status, storage):
    if status != "available":
        return "NOT_READY ⚠️"
    elif storage < 5:
        return "LOW_STORAGE ⚠️"
    else:
        return "HEALTHY"


# ============================
# 3. FETCH RDS INSTANCES
# ============================
def get_rds_instances():
    try:
        response = rds.describe_db_instances()

        instances = []

        for db in response["DBInstances"]:

            storage = db.get("AllocatedStorage", 0)

            cost = estimate_rds_cost(
                db.get("DBInstanceClass"),
                storage
            )

            risk = analyze_rds_risk(
                db.get("DBInstanceStatus"),
                storage
            )

            instances.append({
                "db_identifier": db.get("DBInstanceIdentifier"),
                "engine": db.get("Engine"),
                "instance_class": db.get("DBInstanceClass"),
                "status": db.get("DBInstanceStatus"),
                "allocated_storage": storage,
                "cost": cost,
                "risk": risk
            })

        return instances

    except Exception as e:
        print("RDS Fetch Error:", str(e))
        return []


# ============================
# 4. SAVE TO DATABASE
# ============================
def save_rds_instances(db: Session, data):
    existing = {
        r.db_identifier: r
        for r in db.query(RDSInstance).all()
    }

    # Delete RDS instances from DB that are no longer in AWS
    new_ids = {r["db_identifier"] for r in data}
    for db_id, db_obj in existing.items():
        if db_id not in new_ids:
            db.delete(db_obj)

    for r in data:
        if r["db_identifier"] in existing:
            obj = existing[r["db_identifier"]]
            obj.engine = r["engine"]
            obj.instance_class = r["instance_class"]
            obj.status = r["status"]
            obj.allocated_storage = r["allocated_storage"]
            obj.cost = r["cost"]
            obj.risk = r["risk"]
        else:
            db.add(RDSInstance(**r))

    db.commit()


# ============================
# 5. DASHBOARD DATA
# ============================
def get_rds_dashboard(db: Session):
    instances = db.query(RDSInstance).all()

    total = len(instances)
    total_cost = sum(i.cost or 0 for i in instances)

    not_ready = len([i for i in instances if i.risk == "NOT_READY ⚠️"])
    low_storage = len([i for i in instances if i.risk == "LOW_STORAGE ⚠️"])

    return {
        "total_databases": total,
        "total_cost": total_cost,
        "not_ready": not_ready,
        "low_storage": low_storage,
        "instances": [
            {
                "id": i.db_identifier,
                "engine": i.engine,
                "class": i.instance_class,
                "status": i.status,
                "storage": i.allocated_storage,
                "cost": i.cost,
                "risk": i.risk
            }
            for i in instances
        ]
    }
