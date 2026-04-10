from app.db.database import engine, Base

# 🔥 Import all models here (important for table creation)
from app.models import instance
from app.models import cost
from app.models import cpu
from app.models import user
from app.models import risk_history
from app.models import s3_bucket
from app.models import rds_instance
from app.models import lambda_model

def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
