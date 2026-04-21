import boto3
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.lambda_model import LambdaFunction

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")

lambda_client = boto3.client("lambda", region_name=AWS_REGION)
cloudwatch = boto3.client("cloudwatch", region_name=AWS_REGION)

# ============================
# 1. FETCH LAMBDA FUNCTIONS
# ============================
def get_lambda_functions():
    try:
        functions = []

        paginator = lambda_client.get_paginator("list_functions")

        for page in paginator.paginate():
            for fn in page.get("Functions", []):

                memory = fn.get("MemorySize", 128)
                timeout = fn.get("Timeout", 3)

                invocations = get_lambda_invocations(fn["FunctionName"])
                cost = estimate_lambda_cost(memory, invocations)
                risk = analyze_lambda_risk(timeout, memory, invocations)

                functions.append({
                    "name": fn["FunctionName"],
                    "runtime": fn.get("Runtime"),
                    "memory": memory,
                    "timeout": timeout,
                    "handler": fn.get("Handler"),
                    "last_modified": fn.get("LastModified"),
                    "invocations": invocations,
                    "cost_estimate": cost,
                    "risk": risk
                })

        return functions

    except Exception as e:
        print("Lambda Fetch Error:", str(e))
        return []


# ============================
# 2. CLOUDWATCH METRICS
# ============================
def get_lambda_invocations(function_name):
    try:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=24)

        response = cloudwatch.get_metric_statistics(
            Namespace="AWS/Lambda",
            MetricName="Invocations",
            Dimensions=[
                {"Name": "FunctionName", "Value": function_name}
            ],
            StartTime=start_time,
            EndTime=end_time,
            Period=3600,
            Statistics=["Sum"]
        )

        datapoints = response.get("Datapoints", [])

        if datapoints:
            return int(sum(d["Sum"] for d in datapoints))

        return 0

    except Exception as e:
        print("Invocation Fetch Error:", str(e))
        return 0


# ============================
# 3. COST ESTIMATION
# ============================
def estimate_lambda_cost(memory_mb, executions=1000, avg_duration_ms=1000):
    gb = memory_mb / 1024
    seconds = avg_duration_ms / 1000

    cost_per_execution = gb * seconds * 0.00001667
    total_cost = cost_per_execution * executions

    return round(total_cost, 6)


# ============================
# 4. RISK ANALYSIS
# ============================
def analyze_lambda_risk(timeout, memory, invocations):
    if timeout >= 60:
        return "HIGH TIMEOUT ⚠️"
    elif memory >= 1024:
        return "HIGH MEMORY ⚠️"
    elif invocations == 0:
        return "UNUSED ⚠️"
    elif timeout > 30:
        return "MEDIUM TIMEOUT"
    else:
        return "OPTIMAL"


# ============================
# 5. SAVE TO DATABASE
# ============================
def save_lambda_functions(db: Session, functions_data):
    existing = {
        f.name: f for f in db.query(LambdaFunction).all()
    }

    # Delete Lambda functions from DB that are no longer in AWS
    new_names = {fn["name"] for fn in functions_data}
    for name, fn_obj in existing.items():
        if name not in new_names:
            db.delete(fn_obj)

    for fn in functions_data:

        if fn["name"] in existing:
            obj = existing[fn["name"]]
            obj.runtime = fn["runtime"]
            obj.memory = fn["memory"]
            obj.timeout = fn["timeout"]
            obj.invocations = fn["invocations"]
            obj.cost = fn["cost_estimate"]
            obj.risk = fn["risk"]

        else:
            db.add(
                LambdaFunction(
                    name=fn["name"],
                    runtime=fn["runtime"],
                    memory=fn["memory"],
                    timeout=fn["timeout"],
                    invocations=fn["invocations"],
                    cost=fn["cost_estimate"],
                    risk=fn["risk"]
                )
            )

    db.commit()


# ============================
# 6. DASHBOARD DATA
# ============================
def get_lambda_dashboard(db: Session):
    functions = db.query(LambdaFunction).all()

    total = len(functions)
    total_cost = sum(f.cost or 0 for f in functions)
    unused = len([f for f in functions if f.risk == "UNUSED ⚠️"])
    high_risk = len([f for f in functions if "HIGH" in (f.risk or "")])

    return {
        "total_functions": total,
        "total_cost": total_cost,
        "unused_functions": unused,
        "high_risk": high_risk,
        "functions": [
            {
                "name": f.name,
                "runtime": f.runtime,
                "memory": f.memory,
                "timeout": f.timeout,
                "invocations": f.invocations,
                "cost": f.cost,
                "risk": f.risk
            }
            for f in functions
        ]
    }
