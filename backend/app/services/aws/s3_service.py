import boto3
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session

from app.models.s3_bucket import S3Bucket

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")

s3 = boto3.client("s3", region_name=AWS_REGION)


# ============================
# 1. GET SIZE + COUNT
# ============================
def get_bucket_size(bucket_name):
    try:
        response = s3.list_objects_v2(Bucket=bucket_name)

        size = 0
        count = 0

        for obj in response.get("Contents", []):
            size += obj["Size"]
            count += 1

        return size, count

    except Exception as e:
        print("Size Error:", str(e))
        return 0, 0


# ============================
# 2. COST ESTIMATION
# ============================
def estimate_s3_cost(size_bytes):
    size_gb = size_bytes / (1024 ** 3)
    price_per_gb = 0.023  # AWS standard

    return size_gb * price_per_gb


# ============================
# 3. ANALYZE BUCKET
# ============================
def analyze_bucket(size, count):
    if count == 0:
        return "EMPTY ⚠️"
    elif size < 1024 * 1024:
        return "LOW_USAGE"
    else:
        return "ACTIVE"


# ============================
# 4. FETCH BUCKETS (FINAL)
# ============================
def get_s3_buckets():
    try:
        response = s3.list_buckets()
        buckets = []

        for b in response.get("Buckets", []):
            size, count = get_bucket_size(b["Name"])
            cost = estimate_s3_cost(size)
            status = analyze_bucket(size, count)

            buckets.append({
                "name": b["Name"],
                "creation_date": str(b["CreationDate"]),
                "size_bytes": size,
                "object_count": count,
                "estimated_cost": cost,
                "status": status
            })

        return buckets

    except Exception as e:
        print("S3 Fetch Error:", str(e))
        return []


# ============================
# 5. SAVE TO DB
# ============================
def save_s3_buckets(db: Session, buckets_data):
    existing = {
        b.name: b
        for b in db.query(S3Bucket).all()
    }

    for bucket in buckets_data:
        if bucket["name"] in existing:
            existing[bucket["name"]].size_bytes = bucket["size_bytes"]
            existing[bucket["name"]].object_count = bucket["object_count"]
            existing[bucket["name"]].cost = bucket["estimated_cost"]
            existing[bucket["name"]].status = bucket["status"]

        else:
            db.add(
                S3Bucket(
                    name=bucket["name"],
                    creation_date=bucket["creation_date"],
                    size_bytes=bucket["size_bytes"],
                    object_count=bucket["object_count"],
                    cost=bucket["estimated_cost"],
                    status=bucket["status"]
                )
            )

    db.commit()


# ============================
# 6. DASHBOARD DATA
# ============================
def get_s3_dashboard(db: Session):
    buckets = db.query(S3Bucket).all()

    total_buckets = len(buckets)
    total_size = sum(b.size_bytes or 0 for b in buckets)
    total_cost = sum(b.cost or 0 for b in buckets)

    empty = len([b for b in buckets if b.status == "EMPTY ⚠️"])

    return {
        "total_buckets": total_buckets,
        "total_storage_bytes": total_size,
        "total_cost": total_cost,
        "empty_buckets": empty,
        "buckets": [
            {
                "name": b.name,
                "size": b.size_bytes,
                "objects": b.object_count,
                "cost": b.cost,
                "status": b.status
            }
            for b in buckets
        ]
    }
