from sqlalchemy import Column, Integer, String, Float, Date
from app.db.database import Base

class DailyCost(Base):
    __tablename__ = "daily_costs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True, index=True)
    amount = Column(Float)
    unit = Column(String)
