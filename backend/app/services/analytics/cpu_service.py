from sqlalchemy.orm import Session
from app.models.cpu import CPUMetric
from app.models.instance import EC2Instance

def get_cpu_trend(db: Session):
    # Join CPUMetric with EC2Instance to get additional metadata like instance_type and region
    results = db.query(
        CPUMetric.instance_id,
        CPUMetric.date,
        CPUMetric.average_cpu,
        EC2Instance.instance_type,
        EC2Instance.region
    ).join(
        EC2Instance, 
        CPUMetric.instance_id == EC2Instance.instance_id,
        isouter=True # Use outer join in case instance record was deleted
    ).order_by(CPUMetric.date.desc()).limit(100).all()

    return [
        {
            "instance_id": r.instance_id,
            "date": r.date.isoformat() if r.date else "",
            "average_cpu": round(r.average_cpu, 4) if r.average_cpu is not None else 0,
            "instance_type": r.instance_type or "unknown",
            "region": r.region or "unknown"
        }
        for r in results
    ]

