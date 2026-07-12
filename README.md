#  TransitOps – Smart Transport Operations Platform

##  Overview

TransitOps is a web-based **Smart Transport Operations Platform** designed to streamline and digitize transportation management for organizations. The system provides a centralized solution for managing vehicles, drivers, trips, maintenance schedules, fuel consumption, operational expenses, and analytics.

By replacing traditional spreadsheet-based workflows with an integrated platform, TransitOps improves fleet visibility, minimizes operational delays, reduces maintenance costs, and enhances decision-making through real-time insights.

---

#  Problem Statement

Many organizations still rely on spreadsheets and manual processes to manage transport operations. This often results in:

- Vehicle scheduling conflicts
- Inaccurate records
- Delayed maintenance
- Fuel wastage
- Poor driver tracking
- Inefficient resource utilization

TransitOps addresses these challenges by providing a centralized digital platform that automates fleet management, improves operational efficiency, and enables data-driven decision-making.

---

#  Objectives

- Digitize transport operations
- Centralize vehicle and driver management
- Improve fleet utilization
- Reduce vehicle downtime
- Automate maintenance scheduling
- Track fuel consumption and expenses
- Simplify trip dispatching
- Generate operational reports and analytics
- Secure the platform using Role-Based Access Control (RBAC)

---

#  Tech Stack

| Layer | Technology |
|--------|------------|
| **Frontend** | Next.js (App Router) |
| **Backend** | Node.js + Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM |
| **Authentication** | JWT + bcrypt |
| **Styling** | Tailwind CSS |
| **Data Fetching** | TanStack Query (React Query) |
| **Forms & Validation** | React Hook Form + Zod |
| **Charts & Analytics** | Recharts |
| **API Testing** | Postman |
| **Version Control** | Git & GitHub |
| **Development Environment** | Visual Studio Code |

---

#  User Roles

##  Fleet Manager

- Manage Vehicles
- Manage Drivers
- Dispatch Trips
- View Reports
- Assign Maintenance
- Manage Fuel Records
- Access Analytics

---

##  Dispatcher

- Create Trips
- Assign Vehicles
- Assign Drivers
- Monitor Trip Progress

---

##  Safety Officer

- Manage Driver Safety
- Verify Driver Licenses
- Schedule Vehicle Inspections
- Monitor Maintenance Status

---

##  Financial Analyst

- Track Fuel Costs
- Manage Expenses
- Generate Cost Reports
- Analyze Operational Costs

---

#  Modules

##  Authentication (RBAC)

### Features

- Secure Login
- Logout
- JWT Authentication
- Password Encryption
- Remember Me
- Forgot Password
- Role-Based Login

---

##  Dashboard

Provides an overview of the complete transport management system.

### Dashboard KPIs

- Total Vehicles
- Active Vehicles
- Available Vehicles
- Vehicles On Trip
- Vehicles Under Maintenance
- Total Drivers
- Fleet Utilization Percentage

### Dashboard Components

- Recent Trips
- Vehicle Status Overview
- Fleet Utilization Chart
- Fuel Consumption Chart
- Monthly Expense Chart

---

##  Vehicle Registry

Manage all organization vehicles.

### Features

- Add Vehicle
- Update Vehicle Details
- Delete Vehicle
- Search Vehicles
- Filter Vehicles
- Vehicle Registration Number
- Vehicle Type
- Capacity
- Purchase Date
- Current Mileage
- Vehicle Status

### Vehicle Status

- Available
- On Trip
- In Maintenance
- Retired

---

##  Driver Management

Manage organization drivers and safety records.

### Features

- Add Driver
- Update Driver
- Delete Driver
- Driver Photo
- Contact Information
- License Number
- License Expiry Date
- Driver Availability
- Safety Score
- Assigned Vehicle

### Driver Status

- Available
- Assigned
- Off Duty
- Suspended
##  Trip Dispatcher

Manage trip assignments between vehicles and drivers.

### Features

- Create New Trip
- Assign Vehicle
- Assign Driver
- Pickup Location
- Destination
- Cargo Information
- Cargo Weight
- Route Distance
- Trip Status Tracking

### Trip Workflow

```text
Pending
   │
   ▼
Dispatched
   │
   ▼
In Progress
   │
   ▼
Completed

or

Cancelled
```

