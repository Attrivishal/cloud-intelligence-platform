from sqlalchemy.orm import Session
from app.models.cpu import CPUMetric


def get_cpu_trend(db: Session):
    metrics = db.query(CPUMetric).order_by(CPUMetric.date).all()

    return [
        {
            "instance_id": m.instance_id,
            "date": m.date.isoformat(),
            "average_cpu": round(m.average_cpu, 4) if m.average_cpu is not None else 0
        }
        for m in metrics
    ]
