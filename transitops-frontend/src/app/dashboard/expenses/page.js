'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { expenseService } from '@/services/expenseService';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download, Plus, DollarSign, Wrench, Shield, Users, MapPin, Tag, ArrowUpRight, ArrowDownRight, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { reportService } from '@/services/reportService';
import ExportModal from '@/components/ui/ExportModal';

const COLORS = ['#F66F14', '#facc15', '#38bdf8', '#a78bfa', '#f43f5e', '#10b981'];

const monthlyTrend = [
  { month: 'Jan', Fuel: 95000, Maintenance: 42000, Administrative: 28000 },
  { month: 'Feb', Fuel: 104000, Maintenance: 38000, Administrative: 31000 },
  { month: 'Mar', Fuel: 110000, Maintenance: 45000, Administrative: 29000 },
  { month: 'Apr', Fuel: 98000, Maintenance: 52000, Administrative: 34000 },
  { month: 'May', Fuel: 118000, Maintenance: 48000, Administrative: 30000 },
  { month: 'Jun', Fuel: 124500, Maintenance: 62000, Administrative: 33000 },
];

export default function ExpensesPage() {
  const { isReady, isAuthenticated, role } = useAuth();
  const isAllowed = ['Fleet Manager', 'Financial Analyst'].includes(role);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Fuel',
    vehicle: '',
    description: '',
    amount: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchExpenses();
    }
  }, [isReady, isAuthenticated]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenses();
      setExpenses(data);
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
    if (!newExpense.vehicle || !newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all fields');
      return;
    }

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
      setShowModal(false);
      setNewExpense({ category: 'Fuel', vehicle: '', description: '', amount: '', status: 'Pending' });
      toast.success('Expense recorded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense claim');
    }
  };

  const [showExportModal, setShowExportModal] = useState(false);
  const handleExport = () => {
    setShowExportModal(true);
  };

  // Dynamically group categories for allocation pie chart
  const categoriesMap = expenses.reduce((acc, exp) => {
    const amt = parseFloat(exp.amount || 0);
    acc[exp.category] = (acc[exp.category] || 0) + amt;
    return acc;
  }, {});

  const expenseCategories = Object.keys(categoriesMap).map((cat, idx) => {
    const val = categoriesMap[cat];
    const total = Object.values(categoriesMap).reduce((sum, v) => sum + v, 0);
    const pct = total > 0 ? `${Math.round((val / total) * 100)}%` : '0%';
    
    // Choose icon
    let icon = DollarSign;
    if (cat === 'Repairs') icon = Wrench;
    else if (cat === 'Insurance') icon = Shield;
    else if (cat === 'Salary') icon = Users;
    else if (cat === 'Toll & Taxes') icon = MapPin;

    return {
      name: cat,
      value: val,
      color: COLORS[idx % COLORS.length],
      percentage: pct,
      icon
    };
  });

  const totalSpend = expenseCategories.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Financial Ledger</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Fleet Expenses</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Record operations cost, repair invoices, and verify fuel spend profiles.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          {isAllowed && (
            <Button onClick={() => setShowModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          )}
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-medium uppercase tracking-wider text-[#CAC4DA]">Total Ledger Spend</p>
          <p className="mt-3 text-3xl font-bold text-white">₹{ (totalSpend / 100000).toFixed(2) } Lakhs</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
              <ArrowDownRight className="h-3 w-3" /> -2.4%
            </span>
            <span>Vs last month</span>
          </div>
        </GlassCard>
        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-medium uppercase tracking-wider text-[#CAC4DA]">Avg Spend / Vehicle</p>
          <p className="mt-3 text-3xl font-bold text-white">₹19,842</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span className="flex items-center text-rose-400 font-semibold gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +4.2%
            </span>
            <span>Increase in repairs</span>
          </div>
        </GlassCard>
        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-medium uppercase tracking-wider text-[#CAC4DA]">Approved Claims</p>
          <p className="mt-3 text-3xl font-bold text-[#10b981]">
            {expenses.length > 0 ? `${Math.round((expenses.filter(e=>e.status==='Approved').length / expenses.length) * 100)}%` : '94%'}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span>{expenses.filter(e=>e.status==='Approved').length}/{expenses.length} approved</span>
            <span>All-time</span>
          </div>
        </GlassCard>
        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-medium uppercase tracking-wider text-[#CAC4DA]">Pending Invoices</p>
          <p className="mt-3 text-3xl font-bold text-amber-400">
            {expenses.filter(e=>e.status==='Pending').length} Invoices
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span>Est. ₹1.1 Lakhs</span>
            <span>Awaiting signature</span>
          </div>
        </GlassCard>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#F66F14] animate-spin" />
        </div>
      ) : error ? (
        <GlassCard className="p-8 text-center text-rose-400">
          <p>Failed to load expense records. Please verify database connectivity.</p>
        </GlassCard>
      ) : (
        <>
          {/* Charts section */}
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <GlassCard className="p-5" hover={false}>
              <h3 className="text-lg font-bold text-white mb-1">Expense Allocation</h3>
              <p className="text-xs text-[#CAC4DA] mb-6">Visual split of all operating expense claims</p>
              <div className="grid md:grid-cols-[1fr_1.1fr] gap-6 items-center">
                <div className="h-60 relative flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0c0f17',
                          borderColor: 'rgba(247,114,24,0.15)',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Cost']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xs text-[#CAC4DA]">Total Ledger</span>
                    <span className="text-xl font-bold text-white">₹{ (totalSpend / 100000).toFixed(1) }L</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {expenseCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.name} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg border border-[rgba(247,114,24,0.15)]" style={{ backgroundColor: `${category.color}15`, color: category.color }}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{category.name}</p>
                            <p className="text-[10px] text-[#CAC4DA]">{category.percentage} allocation</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white">₹{category.value.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5" hover={false}>
              <h3 className="text-lg font-bold text-white mb-1">Monthly Cost Trend</h3>
              <p className="text-xs text-[#CAC4DA] mb-6">Stacked operating expenses over last six months</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                    <YAxis tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0c0f17',
                        borderColor: 'rgba(247,114,24,0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="Fuel" stackId="a" fill="#F66F14" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Maintenance" stackId="a" fill="#facc15" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Administrative" stackId="a" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Ledger Table */}
          <GlassCard className="p-5" hover={false}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                <p className="text-xs text-[#CAC4DA]">Realtime operational expense feed</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-[#CAC4DA] text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Expense Code</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Asset</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 font-mono text-white text-xs">{exp.id}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-white font-medium">{exp.vehicle}</td>
                      <td className="px-4 py-3.5 text-[#CAC4DA] text-xs max-w-xs truncate">{exp.description}</td>
                      <td className="px-4 py-3.5 font-bold text-white">₹{exp.amount.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-[#CAC4DA] text-xs">
                        {new Date(exp.date).toISOString().split('T')[0]}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          exp.status === 'Approved' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                          exp.status === 'Pending' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                          'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-[#CAC4DA]">
                        No expenses logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4">
          <GlassCard className="w-full max-w-md p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Record Fleet Expense</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[#CAC4DA] hover:text-white border border-transparent hover:border-white/10 p-1.5 rounded-lg transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-[#CAC4DA] mb-6">Ensure invoice or receipt reference is added below.</p>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
                >
                  <option value="Fuel">Fuel</option>
                  <option value="Repairs">Repairs</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Salary">Salary</option>
                  <option value="Toll & Taxes">Toll & Taxes</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Asset Reference</label>
                <input
                  type="text"
                  placeholder="e.g. V-214"
                  value={newExpense.vehicle}
                  onChange={(e) => setNewExpense({ ...newExpense, vehicle: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Amount (INR)</label>
                <input
                  type="number"
                  placeholder="Amount in ₹"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Battery replacement & diagnostics"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Save Claim
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Expenses Log"
        onExport={async (format) => {
          try {
            const report = await reportService.compileReport('Expense', format, 'Expense Operations Audit');
            toast.success('Report compiled successfully! Download starting.');
            window.open(report.file_url, '_blank');
          } catch (err) {
            toast.error('Failed to export expenses report');
          }
        }}
      />
    </div>
  );
}
