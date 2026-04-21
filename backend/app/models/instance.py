from sqlalchemy import Column, Integer, String, DateTime, Float
from app.db.database import Base


class EC2Instance(Base):
    __tablename__ = "ec2_instances"

    id = Column(Integer, primary_key=True, index=True)

    # 🔹 Basic Info
    instance_id = Column(String, unique=True, index=True)
    instance_type = Column(String)
    state = Column(String)

    # 🔹 Location Info
    region = Column(String)
    availability_zone = Column(String)

    # 🔹 Metadata
    launch_time = Column(DateTime)

    # 🔥 NEW (IMPORTANT) - CONSISTENT WITH CPUMetric
    average_cpu = Column(Float)
    cost = Column(Float)
    risk = Column(String)
