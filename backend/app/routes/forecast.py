from fastapi import APIRouter
import numpy as np
import random
import datetime
from sklearn.linear_model import LinearRegression

router = APIRouter(prefix="/dashboard", tags=["Forecast"])

# =============================
# EC2 Pricing Model
# =============================

EC2_PRICING = {
    "t3.micro": 0.0104,
    "t3.medium": 0.0416,
    "m5.large": 0.096
}

HOURS_PER_DAY = 24


def generate_ec2_cost_history(days=60):
    base_instances = 3
    instance_type = "t3.medium"

    daily_costs = []

    for day in range(days):

        weekend_spike = 2 if day % 7 in [5, 6] else 0
        growth_factor = int(day / 20)
        random_scale = random.randint(0, 2)

        total_instances = (
            base_instances
            + weekend_spike
            + growth_factor
            + random_scale
        )

        hourly_price = EC2_PRICING[instance_type]
        daily_cost = total_instances * hourly_price * HOURS_PER_DAY

        daily_costs.append(round(daily_cost, 2))

    return daily_costs


def generate_forecast_data():
    historical_cost = generate_ec2_cost_history(60)

    X = np.arange(len(historical_cost)).reshape(-1, 1)
    y = np.array(historical_cost)

    model = LinearRegression()
    model.fit(X, y)

    forecast_days = 30
    future_X = np.arange(len(y), len(y) + forecast_days).reshape(-1, 1)
    predictions = model.predict(future_X)

    residuals = y - model.predict(X)
    std_error = np.std(residuals)

    upper = predictions + (1.96 * std_error)
    lower = predictions - (1.96 * std_error)

    today = datetime.date.today()

    forecast_output = []

    for i in range(forecast_days):
        forecast_output.append({
            "date": str(today + datetime.timedelta(days=i)),
            "predicted_cost": round(float(predictions[i]), 2),
            "upper_bound": round(float(upper[i]), 2),
            "lower_bound": round(float(lower[i]), 2)
        })

    return {
        "model": "Linear Regression (EC2 Synthetic)",
        "forecast_days": forecast_days,
        "forecast": forecast_output,
        "predicted_total_30_days": round(float(sum(predictions)), 2),
        "forecast_trend_direction": (
            "Increasing" if predictions[-1] > predictions[0] else "Decreasing"
        ),
        "confidence_level": 85
    }


# =============================
# API Endpoint
# =============================

@router.get("/forecast")
def get_forecast():
    return generate_forecast_data()
