from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from apscheduler.jobstores.memory import MemoryJobStore
import pytz

from app.db.database import SessionLocal

from app.services.aws.ec2_service import (
    get_ec2_instances,
    save_ec2_instances
)

from app.services.aws.cloudwatch_service import (
    sync_cpu_metrics
)

from app.services.aws.cost_explorer_service import (
    get_daily_cost,
    save_daily_costs
)

from app.services.aws.s3_service import (
    get_s3_buckets,
    save_s3_buckets
)

from app.services.aws.rds_service import (
    get_rds_instances,
    save_rds_instances
)

from app.services.aws.lambda_service import (
    get_lambda_functions,
    save_lambda_functions
)


# =====================================================
# SYNC FUNCTION
# =====================================================

def scheduled_sync():
    print("Running scheduled sync...")

    db = SessionLocal()

    try:
        instances = get_ec2_instances()
        save_ec2_instances(db, instances)

        cost_data = get_daily_cost()
        save_daily_costs(db, cost_data)

        sync_cpu_metrics(db)

        # 🔥 NEW AWS SERVICES
        buckets = get_s3_buckets()
        save_s3_buckets(db, buckets)

        rds_instances = get_rds_instances()
        save_rds_instances(db, rds_instances)

        functions = get_lambda_functions()
        save_lambda_functions(db, functions)

        print("Sync completed successfully")

    except Exception as e:
        print("Scheduler error:", str(e))

    finally:
        db.close()


# =====================================================
# SCHEDULER CONFIG
# =====================================================

jobstores = {
    "default": MemoryJobStore()
}

executors = {
    "default": ThreadPoolExecutor(5)
}

job_defaults = {
    "coalesce": False,
    "max_instances": 1
}


scheduler = BackgroundScheduler(
    jobstores=jobstores,
    executors=executors,
    job_defaults=job_defaults,
    timezone=pytz.utc
)


# =====================================================
# START FUNCTION
# =====================================================

def start_scheduler():
    print("Starting scheduler...")

    scheduler.add_job(
        scheduled_sync,
        trigger="interval",
        minutes=10  # 🔥 change as needed
    )

    scheduler.start()

    print("Scheduler started.")
