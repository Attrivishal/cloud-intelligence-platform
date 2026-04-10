from sqlalchemy import Column, Integer, String, Float, DateTime
from app.db.database import Base

class S3Bucket(Base):
    __tablename__ = "s3_buckets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    creation_date = Column(DateTime)

    size_bytes = Column(Float)
    object_count = Column(Integer)
    cost = Column(Float)
    status = Column(String)
