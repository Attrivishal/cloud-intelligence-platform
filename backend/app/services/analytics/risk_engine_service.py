from sqlalchemy.orm import Session
from app.models.cost import DailyCost
from app.models.cpu import CPUMetric
from app.models.instance import EC2Instance
from app.models.risk_history import RiskHistory

from datetime import date
import numpy as np


# =====================================================
# NORMALIZATION UTILITY
# =====================================================

def normalize(value, max_reference):
    if max_reference == 0:
        return 0
    return min(100, round((value / max_reference) * 100, 2))


# =====================================================
# COST VOLATILITY INDEX
# =====================================================

def calculate_cost_volatility(db: Session):
    costs = db.query(DailyCost).all()
    if len(costs) < 2:
        return 0

    values = [abs(c.amount) for c in costs]
    std_dev = np.std(values)

    reference = max(values) if max(values) != 0 else 1
    return normalize(std_dev, reference)


# =====================================================
# CPU INSTABILITY INDEX
# =====================================================

def calculate_cpu_instability(db: Session):
    metrics = db.query(CPUMetric).all()
    if len(metrics) < 2:
        return 0

    cpu_values = [m.average_cpu for m in metrics]
    variance = np.var(cpu_values)

    reference = max(cpu_values) if max(cpu_values) != 0 else 1
    return normalize(variance, reference)


# =====================================================
# INEFFICIENCY INDEX
# =====================================================

def calculate_inefficiency_index(db: Session):
    instances = db.query(EC2Instance).all()
    metrics = db.query(CPUMetric).all()

    if not instances:
        return 0

    underutilized = 0

    for instance in instances:
        cpu_values = [
            m.average_cpu for m in metrics
            if m.instance_id == instance.instance_id
        ]

        avg_cpu = sum(cpu_values) / len(cpu_values) if cpu_values else 0

        if avg_cpu < 10:  # <10% CPU = underutilized
            underutilized += 1

    inefficiency_ratio = underutilized / len(instances)
    return round(inefficiency_ratio * 100, 2)


# =====================================================
# INFRASTRUCTURE IMBALANCE INDEX
# =====================================================

def calculate_infra_imbalance(db: Session):
    instances = db.query(EC2Instance).all()
    if not instances:
        return 0

    running = len([i for i in instances if i.state == "running"])
    total = len(instances)

    if total == 0:
        return 0

    ideal_ratio = 0.7  # 70% running is considered healthy
    current_ratio = running / total

    imbalance = abs(current_ratio - ideal_ratio)
    return round(imbalance * 100, 2)


# =====================================================
# SUSTAINABILITY PRESSURE INDEX
# =====================================================

def calculate_sustainability_pressure(db: Session):
    instances = db.query(EC2Instance).all()
    metrics = db.query(CPUMetric).all()

    total_emission = 0

    for instance in instances:
        cpu_values = [
            m.average_cpu for m in metrics
            if m.instance_id == instance.instance_id
        ]

        avg_cpu = sum(cpu_values) / len(cpu_values) if cpu_values else 0
        total_emission += avg_cpu * 0.0002

    return normalize(total_emission, 1)


# =====================================================
# MAIN RISK ANALYSIS
# =====================================================

def get_risk_analysis(db: Session):

    cost_volatility = calculate_cost_volatility(db)
    cpu_instability = calculate_cpu_instability(db)
    inefficiency = calculate_inefficiency_index(db)
    infra_imbalance = calculate_infra_imbalance(db)
    sustainability_pressure = calculate_sustainability_pressure(db)

    risk_score = (
        cost_volatility * 0.30 +
        cpu_instability * 0.20 +
        inefficiency * 0.20 +
        infra_imbalance * 0.15 +
        sustainability_pressure * 0.15
    )

    risk_score = float(round(risk_score, 2))

    # Risk classification
    if risk_score >= 75:
        risk_level = "High"
        prediction = "Infrastructure likely to face instability and cost inefficiencies."
    elif risk_score >= 50:
        risk_level = "Moderate"
        prediction = "Potential scaling or optimization risks detected."
    else:
        risk_level = "Low"
        prediction = "Infrastructure operating within stable parameters."

    # =====================================================
    # STORE DAILY RISK HISTORY
    # =====================================================

    today = date.today()

    existing = db.query(RiskHistory).filter(
        RiskHistory.date == today
    ).first()

    if not existing:
        new_entry = RiskHistory(
            date=today,
            risk_score=risk_score
        )
        db.add(new_entry)
        db.commit()

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "cost_volatility_index": cost_volatility,
        "cpu_instability_index": cpu_instability,
        "inefficiency_index": inefficiency,
        "infra_imbalance_index": infra_imbalance,
        "sustainability_pressure_index": sustainability_pressure,
        "prediction": prediction
    }


# =====================================================
# RISK TREND
# =====================================================

def get_risk_trend(db: Session):
    history = db.query(RiskHistory).order_by(RiskHistory.date).all()

    return [
        {
            "date": entry.date.isoformat(),
            "risk_score": round(entry.risk_score, 2)
        }
        for entry in history
    ]
