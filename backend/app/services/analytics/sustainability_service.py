from sqlalchemy.orm import Session
from app.models.instance import EC2Instance
from app.models.cpu import CPUMetric

EMISSION_FACTOR = 0.0002  # kg CO2 per CPU unit per day


def get_green_efficiency_level(score: float):
    if score >= 80:
        return "Excellent"
    elif score >= 60:
        return "Good"
    elif score >= 40:
        return "Moderate"
    return "Needs Improvement"


def get_sustainability_report(db: Session):
    instances = db.query(EC2Instance).all()
    cpu_metrics = db.query(CPUMetric).all()

    total_emission = 0
    running_instances = 0

    for instance in instances:
        if not instance.state or instance.state.lower() != "running":
            continue

        running_instances += 1

        instance_cpu = [
            m.average_cpu for m in cpu_metrics
            if m.instance_id == instance.instance_id
        ]

        avg_cpu = sum(instance_cpu) / len(instance_cpu) if instance_cpu else 0
        emission = avg_cpu * EMISSION_FACTOR
        total_emission += emission

    if running_instances == 0:
        sustainability_score = 100
    else:
        sustainability_score = max(
            0,
            round(100 - (total_emission * 10000), 2)
        )

    if sustainability_score > 80:
        rating = "Excellent"
        recommendation = "Infrastructure is energy efficient"
    elif sustainability_score > 60:
        rating = "Good"
        recommendation = "Minor optimization can improve sustainability"
    else:
        rating = "Needs Improvement"
        recommendation = "Consider reducing idle or oversized instances"

    return {
        "total_running_instances": running_instances,
        "estimated_daily_carbon_kg": round(total_emission, 6),
        "sustainability_score": sustainability_score,
        "rating": rating,
        "recommendation": recommendation,
        "green_efficiency_level": get_green_efficiency_level(sustainability_score)
    }
