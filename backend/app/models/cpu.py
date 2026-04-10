from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.db.database import Base


class CPUMetric(Base):
    __tablename__ = "cpu_metrics"

    id = Column(Integer, primary_key=True, index=True)
    instance_id = Column(String, index=True)
    cpu_utilization = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
