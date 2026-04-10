from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base

class LambdaFunction(Base):
    __tablename__ = "lambda_functions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

    runtime = Column(String)
    memory = Column(Integer)
    timeout = Column(Integer)

    invocations = Column(Integer)   # ✅ ADD THIS

    cost = Column(Float)
    risk = Column(String)
