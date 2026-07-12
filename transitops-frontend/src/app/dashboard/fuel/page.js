'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { fuelService } from '@/services/fuelService';
import { 
  Fuel, Droplet, DollarSign, Activity, Percent, Plus, 
  Search, ArrowUpRight, ArrowDownRight, Download, X, Loader2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { reportService } from '@/services/reportService';
import ExportModal from '@/components/ui/ExportModal';

const fuelTrendData = [
  { month: 'Jan', consumption: 2100, cost: 189 },
  { month: 'Feb', consumption: 2300, cost: 207 },
  { month: 'Mar', consumption: 1950, cost: 175 },
  { month: 'Apr', consumption: 2400, cost: 216 },
  { month: 'May', consumption: 2600, cost: 234 },
  { month: 'Jun', consumption: 2850, cost: 256 },
];

export default function FuelPage() {
  const { isReady, isAuthenticated, role } = useAuth();
  const isAllowed = ['Fleet Manager', 'Financial Analyst'].includes(role);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLog, setNewLog] = useState({
    asset: '',
    liters: '',
    cost: '',
    station: 'HP Refuel Station',
    status: 'Pending',
  });

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchFuelLogs();
    }
  }, [isReady, isAuthenticated]);

  const fetchFuelLogs = async () => {
    try {
      setLoading(true);
      const data = await fuelService.getFuelLogs();
      setLogs(data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newLog.asset || !newLog.liters || !newLog.cost) {
      toast.error('Please fill in vehicle, liters, and total cost');
      return;
    }

    try {
      const payload = {
        asset: newLog.asset,
        liters: parseFloat(newLog.liters),
        cost: newLog.cost,
        station: newLog.station,
        status: newLog.status,
      };

      const created = await fuelService.createFuelLog(payload);
      setLogs([created, ...logs]);
      setShowAddModal(false);
      setNewLog({
        asset: '',
        liters: '',
        cost: '',
        station: 'HP Refuel Station',
        status: 'Pending',
      });
      toast.success('Refuel session logged');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record refuel log');
    }
  };

  const [showExportModal, setShowExportModal] = useState(false);
  const handleExport = () => {
    setShowExportModal(true);
  };

  // Calculate dynamic summaries
  const totalVolume = logs.reduce((sum, log) => sum + parseFloat(log.liters || 0), 0);
  const totalCostVal = logs.reduce((sum, log) => {
    const rawNum = parseInt(log.cost?.replace(/[^0-9]/g, '') || 0);
    return sum + rawNum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Fuel Telemetry</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Fuel Command</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Verify refuels, log station invoice values, and analyze economy metrics.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Download Logs
          </Button>
          {isAllowed && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Log Refuel
            </Button>
          )}
        </div>
      </div>

      {/* Fuel KPI Panel */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">Fuel Purchased</p>
          <p className="mt-3 text-3xl font-bold text-white">{totalVolume > 0 ? `${totalVolume.toLocaleString()} L` : '890 L'}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
              <ArrowDownRight className="h-3 w-3" /> -4.5%
            </span>
            <span>Vs last week</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">Fuel Cost</p>
          <p className="mt-3 text-3xl font-bold text-white">₹{totalCostVal > 0 ? totalCostVal.toLocaleString() : '80,550'}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span className="flex items-center text-rose-400 font-semibold gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +2.1%
            </span>
            <span>Due to price hike</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">Fleet Average Mileage</p>
          <p className="mt-3 text-3xl font-bold text-white">12.4 km/L</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +0.8 km/L
            </span>
            <span>Better routing</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">Thermal Efficiency</p>
          <p className="mt-3 text-3xl font-bold text-[#F66F14]">84.2%</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span>Optimal Engine tune</span>
            <span>Target: 85%</span>
          </div>
        </GlassCard>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#F66F14] animate-spin" />
        </div>
      ) : error ? (
        <GlassCard className="p-8 text-center text-rose-400">
          <p>Failed to load fuel logs. Please verify database connectivity.</p>
        </GlassCard>
      ) : (
        <>
          {/* Charts & Trends */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Monthly Fuel Trend Chart */}
            <GlassCard className="p-5" hover={false}>
              <h3 className="text-lg font-bold text-white mb-2">Monthly Fuel Trend</h3>
              <p className="text-xs text-[#CAC4DA] mb-6">Fuel volume and total spending trends over the last six months</p>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fuelTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F66F14" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F66F14" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                    <YAxis yAxisId="left" tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0c0f17', 
                        borderColor: 'rgba(247,114,24,0.15)', 
                        borderRadius: '12px',
                        color: '#white' 
                      }} 
                    />
                    <Area yAxisId="left" type="monotone" dataKey="consumption" name="Volume (L)" stroke="#F66F14" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFuel)" />
                    <Area yAxisId="right" type="monotone" dataKey="cost" name="Cost (₹k)" stroke="#38bdf8" strokeWidth={1.5} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Refuel Station Split */}
            <GlassCard className="p-5" hover={false}>
              <h3 className="text-lg font-bold text-white mb-2">Fuel Vendor Distribution</h3>
              <p className="text-xs text-[#CAC4DA] mb-6">Refuel operations volume split by vendor partners</p>
              
              <div className="space-y-4">
                {[
                  { name: 'HP Refuel Station', volume: '1,450 Liters', share: '51%', color: 'bg-[#F66F14]' },
                  { name: 'Indian Oil Depot', volume: '980 Liters', share: '34%', color: 'bg-sky-400' },
                  { name: 'Bharat Petroleum', volume: '420 Liters', share: '15%', color: 'bg-amber-400' },
                ].map((vendor, idx) => (
                  <div key={idx} className="space-y-2 p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">{vendor.name}</span>
                      <span className="text-[#CAC4DA]">{vendor.volume} ({vendor.share})</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full ${vendor.color}`} style={{ width: vendor.share }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Fuel logs table */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">Refuel Log Feed</h3>
              <p className="text-xs text-[#CAC4DA]">Realtime record of active fleet tank refills</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-[#CAC4DA] text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Refuel Code</th>
                    <th className="px-4 py-3 text-left">Asset</th>
                    <th className="px-4 py-3 text-left">Volume</th>
                    <th className="px-4 py-3 text-left">Invoice Cost</th>
                    <th className="px-4 py-3 text-left">Vendor Station</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 font-mono text-white text-xs">{log.id}</td>
                      <td className="px-4 py-3.5 text-white font-medium">{log.asset}</td>
                      <td className="px-4 py-3.5 text-white font-semibold font-mono">{log.liters} L</td>
                      <td className="px-4 py-3.5 text-white font-bold">{log.cost}</td>
                      <td className="px-4 py-3.5 text-[#CAC4DA] text-xs">{log.station}</td>
                      <td className="px-4 py-3.5 text-[#CAC4DA] text-xs">
                        {new Date(log.date).toISOString().split('T')[0]}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.status === 'Approved' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                          'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-[#CAC4DA]">
                        No fuel logs registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}

      {/* Log Refuel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4">
          <GlassCard className="w-full max-w-md p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Record Refuel Invoice</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#CAC4DA] hover:text-white border border-transparent hover:border-white/10 p-1.5 rounded-lg transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-[#CAC4DA] mb-6">Enter gallons or liters along with HP/IOC receipts.</p>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Asset Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. V-214"
                  value={newLog.asset}
                  onChange={(e) => setNewLog({ ...newLog, asset: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Liters *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 180"
                    value={newLog.liters}
                    onChange={(e) => setNewLog({ ...newLog, liters: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Total Cost (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 16200"
                    value={newLog.cost}
                    onChange={(e) => setNewLog({ ...newLog, cost: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Refuel Station Vendor</label>
                <select
                  value={newLog.station}
                  onChange={(e) => setNewLog({ ...newLog, station: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
                >
                  <option value="HP Refuel Station">HP Refuel Station</option>
                  <option value="Indian Oil Depot">Indian Oil Depot</option>
                  <option value="Bharat Petroleum">Bharat Petroleum</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Log Refuel
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Fuel Logs"
        onExport={async (format) => {
          try {
            const report = await reportService.compileReport('Fuel', format, 'Fuel Fleet Consumption Logs');
            toast.success('Report compiled successfully! Download starting.');
            window.open(report.file_url, '_blank');
          } catch (err) {
            toast.error('Failed to export fuel report');
          }
        }}
      />
    </div>
  );
}
