import boto3
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.instance import EC2Instance
from app.models.cpu import CPUMetric

# ============================
# ENV + AWS CLIENTS
# ============================
load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")

ec2 = boto3.client("ec2", region_name=AWS_REGION)
cloudwatch = boto3.client("cloudwatch", region_name=AWS_REGION)


# ============================
# 1. FETCH EC2 INSTANCES
# ============================
def get_ec2_instances():
    instances_list = []

    paginator = ec2.get_paginator("describe_instances")

    for page in paginator.paginate():
        for reservation in page["Reservations"]:
            for instance in reservation["Instances"]:

                instances_list.append({
                    "instance_id": instance["InstanceId"],
                    "instance_type": instance["InstanceType"],
                    "state": instance["State"]["Name"]
                })

    return instances_list


# ============================
# 2. CPU UTILIZATION
# ============================
def get_instance_cpu_utilization(instance_id):
    try:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(minutes=10)

        response = cloudwatch.get_metric_statistics(
            Namespace="AWS/EC2",
            MetricName="CPUUtilization",
            Dimensions=[
                {"Name": "InstanceId", "Value": instance_id}
            ],
            StartTime=start_time,
            EndTime=end_time,
            Period=300,
            Statistics=["Average"],
        )

        datapoints = response.get("Datapoints", [])

        if datapoints:
            datapoints.sort(key=lambda x: x["Timestamp"])
            return datapoints[-1]["Average"]

        return 0.0

    except Exception as e:
        print("CPU Fetch Error:", str(e))
        return 0.0


# ============================
# 3. COST ESTIMATION
# ============================
def estimate_ec2_cost(instance_type, hours=24):
    pricing = {
        "t3.micro": 0.0104,
        "t2.micro": 0.0116
    }

    rate = pricing.get(instance_type, 0.01)
    return rate * hours


# ============================
# 4. RISK ANALYSIS
# ============================
def analyze_ec2_risk(cpu):
    if cpu < 5:
        return "UNDERUTILIZED ⚠️"
    elif cpu > 80:
        return "OVERLOADED 🔥"
    else:
        return "OPTIMAL"


# ============================
# 5. SAVE EC2 + ENRICH DATA
# ============================
def save_ec2_instances(db: Session, instances_data):

    existing_instances = {
        inst.instance_id: inst
        for inst in db.query(EC2Instance).all()
    }

    # Delete instances from DB that are no longer in AWS
    new_ids = {instance["instance_id"] for instance in instances_data}
    for instance_id, inst_obj in existing_instances.items():
        if instance_id not in new_ids:
            db.delete(inst_obj)

    for instance in instances_data:

        cpu = get_instance_cpu_utilization(instance["instance_id"])
        cost = estimate_ec2_cost(instance["instance_type"])
        risk = analyze_ec2_risk(cpu)

        existing = existing_instances.get(instance["instance_id"])

        if existing:
            existing.instance_type = instance["instance_type"]
            existing.state = instance["state"]
            existing.average_cpu = cpu
            existing.cost = cost
            existing.risk = risk

        else:
            db.add(
                EC2Instance(
                    instance_id=instance["instance_id"],
                    instance_type=instance["instance_type"],
                    state=instance["state"],
                    average_cpu=cpu,
                    cost=cost,
                    risk=risk
                )
            )

    db.commit()


# ============================
# 6. STORE CPU HISTORY
# ============================
def sync_cpu_metrics(db: Session):

    instances = db.query(EC2Instance).all()

    for inst in instances:
        cpu = get_instance_cpu_utilization(inst.instance_id)

        db.add(
            CPUMetric(
                instance_id=inst.instance_id,
                average_cpu=cpu
            )
        )

    db.commit()


# ============================
# 7. DASHBOARD DATA (NEW 🔥)
# ============================
def get_ec2_dashboard(db: Session):
    instances = db.query(EC2Instance).all()

    total_instances = len(instances)
    running = len([i for i in instances if i.state == "running"])
    stopped = len([i for i in instances if i.state == "stopped"])

    total_cost = sum(i.cost or 0 for i in instances)

    underutilized = len([i for i in instances if i.risk == "UNDERUTILIZED ⚠️"])
    overloaded = len([i for i in instances if i.risk == "OVERLOADED 🔥"])

    return {
        "total_instances": total_instances,
        "running": running,
        "stopped": stopped,
        "total_cost": total_cost,
        "underutilized": underutilized,
        "overloaded": overloaded,
        "instances": [
            {
                "id": i.instance_id,
                "type": i.instance_type,
                "state": i.state,
                "cpu": i.average_cpu,
                "cost": i.cost,
                "risk": i.risk
            }
            for i in instances
        ]
    }
