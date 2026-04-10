import boto3
from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session

from app.models.cost import DailyCost


def get_daily_cost():
    ce = boto3.client("ce", region_name="us-east-1")

    end_date = date.today()
    start_date = end_date - timedelta(days=30)

    response = ce.get_cost_and_usage(
        TimePeriod={
            "Start": start_date.strftime("%Y-%m-%d"),
            "End": end_date.strftime("%Y-%m-%d")
        },
        Granularity="DAILY",
        Metrics=["UnblendedCost"]
    )

    return response.get("ResultsByTime", [])


def save_daily_costs(db: Session, cost_data):

    for entry in cost_data:
        date_str = entry["TimePeriod"]["Start"]
        raw_amount = float(entry["Total"]["UnblendedCost"]["Amount"])

        cost_date = datetime.strptime(date_str, "%Y-%m-%d").date()

        if abs(raw_amount) < 0.01:
            continue

        amount = round(abs(raw_amount), 2)

        existing = db.query(DailyCost).filter(
            DailyCost.date == cost_date
        ).first()

        if existing:
            existing.amount = amount
        else:
            db.add(
                DailyCost(
                    date=cost_date,
                    amount=amount
                )
            )

    db.commit()
