import boto3
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.instance import EC2Instance
from app.models.cpu import CPUMetric

load_dotenv()
AWS_REGION = os.getenv("AWS_REGION")


def get_instance_cpu_utilization(instance_id):
    cloudwatch = boto3.client("cloudwatch", region_name=AWS_REGION)

    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=1)

    response = cloudwatch.get_metric_statistics(
        Namespace="AWS/EC2",
        MetricName="CPUUtilization",
        Dimensions=[{"Name": "InstanceId", "Value": instance_id}],
        StartTime=start_time,
        EndTime=end_time,
        Period=3600,
        Statistics=["Average"]
    )

    return response.get("Datapoints", [])


def sync_cpu_metrics(db: Session):
    instances = db.query(EC2Instance).all()

    cloudwatch = boto3.client("cloudwatch", region_name=AWS_REGION)

    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=1)

    for instance in instances:

        response = cloudwatch.get_metric_statistics(
            Namespace="AWS/EC2",
            MetricName="CPUUtilization",
            Dimensions=[{"Name": "InstanceId", "Value": instance.instance_id}],
            StartTime=start_time,
            EndTime=end_time,
            Period=86400,
            Statistics=["Average"]
        )

        datapoints = response.get("Datapoints", [])

        if datapoints:
            avg_cpu = round(float(datapoints[0]["Average"]), 2)
            today_date = start_time.date()

            existing = db.query(CPUMetric).filter(
                CPUMetric.instance_id == instance.instance_id,
                CPUMetric.date == today_date
            ).first()

            if not existing:
                db.add(
                    CPUMetric(
                        instance_id=instance.instance_id,
                        date=today_date,
                        average_cpu=avg_cpu
                    )
                )

    db.commit()
