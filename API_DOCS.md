# TransitOps REST API Documentation

The TransitOps API is built with Node.js, Express, and node-postgres (`pg`), listening on `http://localhost:5000/api`.

---

## 🔐 1. Authentication Module

### User Login
Authenticate credentials and issue JWT.
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@transitops.io",
    "password": "demo1234"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@transitops.io",
      "name": "Alicia Diaz",
      "role": "Fleet Manager"
    }
  }
  ```

### User Logout
Clear current authentication context.
- **Method**: `POST`
- **Route**: `/api/auth/logout`
- **Response (200 OK)**:
  ```json
  {
    "message": "Successfully logged out"
  }
  ```

---

## 📈 2. Dashboard Analytics Module

### Operations Overview
Retrieve aggregated counts, fleet utilization indices, and charts.
- **Method**: `GET`
- **Route**: `/api/dashboard/overview`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "kpis": [...],
    "utilization": [...],
    "fuel": [...],
    "trips": [...],
    "tripStatus": [...],
    "driverPerformance": [...],
    "maintenanceCosts": [...],
    "vehicleStatus": [...],
    "tripsTable": [...],
    "drivers": [...],
    "notifications": [...]
  }
  ```

---

## 🚌 3. Vehicles Module (CRUD)

### Get All Vehicles
Retrieve all registered fleet assets. Supports filters.
- **Method**: `GET`
- **Route**: `/api/vehicles`
- **Query Params**:
  - `search` (Optional): Matches ID, registration, model, or driver.
  - `status` (Optional): Filter by `available`, `on trip`, or `maintenance`.
- **Headers**: `Authorization: Bearer <token>`

### Register Vehicle
Add asset to registry. *Requires Fleet Manager role.*
- **Method**: `POST`
- **Route**: `/api/vehicles`
- **Request Body**:
  ```json
  {
    "id": "V-301",
    "regNumber": "DL-4C-XY-1234",
    "type": "Bus",
    "model": "EV-Transit 10",
    "driver": "Marcus Aurelius",
    "status": "available",
    "mileage": "0",
    "fuel": "100"
  }
  ```

---

## 🛡️ 4. Drivers Module (CRUD)

### Get All Drivers
Retrieve operator profiles.
- **Method**: `GET`
- **Route**: `/api/drivers`
- **Headers**: `Authorization: Bearer <token>`

### Onboard Driver
Create legal profile registration. *Requires Fleet Manager or Safety Officer roles.*
- **Method**: `POST`
- **Route**: `/api/drivers`
- **Request Body**:
  ```json
  {
    "name": "Richard Hendricks",
    "license": "LC-DL-88301",
    "phone": "+91 99000 12345",
    "vehicle": "V-301",
    "status": "On Shift",
    "safetyScore": 92
  }
  ```

---

## 🚚 5. Trips Dispatcher Module

### Get Active Trips
- **Method**: `GET`
- **Route**: `/api/trips`

### Schedule Trip Dispatch
- **Method**: `POST`
- **Route**: `/api/trips`
- **Request Body**:
  ```json
  {
    "vehicle": "V-214 (Bus)",
    "driver": "Mina Alvarez",
    "cargo": "Passenger Route A",
    "pickup": "Terminal 1",
    "destination": "Suburban Plaza",
    "distance": "58",
    "eta": "14:20",
    "status": "Pending"
  }
  ```

---

## 🔧 6. Maintenance Module

### Fetch Service Timeline & Queue
- **Method**: `GET`
- **Route**: `/api/maintenance`

### Schedule Service Ticket
- **Method**: `POST`
- **Route**: `/api/maintenance`
- **Request Body**:
  ```json
  {
    "type": "Brake Service",
    "asset": "V-198 (Heavy Truck)",
    "date": "2026-07-14",
    "cost": "14200",
    "progress": 40,
    "status": "In Progress"
  }
  ```

---

## ⛽ 7. Fuel Module

### Retrieve Refuels
- **Method**: `GET`
- **Route**: `/api/fuel`

### Record Refuel Invoice
- **Method**: `POST`
- **Route**: `/api/fuel`

---

## 💵 8. Expenses Module

### Retrieve Costs
- **Method**: `GET`
- **Route**: `/api/expenses`

### Log Operating Claim
- **Method**: `POST`
- **Route**: `/api/expenses`

---

## 📄 9. Reports Module

### Get Historical Reports
- **Method**: `GET`
- **Route**: `/api/reports`

### Compile Operations Report
- **Method**: `POST`
- **Route**: `/api/reports`

---

## 🔔 10. Notifications Module

### Get Notifications Feed
- **Method**: `GET`
- **Route**: `/api/notifications`

### Mark Alert As Read
- **Method**: `PUT`
- **Route**: `/api/notifications/:id/read`
