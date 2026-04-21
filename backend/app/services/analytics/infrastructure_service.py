from sqlalchemy.orm import Session
from app.models.instance import EC2Instance
from app.models.cpu import CPUMetric
from app.models.cost import DailyCost
from collections import defaultdict


def get_infrastructure_details(db: Session):

    instances = db.query(EC2Instance).all()
    cpu_metrics = db.query(CPUMetric).all()
    cost_data = db.query(DailyCost).all()

    total_instances = len(instances)
    running_instances = 0
    stopped_instances = 0

    region_distribution = defaultdict(int)
    instance_list = []

    # Calculate global average daily cost (for estimation)
    if cost_data:
        avg_daily_cost = sum(abs(c.amount) for c in cost_data) / len(cost_data)
    else:
        avg_daily_cost = 0

    for instance in instances:

        state = instance.state.lower() if instance.state else "unknown"

        if state == "running":
            running_instances += 1
        elif state == "stopped":
            stopped_instances += 1

        # Count region
        region = instance.region if (instance.region is not None) else "unknown"
        region_distribution[region] += 1

        # Get CPU metrics for this instance
        instance_cpu = [
            m.average_cpu for m in cpu_metrics
            if m.instance_id == instance.instance_id
        ]

        avg_cpu = round(sum(instance_cpu) / len(instance_cpu), 2) if instance_cpu else 0

        # Simple monthly cost estimation
        estimated_monthly_cost = round(avg_daily_cost * 30 / max(total_instances, 1), 4)

        instance_list.append({
            "instance_id": instance.instance_id,
            "instance_type": instance.instance_type,
            "state": state,
            "region": region,
            "average_cpu": avg_cpu,
            "estimated_monthly_cost": estimated_monthly_cost
        })

    return {
        "summary": {
            "total_instances": total_instances,
            "running_instances": running_instances,
            "stopped_instances": stopped_instances
        },
        "instances": instance_list,
        "region_distribution": dict(region_distribution)
    }
