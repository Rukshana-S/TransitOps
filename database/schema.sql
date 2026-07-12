-- TransitOps PostgreSQL Database Schema

-- Drop tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS fuel_logs CASCADE;
DROP TABLE IF EXISTS maintenance CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    employee_id VARCHAR(20),
    department VARCHAR(50),
    role VARCHAR(30) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Vehicles Table
CREATE TABLE vehicles (
    id VARCHAR(50) PRIMARY KEY,
    reg_number VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100) NOT NULL,
    manufacturing_year INTEGER,
    fuel_type VARCHAR(50),
    mileage VARCHAR(50) DEFAULT '0 km',
    fuel VARCHAR(50) DEFAULT '100%',
    capacity INTEGER,
    status VARCHAR(50) DEFAULT 'available',
    current_location VARCHAR(255),
    notes TEXT,
    assigned_driver_id VARCHAR(50)
);

-- 4. Drivers Table
CREATE TABLE drivers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(20) UNIQUE,
    license VARCHAR(100) UNIQUE NOT NULL,
    license_expiry DATE,
    phone VARCHAR(50),
    email VARCHAR(100),
    joining_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Available',
    safety_score INTEGER DEFAULT 90,
    assigned_vehicle_id VARCHAR(50) REFERENCES vehicles(id) ON DELETE SET NULL
);

ALTER TABLE vehicles ADD CONSTRAINT fk_vehicles_assigned_driver FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id) ON DELETE SET NULL;

-- 5. Trips Table
CREATE TABLE trips (
    id VARCHAR(50) PRIMARY KEY,
    vehicle VARCHAR(100) NOT NULL,
    driver VARCHAR(100) NOT NULL,
    cargo VARCHAR(255) DEFAULT 'General Freight',
    pickup VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    distance VARCHAR(50) NOT NULL,
    eta VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 6. Maintenance Table
CREATE TABLE maintenance (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    asset VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    cost VARCHAR(50) NOT NULL,
    progress INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Scheduled'
);

-- 7. Fuel Logs Table
CREATE TABLE fuel_logs (
    id VARCHAR(50) PRIMARY KEY,
    asset VARCHAR(100) NOT NULL,
    liters DOUBLE PRECISION NOT NULL,
    cost VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    station VARCHAR(100) DEFAULT 'HP Refuel Station',
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 8. Expenses Table
CREATE TABLE expenses (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    vehicle VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 9. Reports Table
CREATE TABLE reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    author VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL
);

-- 10. Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_maintenance_status ON maintenance(status);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_fuel_logs_date ON fuel_logs(date);
