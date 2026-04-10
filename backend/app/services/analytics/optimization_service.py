from sqlalchemy.orm import Session
from app.models.instance import EC2Instance
from app.models.cpu import CPUMetric
from app.models.cost import DailyCost


# IMPORTANT: CPU is percentage (0–100)
CPU_IDLE_THRESHOLD = 10  # 10% CPU


def get_savings_priority(savings_amount: float):
    if savings_amount > 100:
        return "High"
    elif savings_amount > 20:
        return "Medium"
    return "Low"


def get_optimization_report(db: Session):
    instances = db.query(EC2Instance).all()
    cpu_metrics = db.query(CPUMetric).all()
    cost_data = db.query(DailyCost).all()

    report = []

    if not cost_data:
        average_daily_cost = 0
    else:
        average_daily_cost = sum(c.amount for c in cost_data) / len(cost_data)

    for instance in instances:

        instance_cpu = [
            m.average_cpu for m in cpu_metrics
            if m.instance_id == instance.instance_id
        ]

        avg_cpu = sum(instance_cpu) / len(instance_cpu) if instance_cpu else 0

        if avg_cpu < CPU_IDLE_THRESHOLD:
            status = "Underutilized"
            recommendation = "Consider stopping or resizing this instance"
            estimated_monthly_savings = abs(average_daily_cost) * 30
        else:
            status = "Healthy"
            recommendation = "No action required"
            estimated_monthly_savings = 0

        report.append({
            "instance_id": instance.instance_id,
            "instance_type": instance.instance_type,
            "state": instance.state,
            "average_cpu": round(avg_cpu, 4),
            "status": status,
            "recommendation": recommendation,
            "estimated_monthly_savings": round(estimated_monthly_savings, 6)
        })

    return report


def get_optimization_summary(db: Session):
    report = get_optimization_report(db)

    total_instances = len(report)
    underutilized_instances = len(
        [r for r in report if r["status"] == "Underutilized"]
    )

    total_savings = sum(
        r["estimated_monthly_savings"] for r in report
    )

    if total_instances == 0:
        optimization_score = 100
    else:
        healthy_ratio = (total_instances - underutilized_instances) / total_instances
        optimization_score = round(healthy_ratio * 100, 2)

    savings_priority_level = get_savings_priority(total_savings)

    return {
        "total_instances": total_instances,
        "underutilized_instances": underutilized_instances,
        "optimization_score": optimization_score,
        "total_potential_monthly_savings": round(total_savings, 6),
        "savings_priority_level": savings_priority_level
    }
