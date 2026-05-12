from sqlalchemy.orm import Session
from app.models.instance import EC2Instance
from app.models.cpu import CPUMetric
from app.models.cost import DailyCost
from app.models.s3_bucket import S3Bucket
from app.models.rds_instance import RDSInstance
from app.models.lambda_model import LambdaFunction

CPU_IDLE_THRESHOLD = 10  # 10% CPU

def get_savings_priority(savings_amount: float):
    if savings_amount > 100: return "High"
    if savings_amount > 20: return "Medium"
    return "Low"

def get_optimization_report(db: Session):
    # This returns detailed items for the report
    report = []
    
    # 1. EC2 Optimizations
    instances = db.query(EC2Instance).all()
    for inst in instances:
        if inst.risk == "UNDERUTILIZED ⚠️" or (inst.average_cpu and inst.average_cpu < 10):
            report.append({
                "instance_id": inst.instance_id,
                "instance_type": inst.instance_type,
                "state": inst.state,
                "average_cpu": round(inst.average_cpu or 0, 2),
                "status": "Underutilized",
                "recommendation": "Resize to t3.micro or schedule shutdown",
                "estimated_monthly_savings": 12.50
            })
            
    # 2. RDS Optimizations
    rds_insts = db.query(RDSInstance).all()
    for rds in rds_insts:
        if rds.risk == "LOW STORAGE ⚠️":
            report.append({
                "instance_id": rds.db_identifier,
                "instance_type": rds.instance_class,
                "state": rds.status,
                "average_cpu": 0, # RDS CPU not tracked here yet
                "status": "Low Storage Risk",
                "recommendation": "Enable Storage Autoscaling",
                "estimated_monthly_savings": 0.0
            })
            
    # 3. Lambda Optimizations
    lambdas = db.query(LambdaFunction).all()
    for fn in lambdas:
        if fn.risk == "UNUSED ⚠️":
            report.append({
                "instance_id": fn.name,
                "instance_type": "Lambda",
                "state": "Active",
                "average_cpu": 0,
                "status": "Unused",
                "recommendation": "Archive and delete function",
                "estimated_monthly_savings": 2.00
            })

    return report

def get_optimization_summary(db: Session):
    report = get_optimization_report(db)
    
    total_savings = sum(r["estimated_monthly_savings"] for r in report)
    underutilized = len([r for r in report if r["status"] == "Underutilized"])
    
    # Get counts for score calculation
    total_ec2 = db.query(EC2Instance).count()
    total_lambda = db.query(LambdaFunction).count()
    total_resources = total_ec2 + total_lambda
    
    if total_resources == 0:
        score = 100
    else:
        score = max(50, 100 - (len(report) * 5))
        
    return {
        "total_instances": total_ec2,
        "underutilized_instances": underutilized,
        "optimization_score": score,
        "total_potential_monthly_savings": round(total_savings, 2),
        "savings_priority_level": get_savings_priority(total_savings)
    }
