from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from datetime import datetime
from app.db.database import Base


class CPUMetric(Base):
    __tablename__ = "cpu_metrics"

    id = Column(Integer, primary_key=True, index=True)
    instance_id = Column(String, index=True)
    average_cpu = Column(Float)
    date = Column(Date, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
