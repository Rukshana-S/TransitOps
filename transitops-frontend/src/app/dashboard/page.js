'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Bus, Users, Fuel, Wallet, Wrench, Navigation, AlertTriangle, 
  TrendingUp, Compass, CloudSun, Calendar, Plus, FileText, ArrowRight,
  TrendingDown, CheckCircle2, ShieldCheck, MapPin, Settings2, BarChart2, Loader2, Star
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import DashboardCard from '@/components/ui/DashboardCard';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { dashboardService } from '@/services/dashboardService';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

// Color map for charts
const COLORS = ['#F66F14', '#38bdf8', '#facc15', '#f43f5e', '#a78bfa', '#10b981'];

export default function DashboardPage() {
  const { isReady, isAuthenticated } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [mapDetails, setMapDetails] = useState({ activeId: 'TR-102', speed: 64, cargo: 'Medical Supplies' });
  const canvasRef = useRef(null);

  // Live state from PostgreSQL API
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Time stamp update
  useEffect(() => {
    const d = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(d.toLocaleDateString('en-US', options));
  }, []);

  // Fetch PostgreSQL dynamic details
  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchDashboardOverview();
    }
  }, [isReady, isAuthenticated]);

  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getOverview();
      setOverview(data);
      setError(false);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Map Animation Logic (HTML5 Canvas simulation of live route)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle scaling for high DPI screens
    const width = 800;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Draw parameters
    let t = 0;
    
    // Simulating 3 route paths
    const route1 = [
      { x: 100, y: 150 },
      { x: 220, y: 120 },
      { x: 380, y: 220 },
      { x: 500, y: 140 },
      { x: 680, y: 250 },
    ];
    const route2 = [
      { x: 150, y: 280 },
      { x: 280, y: 210 },
      { x: 420, y: 290 },
      { x: 580, y: 220 },
      { x: 720, y: 310 },
    ];

    const getBezierPoint = (pts, ratio) => {
      const idx = Math.floor(ratio * (pts.length - 1));
      const nextIdx = Math.min(pts.length - 1, idx + 1);
      const innerRatio = (ratio * (pts.length - 1)) - idx;
      const p1 = pts[idx];
      const p2 = pts[nextIdx];
      return {
        x: p1.x + (p2.x - p1.x) * innerRatio,
        y: p1.y + (p2.y - p1.y) * innerRatio,
      };
    };

    const drawMap = () => {
      t = (t + 0.0006) % 1.0;
      
      // Clear
      ctx.fillStyle = '#060910';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Route 1 Path (Transit Line)
      ctx.beginPath();
      ctx.moveTo(route1[0].x, route1[0].y);
      for (let i = 1; i < route1.length; i++) {
        ctx.lineTo(route1[i].x, route1[i].y);
      }
      ctx.strokeStyle = 'rgba(246, 111, 20, 0.2)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Draw Route 2 Path (Commercial Highway)
      ctx.beginPath();
      ctx.moveTo(route2[0].x, route2[0].y);
      for (let i = 1; i < route2.length; i++) {
        ctx.lineTo(route2[i].x, route2[i].y);
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Vehicle 1 (Orange Truck)
      const v1 = getBezierPoint(route1, t);
      ctx.beginPath();
      ctx.arc(v1.x, v1.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#F66F14';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#F66F14';
      ctx.fill();
      ctx.shadowBlur = 0; // reset
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vehicle 2 (Blue Van)
      const v2 = getBezierPoint(route2, (t + 0.4) % 1.0);
      ctx.beginPath();
      ctx.arc(v2.x, v2.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0; // reset
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Update telemetry display
      if (Math.random() < 0.05) {
        setMapDetails({
          activeId: t < 0.5 ? 'TR-1042 (Cargo Truck)' : 'TR-1038 (Heavy Truck)',
          speed: Math.floor(58 + Math.random() * 15),
          cargo: t < 0.5 ? 'Electronics Freight' : 'Passenger Commute Route A',
        });
      }

      animationFrameId = requestAnimationFrame(drawMap);
    };

    drawMap();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleAction = (name) => {
    toast.success(`Redirecting to action: ${name}`);
  };

  const getKpiIcon = (title) => {
    switch (title) {
      case 'Total Vehicles': return Bus;
      case 'Available': return CheckCircle2;
      case 'On Trip': return Navigation;
      case 'Maintenance': return Wrench;
      case 'Drivers': return Users;
      case 'Fuel Used': return Fuel;
      case 'Monthly Expense': return Wallet;
      default: return TrendingUp;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-10 w-10 text-[#F66F14] animate-spin" />
      </div>
    );
  }

  if (error || !overview) {
    return (
      <GlassCard className="p-8 text-center text-rose-400">
        <p>Failed to load dashboard metrics. Please verify PostgreSQL connection status.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.18),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F66F14]">TransitOps Operations</p>
          <h2 className="mt-1 text-3xl font-extrabold text-white tracking-tight">Smart Control Center</h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-[#CAC4DA]">
            <Calendar className="h-4 w-4 text-[#F66F14]" />
            <span>{currentDate || 'Sunday, July 12, 2026'}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => handleAction('Generate Report')}>
            <FileText className="mr-2 h-4 w-4" /> Reports
          </Button>
          <Button onClick={() => handleAction('Quick Dispatch')}>
            <Plus className="mr-2 h-4 w-4" /> Schedule Trip
          </Button>
        </div>
      </div>

      {/* 8 Premium KPI Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        {overview.kpis.map((kpi) => (
          <DashboardCard 
            key={kpi.id} 
            title={kpi.title} 
            value={kpi.value} 
            detail={kpi.detail} 
            icon={getKpiIcon(kpi.title)} 
            trend={kpi.trend} 
          />
        ))}
      </div>

      {/* Main Grid: Left is charts/map, right is widgets */}
      <div className="grid gap-6 xl:grid-cols-4">
        
        {/* Left Column span-3 */}
        <div className="space-y-6 xl:col-span-3">
          
          {/* Live GPS Panel */}
          <GlassCard className="p-5 overflow-hidden" hover={false}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="h-5 w-5 text-[#F66F14] animate-spin" style={{ animationDuration: '6s' }} />
                  Live GPS Fleet Network
                </h3>
                <p className="text-xs text-[#CAC4DA]">Realtime dispatch tracks & telemetry</p>
              </div>
              <div className="flex gap-4 rounded-xl bg-black/40 border border-white/5 px-3 py-1.5 text-xs">
                <div>
                  <span className="text-[#CAC4DA] block text-[9px] uppercase">Active Track</span>
                  <span className="font-semibold text-[#F66F14]">{mapDetails.activeId}</span>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <span className="text-[#CAC4DA] block text-[9px] uppercase">Speed</span>
                  <span className="font-semibold text-emerald-400">{mapDetails.speed} km/h</span>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <span className="text-[#CAC4DA] block text-[9px] uppercase">Cargo status</span>
                  <span className="font-semibold text-white truncate max-w-[100px] block">{mapDetails.cargo}</span>
                </div>
              </div>
            </div>

            {/* Simulated Track Canvas */}
            <div className="relative rounded-2xl border border-white/5 bg-[#060910] p-1.5 shadow-[inner_0_0_20px_black]">
              <canvas ref={canvasRef} className="w-full h-[320px] rounded-xl" />
              {/* Overlay Weather/Location indicator */}
              <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-black/75 border border-white/10 p-3 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F66F14]/20 border border-[rgba(247,114,24,0.2)]">
                  <CloudSun className="h-5 w-5 text-[#F66F14]" />
                </div>
                <div className="text-xs text-[#CAC4DA]">
                  <p className="font-semibold text-white">Route Overhaul Status</p>
                  <p className="text-[10px]">Weather: Clear • Traffic: Optimal</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Double Column Chart Panel */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Fleet Capacity Trend Chart */}
            <GlassCard className="p-5" hover={false}>
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Fleet Capacity Utilization</h3>
                <p className="text-xs text-[#CAC4DA]">Live timeline occupancy index percentage</p>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overview.utilization} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <Line type="monotone" dataKey="utilization" stroke="#F66F14" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Fuel Consumption Bar Chart */}
            <GlassCard className="p-5" hover={false}>
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Fuel Consumption Trend</h3>
                <p className="text-xs text-[#CAC4DA]">Diesel volume logs in Liters</p>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview.fuel} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <Bar dataKey="consumption" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

          </div>

          {/* Kanban / Table Panel for active trips */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Live Dispatches</h3>
                <p className="text-xs text-[#CAC4DA]">Live operational routes tracker</p>
              </div>
              <Button variant="secondary" className="px-3 py-1.5 text-xs rounded-xl" onClick={() => handleAction('Dispatch Panel')}>
                Dispatch Room <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.01]">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-[#CAC4DA] text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Route ID</th>
                    <th className="px-4 py-3 text-left">Operator</th>
                    <th className="px-4 py-3 text-left">Vehicle Asset</th>
                    <th className="px-4 py-3 text-left">Routing</th>
                    <th className="px-4 py-3 text-left">Odometer</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {overview.tripsTable.map((trip) => (
                    <tr key={trip.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 font-mono text-white text-xs font-bold">{trip.id}</td>
                      <td className="px-4 py-3.5 text-white font-medium">{trip.driver}</td>
                      <td className="px-4 py-3.5 text-[#CAC4DA] font-mono text-xs">{trip.vehicle}</td>
                      <td className="px-4 py-3.5 text-white">
                        <div className="text-xs font-semibold">{trip.source} ➔ {trip.destination}</div>
                      </td>
                      <td className="px-4 py-3.5 text-[#CAC4DA] text-xs font-mono">{trip.distance}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          trip.status === 'Completed' || trip.status === 'completed' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                          trip.status === 'In Progress' || trip.status === 'active' ? 'bg-[#F66F14]/10 border border-[#F66F14]/20 text-[#F66F14]' :
                          'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                        }`}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Widgets / Quick actions */}
        <div className="space-y-6">
          
          {/* Notifications feed */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Incident Alerts</h3>
                <p className="text-xs text-[#CAC4DA]">Live warnings and notices</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            </div>

            <div className="space-y-3">
              {overview.notifications.map((notif, idx) => (
                <div key={idx} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.01] p-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 h-fit shrink-0">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                    <p className="text-[11px] text-[#CAC4DA] mt-0.5 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Trip Status donut/pie chart */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4">
              <h3 className="text-base font-bold text-white">Trip Dispatch Split</h3>
              <p className="text-xs text-[#CAC4DA]">Current active route split percentage</p>
            </div>
            <div className="grid grid-cols-[1fr_0.9fr] gap-4 items-center">
              <div className="h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overview.tripStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {overview.tripStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0c0f17', 
                        borderColor: 'rgba(247,114,24,0.15)', 
                        borderRadius: '12px',
                        color: '#white' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[10px] uppercase text-[#CAC4DA]">Active</span>
                  <span className="text-xl font-bold text-white">{overview.kpis.find(k=>k.title==='On Trip')?.value || '21'}</span>
                </div>
              </div>
              <div className="space-y-2">
                {overview.tripStatus.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-[#CAC4DA] truncate max-w-[80px]">{item.name}</span>
                    <span className="ml-auto font-bold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Top Drivers widget */}
          <GlassCard className="p-5" hover={false}>
            <div className="mb-4">
              <h3 className="text-base font-bold text-white">Top Driver Ratings</h3>
              <p className="text-xs text-[#CAC4DA]">Safety index scoring metrics</p>
            </div>

            <div className="space-y-3">
              {overview.drivers.map((driver, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F66F14]/20 border border-[rgba(247,114,24,0.2)] text-xs font-bold text-[#F66F14]">
                      {driver.image}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{driver.name}</p>
                      <p className="text-[10px] text-[#CAC4DA]">{driver.availability}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#F66F14] stroke-[#F66F14]" />
                    <span className="text-xs font-bold text-white">{driver.safety}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

      </div>
    </div>
  );
}
