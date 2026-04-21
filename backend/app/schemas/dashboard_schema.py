from pydantic import BaseModel, RootModel, Field
from typing import List, Dict, Optional


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
    region: Optional[str] = ""
    average_cpu: float
    estimated_monthly_cost: float


class InfrastructureSummary(BaseModel):
    total_instances: int
    running_instances: int
    stopped_instances: int


class InfrastructureResponseSchema(BaseModel):
    summary: InfrastructureSummary
    instances: List[InfrastructureInstanceItem]
    region_distribution: Dict[Optional[str], int]


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
# SERVICE SPECIFIC SCHEMAS (REQUIRED BY FRONTEND)
# =====================================================

class EC2InstanceItem(BaseModel):
    id: str
    type: str
    state: str
    cpu: float
    cost: float
    risk: str

class EC2Schema(BaseModel):
    total_cost: float
    running: int
    total_instances: int
    underutilized: int
    overloaded: int
    instances: List[EC2InstanceItem]

class S3BucketItem(BaseModel):
    name: str
    size: float
    objects: int
    cost: float
    status: str

class S3Schema(BaseModel):
    total_cost: float
    total_buckets: int
    buckets: List[S3BucketItem]

class RDSInstanceItem(BaseModel):
    id: str
    engine: str
    type: str = Field(alias="class")
    state: str = Field(alias="status")
    storage: float
    cost: float
    risk: str

    class Config:
        populate_by_name = True

class RDSSchema(BaseModel):
    total_cost: float
    total_databases: int
    low_storage: int
    instances: List[RDSInstanceItem]

class LambdaFunctionItem(BaseModel):
    name: str
    runtime: str
    memory: int
    timeout: int = 0
    invocations: int = 0
    cost: float = 0.0
    risk: str = "OPTIMAL"

class LambdaSchema(BaseModel):
    total_cost: float
    total_functions: int
    unused_functions: int
    functions: List[LambdaFunctionItem]


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
    
    # 🔥 NEW SERVICE SPECIFIC KEYS
    ec2: EC2Schema
    s3: S3Schema
    rds: RDSSchema
    lambda_details: LambdaSchema = Field(alias="lambda")


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
