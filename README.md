# Cloud Intelligence Platform ☁️

A high-performance, production-grade Cloud Management Console designed to provide real-time visibility, cost optimization, and environmental sustainability tracking for AWS infrastructure.

---


## 🚀 Core Features

### 📊 Cost Analytics
- **Dynamic Filtering**: Analyze costs over 7d, 30d, and 90d timelines.
- **Service Breakdown**: Granular cost tracking across EC2, S3, RDS, and Lambda.
- **Forecasting**: Intelligent cost prediction based on historical trends.

### ⚡ Operations Intelligence (Performance)
- **Real-Time Monitoring**: Live CPU, Memory, and Network metrics for EC2 instances.
- **Resource Inventory**: Automated discovery of regional infrastructure.
- **Health Indicators**: At-a-glance status monitoring (Optimal, Warning, Critical).

### 🌿 Sustainability Tracking
- **Carbon Footprint Analysis**: Real-time emission tracking based on infrastructure usage.
- **Green Efficiency Index**: Proactive recommendations to reduce environmental impact.
- **Avoided Emissions**: Dynamic calculation of CO2 savings from optimized/stopped resources.

### 🛡️ Risk & Optimization
- **Rightsizing Engine**: Automatic identification of underutilized or overloaded instances.
- **Cost Leakage Detection**: Alerts for unused resources and storage waste.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide React, Chart.js.
- **Backend**: FastAPI (Python), SQLAlchemy, Boto3 (AWS SDK).
- **Database**: PostgreSQL.
- **Containerization**: Docker & Docker Compose.

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL
- AWS Credentials (IAM User with ReadOnlyAccess)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```
Create a `.env` file in the `backend` folder:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/cloud_intelligence_db
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` folder:
```env
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

### 4. Run the Application
**Start Backend:**
```bash
uvicorn app.main:app --reload
```
**Start Frontend:**
```bash
npm run dev
```

---

## 🔒 Security & Best Practices
- **Credential Safety**: The project is pre-configured with a strict `.gitignore` that blocks all `.env` files and credentials from being committed.
- **API Unification**: All frontend requests are routed through a centralized `@/lib/api` utility for consistent error handling and loading states.
- **Mock-Free Environment**: Once synchronized, the platform displays 100% real-world data from your connected AWS account.

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## 📄 License
This project is licensed under the MIT License.
