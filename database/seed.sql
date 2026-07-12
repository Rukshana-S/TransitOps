-- 1. Seed Admin User (Password is 'demo1234', hashed using bcrypt)
INSERT INTO users (full_name, email, phone, employee_id, department, role, password) VALUES
('Alicia Diaz', 'admin@transitops.io', '+91 98765 43210', 'EMP-001', 'Fleet Management', 'Fleet Manager', '$2b$10$39hknkSQEc8mABuHk/uwc.5lXr8YumFpXGgoblhH58yXJV1VD6d1u');

-- 3. Seed Vehicles
INSERT INTO vehicles (id, reg_number, type, manufacturer, model, manufacturing_year, fuel_type, mileage, fuel, capacity, status, current_location, notes) VALUES
('V-214', 'DL-3C-AS-8812', 'Bus', 'Tata Motors', 'EV-Transit 12', 2024, 'Electric', '34,200 km', '82%', 45, 'available', 'Terminal 1', 'Standard operations route vehicle.'),
('V-198', 'MH-12-TR-9042', 'Truck', 'Ashok Leyland', 'Hybrid Cargo X', 2023, 'Hybrid', '56,900 km', '18%', 80, 'maintenance', 'Workshop 2', 'Scheduled for brake check.'),
('V-176', 'KA-51-MM-2234', 'Van', 'Mahindra', 'Cargo Express S', 2025, 'Diesel', '12,400 km', '68%', 15, 'on trip', 'NH 48 Highway', 'En route dispatch.'),
('V-150', 'HR-26-ZZ-4890', 'Bus', 'Tata Motors', 'EV-Transit 12', 2024, 'Electric', '22,800 km', '95%', 45, 'available', 'Depot Central', 'Fully charged.'),
('V-112', 'GJ-01-XX-3942', 'Truck', 'Eicher', 'Heavy Carrier Gen 2', 2022, 'Diesel', '78,400 km', '45%', 120, 'on trip', 'City Bypass', 'Towing heavy cargo.');

-- 4. Seed Drivers
INSERT INTO drivers (id, name, employee_id, license, license_expiry, phone, email, joining_date, status, safety_score) VALUES
('DR-042', 'Mina Alvarez', 'EMP-102', 'LC-DL-994821', '2027-10-18', '+91 98765 43210', 'mina@transitops.io', '2023-05-15', 'On Shift', 96),
('DR-038', 'Ravi Thakur', 'EMP-103', 'LC-MH-228491', '2026-09-22', '+91 98765 43211', 'ravi@transitops.io', '2024-02-10', 'Resting', 89),
('DR-076', 'Jordan Lee', 'EMP-104', 'LC-KA-550921', '2027-11-05', '+91 98765 43212', 'jordan@transitops.io', '2023-11-01', 'On Shift', 92),
('DR-099', 'Sarah Connor', 'EMP-105', 'LC-HR-003849', '2028-04-12', '+91 98765 43213', 'sarah@transitops.io', '2022-09-01', 'Off Duty', 98),
('DR-011', 'John Doe', 'EMP-106', 'LC-GJ-884021', '2026-07-28', '+91 98765 43214', 'john@transitops.io', '2024-06-18', 'On Shift', 82);

-- Set initial assignments
UPDATE vehicles SET assigned_driver_id = 'DR-042' WHERE id = 'V-214';
UPDATE drivers SET assigned_vehicle_id = 'V-214' WHERE id = 'DR-042';

UPDATE vehicles SET assigned_driver_id = 'DR-038' WHERE id = 'V-198';
UPDATE drivers SET assigned_vehicle_id = 'V-198' WHERE id = 'DR-038';

UPDATE vehicles SET assigned_driver_id = 'DR-076' WHERE id = 'V-176';
UPDATE drivers SET assigned_vehicle_id = 'V-176' WHERE id = 'DR-076';


-- 5. Seed Trips
INSERT INTO trips (id, vehicle, driver, cargo, pickup, destination, distance, eta, status) VALUES
('TR-1042', 'V-214 (Bus)', 'Mina Alvarez', 'Passenger Route A', 'Terminal 1', 'Suburban Plaza', '58 km', '14:20', 'In Progress'),
('TR-1038', 'V-198 (Truck)', 'Ravi Thakur', 'Heavy Electronics', 'North Depot', 'Sea Harbor Warehouse', '124 km', '16:45', 'Assigned'),
('TR-1076', 'V-176 (Van)', 'Jordan Lee', 'Cold Pharmaceuticals', 'Med Lab Hub', 'City Medical Store', '18 km', '13:05', 'Pending'),
('TR-1025', 'V-150 (Bus)', 'Sarah Connor', 'Passenger Route B', 'City Center', 'Outer Ring Plaza', '45 km', 'Completed', 'Completed'),
('TR-1011', 'V-112 (Truck)', 'John Doe', 'Construction Metal', 'Steel Factory', 'Metro Line Block 4', '85 km', 'Cancelled', 'Cancelled');

