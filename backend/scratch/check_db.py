from sqlalchemy import create_all
from app.db.database import SessionLocal
from app.models.s3_bucket import S3Bucket
from app.models.rds_instance import RDSInstance
from app.models.lambda_model import LambdaFunction

db = SessionLocal()
try:
    s3_count = db.query(S3Bucket).count()
    rds_count = db.query(RDSInstance).count()
    lambda_count = db.query(LambdaFunction).count()
    print(f"S3 Buckets: {s3_count}")
    print(f"RDS Instances: {rds_count}")
    print(f"Lambda Functions: {lambda_count}")
finally:
    db.close()
