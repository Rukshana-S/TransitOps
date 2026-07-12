'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsService } from '../../services/trips';
import TripCard from './TripCard';
import TripModal from './TripModal';
import toast from 'react-hot-toast';
import {
  FiSearch, FiPlus, FiTruck, FiCheckCircle, FiClock,
  FiXCircle, FiActivity, FiRefreshCw, FiDownload, FiUpload,
  FiAlertTriangle, FiBarChart2, FiMapPin, FiBell,
  FiEye, FiEdit2, FiTrash2,
} from 'react-icons/fi';

// ─── Workflow ────────────────────────────────────────────────────────────────
const COLUMNS = ['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED'];

const COL_CFG = {
  DRAFT:      { title: 'Draft',      color: '#F59E0B', glow: 'rgba(245,158,11,0.25)',  bg: 'rgba(245,158,11,0.08)',  dot: '#F59E0B' },
  DISPATCHED: { title: 'Dispatched', color: '#3B82F6', glow: 'rgba(59,130,246,0.25)',  bg: 'rgba(59,130,246,0.08)',  dot: '#3B82F6' },
  COMPLETED:  { title: 'Completed',  color: '#22C55E', glow: 'rgba(34,197,94,0.25)',   bg: 'rgba(34,197,94,0.08)',   dot: '#22C55E' },
  CANCELLED:  { title: 'Cancelled',  color: '#EF4444', glow: 'rgba(239,68,68,0.25)',   bg: 'rgba(239,68,68,0.08)',   dot: '#EF4444' },
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const O = '#F66F14'; // primary orange

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

  .td-page * { box-sizing: border-box; }

  .td-page {
    min-height: 100vh;
    background: #060910;
    background-image:
      radial-gradient(ellipse 80% 40% at 50% -10%, rgba(246,111,20,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(59,130,246,0.05) 0%, transparent 60%);
    padding: 32px;
    font-family: 'Inter', system-ui, sans-serif;
    color: #E8EAF0;
  }

  .td-h1 {
    font-family: 'Mulish', sans-serif;
    font-size: 28px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.4px;
    margin: 0;
  }

  .td-glass {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(246,111,20,0.18);
    border-radius: 18px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .td-glass-dark {
    background: rgba(10,14,26,0.7);
    border: 1px solid rgba(246,111,20,0.14);
    border-radius: 16px;
    backdrop-filter: blur(16px);
  }

  .td-btn-primary {
    display: flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #F66F14, #d45c0a);
    border: none; border-radius: 12px; padding: 11px 22px;
    color: #fff; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(246,111,20,0.35), 0 4px 12px rgba(0,0,0,0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    white-space: nowrap;
  }
  .td-btn-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 0 30px rgba(246,111,20,0.5), 0 8px 24px rgba(0,0,0,0.4);
  }

  .td-btn-secondary {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(246,111,20,0.3); border-radius: 12px; padding: 10px 18px;
    color: #9CA3AF; font-size: 13px; font-weight: 500; font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .td-btn-secondary:hover {
    border-color: #F66F14; color: #F66F14;
    background: rgba(246,111,20,0.06);
    box-shadow: 0 0 12px rgba(246,111,20,0.15);
  }

  .td-kpi-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(246,111,20,0.15);
    border-radius: 18px; padding: 20px 22px;
    display: flex; align-items: center; gap: 16px;
    backdrop-filter: blur(20px);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    cursor: default;
    position: relative; overflow: hidden;
  }
  .td-kpi-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(246,111,20,0.04), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .td-kpi-card:hover {
    transform: translateY(-4px);
    border-color: rgba(246,111,20,0.4);
    box-shadow: 0 8px 32px rgba(246,111,20,0.15), 0 0 0 1px rgba(246,111,20,0.1);
  }
  .td-kpi-card:hover::before { opacity: 1; }

  .td-col-wrap {
    background: rgba(10,14,26,0.6);
    border: 1px solid rgba(246,111,20,0.12);
    border-radius: 18px; overflow: hidden;
    backdrop-filter: blur(16px);
    transition: border-color 0.25s;
  }
  .td-col-wrap:hover { border-color: rgba(246,111,20,0.25); }

  .td-search-input {
    width: 100%; height: 42px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(246,111,20,0.2);
    border-radius: 12px; padding: 0 14px 0 40px;
    color: #E8EAF0; font-size: 13px; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .td-search-input::placeholder { color: #4B5563; }
  .td-search-input:focus {
    border-color: #F66F14;
    box-shadow: 0 0 0 3px rgba(246,111,20,0.1), 0 0 16px rgba(246,111,20,0.15);
  }

  .td-table { width: 100%; border-collapse: collapse; }
  .td-table th {
    padding: 12px 16px;
    font-size: 11px; font-weight: 700; font-family: 'Inter', sans-serif;
    color: #4B5563; text-transform: uppercase; letter-spacing: 0.8px;
    background: rgba(246,111,20,0.05);
    border-bottom: 1px solid rgba(246,111,20,0.12);
    text-align: left; white-space: nowrap;
  }
  .td-table td {
    padding: 13px 16px;
    font-size: 13px; color: #9CA3AF;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
  }
  .td-table tbody tr {
    transition: background 0.15s;
  }
  .td-table tbody tr:hover { background: rgba(246,111,20,0.04); }

  .td-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700; font-family: 'Inter', sans-serif;
    letter-spacing: 0.3px;
  }

  .td-action-btn {
    background: none; border: none; padding: 6px;
    border-radius: 7px; cursor: pointer; color: #4B5563;
    transition: background 0.15s, color 0.15s;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .td-action-btn:hover { background: rgba(246,111,20,0.1); color: #F66F14; }

  .td-section-title {
    font-family: 'Mulish', sans-serif;
    font-size: 18px; font-weight: 800;
    color: #F9FAFB; margin: 0 0 16px;
  }

  .td-divider {
    height: 1px;
    background: linear-gradient(90deg, rgba(246,111,20,0.4), transparent);
    margin: 28px 0;
  }

  .td-map-area {
    background: #060D1A;
    border-radius: 16px;
    border: 1px solid rgba(246,111,20,0.18);
    min-height: 260px;
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }

  @keyframes td-spin { to { transform: rotate(360deg); } }
  @keyframes td-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes td-float {
    0%,100% { transform: translateY(0) translateX(0); }
    33%     { transform: translateY(-8px) translateX(4px); }
    66%     { transform: translateY(4px) translateX(-3px); }
  }
  @keyframes td-dash {
    to { stroke-dashoffset: -60; }
  }
  @keyframes td-glow-pulse {
    0%,100% { box-shadow: 0 0 12px rgba(246,111,20,0.4); }
    50%     { box-shadow: 0 0 28px rgba(246,111,20,0.7); }
  }
  @keyframes td-slide-in {
    from { opacity:0; transform: translateY(12px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes td-fade-in {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes td-skeleton {
    0%,100% { opacity:0.4; } 50% { opacity:0.7; }
  }

  .td-animate-in { animation: td-slide-in 0.3s ease both; }
  .td-fade-in    { animation: td-fade-in 0.4s ease both;  }

  .td-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 3px solid rgba(246,111,20,0.15);
    border-top-color: #F66F14;
    animation: td-spin 0.8s linear infinite;
  }

  .td-skel {
    border-radius: 8px;
    background: linear-gradient(90deg, rgba(246,111,20,0.06), rgba(246,111,20,0.12), rgba(246,111,20,0.06));
    animation: td-skeleton 1.5s ease infinite;
  }

  .td-float-orb {
    position: absolute; border-radius: 50%;
    background: radial-gradient(circle, rgba(246,111,20,0.2), transparent);
    pointer-events: none;
    animation: td-float 6s ease-in-out infinite;
  }

  .td-glow-line {
    position: absolute; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(246,111,20,0.6), transparent);
    animation: td-pulse 2s ease infinite;
  }
`;

const STATUS_TABLE = {
  DRAFT:      { label: 'Draft',      bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  DISPATCHED: { label: 'Dispatched', bg: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: 'rgba(59,130,246,0.3)' },
  COMPLETED:  { label: 'Completed',  bg: 'rgba(34,197,94,0.12)',  color: '#22C55E', border: 'rgba(34,197,94,0.3)'  },
  CANCELLED:  { label: 'Cancelled',  bg: 'rgba(239,68,68,0.12)',  color: '#EF4444', border: 'rgba(239,68,68,0.3)'  },
};

const kpiConfig = [
  { key: 'total',      label: 'Total Trips',     icon: FiTruck,        color: '#F66F14', iconBg: 'rgba(246,111,20,0.12)' },
  { key: 'DRAFT',      label: 'Draft',           icon: FiClock,        color: '#F59E0B', iconBg: 'rgba(245,158,11,0.12)' },
  { key: 'DISPATCHED', label: 'Dispatched',      icon: FiActivity,     color: '#3B82F6', iconBg: 'rgba(59,130,246,0.12)' },
  { key: 'COMPLETED',  label: 'Completed',       icon: FiCheckCircle,  color: '#22C55E', iconBg: 'rgba(34,197,94,0.12)'  },
  { key: 'CANCELLED',  label: 'Cancelled',       icon: FiXCircle,      color: '#EF4444', iconBg: 'rgba(239,68,68,0.12)'  },
  { key: 'today',      label: "Today's Trips",   icon: FiBarChart2,    color: '#A78BFA', iconBg: 'rgba(167,139,250,0.12)' },
  { key: 'utilization',label: 'Fleet Util.',     icon: FiTruck,        color: '#34D399', iconBg: 'rgba(52,211,153,0.12)'  },
  { key: 'avgTime',    label: 'Avg. Distance',   icon: FiMapPin,       color: '#60A5FA', iconBg: 'rgba(96,165,250,0.12)'  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function TripKanbanBoard() {
  const queryClient = useQueryClient();
  const [search, setSearch]             = React.useState('');
  const [modalOpen, setModalOpen]       = React.useState(false);
  const [selectedTrip, setSelectedTrip] = React.useState(null);
  const [isViewOnly, setIsViewOnly]     = React.useState(false);
  const [activeView, setActiveView]     = React.useState('kanban'); // 'kanban' | 'table'

  const { data: trips = [], isLoading, refetch } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripsService.getTrips({}),
  });

  const createMutation = useMutation({
    mutationFn: tripsService.createTrip,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['trips'] }); toast.success('Trip created!'); setModalOpen(false); },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to create trip'),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => tripsService.updateTrip(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['trips'] }); toast.success('Trip updated!'); setModalOpen(false); },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to update trip'),
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => tripsService.updateStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['trips'] }); toast.success('Status updated'); },
    onError: (e) => toast.error(e?.response?.data?.message || 'Invalid transition'),
  });
  const deleteMutation = useMutation({
    mutationFn: tripsService.deleteTrip,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['trips'] }); toast.success('Trip deleted'); },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to delete'),
  });

  const handleCreate       = () => { setSelectedTrip(null); setIsViewOnly(false); setModalOpen(true); };
  const handleEdit         = (t) => { setSelectedTrip(t); setIsViewOnly(false); setModalOpen(true); };
  const handleView         = (t) => { setSelectedTrip(t); setIsViewOnly(true);  setModalOpen(true); };
  const handleDelete       = (id) => { if (window.confirm('Delete this trip?')) deleteMutation.mutate(id); };
  const handleStatusChange = (id, status) => statusMutation.mutate({ id, status });
  const handleSave         = (data) => selectedTrip
    ? updateMutation.mutate({ id: selectedTrip.id, payload: data })
    : createMutation.mutate(data);

  const filteredTrips = React.useMemo(() => {
    if (!search.trim()) return trips;
    const q = search.toLowerCase();
    return trips.filter(t =>
      t.tripCode?.toLowerCase().includes(q) ||
      t.vehicleId?.toLowerCase().includes(q) ||
      t.driverId?.toLowerCase().includes(q) ||
      t.source?.toLowerCase().includes(q) ||
      t.destination?.toLowerCase().includes(q)
    );
  }, [trips, search]);

  const byCol = React.useMemo(() =>
    COLUMNS.reduce((a, c) => { a[c] = filteredTrips.filter(t => t.status === c); return a; }, {}),
  [filteredTrips]);

  const totalDist = trips.reduce((s, t) => s + (t.plannedDistance || 0), 0);
  const avgDist   = trips.length ? Math.round(totalDist / trips.length) : 0;
  const todayStr  = new Date().toISOString().slice(0, 10);

  const kpiValues = {
    total:       trips.length,
    DRAFT:       trips.filter(t => t.status === 'DRAFT').length,
    DISPATCHED:  trips.filter(t => t.status === 'DISPATCHED').length,
    COMPLETED:   trips.filter(t => t.status === 'COMPLETED').length,
    CANCELLED:   trips.filter(t => t.status === 'CANCELLED').length,
    today:       trips.filter(t => t.createdAt?.slice(0, 10) === todayStr).length,
    utilization: trips.length ? `${Math.round((trips.filter(t => t.status === 'DISPATCHED').length / trips.length) * 100)}%` : '0%',
    avgTime:     `${avgDist} km`,
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // ─── Upcoming / Delayed sidebar data ────────────────────────────────────────
  const upcoming = trips.filter(t => t.status === 'DRAFT').slice(0, 4);
  const dispatched = trips.filter(t => t.status === 'DISPATCHED').slice(0, 3);

  return (
    <>
      <style>{css}</style>
      <div className="td-page">

        {/* ── FLOATING ORBS (decoration) ─────────────────────────────── */}
        <div className="td-float-orb" style={{ width:'300px', height:'300px', top:'-100px', right:'200px', opacity:0.4, animationDelay:'0s' }} />
        <div className="td-float-orb" style={{ width:'200px', height:'200px', bottom:'200px', left:'60px', opacity:0.25, animationDelay:'3s' }} />

        {/* ── HEADER ────────────────────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'32px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'8px' }}>
              <div style={{
                width:'50px', height:'50px', borderRadius:'14px',
                background:'linear-gradient(135deg,#F66F14,#c25a0c)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 24px rgba(246,111,20,0.5)',
                animation:'td-glow-pulse 2.5s ease infinite',
              }}>
                <FiTruck size={24} color="#fff" />
              </div>
              <div>
                <h1 className="td-h1">Trip Dispatcher</h1>
                <p style={{ fontSize:'13px', color:'#4B5563', margin:'3px 0 0', fontFamily:'Inter,sans-serif' }}>
                  Manage, assign and monitor transportation trips in real time.
                </p>
              </div>
            </div>
            <p style={{ fontSize:'12px', color:'#374151', paddingLeft:'64px', fontFamily:'Inter,sans-serif' }}>{today}</p>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
            <button className="td-btn-secondary" onClick={() => refetch()}>
              <FiRefreshCw size={14} /> Refresh
            </button>
            <button className="td-btn-secondary">
              <FiUpload size={14} /> Import
            </button>
            <button className="td-btn-secondary">
              <FiDownload size={14} /> Export
            </button>
            <button className="td-btn-primary" onClick={handleCreate}>
              <FiPlus size={16} /> Create Trip
            </button>
          </div>
        </div>

        {/* ── KPI CARDS (8 cards, 4 col on desktop → 2 col on md) ─── */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(4,1fr)',
          gap:'16px',
          marginBottom:'32px',
        }}>
          {kpiConfig.map(k => {
            const Icon = k.icon;
            return (
              <div key={k.key} className="td-kpi-card td-animate-in">
                {/* glow line */}
                <div className="td-glow-line" style={{ bottom:0, top:'auto' }} />
                <div style={{
                  width:'46px', height:'46px', borderRadius:'12px',
                  background: k.iconBg,
                  border:`1px solid ${k.color}30`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0,
                  boxShadow:`0 0 16px ${k.color}25`,
                }}>
                  <Icon size={22} color={k.color} />
                </div>
                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={{ fontSize:'28px', fontWeight:800, color:'#fff', lineHeight:1, fontFamily:'Mulish,sans-serif' }}>
                    {isLoading ? <div className="td-skel" style={{ width:'40px', height:'28px' }} /> : kpiValues[k.key]}
                  </div>
                  <div style={{ fontSize:'12px', color:'#6B7280', marginTop:'4px' }}>{k.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── GLOWING DIVIDER ───────────────────────────────────────── */}
        <div className="td-divider" />

        {/* ── TOOLBAR ───────────────────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', marginBottom:'24px', flexWrap:'wrap' }}>
          {/* Search */}
          <div style={{ position:'relative', flex:1, maxWidth:'440px', minWidth:'220px' }}>
            <FiSearch size={15} style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color:'#4B5563', pointerEvents:'none' }} />
            <input
              className="td-search-input"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Trip ID, Vehicle, Driver, Source, Destination…"
            />
          </div>

          {/* View toggle */}
          <div style={{
            display:'flex', background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(246,111,20,0.18)',
            borderRadius:'12px', padding:'4px', gap:'4px',
          }}>
            {[{id:'kanban',label:'Kanban'},{id:'table',label:'Table'}].map(v => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                style={{
                  padding:'7px 18px', borderRadius:'9px', border:'none',
                  background: activeView === v.id ? 'linear-gradient(135deg,#F66F14,#d45c0a)' : 'transparent',
                  color: activeView === v.id ? '#fff' : '#6B7280',
                  fontWeight: activeView === v.id ? 700 : 500,
                  fontSize:'13px', cursor:'pointer', fontFamily:'Inter,sans-serif',
                  boxShadow: activeView === v.id ? '0 0 14px rgba(246,111,20,0.3)' : 'none',
                  transition:'all 0.2s',
                }}
              >{v.label}</button>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT (kanban + right sidebar) ─────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px', alignItems:'start' }}>

          {/* LEFT: Kanban / Table */}
          <div>
            {isLoading ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'18px' }}>
                {COLUMNS.map(c => (
                  <div key={c} className="td-col-wrap" style={{ padding:'16px' }}>
                    <div className="td-skel" style={{ height:'24px', marginBottom:'12px' }} />
                    {[1,2,3].map(i => (
                      <div key={i} className="td-skel" style={{ height:'130px', marginBottom:'10px', borderRadius:'12px' }} />
                    ))}
                  </div>
                ))}
              </div>
            ) : activeView === 'kanban' ? (
              /* ── KANBAN ─ */
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'18px', alignItems:'start' }}>
                {COLUMNS.map(col => {
                  const cfg = COL_CFG[col];
                  const colTrips = byCol[col] || [];
                  return (
                    <div key={col} className="td-col-wrap">
                      {/* Column header */}
                      <div style={{
                        padding:'14px 16px 10px',
                        background:`linear-gradient(180deg, ${cfg.bg} 0%, transparent 100%)`,
                        borderBottom:`1px solid rgba(246,111,20,0.08)`,
                      }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <div style={{
                              width:'8px', height:'8px', borderRadius:'50%',
                              background: cfg.color,
                              boxShadow:`0 0 8px ${cfg.color}`,
                            }} />
                            <span style={{ fontSize:'13px', fontWeight:700, color:'#F9FAFB', fontFamily:'Mulish,sans-serif' }}>
                              {cfg.title}
                            </span>
                          </div>
                          <span style={{
                            background: cfg.bg, color: cfg.color,
                            border:`1px solid ${cfg.color}40`,
                            fontSize:'12px', fontWeight:700,
                            borderRadius:'20px', padding:'2px 10px',
                            fontFamily:'Inter,sans-serif',
                            boxShadow:`0 0 8px ${cfg.color}20`,
                          }}>
                            {colTrips.length}
                          </span>
                        </div>
                        <div style={{ height:'2px', borderRadius:'2px', background:`linear-gradient(90deg,${cfg.color},transparent)`, opacity:0.7 }} />
                      </div>

                      {/* Cards */}
                      <div style={{ padding:'12px', display:'flex', flexDirection:'column', gap:'10px', minHeight:'160px' }}>
                        {colTrips.map((trip, idx) => (
                          <div key={trip.id} style={{ animation:`td-slide-in 0.3s ease ${idx * 0.05}s both` }}>
                            <TripCard
                              trip={trip}
                              config={cfg}
                              onEdit={handleEdit}
                              onView={handleView}
                              onDelete={handleDelete}
                              onStatusChange={handleStatusChange}
                            />
                          </div>
                        ))}

                        {colTrips.length === 0 && col === 'DRAFT' && (
                          <div style={{
                            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                            padding:'28px 12px', minHeight:'200px',
                            border:'1px dashed rgba(246,111,20,0.2)', borderRadius:'14px',
                            background:'rgba(246,111,20,0.02)',
                          }}>
                            <div style={{
                              width:'52px', height:'52px', borderRadius:'14px',
                              background:'rgba(246,111,20,0.08)', border:'1px solid rgba(246,111,20,0.2)',
                              display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px',
                              boxShadow:'0 0 20px rgba(246,111,20,0.1)',
                            }}>
                              <FiTruck size={24} color={O} />
                            </div>
                            <p style={{ color:'#6B7280', fontSize:'13px', fontWeight:600, margin:'0 0 4px', textAlign:'center', fontFamily:'Mulish,sans-serif' }}>
                              No Draft Trips
                            </p>
                            <p style={{ color:'#374151', fontSize:'11px', margin:'0 0 16px', textAlign:'center', lineHeight:1.5, maxWidth:'160px' }}>
                              Create your first trip to begin dispatch operations.
                            </p>
                            <button className="td-btn-primary" onClick={handleCreate} style={{ padding:'8px 16px', fontSize:'12px', borderRadius:'10px' }}>
                              <FiPlus size={13} /> Create First Trip
                            </button>
                          </div>
                        )}

                        {colTrips.length === 0 && col !== 'DRAFT' && (
                          <div style={{
                            display:'flex', alignItems:'center', justifyContent:'center',
                            padding:'20px', minHeight:'100px',
                            border:'1px dashed rgba(255,255,255,0.05)', borderRadius:'12px',
                          }}>
                            <p style={{ color:'#1F2937', fontSize:'12px', margin:0 }}>No trips</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ── TABLE ─ */
              <TripMonitoringTable
                trips={filteredTrips}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onCreate={handleCreate}
              />
            )}

            {/* ── DIVIDER ── */}
            <div className="td-divider" style={{ margin:'28px 0' }} />

            {/* ── LIVE ROUTE TRACKING (SVG illustration) ── */}
            <LiveRouteMap trips={dispatched} />
          </div>

          {/* RIGHT SIDEBAR ─────────────────────────────────────────── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <RightSidebar
              upcoming={upcoming}
              dispatched={dispatched}
              trips={trips}
              onCreate={handleCreate}
            />
          </div>
        </div>

        {/* ── MODAL ── */}
        <TripModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          trip={selectedTrip}
          isViewOnly={isViewOnly}
          onSave={handleSave}
        />
      </div>
    </>
  );
}

// ─── TRIP MONITORING TABLE ───────────────────────────────────────────────────
function TripMonitoringTable({ trips, onView, onEdit, onDelete, onStatusChange, onCreate }) {
  if (trips.length === 0) return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      minHeight:'320px', background:'rgba(10,14,26,0.6)', borderRadius:'18px',
      border:'1px solid rgba(246,111,20,0.12)', padding:'48px',
    }}>
      <FiTruck size={40} color="#F66F14" style={{ marginBottom:'16px', opacity:0.6 }} />
      <p style={{ color:'#6B7280', fontSize:'16px', fontWeight:700, margin:'0 0 8px', fontFamily:'Mulish,sans-serif' }}>No trips found</p>
      <p style={{ color:'#374151', fontSize:'13px', margin:'0 0 20px' }}>Create your first trip to see it here.</p>
      <button className="td-btn-primary" onClick={onCreate}><FiPlus size={15} /> Create Trip</button>
    </div>
  );

  const ACTIONS_MAP = {
    DRAFT:      [{ label:'Dispatch', next:'DISPATCHED', color:'#3B82F6' }],
    DISPATCHED: [{ label:'Complete', next:'COMPLETED',  color:'#22C55E' }],
    COMPLETED:  [],
    CANCELLED:  [],
  };

  return (
    <div style={{ borderRadius:'18px', overflow:'hidden', border:'1px solid rgba(246,111,20,0.14)', backdropFilter:'blur(16px)' }}>
      <table className="td-table">
        <thead>
          <tr>
            {['Trip ID','Vehicle','Driver','Source','Destination','Distance','ETA','Status','Priority','Actions'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trips.map((t, idx) => {
            const st = STATUS_TABLE[t.status] || STATUS_TABLE.DRAFT;
            const hrs = Math.floor(t.plannedDistance / 60);
            const mins = Math.round(t.plannedDistance % 60);
            const actions = ACTIONS_MAP[t.status] || [];
            return (
              <tr key={t.id}>
                <td><span style={{ color:'#F66F14', fontWeight:700, fontSize:'12px' }}>{t.tripCode}</span></td>
                <td style={{ color:'#D1D5DB' }}>{t.vehicleId}</td>
                <td style={{ color:'#D1D5DB' }}>{t.driverId}</td>
                <td>{t.source}</td>
                <td>{t.destination}</td>
                <td>{t.plannedDistance} km</td>
                <td>{hrs}h {mins}m</td>
                <td>
                  <span className="td-status-pill" style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>
                    <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:st.color, display:'inline-block' }} />
                    {st.label}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize:'11px', color:'#6B7280', background:'rgba(255,255,255,0.05)', borderRadius:'6px', padding:'2px 8px' }}>
                    {idx % 3 === 0 ? 'High' : idx % 2 === 0 ? 'Medium' : 'Low'}
                  </span>
                </td>
                <td>
                  <div style={{ display:'flex', gap:'4px' }}>
                    <button className="td-action-btn" title="View" onClick={() => onView(t)}><FiEye size={14} /></button>
                    {t.status === 'DRAFT' && <button className="td-action-btn" title="Edit" onClick={() => onEdit(t)}><FiEdit2 size={14} /></button>}
                    {actions.map(a => (
                      <button key={a.next} className="td-action-btn" style={{ color:a.color }} title={a.label} onClick={() => onStatusChange(t.id, a.next)}>
                        <FiActivity size={14} />
                      </button>
                    ))}
                    {!['COMPLETED','CANCELLED'].includes(t.status) && (
                      <button className="td-action-btn" style={{ color:'#EF4444' }} title="Delete" onClick={() => onDelete(t.id)}>
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{
        padding:'10px 16px', background:'rgba(246,111,20,0.03)',
        borderTop:'1px solid rgba(246,111,20,0.08)',
        fontSize:'12px', color:'#374151', fontFamily:'Inter,sans-serif',
      }}>
        Showing {trips.length} trip{trips.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

// ─── LIVE ROUTE MAP (SVG illustration) ───────────────────────────────────────
function LiveRouteMap({ trips }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2 className="td-section-title" style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <FiMapPin color="#F66F14" size={18} /> Live Route Tracking
        <span style={{ fontSize:'11px', color:'#22C55E', fontWeight:500, fontFamily:'Inter,sans-serif', marginLeft:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
          <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22C55E', display:'inline-block', animation:'td-pulse 1.2s ease infinite' }} />
          LIVE
        </span>
      </h2>
      <div className="td-map-area">
        {/* Dark grid background */}
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.15 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F66F14" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Orange animated route lines */}
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} xmlns="http://www.w3.org/2000/svg">
          {[
            { x1:'10%', y1:'70%', x2:'45%', y2:'35%', x3:'80%', y3:'55%' },
            { x1:'5%',  y1:'30%', x2:'35%', y2:'65%', x3:'70%', y3:'20%' },
            { x1:'20%', y1:'80%', x2:'60%', y2:'40%', x3:'90%', y3:'70%' },
          ].map((r, i) => (
            <g key={i}>
              <path
                d={`M ${r.x1} ${r.y1} Q ${r.x2} ${r.y2} ${r.x3} ${r.y3}`}
                fill="none"
                stroke="rgba(246,111,20,0.15)"
                strokeWidth="2"
              />
              <path
                d={`M ${r.x1} ${r.y1} Q ${r.x2} ${r.y2} ${r.x3} ${r.y3}`}
                fill="none"
                stroke="#F66F14"
                strokeWidth="2"
                strokeDasharray="12 8"
                strokeDashoffset={-tick * 4}
                opacity="0.6"
                style={{ transition:'stroke-dashoffset 0.5s linear' }}
              />
            </g>
          ))}

          {/* Moving truck dots */}
          {[
            { cx:'45%', cy:'35%', delay:0    },
            { cx:'35%', cy:'65%', delay:1000 },
            { cx:'60%', cy:'40%', delay:500  },
          ].map((d, i) => (
            <g key={i}>
              <circle cx={d.cx} cy={d.cy} r="10" fill="rgba(246,111,20,0.15)" />
              <circle cx={d.cx} cy={d.cy} r="5"  fill="#F66F14" />
              <circle cx={d.cx} cy={d.cy} r="5"  fill="none" stroke="#F66F14" strokeWidth="2" opacity="0.6">
                <animate attributeName="r" from="5" to="16" dur="2s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" begin={`${i * 0.7}s`} />
              </circle>
            </g>
          ))}

          {/* Origin pins */}
          {[{cx:'10%',cy:'70%'},{cx:'5%',cy:'30%'},{cx:'20%',cy:'80%'}].map((p,i)=>(
            <circle key={i} cx={p.cx} cy={p.cy} r="6" fill="rgba(59,130,246,0.6)" stroke="#3B82F6" strokeWidth="1.5" />
          ))}
          {/* Destination pins */}
          {[{cx:'80%',cy:'55%'},{cx:'70%',cy:'20%'},{cx:'90%',cy:'70%'}].map((p,i)=>(
            <circle key={i} cx={p.cx} cy={p.cy} r="6" fill="rgba(34,197,94,0.6)" stroke="#22C55E" strokeWidth="1.5" />
          ))}
        </svg>

        {/* Legend overlay */}
        <div style={{
          position:'absolute', bottom:'14px', left:'14px',
          background:'rgba(6,9,16,0.85)', borderRadius:'10px',
          border:'1px solid rgba(246,111,20,0.2)',
          padding:'10px 14px', display:'flex', gap:'16px',
          backdropFilter:'blur(12px)',
        }}>
          {[
            { color:'#F66F14', label:'Active Route' },
            { color:'#3B82F6', label:'Origin' },
            { color:'#22C55E', label:'Destination' },
          ].map(l => (
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:l.color, boxShadow:`0 0 6px ${l.color}` }} />
              <span style={{ fontSize:'11px', color:'#6B7280', fontFamily:'Inter,sans-serif' }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Active trips badge */}
        <div style={{
          position:'absolute', top:'14px', right:'14px',
          background:'rgba(246,111,20,0.1)', borderRadius:'10px',
          border:'1px solid rgba(246,111,20,0.3)',
          padding:'8px 14px',
          backdropFilter:'blur(12px)',
          display:'flex', alignItems:'center', gap:'8px',
        }}>
          <FiTruck size={14} color="#F66F14" />
          <span style={{ fontSize:'12px', color:'#F66F14', fontWeight:700, fontFamily:'Inter,sans-serif' }}>
            {trips.length} Active Vehicle{trips.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── RIGHT SIDEBAR ────────────────────────────────────────────────────────────
function RightSidebar({ upcoming, dispatched, trips, onCreate }) {
  const completedToday = trips.filter(t => t.status === 'COMPLETED').length;
  const cancelledCount = trips.filter(t => t.status === 'CANCELLED').length;

  return (
    <>
      {/* Upcoming Trips */}
      <SideCard title="Upcoming Trips" icon={FiClock} count={upcoming.length}>
        {upcoming.length === 0
          ? <p style={{ color:'#374151', fontSize:'12px', textAlign:'center', padding:'12px 0' }}>No draft trips</p>
          : upcoming.map(t => (
            <SideTrip key={t.id} trip={t} color="#F59E0B" />
          ))
        }
      </SideCard>

      {/* Dispatched / Active */}
      <SideCard title="Active Dispatches" icon={FiActivity} count={dispatched.length}>
        {dispatched.length === 0
          ? <p style={{ color:'#374151', fontSize:'12px', textAlign:'center', padding:'12px 0' }}>No active trips</p>
          : dispatched.map(t => (
            <SideTrip key={t.id} trip={t} color="#3B82F6" />
          ))
        }
      </SideCard>

      {/* Fleet Status */}
      <SideCard title="Fleet Status" icon={FiBarChart2}>
        {[
          { label:'Completed', val:completedToday, color:'#22C55E', pct: trips.length ? Math.round((completedToday/trips.length)*100) : 0 },
          { label:'Cancelled', val:cancelledCount, color:'#EF4444', pct: trips.length ? Math.round((cancelledCount/trips.length)*100) : 0 },
        ].map(s => (
          <div key={s.label} style={{ marginBottom:'12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
              <span style={{ fontSize:'12px', color:'#6B7280', fontFamily:'Inter,sans-serif' }}>{s.label}</span>
              <span style={{ fontSize:'12px', color:s.color, fontWeight:700 }}>{s.val}</span>
            </div>
            <div style={{ height:'4px', background:'rgba(255,255,255,0.06)', borderRadius:'4px', overflow:'hidden' }}>
              <div style={{
                height:'100%', width:`${s.pct}%`, background:s.color,
                borderRadius:'4px', boxShadow:`0 0 8px ${s.color}60`,
                transition:'width 0.6s ease',
              }} />
            </div>
          </div>
        ))}
      </SideCard>

      {/* Notifications */}
      <SideCard title="Recent Activity" icon={FiBell}>
        {trips.slice(0, 4).map((t, i) => (
          <div key={t.id} style={{
            display:'flex', alignItems:'center', gap:'10px',
            padding:'8px 0',
            borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}>
            <div style={{
              width:'7px', height:'7px', borderRadius:'50%', flexShrink:0,
              background: STATUS_TABLE[t.status]?.color || '#F66F14',
              boxShadow:`0 0 6px ${STATUS_TABLE[t.status]?.color || '#F66F14'}`,
            }} />
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:'12px', color:'#D1D5DB', margin:0, fontWeight:600, fontFamily:'Inter,sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {t.tripCode} — {STATUS_TABLE[t.status]?.label}
              </p>
              <p style={{ fontSize:'11px', color:'#374151', margin:'1px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {t.source} → {t.destination}
              </p>
            </div>
          </div>
        ))}
        {trips.length === 0 && <p style={{ color:'#374151', fontSize:'12px', textAlign:'center', padding:'12px 0' }}>No recent activity</p>}
      </SideCard>

      {/* Create CTA */}
      <button
        className="td-btn-primary"
        onClick={onCreate}
        style={{ width:'100%', justifyContent:'center', padding:'13px' }}
      >
        <FiPlus size={16} /> New Trip
      </button>
    </>
  );
}

function SideCard({ title, icon: Icon, count, children }) {
  return (
    <div className="td-glass-dark" style={{ padding:'16px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <Icon size={15} color="#F66F14" />
          <span style={{ fontSize:'13px', fontWeight:700, color:'#F9FAFB', fontFamily:'Mulish,sans-serif' }}>{title}</span>
        </div>
        {count !== undefined && (
          <span style={{
            background:'rgba(246,111,20,0.12)', color:'#F66F14',
            border:'1px solid rgba(246,111,20,0.25)',
            fontSize:'11px', fontWeight:700, borderRadius:'12px', padding:'1px 8px',
          }}>{count}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function SideTrip({ trip, color }) {
  return (
    <div style={{
      display:'flex', gap:'10px', alignItems:'flex-start',
      padding:'8px 10px', borderRadius:'10px',
      background:'rgba(255,255,255,0.02)', marginBottom:'6px',
      border:'1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        width:'28px', height:'28px', borderRadius:'8px', flexShrink:0,
        background:`${color}18`, border:`1px solid ${color}30`,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <FiTruck size={13} color={color} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:'12px', fontWeight:700, color:'#F9FAFB', margin:0, fontFamily:'Inter,sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {trip.tripCode}
        </p>
        <p style={{ fontSize:'11px', color:'#4B5563', margin:'2px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {trip.source} → {trip.destination}
        </p>
      </div>
    </div>
  );
}
