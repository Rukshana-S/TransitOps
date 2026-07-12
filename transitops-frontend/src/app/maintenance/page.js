'use client';

import React from 'react';
import {
  FiTool, FiCalendar, FiAlertTriangle, FiCheckCircle,
  FiClock, FiDollarSign, FiTrendingDown, FiPlus, FiFileText,
  FiBell, FiUser, FiTruck, FiActivity, FiZap, FiDroplet,
  FiShield, FiRefreshCw, FiMoreVertical, FiEye, FiEdit2,
  FiChevronLeft, FiChevronRight, FiStar,
} from 'react-icons/fi';

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const O  = '#F66F14';
const BG = '#060910';

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const VEHICLES = [
  { id:'V-1001', reg:'MH-12-AB-1001', mileage:'82,450 km', engine:88, tyre:72, battery:91, fuel:79, health:82, make:'Tata Prima', lastService:'2026-06-10' },
  { id:'V-1002', reg:'MH-12-AB-1002', mileage:'61,200 km', engine:94, tyre:85, battery:68, fuel:88, health:89, make:'Ashok Leyland', lastService:'2026-06-28' },
  { id:'V-1003', reg:'MH-12-AB-1003', mileage:'1,14,300 km', engine:55, tyre:48, battery:40, fuel:61, health:48, make:'Eicher Pro',    lastService:'2026-04-15' },
  { id:'V-1004', reg:'MH-12-AB-1004', mileage:'38,900 km', engine:97, tyre:93, battery:95, fuel:92, health:94, make:'Mahindra Furio',  lastService:'2026-07-01' },
];

const TIMELINE = [
  { type:'Oil Change',          vehicle:'V-1001', date:'2026-07-14', mechanic:'Ravi Kumar',  progress:100, status:'DONE',     cost:2800 },
  { type:'Brake Service',       vehicle:'V-1003', date:'2026-07-16', mechanic:'Anand Patel', progress:60,  status:'IN_PROG',  cost:5500 },
  { type:'Engine Inspection',   vehicle:'V-1002', date:'2026-07-18', mechanic:'Suresh Nair', progress:0,   status:'UPCOMING', cost:3200 },
  { type:'Tyre Replacement',    vehicle:'V-1003', date:'2026-07-20', mechanic:'Ravi Kumar',  progress:0,   status:'OVERDUE',  cost:18000 },
  { type:'Battery Replacement', vehicle:'V-1001', date:'2026-07-22', mechanic:'Anand Patel', progress:0,   status:'UPCOMING', cost:6500 },
  { type:'Insurance Renewal',   vehicle:'V-1004', date:'2026-07-25', mechanic:'—',           progress:0,   status:'UPCOMING', cost:42000 },
  { type:'FC Renewal',          vehicle:'V-1002', date:'2026-07-28', mechanic:'—',           progress:0,   status:'UPCOMING', cost:8000 },
];

const HISTORY = [
  { vehicle:'V-1001', type:'Oil Change',        mechanic:'Ravi Kumar',  cost:2800,  date:'2026-06-10', next:'2026-09-10', status:'COMPLETED' },
  { vehicle:'V-1002', type:'Tyre Replacement',  mechanic:'Anand Patel', cost:18000, date:'2026-05-22', next:'2026-11-22', status:'COMPLETED' },
  { vehicle:'V-1003', type:'Brake Service',     mechanic:'Suresh Nair', cost:5500,  date:'2026-04-15', next:'2026-07-16', status:'OVERDUE'   },
  { vehicle:'V-1004', type:'Engine Inspection', mechanic:'Ravi Kumar',  cost:3200,  date:'2026-07-01', next:'2026-10-01', status:'COMPLETED' },
  { vehicle:'V-1001', type:'Battery Check',     mechanic:'Anand Patel', cost:500,   date:'2026-06-28', next:'2026-09-28', status:'COMPLETED' },
];

const MECHANICS = [
  { name:'Ravi Kumar',  exp:'8 yrs',  jobs:3, rating:4.8, spec:'Engine & Transmission' },
  { name:'Anand Patel', exp:'5 yrs',  jobs:2, rating:4.6, spec:'Electrical & Battery'  },
  { name:'Suresh Nair', exp:'12 yrs', jobs:1, rating:4.9, spec:'Brake & Suspension'    },
];

