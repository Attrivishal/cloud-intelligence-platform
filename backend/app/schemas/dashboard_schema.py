from pydantic import BaseModel, RootModel
from typing import List, Dict


# =====================================================
# COST SECTION
# =====================================================

class HighestLowestCost(BaseModel):
    date: str
    amount: float


class CostSummarySchema(BaseModel):
    total_cost: float
    average_daily_cost: float
    highest_cost: HighestLowestCost
    lowest_cost: HighestLowestCost
    days_count: int
    change_percent: float
    trend_direction: str
    cost_health_score: float


# =====================================================
# INFRASTRUCTURE (OVERVIEW SUMMARY ONLY)
# =====================================================

class InfrastructureSchema(BaseModel):
    total_instances: int
    running_instances: int
    stopped_instances: int
    utilization_rate: float
    infra_health_score: float


# =====================================================
# INFRASTRUCTURE (DETAILED ENDPOINT)
# =====================================================

class InfrastructureInstanceItem(BaseModel):
    instance_id: str
    instance_type: str
    state: str
    region: str
    average_cpu: float
    estimated_monthly_cost: float


class InfrastructureSummary(BaseModel):
    total_instances: int
    running_instances: int
    stopped_instances: int


class InfrastructureResponseSchema(BaseModel):
    summary: InfrastructureSummary
    instances: List[InfrastructureInstanceItem]
    region_distribution: Dict[str, int]


# =====================================================
# PERFORMANCE
# =====================================================

class PerformanceSchema(BaseModel):
    average_cpu_utilization: float
    health_status: str


# =====================================================
# FORECAST
# =====================================================

class ForecastItem(BaseModel):
    date: str
    predicted_cost: float


class ForecastResponseSchema(BaseModel):
    model: str
    forecast_days: int
    forecast: List[ForecastItem]
    predicted_total_30_days: float
    forecast_trend_direction: str
    confidence_level: int


# =====================================================
# SUSTAINABILITY
# =====================================================

class SustainabilityReportSchema(BaseModel):
    total_running_instances: int
    estimated_daily_carbon_kg: float
    sustainability_score: float
    rating: str
    recommendation: str
    green_efficiency_level: str


# =====================================================
# OPTIMIZATION
# =====================================================

class OptimizationItem(BaseModel):
    instance_id: str
    instance_type: str
    state: str
    average_cpu: float
    status: str
    recommendation: str
    estimated_monthly_savings: float


class OptimizationSchema(RootModel[List[OptimizationItem]]):
    pass


class OptimizationSummarySchema(BaseModel):
    total_instances: int
    underutilized_instances: int
    optimization_score: float
    total_potential_monthly_savings: float
    savings_priority_level: str


# =====================================================
# CLOUD HEALTH
# =====================================================

class CloudHealthSchema(BaseModel):
    score: float
    grade: str
    status: str
    risk_level: str


# =====================================================
# DASHBOARD OVERVIEW (MAIN RESPONSE)
# =====================================================

class DashboardOverviewSchema(BaseModel):
    cost: CostSummarySchema
    infrastructure: InfrastructureSchema
    performance: PerformanceSchema
    forecast: ForecastResponseSchema
    optimization: OptimizationSummarySchema
    sustainability: SustainabilityReportSchema
    cloud_health: CloudHealthSchema


# =====================================================
# RISK ANALYSIS
# =====================================================

class RiskAnalysisSchema(BaseModel):
    risk_score: float
    risk_level: str
    cost_volatility_index: float
    cpu_instability_index: float
    inefficiency_index: float
    infra_imbalance_index: float
    sustainability_pressure_index: float
    prediction: str


# =====================================================
# COST TREND
# =====================================================

class CostTrendItem(BaseModel):
    date: str
    amount: float


class CostTrendSchema(RootModel[List[CostTrendItem]]):
    pass


# =====================================================
# CPU TREND
# =====================================================

class CPUTrendItem(BaseModel):
    instance_id: str
    date: str
    average_cpu: float


class CPUTrendSchema(RootModel[List[CPUTrendItem]]):
    pass


# =====================================================
# RISK TREND
# =====================================================

class RiskTrendItem(BaseModel):
    date: str
    risk_score: float


class RiskTrendSchema(RootModel[List[RiskTrendItem]]):
    pass
