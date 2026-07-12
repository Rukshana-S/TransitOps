'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { 
  BarChart2, TrendingUp, Compass, Calendar, Download, 
  MapPin, Clock, ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import toast from 'react-hot-toast';
import api from '@/services/api';

const weekData = [
  { day: 'Mon', active: 85, maintenance: 15, idle: 12 },
  { day: 'Tue', active: 92, maintenance: 15, idle: 8 },
  { day: 'Wed', active: 89, maintenance: 17, idle: 9 },
  { day: 'Thu', active: 94, maintenance: 12, idle: 10 },
  { day: 'Fri', active: 96, maintenance: 12, idle: 6 },
  { day: 'Sat', active: 78, maintenance: 19, idle: 17 },
  { day: 'Sun', active: 62, maintenance: 21, idle: 28 },
];

const efficiencyData = [
  { name: 'Route A', efficiency: 94 },
  { name: 'Route B', efficiency: 88 },
  { name: 'Route C', efficiency: 91 },
  { name: 'Route D', efficiency: 85 },
  { name: 'Route E', efficiency: 82 },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('Weekly');
  const [stats, setStats] = useState({
    fleet: { active: 17, maintenance: 3 },
    costs: { fuel: 12400, expenses: 0, total: 12400 },
    operations: { completedTrips: 45, totalTrips: 50, activeDrivers: 18 }
  });

  useEffect(() => {
    handleSync(true); // pass true for silent sync on mount
  }, []);

  const handleExport = async (type) => {
    try {
      toast.loading(`Compiling ${type.toUpperCase()} analytics report...`);
      const res = await api.get(`/analytics/export?type=${type}`);
      toast.dismiss();
      toast.success('Report successfully compiled and ready for download.');
      if (res.data.fileUrl || res.data.file_url) {
        window.open(res.data.fileUrl || res.data.file_url, '_blank');
      } else if (type === 'json') {
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (err) {
      toast.dismiss();
      toast.error(`Failed to export ${type} analytics`);
    }
  };

  const handleSync = async (silent = false) => {
    try {
      if (!silent) toast.loading('Synchronizing analytics with PostgreSQL...');
      const res = await api.get('/analytics/sync');
      setStats(res.data);
      if (!silent) {
        toast.dismiss();
        toast.success('Analytics synchronized successfully');
      }
    } catch (err) {
      if (!silent) {
        toast.dismiss();
        toast.error('Failed to sync analytics');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Operations Intel</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Performance Analytics</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Analyze dispatcher logs, compare route performance patterns, and check vehicle uptime.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button variant="secondary" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={handleSync}>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" style={{ animationDuration: '4s' }} /> Sync Data
          </Button>
        </div>
      </div>

      {/* Mini KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">Total Operations Cost</p>
          <p className="mt-3 text-3xl font-bold text-white font-mono">₹{stats.costs.total.toLocaleString()}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
              <ArrowDownRight className="h-3 w-3" /> Synced
            </span>
            <span>Fuel + Expenses</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">Active Fleet</p>
          <p className="mt-3 text-3xl font-bold text-white font-mono">{stats.fleet.active}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span className="flex items-center text-sky-400 font-semibold gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> Live
            </span>
            <span>Vehicles Available</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">Trips Completed</p>
          <p className="mt-3 text-3xl font-bold text-white font-mono">{stats.operations.completedTrips}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span className="flex items-center text-emerald-400 font-semibold gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> 100%
            </span>
            <span>Out of {stats.operations.totalTrips} Total</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5" hover={true}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">Active Operators</p>
          <p className="mt-3 text-3xl font-bold text-[#F66F14] font-mono">{stats.operations.activeDrivers}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-[#CAC4DA]">
            <span>Drivers Available</span>
            <span>Synced</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Weekly Stacked Active/Idle Chart */}
        <GlassCard className="p-5" hover={false}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Fleet Allocation Split</h3>
              <p className="text-xs text-[#CAC4DA]">Detailed tracking of active vs repair workshop assets</p>
            </div>
            <div className="flex rounded-xl bg-black/30 border border-white/5 p-1 text-xs">
              {['Weekly', 'Monthly'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setTimeframe(opt)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${timeframe === opt ? 'bg-[#F66F14] text-white shadow-md' : 'text-[#CAC4DA] hover:text-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0c0f17', 
                    borderColor: 'rgba(247,114,24,0.15)', 
                    borderRadius: '12px',
                    color: '#white' 
                  }} 
                />
                <Legend tick={{ fill: '#CAC4DA', fontSize: 10 }} />
                <Bar dataKey="active" stackId="a" fill="#F66F14" name="Active On Route" />
                <Bar dataKey="idle" stackId="a" fill="#38bdf8" name="Idle / Standby" />
                <Bar dataKey="maintenance" stackId="a" fill="#f43f5e" name="Workshop Maintenance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Route Efficiency */}
        <GlassCard className="p-5" hover={false}>
          <h3 className="text-lg font-bold text-white mb-2">Route Dispatch Safety Index</h3>
          <p className="text-xs text-[#CAC4DA] mb-6">Percentage safety compliance by route sectors</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={efficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F66F14" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F66F14" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#CAC4DA', fontSize: 10 }} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0c0f17', 
                    borderColor: 'rgba(247,114,24,0.15)', 
                    borderRadius: '12px',
                    color: '#white' 
                  }} 
                />
                <Area type="monotone" dataKey="efficiency" name="Safety %" stroke="#F66F14" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEff)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
