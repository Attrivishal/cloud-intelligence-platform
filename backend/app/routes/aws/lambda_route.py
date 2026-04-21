from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.aws.lambda_service import get_lambda_dashboard, get_lambda_functions, save_lambda_functions
from app.schemas.dashboard_schema import LambdaSchema

router = APIRouter(
    prefix="/aws/lambda",
    tags=["AWS", "Lambda"]
)

@router.get("/", response_model=LambdaSchema)
def lambda_dashboard(db: Session = Depends(get_db)):
    """
    Returns the Lambda dashboard overview including all functions.
    """
    return get_lambda_dashboard(db)

@router.post("/sync")
def sync_lambda(db: Session = Depends(get_db)):
    """
    Fetches latest Lambda functions from AWS and saves to DB.
    """
    functions = get_lambda_functions()
    save_lambda_functions(db, functions)
    return {"message": "Lambda functions synced successfully"}
