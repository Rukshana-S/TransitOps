# TransitOps – Smart Transport Operations Platform

TransitOps is a smart, enterprise-grade **Smart Transport Operations Platform** designed to streamline and digitize fleet operations. It features secure Role-Based Access Control (RBAC), vehicle registries, interactive route dispatchers, real-time GPS telemetry overlays, upcoming maintenance timelines, fuel and expense audit ledgers, reports compiler sheets, and advanced analytics dashboards.

---

## 🛠️ Full Stack Architecture

The application is structured as a workspace:
- **/database**: PostgreSQL SQL schemas and seeder records.
- **/transitops-backend**: Node.js/Express MVC REST API server using connection pooling (`node-postgres`) to interact with PostgreSQL.
- **/transitops-frontend**: Premium Next.js (App Router) client compiled with Tailwind CSS & Lucide icons, connecting to the backend via Axios.

---

## 🚀 Getting Started (Zero Coding Setup)

### 1. Database Configuration
Create a PostgreSQL database named:
```text
transitops
```

Configure your environment variables. Copy `.env.example` to `.env` inside `/transitops-backend` (or at the root) and provide your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/transitops"
JWT_SECRET="replace-with-a-long-random-string"
PORT=5000
```

*Note: You do not need to manually execute SQL tables or seeds! On backend start, TransitOps will check if tables are missing and automatically run database schemas and seed configurations.*

---

### 2. Project Bootstrapping

To install dependencies and start both frontend and backend concurrently:

1. **Install workspace dependencies**:
   ```bash
   npm run install:all
   ```

2. **Boot the complete application**:
   ```bash
   npm run dev
   ```

Both servers will start concurrently:
- **Express Backend**: Listening on [http://localhost:5000/api](http://localhost:5000/api)
- **Next.js Frontend Client**: Listening on [http://localhost:3000](http://localhost:3000)

---

## 🔐 Credentials & Access Matrix
Log in using the default Fleet Manager profile:
- **Email**: `admin@transitops.io`
- **Password**: `demo1234`

### Role-Based Access Control (RBAC) Permission Matrix
| Module | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst |
|---------|---------------|------------|----------------|-------------------|
| Dashboard | **R** | **R** | **R** | **R** |
| Vehicle Registry | **CRUD** | **R** | **R** | **R** |
| Driver Management | **CRUD** | **R** | **CRUD** | **R** |
| Trip Dispatcher | **CRUD** | **CRUD** | **R** | **R** |
| Maintenance | **CRUD** | **R** | **CRUD** | **R** |
| Fuel & Expenses | **CRUD** | **R** | **R** | **CRUD** |
| Reports & Analytics | **CRUD** | **R** | **R** | **CRUD** |
| Settings | **CRUD** | **R** | **R** | **R** |
