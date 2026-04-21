from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.aws.rds_service import get_rds_dashboard, get_rds_instances, save_rds_instances
from app.schemas.dashboard_schema import RDSSchema

router = APIRouter(
    prefix="/aws/rds",
    tags=["AWS", "RDS"]
)

@router.get("/", response_model=RDSSchema)
def rds_dashboard(db: Session = Depends(get_db)):
    """
    Returns the RDS dashboard overview including all instances.
    """
    return get_rds_dashboard(db)

@router.post("/sync")
def sync_rds(db: Session = Depends(get_db)):
    """
    Fetches latest RDS instances from AWS and saves to DB.
    """
    instances = get_rds_instances()
    save_rds_instances(db, instances)
    return {"message": "RDS instances synced successfully"}
