from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.aws.s3_service import get_s3_dashboard, get_s3_buckets, save_s3_buckets
from app.schemas.dashboard_schema import S3Schema

router = APIRouter(
    prefix="/aws/s3",
    tags=["AWS", "S3"]
)

@router.get("/", response_model=S3Schema)
def s3_dashboard(db: Session = Depends(get_db)):
    """
    Returns the S3 dashboard overview including all buckets.
    """
    return get_s3_dashboard(db)

@router.post("/sync")
def sync_s3(db: Session = Depends(get_db)):
    """
    Fetches latest S3 buckets from AWS and saves to DB.
    """
    buckets = get_s3_buckets()
    save_s3_buckets(db, buckets)
    return {"message": "S3 buckets synced successfully"}
