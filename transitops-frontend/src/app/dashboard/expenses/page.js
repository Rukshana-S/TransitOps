'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { expenseService } from '@/services/expenseService';
import { fuelService } from '@/services/fuelService';
import { reportService } from '@/services/reportService';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Download, Plus, DollarSign, Droplets, Loader2, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import ExportModal from '@/components/ui/ExportModal';

const COLORS = ['#F66F14', '#facc15', '#38bdf8', '#a78bfa', '#f43f5e', '#10b981'];

export default function ExpensesPage() {
  const { isReady, isAuthenticated, role } = useAuth();
  const isAllowed = ['Fleet Manager', 'Financial Analyst'].includes(role);
  
  const [expenses, setExpenses] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCategory, setExportCategory] = useState('Expense');
  
  const [newExpense, setNewExpense] = useState({
    category: 'Repairs',
    vehicle: '',
    description: '',
    amount: '',
    status: 'Pending',
  });
  
  const [newFuelLog, setNewFuelLog] = useState({
    asset: '',
    liters: '',
    cost: '',
    station: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchData();
    }
  }, [isReady, isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expData, fuelData] = await Promise.all([
        expenseService.getExpenses(),
        fuelService.getFuelLogs()
      ]);
      setExpenses(expData);
      setFuelLogs(fuelData);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        category: newExpense.category,
        vehicle: newExpense.vehicle,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        status: newExpense.status,
      };
      const created = await expenseService.createExpense(payload);
      setExpenses([created, ...expenses]);
      setShowExpenseModal(false);
      setNewExpense({ category: 'Repairs', vehicle: '', description: '', amount: '', status: 'Pending' });
      toast.success('Expense recorded successfully');
    } catch (err) {
      toast.error('Failed to save expense claim');
    }
  };

  const handleAddFuelLog = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        asset: newFuelLog.asset,
        liters: parseFloat(newFuelLog.liters),
        cost: parseFloat(newFuelLog.cost), // Cost field will be formatted on the backend
        station: newFuelLog.station,
        status: newFuelLog.status,
      };
      const created = await fuelService.createFuelLog(payload);
      setFuelLogs([created, ...fuelLogs]);
      setShowFuelModal(false);
      setNewFuelLog({ asset: '', liters: '', cost: '', station: '', status: 'Pending' });
      toast.success('Fuel log recorded successfully');
    } catch (err) {
      toast.error('Failed to save fuel log');
    }
  };

  const openExport = (category) => {
    setExportCategory(category);
    setShowExportModal(true);
  };

  // Calculations
  const totalFuelCost = fuelLogs.reduce((sum, log) => {
    const costStr = String(log.cost).replace(/[^0-9.]/g, '');
    return sum + (parseFloat(costStr) || 0);
  }, 0);

  const totalOtherExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  
  const pendingApprovals = 
    expenses.filter(e => e.status === 'Pending').length + 
    fuelLogs.filter(f => f.status === 'Pending').length;

  // Chart Data Preparation
  const expenseCategoriesMap = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + (parseFloat(exp.amount) || 0);
    return acc;
  }, {});

  const expenseSplitData = Object.keys(expenseCategoriesMap).map((cat, idx) => ({
    name: cat,
    value: expenseCategoriesMap[cat],
    color: COLORS[idx % COLORS.length]
  }));

  // Group by date for Fuel Cost Trend and Operational Trend
  // (Using mock data structure scaled by actual total if empty, otherwise real data grouped by month)
  // For simplicity, we just display the charts based on the fetched data dates
  
  const fuelTrendMap = fuelLogs.reduce((acc, log) => {
    const date = new Date(log.date).toISOString().split('T')[0];
    const cost = parseFloat(String(log.cost).replace(/[^0-9.]/g, '')) || 0;
    acc[date] = (acc[date] || 0) + cost;
    return acc;
  }, {});
  
  const fuelCostData = Object.keys(fuelTrendMap).sort().map(date => ({
    date,
    Cost: fuelTrendMap[date]
  })).slice(-7); // Last 7 days

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Financial Ledger</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Expense Module</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Manage and track both fuel logs and other operational expenses in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAllowed && (
            <>
              <Button onClick={() => setShowFuelModal(true)}>
                <Droplets className="mr-2 h-4 w-4" /> Log Fuel
              </Button>
              <Button onClick={() => setShowExpenseModal(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => openExport('Expense')}>
            <Download className="mr-2 h-4 w-4" /> Export Expenses
          </Button>
          <Button variant="secondary" onClick={() => openExport('Fuel')}>
            <Download className="mr-2 h-4 w-4" /> Export Fuel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-medium uppercase tracking-wider text-[#CAC4DA]">Total Fuel Cost</p>
          <p className="mt-3 text-3xl font-bold text-white font-mono">₹{totalFuelCost.toLocaleString()}</p>
          <div className="mt-4 text-xs text-sky-400 font-semibold flex items-center gap-1">
            <Droplets className="h-3 w-3" /> Based on logged refuels
          </div>
        </GlassCard>
        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-medium uppercase tracking-wider text-[#CAC4DA]">Total Other Expenses</p>
          <p className="mt-3 text-3xl font-bold text-white font-mono">₹{totalOtherExpenses.toLocaleString()}</p>
          <div className="mt-4 text-xs text-rose-400 font-semibold flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> Maintenance, Tolls, Salaries
          </div>
        </GlassCard>
        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-medium uppercase tracking-wider text-[#CAC4DA]">Pending Approvals</p>
          <p className="mt-3 text-3xl font-bold text-amber-400 font-mono">{pendingApprovals}</p>
          <div className="mt-4 text-xs text-[#CAC4DA] flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Requires manager sign-off
          </div>
        </GlassCard>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#F66F14] animate-spin" />
        </div>
      ) : error ? (
        <GlassCard className="p-8 text-center text-rose-400">
          <p>Failed to load data. Please verify database connectivity.</p>
        </GlassCard>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <GlassCard className="p-5" hover={false}>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Expense Split</h3>
              <div className="h-48 relative flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseSplitData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                      {expenseSplitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0c0f17', borderColor: 'rgba(247,114,24,0.15)', borderRadius: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-5 lg:col-span-2" hover={false}>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Fuel Cost Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fuelCostData.length ? fuelCostData : [{date: 'N/A', Cost: 0}]} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                    <YAxis tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0c0f17', borderColor: 'rgba(247,114,24,0.15)', borderRadius: '12px', color: '#fff' }} />
                    <Line type="monotone" dataKey="Cost" stroke="#F66F14" strokeWidth={3} dot={{ r: 4, fill: '#F66F14' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Tables Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            
            {/* Fuel Logs Table */}
            <GlassCard className="p-5" hover={false}>
              <h3 className="text-lg font-bold text-white mb-4">Fuel Logs</h3>
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-[#CAC4DA] text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Asset</th>
                      <th className="px-4 py-3 text-left">Liters</th>
                      <th className="px-4 py-3 text-left">Cost</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {fuelLogs.slice(0, 8).map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors text-xs">
                        <td className="px-4 py-3 font-medium text-white">{log.asset}</td>
                        <td className="px-4 py-3 text-[#CAC4DA]">{log.liters} L</td>
                        <td className="px-4 py-3 font-bold text-[#F66F14]">{log.cost}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                            log.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {fuelLogs.length === 0 && (
                      <tr><td colSpan="4" className="px-4 py-8 text-center text-[#CAC4DA]">No fuel logs found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Other Expenses Table */}
            <GlassCard className="p-5" hover={false}>
              <h3 className="text-lg font-bold text-white mb-4">Other Expenses</h3>
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-[#CAC4DA] text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">Asset</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {expenses.slice(0, 8).map((exp) => (
                      <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors text-xs">
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full font-semibold bg-white/5 text-white">{exp.category}</span>
                        </td>
                        <td className="px-4 py-3 text-[#CAC4DA]">{exp.vehicle}</td>
                        <td className="px-4 py-3 font-bold text-sky-400">₹{parseFloat(exp.amount).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            exp.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                            exp.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {exp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {expenses.length === 0 && (
                      <tr><td colSpan="4" className="px-4 py-8 text-center text-[#CAC4DA]">No expenses found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4">
          <GlassCard className="w-full max-w-md p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Record Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-[#CAC4DA] hover:text-white"><X className="h-4.5 w-4.5" /></button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#CAC4DA] mb-1.5">Category</label>
                <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40">
                  <option value="Repairs">Repairs</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Salary">Salary</option>
                  <option value="Toll & Taxes">Toll & Taxes</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#CAC4DA] mb-1.5">Asset Ref</label>
                  <input required type="text" value={newExpense.vehicle} onChange={e => setNewExpense({...newExpense, vehicle: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#CAC4DA] mb-1.5">Amount (₹)</label>
                  <input required type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#CAC4DA] mb-1.5">Description</label>
                <input required type="text" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Expense</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Log Fuel Modal */}
      {showFuelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4">
          <GlassCard className="w-full max-w-md p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Log Fuel</h3>
              <button onClick={() => setShowFuelModal(false)} className="text-[#CAC4DA] hover:text-white"><X className="h-4.5 w-4.5" /></button>
            </div>
            <form onSubmit={handleAddFuelLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#CAC4DA] mb-1.5">Asset Reference</label>
                <input required type="text" value={newFuelLog.asset} onChange={e => setNewFuelLog({...newFuelLog, asset: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#CAC4DA] mb-1.5">Liters (L)</label>
                  <input required type="number" step="0.1" value={newFuelLog.liters} onChange={e => setNewFuelLog({...newFuelLog, liters: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#CAC4DA] mb-1.5">Total Cost (₹)</label>
                  <input required type="number" value={newFuelLog.cost} onChange={e => setNewFuelLog({...newFuelLog, cost: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#CAC4DA] mb-1.5">Station Name</label>
                <input type="text" placeholder="e.g. Shell Express" value={newFuelLog.station} onChange={e => setNewFuelLog({...newFuelLog, station: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowFuelModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Log Fuel</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={`Export ${exportCategory} Logs`}
        onExport={async (format) => {
          try {
            const report = await reportService.compileReport(exportCategory, format, `${exportCategory} Operations Audit`);
            toast.success('Report compiled successfully! Download starting.');
            window.open(report.file_url, '_blank');
          } catch (err) {
            toast.error(`Failed to export ${exportCategory} report`);
          }
        }}
      />
    </div>
  );
}