-- 6. Seed Maintenance
INSERT INTO maintenance (id, type, asset, date, cost, progress, status) VALUES
('MNT-482', 'Oil Change', 'V-214 (Bus)', '2026-07-13', '₹4,500', 85, 'Scheduled'),
('MNT-483', 'Brake Service', 'V-198 (Heavy Truck)', '2026-07-14', '₹14,200', 40, 'In Progress'),
('MNT-484', 'Tyre Replacement', 'V-176 (Van)', '2026-07-16', '₹22,000', 0, 'Scheduled'),
('MNT-485', 'Engine Inspection', 'V-112 (Truck)', '2026-07-19', '₹34,800', 10, 'Scheduled'),
('MNT-486', 'Vehicle Inspection', 'V-150 (Bus)', '2026-07-22', '₹2,500', 100, 'Completed');

-- 7. Seed Fuel Logs
INSERT INTO fuel_logs (id, asset, liters, cost, date, station, status) VALUES
('FUL-024', 'V-214 (Bus)', 180, '₹16,200', '2026-07-12', 'HP Refuel Station', 'Approved'),
('FUL-023', 'V-198 (Heavy Truck)', 240, '₹22,100', '2026-07-11', 'Indian Oil Depot', 'Approved'),
('FUL-022', 'V-176 (Van)', 65, '₹5,850', '2026-07-11', 'Bharat Petroleum', 'Approved'),
('FUL-021', 'V-112 (Truck)', 210, '₹18,900', '2026-07-10', 'HP Refuel Station', 'Pending'),
('FUL-020', 'V-150 (Bus)', 195, '₹17,550', '2026-07-09', 'Indian Oil Depot', 'Approved');

-- 8. Seed Expenses
INSERT INTO expenses (id, category, vehicle, description, amount, date, status) VALUES
('EXP-8842', 'Fuel', 'V-214', 'Diesel refuel (210L)', 24500, '2026-07-12', 'Approved'),
('EXP-8841', 'Repairs', 'V-198', 'Brake pad replacement & servicing', 18200, '2026-07-12', 'Approved'),
('EXP-8840', 'Toll & Taxes', 'V-176', 'State highway toll pass renewal', 4500, '2026-07-11', 'Pending'),
('EXP-8839', 'Insurance', 'V-102', 'Annual commercial vehicle insurance premium', 38000, '2026-07-10', 'Approved'),
('EXP-8838', 'Repairs', 'V-255', 'Engine diagnostics & sensor repair', 12900, '2026-07-09', 'Approved'),
('EXP-8837', 'Miscellaneous', 'V-114', 'Driver refreshment allowance', 2400, '2026-07-08', 'Rejected');

-- 9. Seed Reports
INSERT INTO reports (id, title, category, date, author, size, type) VALUES
('REP-904', 'Q2 Fleet Maintenance Digest', 'Maintenance', '2026-07-12', 'Alicia Diaz', '2.4 MB', 'PDF'),
('REP-903', 'June Driver Safety Scoreboard', 'Driver', '2026-07-10', 'Alicia Diaz', '1.8 MB', 'Excel'),
('REP-902', 'Weekly Fuel Consumption Audit', 'Fuel', '2026-07-08', 'System Operator', '940 KB', 'PDF'),
('REP-901', 'Monthly Operating Expense Ledger', 'Expense', '2026-07-05', 'Alicia Diaz', '4.2 MB', 'Excel'),
('REP-900', 'Active Asset Registry Audit', 'Vehicle', '2026-07-01', 'System Operator', '1.2 MB', 'PDF');

-- 10. Seed Notifications
INSERT INTO notifications (title, message, date, read) VALUES
('Maintenance Due', 'V-214 requires brake inspection in 2 days.', NOW() - INTERVAL '2 hours', false),
('License Expiry', 'Driver Ravi needs renewal before 2026-09-22.', NOW() - INTERVAL '1 day', false),
('Fuel Alert', 'V-198 is below the recommended fuel threshold.', NOW() - INTERVAL '2 days', false),
('Vehicle Breakdown', 'V-255 reported breakdown alert at NH48 corridor.', NOW() - INTERVAL '3 days', false);
