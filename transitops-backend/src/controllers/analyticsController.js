import pool from '../config/db.js';
import { compileReportFile } from '../utils/reportGenerator.js';

export const syncAnalytics = async (req, res, next) => {
  try {
    const vStats = await pool.query("SELECT status, count(*) FROM vehicles GROUP BY status");
    const dStats = await pool.query("SELECT status, count(*) FROM drivers GROUP BY status");
    const tStats = await pool.query("SELECT status, count(*) FROM trips GROUP BY status");
    
    const fuelRes = await pool.query("SELECT SUM(CAST(REGEXP_REPLACE(cost, '[^0-9.]', '', 'g') AS NUMERIC)) as total FROM fuel_logs");
    
    // Expenses is NUMERIC
    const expenseRes = await pool.query("SELECT SUM(amount) as total FROM expenses");
    
    const vActive = parseInt(vStats.rows.find(r => r.status === 'on trip' || r.status === 'available')?.count || 0);
    const vMaint = parseInt(vStats.rows.find(r => r.status === 'maintenance')?.count || 0);
    
    const totalFuelCost = parseFloat(fuelRes.rows[0].total || 0);
    const totalExpenses = parseFloat(expenseRes.rows[0].total || 0);
    const totalOpsCost = totalFuelCost + totalExpenses;

    const completedTrips = parseInt(tStats.rows.find(r => r.status === 'Completed')?.count || 0);
    const totalTrips = tStats.rows.reduce((acc, r) => acc + parseInt(r.count), 0);
    
    const activeDrivers = parseInt(dStats.rows.find(r => r.status === 'On Shift' || r.status === 'Available')?.count || 0);

    return res.status(200).json({
      fleet: {
        active: vActive,
        maintenance: vMaint,
      },
      costs: {
        fuel: totalFuelCost,
        expenses: totalExpenses,
        total: totalOpsCost
      },
      operations: {
        completedTrips,
        totalTrips,
        activeDrivers
      }
    });
  } catch (error) {
    next(error);
  }
};

export const exportAnalytics = async (req, res, next) => {
  try {
    const { type } = req.query; // csv, xlsx, json, pdf
    if (!type) {
      return res.status(400).json({ message: 'Missing export type' });
    }
    
    if (type.toLowerCase() === 'json') {
      const vStats = await pool.query("SELECT status, count(*) FROM vehicles GROUP BY status");
      return res.status(200).json({
        exportType: 'json',
        data: vStats.rows,
        timestamp: new Date().toISOString()
      });
    }

    const report = await compileReportFile('Analytics', type);
    return res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};
