from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.analytics.risk_engine_service import get_risk_analysis, get_risk_trend
from app.schemas.dashboard_schema import RiskAnalysisSchema, RiskTrendSchema

router = APIRouter(
    prefix="/aws/risk",
    tags=["AWS", "Risk"]
)

@router.get("/", response_model=RiskAnalysisSchema)
def risk_analysis(db: Session = Depends(get_db)):
    """
    Returns the comprehensive risk analysis for the cloud infrastructure.
    """
    return get_risk_analysis(db)

@router.get("/trend", response_model=RiskTrendSchema)
def risk_trend(db: Session = Depends(get_db)):
    """
    Returns the historical risk score trends.
    """
    return get_risk_trend(db)
