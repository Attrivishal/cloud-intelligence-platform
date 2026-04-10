from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base


class RDSInstance(Base):
    __tablename__ = "rds_instances"

    id = Column(Integer, primary_key=True, index=True)

    db_identifier = Column(String, unique=True)
    engine = Column(String)
    instance_class = Column(String)
    status = Column(String)

    allocated_storage = Column(Float)
    cost = Column(Float)
    risk = Column(String)
