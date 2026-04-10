from sqlalchemy import Column, Integer, Float, Date
from app.db.database import Base


class RiskHistory(Base):
    __tablename__ = "risk_history"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True, index=True)
    risk_score = Column(Float)
