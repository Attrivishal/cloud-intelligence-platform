from sqlalchemy.orm import Session
from app.models.instance import EC2Instance
from app.models.cpu import CPUMetric
from app.models.cost import DailyCost

from app.services.analytics.forecast_service import get_cost_forecast
from app.services.analytics.optimization_service import get_optimization_summary
from app.services.analytics.sustainability_service import get_sustainability_report


# =====================================================
# HELPER FUNCTIONS
# =====================================================

def safe_round(value):
    try:
        return max(0, round(float(value), 4))
    except:
        return 0


def calculate_cost_change(db: Session):
    costs = db.query(DailyCost).order_by(DailyCost.date.desc()).limit(60).all()

    if len(costs) < 30:
        return 0

    recent = costs[:30]
    previous = costs[30:60]

    recent_total = sum(c.amount for c in recent)
    previous_total = sum(c.amount for c in previous)

    if previous_total == 0:
        return 0

    percent_change = ((recent_total - previous_total) / previous_total) * 100
    return round(percent_change, 2)


def get_trend_direction(change_percent):
    if change_percent > 5:
        return "Increasing"
    elif change_percent < -5:
        return "Decreasing"
    return "Stable"


def calculate_utilization_rate(running, total):
    if total == 0:
        return 0
    return round((running / total) * 100, 2)


def get_performance_status(avg_cpu):
    if avg_cpu > 75:
        return "High Load"
    elif avg_cpu < 20:
        return "Over-Provisioned"
    return "Healthy"


def calculate_cloud_health(cost_score, infra_score, performance_score,
                           optimization_score, sustainability_score):

    final_score = (
        cost_score * 0.25 +
        infra_score * 0.20 +
        performance_score * 0.20 +
        optimization_score * 0.20 +
        sustainability_score * 0.15
    )

    final_score = round(final_score, 2)

    if final_score >= 90:
        grade = "A+"
    elif final_score >= 80:
        grade = "A"
    elif final_score >= 70:
        grade = "B"
    elif final_score >= 60:
        grade = "C"
    else:
        grade = "D"

    return {
        "score": final_score,
        "grade": grade,
        "status": "Strong" if final_score >= 80 else "Stable" if final_score >= 65 else "At Risk",
        "risk_level": "Low" if final_score >= 75 else "Moderate" if final_score >= 60 else "High"
    }


# =====================================================
# MAIN DASHBOARD OVERVIEW
# =====================================================

def get_dashboard_overview(db: Session):

    # ================= COST =================
    cost_rows = db.query(DailyCost).order_by(DailyCost.date).all()

    if cost_rows:
        highest_row = max(cost_rows, key=lambda x: x.amount)
        lowest_row = min(cost_rows, key=lambda x: x.amount)

        highest_cost = {
            "date": highest_row.date.isoformat(),
            "amount": safe_round(highest_row.amount)
        }

        lowest_cost = {
            "date": lowest_row.date.isoformat(),
            "amount": safe_round(lowest_row.amount)
        }

        total_cost = sum(c.amount for c in cost_rows)
        average_daily_cost = total_cost / len(cost_rows)
        days_count = len(cost_rows)

    else:
        highest_cost = {"date": "", "amount": 0}
        lowest_cost = {"date": "", "amount": 0}
        total_cost = 0
        average_daily_cost = 0
        days_count = 0

    cost_change_percent = calculate_cost_change(db)
    trend_direction = get_trend_direction(cost_change_percent)
    cost_health_score = max(0, 100 - abs(cost_change_percent))

    cost_summary = {
        "total_cost": safe_round(total_cost),
        "average_daily_cost": safe_round(average_daily_cost),
        "highest_cost": highest_cost,
        "lowest_cost": lowest_cost,
        "days_count": days_count,
        "change_percent": cost_change_percent,
        "trend_direction": trend_direction,
        "cost_health_score": safe_round(cost_health_score)
    }

    # ================= INFRASTRUCTURE =================
    instances = db.query(EC2Instance).all()
    total_instances = len(instances)

    running_instances = len([i for i in instances if i.state == "running"])
    stopped_instances = len([i for i in instances if i.state == "stopped"])

    utilization_rate = calculate_utilization_rate(running_instances, total_instances)
    infra_score = 90 if 60 <= utilization_rate <= 85 else 75

    infrastructure_data = {
        "total_instances": total_instances,
        "running_instances": running_instances,
        "stopped_instances": stopped_instances,
        "utilization_rate": utilization_rate,
        "infra_health_score": infra_score
    }

    # ================= PERFORMANCE =================
    cpu_metrics = db.query(CPUMetric).all()
    avg_cpu = (
        sum(m.average_cpu for m in cpu_metrics) / len(cpu_metrics)
        if cpu_metrics else 0
    )
    avg_cpu = round(avg_cpu, 2)

    performance_score = 95 if 40 <= avg_cpu <= 70 else 75

    performance_data = {
        "average_cpu_utilization": avg_cpu,
        "health_status": get_performance_status(avg_cpu)
    }

    # ================= FORECAST =================
    forecast_data = get_cost_forecast(db) or {}

    # ================= OPTIMIZATION =================
    optimization_summary = get_optimization_summary(db) or {}
    optimization_score = optimization_summary.get("optimization_score", 70)

    # ================= SUSTAINABILITY =================
    sustainability_report = get_sustainability_report(db) or {}
    sustainability_score = sustainability_report.get("sustainability_score", 60)

    # ================= CLOUD HEALTH =================
    cloud_health = calculate_cloud_health(
        cost_score=cost_health_score,
        infra_score=infra_score,
        performance_score=performance_score,
        optimization_score=optimization_score,
        sustainability_score=sustainability_score
    )

    # ================= FINAL RESPONSE =================
    return {
        "cost": cost_summary,
        "infrastructure": infrastructure_data,
        "performance": performance_data,
        "forecast": forecast_data,
        "optimization": optimization_summary,
        "sustainability": sustainability_report,
        "cloud_health": cloud_health
    }