### Validation

- Driver Availability Check
- Vehicle Availability Check
- Cargo Capacity Validation
- License Verification

---

##  Maintenance Management

Maintain vehicle service records.

### Features

- Schedule Maintenance
- Oil Change Records
- Brake Service
- Tyre Replacement
- Engine Inspection
- Service History
- Maintenance Cost Tracking

### Maintenance Status

- Scheduled
- In Progress
- Completed

---

##  Fuel & Expense Management

Monitor operational expenses.

###  Fuel Management

- Fuel Logs
- Fuel Quantity
- Fuel Cost
- Mileage Tracking
- Fuel Efficiency

###  Expense Management

- Repair Expenses
- Toll Charges
- Driver Expenses
- Miscellaneous Expenses

### Features

- Add Expense
- Update Expense
- Delete Expense
- Monthly Expense Summary

---

## 8️ Reports & Analytics

Generate business insights through interactive dashboards.

### Reports

- Fleet Utilization Report
- Fuel Consumption Report
- Vehicle Performance Report
- Driver Performance Report
- Maintenance Cost Report
- Monthly Expense Report

### Analytics

-  Bar Charts
-  Pie Charts
-  Line Charts
-  Area Charts
-  Donut Charts

---

##  Settings

### Features

- User Profile
- Change Password
- Organization Details
- Notification Preferences
- System Settings

---

#  Role-Based Access Control (RBAC)

TransitOps implements **Role-Based Access Control (RBAC)** to ensure secure access to system modules based on user responsibilities.

## Permission Legend

| Permission | Description |
|------------|-------------|
| **C** | Create |
| **R** | Read / View |
| **U** | Update |
| **D** | Delete |
| **CRUD** | Full Access (Create, Read, Update, Delete) |

## Access Matrix

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

---

#  Dashboard Metrics

- Total Vehicles
- Active Vehicles
- Vehicles on Trip
- Vehicles Under Maintenance
- Available Drivers
- Fleet Utilization (%)
- Monthly Fuel Cost
- Monthly Maintenance Cost
- Monthly Operational Expenses

---

#  Database Schema

### Tables

- Users
- Roles
- Vehicles
- Drivers
- Trips
- TripAssignments
- Maintenance
- FuelLogs
- Expenses
- Reports
#  Project Structure

```text
TransitOps
│
├── client
│   ├── app
│   │   ├── (auth)
│   │   │   ├── login
│   │   │   └── forgot-password
│   │   │
│   │   ├── dashboard
│   │   ├── vehicles
│   │   ├── drivers
│   │   ├── trips
│   │   ├── maintenance
│   │   ├── fuel-expenses
│   │   ├── reports
│   │   └── settings
│   │
│   ├── components
│   ├── hooks
│   ├── lib
│   ├── services
│   ├── styles
│   ├── types
│   ├── utils
│   ├── public
│   ├── package.json
│   └── next.config.js
│
├── server
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   │
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── services
│   ├── utils
│   ├── config
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .env
├── .gitignore
├── README.md
└── package.json
```

---

#  Installation

## Backend Setup

```bash
cd server

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

#  Database Configuration

Create a PostgreSQL database named:

```text
transitops
```

Configure your `.env` file.

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/transitops"

JWT_SECRET=your_secret_key

PORT=5000
```

---

#  References

1. **From Chaos to Control: Why Logistics Teams Are Finally Ditching Spreadsheets**  
   https://www.b2bnn.com/2025/07/from-chaos-to-control-why-logistics-teams-are-finally-ditching-spreadsheets/

2. **Fleet Management Best Practices – Geotab**  
   https://www.geotab.com/fleet-management/

3. **What is Fleet Management? A Complete Guide – Samsara**  
   https://www.samsara.com/guides/fleet-management

---

#  License

This project is developed for educational and academic purposes as part of a software engineering project.

TransitOps demonstrates a modern **Smart Transport Operations Platform** built using:

- Next.js (App Router)
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod
- Recharts

The project showcases secure authentication, role-based access control (RBAC), fleet management, driver management, trip dispatching, maintenance scheduling, fuel and expense tracking, and analytics within a centralized transport management system.

---
