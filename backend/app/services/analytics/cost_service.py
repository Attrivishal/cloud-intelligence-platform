from sqlalchemy.orm import Session
from app.models.cost import DailyCost


def save_daily_cost(db: Session, cost_data):
    for day in cost_data:
        date_str = day["TimePeriod"]["Start"]
        amount = float(day["Total"]["UnblendedCost"]["Amount"])
        unit = day["Total"]["UnblendedCost"]["Unit"]

        from datetime import datetime
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()

        existing = db.query(DailyCost).filter(
            DailyCost.date == date_obj
        ).first()

        if not existing:
            new_cost = DailyCost(
                date=date_obj,
                amount=amount,
                unit=unit
            )
            db.add(new_cost)

    db.commit()


def get_cost_trend(db: Session):
    costs = db.query(DailyCost).order_by(DailyCost.date).all()

    return [
        {
            "date": cost.date.isoformat(),
            "amount": round(cost.amount, 8)
        }
        for cost in costs
    ]


def get_cost_summary(db: Session):
    costs = db.query(DailyCost).all()

    if not costs:
        return {"message": "No cost data available"}

    total_cost = sum(c.amount for c in costs)
    average_cost = total_cost / len(costs)

    highest_day = max(costs, key=lambda c: c.amount)
    lowest_day = min(costs, key=lambda c: c.amount)

    return {
        "total_cost": round(total_cost, 8),
        "average_daily_cost": round(average_cost, 8),
        "highest_cost": {
            "date": highest_day.date.isoformat(),
            "amount": round(highest_day.amount, 8)
        },
        "lowest_cost": {
            "date": lowest_day.date.isoformat(),
            "amount": round(lowest_day.amount, 8)
        },
        "days_count": len(costs)
    }