const NOTIFICATIONS = [
  { icon:FiTool,       msg:'V-1003 Tyre Replacement overdue by 3 days',         type:'danger',  time:'10m ago' },
  { icon:FiClock,      msg:'V-1001 Engine Inspection due in 4 days',            type:'warning', time:'1h ago'  },
  { icon:FiShield,     msg:'V-1004 Insurance expires in 13 days',               type:'warning', time:'3h ago'  },
  { icon:FiCheckCircle,msg:'V-1002 Oil Change completed successfully',          type:'success', time:'1d ago'  },
  { icon:FiAlertTriangle,msg:'V-1003 Engine Health dropped below 60%',          type:'danger',  time:'2d ago'  },
];

// Monthly cost data (last 6 months)
const COST_DATA = [
  { month:'Feb', cost:48000 }, { month:'Mar', cost:62000 }, { month:'Apr', cost:39000 },
  { month:'May', cost:71000 }, { month:'Jun', cost:55000 }, { month:'Jul', cost:29500 },
];

const STATUS_CFG = {
  DONE:     { label:'Completed',   color:'#22C55E', bg:'rgba(34,197,94,0.12)',    border:'rgba(34,197,94,0.3)'    },
  IN_PROG:  { label:'In Progress', color:'#F66F14', bg:'rgba(246,111,20,0.12)',   border:'rgba(246,111,20,0.3)'   },
  UPCOMING: { label:'Upcoming',    color:'#3B82F6', bg:'rgba(59,130,246,0.12)',   border:'rgba(59,130,246,0.3)'   },
  OVERDUE:  { label:'Overdue',     color:'#EF4444', bg:'rgba(239,68,68,0.12)',    border:'rgba(239,68,68,0.3)'    },
  COMPLETED:{ label:'Completed',   color:'#22C55E', bg:'rgba(34,197,94,0.12)',    border:'rgba(34,197,94,0.3)'    },
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Mulish:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

.mm-page { min-height:100vh; background:${BG}; padding:32px; font-family:'Inter',system-ui,sans-serif; color:#E8EAF0; box-sizing:border-box; position:relative; overflow:hidden; }
.mm-page * { box-sizing:border-box; }

/* Ambient glow blobs */
.mm-blob { position:absolute; border-radius:50%; pointer-events:none; filter:blur(80px); }

/* Typography */
.mm-h1 { font-family:'Mulish',sans-serif; font-size:26px; font-weight:900; color:#fff; margin:0; letter-spacing:-0.3px; }
.mm-h2 { font-family:'Mulish',sans-serif; font-size:17px; font-weight:800; color:#F9FAFB; margin:0 0 16px; display:flex; align-items:center; gap:8px; }

/* Glass card */
.mm-glass {
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(246,111,20,0.18);
  border-radius:18px;
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  transition:border-color .25s, box-shadow .25s;
}
.mm-glass:hover { border-color:rgba(246,111,20,0.35); box-shadow:0 0 24px rgba(246,111,20,0.08); }

/* KPI card */
.mm-kpi {
  background:rgba(255,255,255,0.03);
  border:1px solid rgba(246,111,20,0.15);
  border-radius:16px; padding:18px 20px;
  display:flex; align-items:center; gap:14px;
  transition:transform .25s, box-shadow .25s, border-color .25s;
  cursor:default; position:relative; overflow:hidden;
}
.mm-kpi::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(246,111,20,0.04),transparent); opacity:0; transition:opacity .25s; }
.mm-kpi:hover { transform:translateY(-4px); border-color:rgba(246,111,20,0.4); box-shadow:0 8px 32px rgba(246,111,20,0.12); }
.mm-kpi:hover::after { opacity:1; }

/* Buttons */
.mm-btn-primary { display:flex; align-items:center; gap:7px; background:linear-gradient(135deg,#F66F14,#c25a0c); border:none; border-radius:11px; padding:10px 20px; color:#fff; font-size:13px; font-weight:700; font-family:'Inter',sans-serif; cursor:pointer; white-space:nowrap; box-shadow:0 0 18px rgba(246,111,20,0.35); transition:transform .2s, box-shadow .2s; }
.mm-btn-primary:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 0 28px rgba(246,111,20,0.55); }
.mm-btn-secondary { display:flex; align-items:center; gap:7px; background:rgba(255,255,255,0.04); border:1px solid rgba(246,111,20,0.25); border-radius:11px; padding:9px 16px; color:#9CA3AF; font-size:13px; font-weight:500; font-family:'Inter',sans-serif; cursor:pointer; white-space:nowrap; transition:all .2s; }
.mm-btn-secondary:hover { border-color:#F66F14; color:#F66F14; background:rgba(246,111,20,0.06); }

/* Progress bar */
.mm-prog-track { height:5px; border-radius:5px; background:rgba(255,255,255,0.06); overflow:hidden; }
.mm-prog-fill  { height:100%; border-radius:5px; transition:width .8s ease; }

/* Table */
.mm-table { width:100%; border-collapse:collapse; }
.mm-table th { padding:11px 14px; font-size:10px; font-weight:700; color:#4B5563; text-transform:uppercase; letter-spacing:.8px; background:rgba(246,111,20,0.05); border-bottom:1px solid rgba(246,111,20,0.1); text-align:left; white-space:nowrap; }
.mm-table td { padding:12px 14px; font-size:12px; color:#9CA3AF; border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; }
.mm-table tbody tr { transition:background .15s; }
.mm-table tbody tr:hover { background:rgba(246,111,20,0.04); }

/* Status pill */
.mm-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:.3px; }

/* Timeline */
.mm-tl-item { display:flex; gap:14px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
.mm-tl-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; margin-top:4px; }
.mm-tl-line { width:1px; background:linear-gradient(to bottom,rgba(246,111,20,0.3),transparent); margin:0 auto; flex-shrink:0; }

/* Calendar */
.mm-cal-day { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:12px; cursor:pointer; transition:all .18s; color:#4B5563; }
.mm-cal-day:hover { background:rgba(246,111,20,0.1); color:#F66F14; }
.mm-cal-day.today { background:linear-gradient(135deg,#F66F14,#c25a0c); color:#fff; box-shadow:0 0 12px rgba(246,111,20,0.5); font-weight:700; }
.mm-cal-day.has-event { color:#F9FAFB; font-weight:600; }
.mm-cal-day.has-event::after { content:''; display:block; width:4px; height:4px; border-radius:50%; background:#F66F14; margin:-2px auto 0; }

/* Chart bars */
.mm-bar { border-radius:6px 6px 0 0; transition:height .8s ease, opacity .2s; cursor:pointer; }
.mm-bar:hover { opacity:.85; }

/* Donut */
.mm-donut-ring { transform-origin:center; transition:stroke-dasharray .8s ease; }

/* Notification item */
.mm-notif { display:flex; gap:12px; align-items:flex-start; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
.mm-notif:last-child { border-bottom:none; }

@keyframes mm-glow { 0%,100%{box-shadow:0 0 14px rgba(246,111,20,0.3)} 50%{box-shadow:0 0 28px rgba(246,111,20,0.6)} }
@keyframes mm-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
@keyframes mm-slide-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes mm-spin { to{transform:rotate(360deg)} }

.mm-anim { animation:mm-slide-up .35s ease both; }
.mm-glow-btn { animation:mm-glow 2.5s ease infinite; }
`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function MaintenancePage() {
  const [calMonth, setCalMonth]   = React.useState(new Date());
  const [activeTab, setActiveTab] = React.useState('timeline'); // 'timeline' | 'health' | 'history'
  const [animated, setAnimated]   = React.useState(false);

  React.useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  const today = new Date();
  const todayLabel = today.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // calendar helpers
  const yr  = calMonth.getFullYear();
  const mo  = calMonth.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const monthName = calMonth.toLocaleDateString('en-US', { month:'long', year:'numeric' });
  const eventDays = new Set(TIMELINE.map(t => { const d = new Date(t.date); return d.getMonth() === mo && d.getFullYear() === yr ? d.getDate() : null; }).filter(Boolean));

  const maxCost = Math.max(...COST_DATA.map(d => d.cost));

  const totalCost = HISTORY.reduce((s, h) => s + h.cost, 0);

  return (
    <>
      <style>{css}</style>
      <div className="mm-page">
        {/* Ambient blobs */}
        <div className="mm-blob" style={{ width:400, height:400, top:-120, right:80, background:'rgba(246,111,20,0.07)', animationDelay:'0s' }} />
        <div className="mm-blob" style={{ width:300, height:300, bottom:200, left:-60, background:'rgba(59,130,246,0.05)', animationDelay:'2s' }} />

        {/* ── HEADER ─────────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'28px', flexWrap:'wrap', gap:'14px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'13px', marginBottom:'6px' }}>
              <div style={{ width:46, height:46, borderRadius:13, background:'linear-gradient(135deg,#F66F14,#c25a0c)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 22px rgba(246,111,20,0.5)', animation:'mm-glow 2.5s ease infinite' }}>
                <FiTool size={22} color="#fff" />
              </div>
              <div>
                <h1 className="mm-h1">Maintenance Management</h1>
                <p style={{ fontSize:13, color:'#4B5563', margin:'3px 0 0', fontFamily:'Inter,sans-serif' }}>Monitor preventive maintenance and vehicle servicing.</p>
              </div>
            </div>
            <p style={{ fontSize:12, color:'#374151', paddingLeft:60 }}>{todayLabel}</p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button className="mm-btn-secondary"><FiRefreshCw size={13} /> Refresh</button>
            <button className="mm-btn-secondary"><FiFileText size={13} /> Generate Report</button>
            <button className="mm-btn-secondary"><FiPlus size={13} /> Add Maintenance</button>
            <button className="mm-btn-primary mm-glow-btn"><FiCalendar size={14} /> Schedule Service</button>
          </div>
        </div>

        {/* ── KPI CARDS ──────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:14, marginBottom:28 }}>
          {[
            { icon:FiTruck,        label:'Vehicles in Service',  val:'4',       color:'#3B82F6', bg:'rgba(59,130,246,0.12)'  },
            { icon:FiClock,        label:'Upcoming Services',    val:'5',       color:'#F59E0B', bg:'rgba(245,158,11,0.12)'  },
            { icon:FiCheckCircle,  label:'Completed Services',   val:'18',      color:'#22C55E', bg:'rgba(34,197,94,0.12)'   },
            { icon:FiAlertTriangle,label:'Overdue Maintenance',  val:'2',       color:'#EF4444', bg:'rgba(239,68,68,0.12)'   },
            { icon:FiDollarSign,   label:'Maintenance Cost',     val:'₹86.5K',  color:'#F66F14', bg:'rgba(246,111,20,0.12)'  },
            { icon:FiTrendingDown, label:'Avg. Downtime',        val:'2.4 days',color:'#A78BFA', bg:'rgba(167,139,250,0.12)' },
          ].map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="mm-kpi mm-anim" style={{ animationDelay:`${i * 0.06}s` }}>
                <div style={{ width:42, height:42, borderRadius:11, background:k.bg, border:`1px solid ${k.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 0 14px ${k.color}25` }}>
                  <Icon size={19} color={k.color} />
                </div>
                <div>
                  <div style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1, fontFamily:'Mulish,sans-serif' }}>{k.val}</div>
                  <div style={{ fontSize:11, color:'#6B7280', marginTop:3 }}>{k.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MAIN CONTENT: Calendar + Timeline/Health/History ── */}
        <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:20, marginBottom:24 }}>

          {/* LEFT: Calendar + Notifications */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

            {/* Calendar */}
            <div className="mm-glass" style={{ padding:18 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <h2 className="mm-h2" style={{ marginBottom:0 }}><FiCalendar size={15} color={O} /> {monthName}</h2>
                <div style={{ display:'flex', gap:4 }}>
                  <button onClick={() => setCalMonth(new Date(yr, mo - 1, 1))} style={{ background:'none', border:'1px solid rgba(246,111,20,0.2)', borderRadius:7, padding:'4px 7px', color:'#6B7280', cursor:'pointer', transition:'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=O; e.currentTarget.style.color=O; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(246,111,20,0.2)'; e.currentTarget.style.color='#6B7280'; }}>
                    <FiChevronLeft size={12} />
                  </button>
                  <button onClick={() => setCalMonth(new Date(yr, mo + 1, 1))} style={{ background:'none', border:'1px solid rgba(246,111,20,0.2)', borderRadius:7, padding:'4px 7px', color:'#6B7280', cursor:'pointer', transition:'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=O; e.currentTarget.style.color=O; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(246,111,20,0.2)'; e.currentTarget.style.color='#6B7280'; }}>
                    <FiChevronRight size={12} />
                  </button>
                </div>
              </div>
              {/* Day headers */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:6 }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:'#374151', padding:'3px 0' }}>{d}</div>
                ))}
              </div>
              {/* Days grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === today.getDate() && mo === today.getMonth() && yr === today.getFullYear();
                  const hasEvt  = eventDays.has(day);
                  return (
                    <div key={day} className={`mm-cal-day${isToday ? ' today' : ''}${hasEvt && !isToday ? ' has-event' : ''}`} style={{ textAlign:'center' }}>
                      {day}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:12, paddingTop:10, borderTop:'1px solid rgba(246,111,20,0.1)' }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:O }} />
                <span style={{ fontSize:10, color:'#4B5563' }}>Service scheduled</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="mm-glass" style={{ padding:18 }}>
              <h2 className="mm-h2"><FiBell size={15} color={O} /> Alerts</h2>
              {NOTIFICATIONS.map((n, i) => {
                const Icon = n.icon;
                const c = n.type === 'danger' ? '#EF4444' : n.type === 'warning' ? '#F59E0B' : '#22C55E';
                return (
                  <div key={i} className="mm-notif">
                    <div style={{ width:30, height:30, borderRadius:8, background:`${c}15`, border:`1px solid ${c}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={13} color={c} />
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:12, color:'#D1D5DB', margin:0, lineHeight:1.4 }}>{n.msg}</p>
                      <p style={{ fontSize:10, color:'#374151', margin:'3px 0 0' }}>{n.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Tab panels */}
          <div className="mm-glass" style={{ padding:20, display:'flex', flexDirection:'column' }}>
            {/* Tabs */}
            <div style={{ display:'flex', gap:4, marginBottom:20, background:'rgba(255,255,255,0.03)', borderRadius:12, padding:4, width:'fit-content', border:'1px solid rgba(246,111,20,0.12)' }}>
              {[
                { id:'timeline', label:'Service Timeline' },
                { id:'health',   label:'Vehicle Health'   },
                { id:'history',  label:'Service History'  },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  padding:'7px 16px', borderRadius:9, border:'none', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif',
                  background: activeTab === tab.id ? 'linear-gradient(135deg,#F66F14,#c25a0c)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#6B7280',
                  cursor:'pointer', transition:'all .2s',
                  boxShadow: activeTab === tab.id ? '0 0 12px rgba(246,111,20,0.3)' : 'none',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── TIMELINE TAB ── */}
            {activeTab === 'timeline' && (
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {TIMELINE.map((item, i) => {
                  const st = STATUS_CFG[item.status];
                  return (
                    <div key={i} className="mm-tl-item mm-anim" style={{ animationDelay:`${i * 0.07}s` }}>
                      {/* Timeline line + dot */}
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:14, flexShrink:0 }}>
                        <div className="mm-tl-dot" style={{ background:st.color, boxShadow:`0 0 8px ${st.color}` }} />
                        {i < TIMELINE.length - 1 && <div className="mm-tl-line" style={{ flex:1, width:1, background:`linear-gradient(to bottom, ${st.color}50, transparent)` }} />}
                      </div>

                      {/* Content */}
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:6 }}>
                          <div>
                            <span style={{ fontSize:13, fontWeight:700, color:'#F9FAFB', fontFamily:'Mulish,sans-serif' }}>{item.type}</span>
                            <div style={{ display:'flex', gap:12, marginTop:3 }}>
                              <span style={{ fontSize:11, color:'#4B5563' }}>🚛 {item.vehicle}</span>
                              <span style={{ fontSize:11, color:'#4B5563' }}>👤 {item.mechanic}</span>
                              <span style={{ fontSize:11, color:'#4B5563' }}>📅 {item.date}</span>
                              <span style={{ fontSize:11, color:O }}>₹{item.cost.toLocaleString()}</span>
                            </div>
                          </div>
                          <span className="mm-pill" style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>
                            <span style={{ width:5, height:5, borderRadius:'50%', background:st.color, display:'inline-block' }} />
                            {st.label}
                          </span>
                        </div>
                        {/* Progress */}
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div className="mm-prog-track" style={{ flex:1 }}>
                            <div className="mm-prog-fill" style={{ width: animated ? `${item.progress}%` : '0%', background:`linear-gradient(90deg,${st.color},${st.color}80)`, boxShadow:`0 0 8px ${st.color}40` }} />
                          </div>
                          <span style={{ fontSize:10, color:'#4B5563', minWidth:28 }}>{item.progress}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── VEHICLE HEALTH TAB ── */}
            {activeTab === 'health' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                {VEHICLES.map((v, vi) => {
                  const hColor = v.health >= 80 ? '#22C55E' : v.health >= 60 ? '#F59E0B' : '#EF4444';
                  return (
                    <div key={v.id} className="mm-anim" style={{
                      background:'rgba(255,255,255,0.02)', border:`1px solid rgba(246,111,20,0.15)`,
                      borderRadius:14, padding:16, animationDelay:`${vi * 0.08}s`,
                      transition:'border-color .25s, box-shadow .25s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(246,111,20,0.4)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(246,111,20,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(246,111,20,0.15)'; e.currentTarget.style.boxShadow='none'; }}
                    >
                      {/* Vehicle icon + info */}
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background:'rgba(246,111,20,0.1)', border:'1px solid rgba(246,111,20,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <FiTruck size={20} color={O} />
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:'#F9FAFB', fontFamily:'Mulish,sans-serif' }}>{v.reg}</div>
                          <div style={{ fontSize:11, color:'#4B5563' }}>{v.make} · {v.mileage}</div>
                        </div>
                        {/* Health score */}
                        <div style={{ marginLeft:'auto', textAlign:'center' }}>
                          <div style={{ fontSize:20, fontWeight:900, color:hColor, fontFamily:'Mulish,sans-serif', lineHeight:1 }}>{v.health}%</div>
                          <div style={{ fontSize:9, color:'#4B5563' }}>Health</div>
                        </div>
                      </div>

                      {/* Health bars */}
                      {[
                        { label:'Engine', val:v.engine, icon:'⚙️' },
                        { label:'Tyre',   val:v.tyre,   icon:'🔵' },
                        { label:'Battery',val:v.battery, icon:'⚡' },
                        { label:'Fuel Eff.',val:v.fuel,  icon:'⛽' },
                      ].map(bar => {
                        const bc = bar.val >= 80 ? '#22C55E' : bar.val >= 60 ? '#F59E0B' : '#EF4444';
                        return (
                          <div key={bar.label} style={{ marginBottom:8 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                              <span style={{ fontSize:10, color:'#6B7280' }}>{bar.icon} {bar.label}</span>
                              <span style={{ fontSize:10, fontWeight:700, color:bc }}>{bar.val}%</span>
                            </div>
                            <div className="mm-prog-track">
                              <div className="mm-prog-fill" style={{ width: animated ? `${bar.val}%` : '0%', background:`linear-gradient(90deg,${bc},${bc}80)`, boxShadow:`0 0 6px ${bc}40` }} />
                            </div>
                          </div>
                        );
                      })}

                      <div style={{ marginTop:10, paddingTop:8, borderTop:'1px solid rgba(246,111,20,0.08)', fontSize:10, color:'#374151' }}>
                        Last service: {v.lastService}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── SERVICE HISTORY TAB ── */}
            {activeTab === 'history' && (
              <div style={{ borderRadius:12, overflow:'hidden', border:'1px solid rgba(246,111,20,0.12)' }}>
                <table className="mm-table">
                  <thead>
                    <tr>
                      {['Vehicle','Service Type','Mechanic','Cost','Date','Next Service','Status','Actions'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HISTORY.map((h, i) => {
                      const st = STATUS_CFG[h.status];
                      return (
                        <tr key={i} className="mm-anim" style={{ animationDelay:`${i * 0.06}s` }}>
                          <td><span style={{ color:O, fontWeight:700, fontSize:12 }}>{h.vehicle}</span></td>
                          <td style={{ color:'#D1D5DB', fontWeight:500 }}>{h.type}</td>
                          <td>{h.mechanic}</td>
                          <td style={{ color:'#22C55E', fontWeight:700 }}>₹{h.cost.toLocaleString()}</td>
                          <td>{h.date}</td>
                          <td style={{ color: new Date(h.next) < today ? '#EF4444' : '#9CA3AF' }}>{h.next}</td>
                          <td>
                            <span className="mm-pill" style={{ background:st.bg, color:st.color, border:`1px solid ${st.border}` }}>
                              <span style={{ width:4, height:4, borderRadius:'50%', background:st.color, display:'inline-block' }} />
                              {st.label}
                            </span>
                          </td>
                          <td>
                            <div style={{ display:'flex', gap:4 }}>
                              <button style={{ background:'none', border:'1px solid rgba(246,111,20,0.15)', borderRadius:7, padding:'4px 7px', color:'#4B5563', cursor:'pointer', transition:'all .15s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor=O; e.currentTarget.style.color=O; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(246,111,20,0.15)'; e.currentTarget.style.color='#4B5563'; }}>
                                <FiEye size={12} />
                              </button>
                              <button style={{ background:'none', border:'1px solid rgba(246,111,20,0.15)', borderRadius:7, padding:'4px 7px', color:'#4B5563', cursor:'pointer', transition:'all .15s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor=O; e.currentTarget.style.color=O; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(246,111,20,0.15)'; e.currentTarget.style.color='#4B5563'; }}>
                                <FiEdit2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── ANALYTICS + MECHANICS ──────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, marginBottom:24 }}>

          {/* Analytics */}
          <div className="mm-glass" style={{ padding:22 }}>
            <h2 className="mm-h2"><FiActivity size={16} color={O} /> Maintenance Analytics</h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

              {/* Bar chart: Monthly cost */}
              <div>
                <p style={{ fontSize:11, color:'#4B5563', marginBottom:12, textTransform:'uppercase', letterSpacing:'.6px', fontWeight:700 }}>Monthly Cost (₹)</p>
                <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120, paddingBottom:4 }}>
                  {COST_DATA.map((d, i) => {
                    const pct = (d.cost / maxCost) * 100;
                    return (
                      <div key={d.month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <div
                          className="mm-bar mm-anim"
                          style={{
                            width:'100%',
                            height: animated ? `${pct}%` : '4px',
                            minHeight:4,
                            background:`linear-gradient(to top, #F66F14, #f59e0b)`,
                            boxShadow:`0 0 10px rgba(246,111,20,0.3)`,
                            animationDelay:`${i * 0.1}s`,
                          }}
                        />
                        <span style={{ fontSize:9, color:'#374151' }}>{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Donut chart: Health scores */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <p style={{ fontSize:11, color:'#4B5563', marginBottom:12, textTransform:'uppercase', letterSpacing:'.6px', fontWeight:700, alignSelf:'flex-start' }}>Fleet Health Score</p>
                <div style={{ position:'relative', width:100, height:100 }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#22C55E" strokeWidth="10"
                      strokeDasharray={animated ? `${0.78 * 2 * Math.PI * 38} ${2 * Math.PI * 38}` : `0 ${2 * Math.PI * 38}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      style={{ transition:'stroke-dasharray .9s ease', filter:'drop-shadow(0 0 6px rgba(34,197,94,0.5))' }}
                    />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" strokeWidth="10"
                      strokeDasharray={animated ? `${0.12 * 2 * Math.PI * 38} ${2 * Math.PI * 38}` : `0 ${2 * Math.PI * 38}`}
                      strokeLinecap="round"
                      transform={`rotate(${-90 + 0.78 * 360} 50 50)`}
                      style={{ transition:'stroke-dasharray .9s ease .2s', filter:'drop-shadow(0 0 4px rgba(239,68,68,0.5))' }}
                    />
                  </svg>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:16, fontWeight:900, color:'#fff', fontFamily:'Mulish,sans-serif' }}>78%</span>
                    <span style={{ fontSize:9, color:'#4B5563' }}>Avg Health</span>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:8, alignSelf:'stretch' }}>
                  {[{c:'#22C55E',l:'Healthy (78%)'},{c:'#F59E0B',l:'Warning (10%)'},{c:'#EF4444',l:'Critical (12%)'}].map(l => (
                    <div key={l.l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:l.c, boxShadow:`0 0 5px ${l.c}` }} />
                      <span style={{ fontSize:10, color:'#6B7280' }}>{l.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service frequency mini bars */}
              <div style={{ gridColumn:'1/-1' }}>
                <p style={{ fontSize:11, color:'#4B5563', marginBottom:10, textTransform:'uppercase', letterSpacing:'.6px', fontWeight:700 }}>Service Frequency by Type</p>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    { label:'Oil Change',        val:85, color:'#F66F14' },
                    { label:'Brake Service',      val:60, color:'#3B82F6' },
                    { label:'Tyre Replacement',   val:45, color:'#22C55E' },
                    { label:'Engine Inspection',  val:30, color:'#F59E0B' },
                    { label:'Battery Service',    val:20, color:'#A78BFA' },
                  ].map(bar => (
                    <div key={bar.label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:11, color:'#6B7280', width:120, flexShrink:0 }}>{bar.label}</span>
                      <div className="mm-prog-track" style={{ flex:1 }}>
                        <div className="mm-prog-fill" style={{ width: animated ? `${bar.val}%` : '0%', background:`linear-gradient(90deg,${bar.color},${bar.color}80)`, boxShadow:`0 0 8px ${bar.color}40` }} />
                      </div>
                      <span style={{ fontSize:10, color:'#4B5563', width:22, textAlign:'right' }}>{bar.val}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mechanic Assignment */}
          <div className="mm-glass" style={{ padding:20 }}>
            <h2 className="mm-h2"><FiUser size={16} color={O} /> Mechanic Team</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {MECHANICS.map((m, i) => (
                <div key={m.name} className="mm-anim" style={{
                  background:'rgba(255,255,255,0.02)', border:'1px solid rgba(246,111,20,0.12)',
                  borderRadius:12, padding:14, animationDelay:`${i * 0.08}s`,
                  transition:'border-color .2s, box-shadow .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(246,111,20,0.35)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(246,111,20,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(246,111,20,0.12)'; e.currentTarget.style.boxShadow='none'; }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    {/* Avatar */}
                    <div style={{
                      width:40, height:40, borderRadius:10, flexShrink:0,
                      background:`linear-gradient(135deg, ${['#F66F14','#3B82F6','#22C55E'][i]}, ${['#c25a0c','#1d4ed8','#15803d'][i]})`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:'Mulish,sans-serif', fontSize:14, fontWeight:900, color:'#fff',
                      boxShadow:`0 0 12px ${['rgba(246,111,20,0.3)','rgba(59,130,246,0.3)','rgba(34,197,94,0.3)'][i]}`,
                    }}>
                      {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'#F9FAFB', fontFamily:'Mulish,sans-serif' }}>{m.name}</div>
                      <div style={{ fontSize:10, color:'#4B5563' }}>{m.spec}</div>
                    </div>
                    {/* Rating */}
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <FiStar size={11} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ fontSize:11, fontWeight:700, color:'#F59E0B' }}>{m.rating}</span>
                    </div>
                  </div>

                  <div style={{ display:'flex', gap:16, marginBottom:10 }}>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:14, fontWeight:800, color:'#fff', fontFamily:'Mulish,sans-serif' }}>{m.exp}</div>
                      <div style={{ fontSize:9, color:'#4B5563' }}>Experience</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:14, fontWeight:800, color:O, fontFamily:'Mulish,sans-serif' }}>{m.jobs}</div>
                      <div style={{ fontSize:9, color:'#4B5563' }}>Active Jobs</div>
                    </div>
                  </div>

                  <button style={{
                    width:'100%', background:'rgba(246,111,20,0.08)', border:'1px solid rgba(246,111,20,0.25)',
                    borderRadius:8, padding:'7px 0', color:O, fontSize:11, fontWeight:700, cursor:'pointer',
                    fontFamily:'Inter,sans-serif', transition:'all .2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(246,111,20,0.18)'; e.currentTarget.style.boxShadow='0 0 12px rgba(246,111,20,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(246,111,20,0.08)'; e.currentTarget.style.boxShadow='none'; }}>
                    Assign Vehicle →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TOTAL COST FOOTER STRIP ─── */}
        <div className="mm-glass" style={{ padding:'14px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <FiDollarSign size={16} color={O} />
            <span style={{ fontFamily:'Mulish,sans-serif', fontWeight:800, color:'#F9FAFB', fontSize:14 }}>Total Maintenance Expenditure</span>
          </div>
          <span style={{ fontFamily:'Mulish,sans-serif', fontWeight:900, color:O, fontSize:22, letterSpacing:'-0.5px' }}>
            ₹{totalCost.toLocaleString()}
          </span>
          <span style={{ fontSize:11, color:'#4B5563' }}>Across {HISTORY.length} service records · FY 2025–26</span>
          <button className="mm-btn-secondary"><FiFileText size={12} /> Download Report</button>
        </div>
      </div>
    </>
  );
}
