from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.aws.ec2_service import get_ec2_dashboard, get_ec2_instances, save_ec2_instances, sync_cpu_metrics
from app.schemas.dashboard_schema import EC2Schema

router = APIRouter(
    prefix="/aws/ec2",
    tags=["AWS", "EC2"]
)

@router.get("/", response_model=EC2Schema)
def ec2_dashboard(db: Session = Depends(get_db)):
    """
    Returns the EC2 dashboard overview including all instances.
    """
    return get_ec2_dashboard(db)

@router.post("/sync")
def sync_ec2(db: Session = Depends(get_db)):
    """
    Fetches latest EC2 instances from AWS and saves to DB.
    """
    instances = get_ec2_instances()
    save_ec2_instances(db, instances)
    sync_cpu_metrics(db)
    return {"message": "EC2 instances and metrics synced successfully"}
