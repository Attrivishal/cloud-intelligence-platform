from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

# ============================
# SERVICES
# ============================

from app.services.analytics.cost_service import get_cost_trend, get_cost_summary
from app.services.analytics.cpu_service import get_cpu_trend
from app.services.dashboard_service import get_dashboard_overview
from app.services.analytics.optimization_service import (
    get_optimization_report,
    get_optimization_summary
)
from app.services.analytics.forecast_service import get_cost_forecast
from app.services.analytics.sustainability_service import get_sustainability_report
from app.services.analytics.risk_engine_service import (
    get_risk_analysis,
    get_risk_trend
)
from app.services.analytics.infrastructure_service import get_infrastructure_details

# ============================
# SCHEMAS
# ============================

from app.schemas.dashboard_schema import (
    DashboardOverviewSchema,
    CostTrendSchema,
    CostSummarySchema,
    CPUTrendSchema,
    OptimizationSchema,
    OptimizationSummarySchema,
    ForecastResponseSchema,
    SustainabilityReportSchema,
    CloudHealthSchema,
    RiskAnalysisSchema,
    RiskTrendSchema,
    InfrastructureResponseSchema
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# =====================================================
# OVERVIEW
# =====================================================

@router.get("/overview", response_model=DashboardOverviewSchema)
def dashboard_overview(db: Session = Depends(get_db)):
    return get_dashboard_overview(db)

# =====================================================
# COST
# =====================================================

@router.get("/cost/trend", response_model=CostTrendSchema)
def dashboard_cost_trend(db: Session = Depends(get_db)):
    return get_cost_trend(db)


@router.get("/cost/summary", response_model=CostSummarySchema)
def dashboard_cost_summary(db: Session = Depends(get_db)):
    return get_cost_summary(db)

# =====================================================
# PERFORMANCE
# =====================================================

@router.get("/performance/cpu-trend", response_model=CPUTrendSchema)
def dashboard_cpu_trend(db: Session = Depends(get_db)):
    return get_cpu_trend(db)

# =====================================================
# OPTIMIZATION
# =====================================================

@router.get("/optimization", response_model=OptimizationSchema)
def dashboard_optimization(db: Session = Depends(get_db)):
    return get_optimization_report(db)


@router.get("/optimization/summary", response_model=OptimizationSummarySchema)
def dashboard_optimization_summary(db: Session = Depends(get_db)):
    return get_optimization_summary(db)

# =====================================================
# FORECAST (AI ENGINE)
# =====================================================

@router.get("/forecast", response_model=ForecastResponseSchema)
def dashboard_forecast(db: Session = Depends(get_db)):
    """
    AI-powered EC2 cost forecast using synthetic simulation + ML.
    """
    return get_cost_forecast(db)

# =====================================================
# SUSTAINABILITY
# =====================================================

@router.get("/sustainability", response_model=SustainabilityReportSchema)
def dashboard_sustainability(db: Session = Depends(get_db)):
    return get_sustainability_report(db)

# =====================================================
# CLOUD HEALTH
# =====================================================

@router.get("/health", response_model=CloudHealthSchema)
def dashboard_health(db: Session = Depends(get_db)):
    overview = get_dashboard_overview(db)
    return overview["cloud_health"]

# =====================================================
# RISK ENGINE
# =====================================================

@router.get("/risk-analysis", response_model=RiskAnalysisSchema)
def dashboard_risk_analysis(db: Session = Depends(get_db)):
    return get_risk_analysis(db)


@router.get("/risk-trend", response_model=RiskTrendSchema)
def dashboard_risk_trend(db: Session = Depends(get_db)):
    return get_risk_trend(db)

# =====================================================
# INFRASTRUCTURE
# =====================================================

@router.get("/infrastructure", response_model=InfrastructureResponseSchema)
def dashboard_infrastructure(db: Session = Depends(get_db)):
    return get_infrastructure_details(db)
