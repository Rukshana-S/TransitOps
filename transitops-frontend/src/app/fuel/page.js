'use client';

import React, { useState, useEffect } from 'react';
import {
  FiDroplet, FiDollarSign, FiTrendingUp, FiTrendingDown,
  FiActivity, FiPieChart, FiBarChart2, FiPlus,
  FiDownload, FiTruck, FiUser, FiCalendar, FiMapPin,
  FiFileText, FiAlertCircle, FiSettings, FiCheckCircle,
  FiX, FiUpload, FiArrowUpRight, FiArrowDownRight,
  FiCreditCard, FiTool, FiShield
} from 'react-icons/fi';

// ─── PALETTE & CONFIG ────────────────────────────────────────────────────────
const O = '#F66F14';
const BG = '#060910';

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const KPIS = [
  { label: 'Fuel Consumed',     val: '12,450 L',   trend: '+4.2%', icon: FiDroplet,      color: '#3B82F6', isGood: false },
  { label: 'Fuel Cost',         val: '₹12.2L',     trend: '+5.1%', icon: FiDollarSign,   color: '#EF4444', isGood: false },
  { label: 'Average Mileage',   val: '4.8 kmpl',   trend: '+0.2',  icon: FiTrendingUp,   color: '#22C55E', isGood: true  },
  { label: 'Fuel Efficiency',   val: '86%',        trend: '+2.4%', icon: FiActivity,     color: '#F59E0B', isGood: true  },
  { label: 'Repair Cost',       val: '₹4.5L',      trend: '-1.2%', icon: FiTool,         color: '#A78BFA', isGood: true  },
  { label: 'Monthly Expense',   val: '₹22.4L',     trend: '+8.4%', icon: FiPieChart,     color: '#EC4899', isGood: false },
  { label: 'Operational Cost',  val: '₹45.8L',     trend: '+2.1%', icon: FiBarChart2,    color: '#06B6D4', isGood: false },
  { label: 'Cost per KM',       val: '₹14.2/km',   trend: '-0.5',  icon: FiTrendingDown, color: '#10B981', isGood: true  },
];

const FUEL_LOGS = [
  { id:'FL-001', date:'2026-07-12', vehicle:'V-1001', driver:'Ravi Kumar', station:'HP - Mumbai Hwy', type:'Diesel', qty:120, mileage:'82,450', cost:11400, eff:'4.5 kmpl' },
  { id:'FL-002', date:'2026-07-11', vehicle:'V-1004', driver:'Anand Patel', station:'Reliance - Delhi', type:'Diesel', qty:200, mileage:'38,900', cost:19000, eff:'4.8 kmpl' },
  { id:'FL-003', date:'2026-07-10', vehicle:'V-1002', driver:'Suresh Nair', station:'Indian Oil - Pune', type:'Diesel', qty:150, mileage:'61,200', cost:14250, eff:'4.1 kmpl' },
  { id:'FL-004', date:'2026-07-09', vehicle:'V-1003', driver:'Ravi Kumar', station:'BP - Surat', type:'Diesel', qty:180, mileage:'1,14,300', cost:17100, eff:'3.9 kmpl' },
];

const EXPENSES = [
  { id:'EX-001', cat:'Maintenance', vehicle:'V-1003', amt:5500,  date:'2026-07-11', approver:'Admin', status:'APPROVED' },
  { id:'EX-002', cat:'Insurance',   vehicle:'V-1001', amt:42000, date:'2026-07-10', approver:'Pending', status:'PENDING' },
  { id:'EX-003', cat:'Toll',        vehicle:'V-1004', amt:1250,  date:'2026-07-09', approver:'Auto', status:'APPROVED' },
  { id:'EX-004', cat:'Driver Salary',vehicle:'—',     amt:25000, date:'2026-07-05', approver:'Admin', status:'APPROVED' },
  { id:'EX-005', cat:'Fuel',        vehicle:'V-1002', amt:14250, date:'2026-07-04', approver:'Auto', status:'REJECTED' },
];

const TRANSACTIONS = [
  { title:'Fuel Purchased',      sub:'V-1001 • Reliance', amt:'-₹11,400', type:'fuel', time:'2h ago' },
  { title:'Maintenance Paid',    sub:'V-1003 • Engine',   amt:'-₹5,500',  type:'maint',time:'1d ago' },
  { title:'Insurance Renewed',   sub:'V-1004',            amt:'-₹42,000', type:'insur',time:'3d ago' },
  { title:'Toll Payment',        sub:'V-1002 • NH-48',    amt:'-₹1,250',  type:'toll', time:'4d ago' },
  { title:'Driver Allowance',    sub:'Ravi Kumar',        amt:'-₹2,000',  type:'salary',time:'5d ago' },
];

const ALERTS = [
  { msg:'V-1003 High Fuel Consumption detected', type:'danger', time:'10m ago' },
  { msg:'Monthly Maintenance Budget Exceeded by 5%', type:'warning', time:'1h ago' },
  { msg:'V-1002 Low Fuel Efficiency (3.9 kmpl)', type:'warning', time:'3h ago' },
  { msg:'4 Expense Approvals Pending', type:'info', time:'1d ago' },
];

const CHART_MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Mulish:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

.fe-page { min-height:100vh; background:${BG}; padding:32px; font-family:'Inter',system-ui,sans-serif; color:#E8EAF0; box-sizing:border-box; position:relative; overflow:hidden; }
.fe-page * { box-sizing:border-box; }

/* Ambient glows */
.fe-glow-bg { position:absolute; inset:0; pointer-events:none; z-index:0; }
.fe-blob { position:absolute; border-radius:50%; filter:blur(100px); opacity:0.6; }

/* Typography */
.fe-h1 { font-family:'Mulish',sans-serif; font-size:28px; font-weight:900; color:#fff; margin:0; letter-spacing:-0.5px; }
.fe-h2 { font-family:'Mulish',sans-serif; font-size:18px; font-weight:800; color:#F9FAFB; margin:0 0 16px; display:flex; align-items:center; gap:8px; }

/* Glass Panels */
.fe-glass {
  background:rgba(255,255,255,0.02);
  border:1px solid rgba(246,111,20,0.15);
  border-radius:18px;
  backdrop-filter:blur(24px);
  -webkit-backdrop-filter:blur(24px);
  position:relative; z-index:1;
  transition:all 0.3s ease;
}
.fe-glass:hover { border-color:rgba(246,111,20,0.35); box-shadow:0 12px 32px rgba(0,0,0,0.4), 0 0 24px rgba(246,111,20,0.1); }

/* Buttons */
.fe-btn-primary { display:flex; align-items:center; gap:8px; background:linear-gradient(135deg,#F66F14,#d45c0a); border:none; border-radius:12px; padding:11px 22px; color:#fff; font-size:14px; font-weight:700; cursor:pointer; box-shadow:0 0 20px rgba(246,111,20,0.35); transition:all .2s; }
.fe-btn-primary:hover { transform:translateY(-2px); box-shadow:0 0 32px rgba(246,111,20,0.6); }
.fe-btn-secondary { display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(246,111,20,0.25); border-radius:12px; padding:10px 18px; color:#9CA3AF; font-size:13px; font-weight:600; cursor:pointer; transition:all .2s; }
.fe-btn-secondary:hover { background:rgba(246,111,20,0.08); border-color:#F66F14; color:#F66F14; box-shadow:0 0 16px rgba(246,111,20,0.2); }

/* KPI Cards */
.fe-kpi {
  background:rgba(10,14,26,0.6);
  border:1px solid rgba(246,111,20,0.15);
  border-radius:16px; padding:20px;
  display:flex; flex-direction:column; gap:12px;
  transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);
  position:relative; overflow:hidden;
}
.fe-kpi::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(246,111,20,0.06),transparent); opacity:0; transition:opacity .3s; }
.fe-kpi:hover { transform:translateY(-5px); border-color:rgba(246,111,20,0.4); box-shadow:0 12px 32px rgba(246,111,20,0.15); }
.fe-kpi:hover::before { opacity:1; }

/* Tables */
.fe-table-wrap { width:100%; overflow-x:auto; }
.fe-table { width:100%; border-collapse:collapse; }
.fe-table th { padding:14px 16px; font-size:11px; font-weight:800; color:#6B7280; text-transform:uppercase; letter-spacing:1px; background:rgba(246,111,20,0.05); border-bottom:1px solid rgba(246,111,20,0.12); text-align:left; white-space:nowrap; }
.fe-table td { padding:14px 16px; font-size:13px; color:#D1D5DB; border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; white-space:nowrap; }
.fe-table tbody tr { transition:background .2s; }
.fe-table tbody tr:hover { background:rgba(246,111,20,0.06); }

/* Form inputs */
.fe-input { width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(246,111,20,0.2); border-radius:10px; padding:11px 14px; color:#fff; font-size:13px; outline:none; transition:all .2s; }
.fe-input:focus { border-color:#F66F14; box-shadow:0 0 0 3px rgba(246,111,20,0.15); }
.fe-label { display:block; font-size:11px; font-weight:700; color:#9CA3AF; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px; }

/* Status Badges */
.fe-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:800; letter-spacing:0.5px; }

/* Chart elements */
.fe-chart-bar { transition:height 1s cubic-bezier(0.4, 0, 0.2, 1); cursor:pointer; }
.fe-chart-bar:hover { filter:brightness(1.2); }
.fe-chart-area-path { transition:stroke-dasharray 1.5s ease; }
.fe-chart-donut { transition:stroke-dasharray 1s ease; transform-origin:center; transform:rotate(-90deg); }

/* Animations */
@keyframes fe-fade-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
@keyframes fe-pulse-glow { 0%,100% { box-shadow:0 0 15px rgba(246,111,20,0.4); } 50% { box-shadow:0 0 30px rgba(246,111,20,0.7); } }
@keyframes fe-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }

.anim-fade-up { animation:fe-fade-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }
.anim-pulse { animation:fe-pulse-glow 2.5s ease infinite; }
.anim-float { animation:fe-float 6s ease-in-out infinite; }
`;

export default function FuelExpensePage() {
  const [activeTab, setActiveTab] = React.useState('fuel'); // 'fuel' | 'expense'
  const [modalType, setModalType] = React.useState(null); // 'fuel' | 'expense' | null
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

  return (
    <>
      <style>{css}</style>
      <div className="fe-page">
        {/* Background blobs */}
        <div className="fe-glow-bg">
          <div className="fe-blob anim-float" style={{ width:500, height:500, top:-150, right:-100, background:'rgba(246,111,20,0.12)', animationDelay:'0s' }} />
          <div className="fe-blob anim-float" style={{ width:400, height:400, bottom:-100, left:-50, background:'rgba(59,130,246,0.08)', animationDelay:'2s' }} />
        </div>

        <div style={{ position:'relative', zIndex:10 }}>
          {/* ── HEADER ── */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:16 }}>
            <div className="anim-fade-up" style={{ animationDelay:'0s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:8 }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#F66F14,#c25a0c)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(246,111,20,0.5)' }} className="anim-pulse">
                  <FiDroplet size={24} color="#fff" />
                </div>
                <div>
                  <h1 className="fe-h1">Fuel & Expense Management</h1>
                  <p style={{ fontSize:14, color:'#9CA3AF', margin:'4px 0 0' }}>Track operational fuel consumption and transportation expenses.</p>
                </div>
              </div>
              <p style={{ fontSize:12, color:'#6B7280', paddingLeft:68 }}>{todayStr}</p>
            </div>
            <div className="anim-fade-up" style={{ display:'flex', gap:12, flexWrap:'wrap', animationDelay:'0.1s' }}>
              <button className="fe-btn-secondary"><FiDownload size={14} /> Download Report</button>
              <button className="fe-btn-secondary" onClick={() => setModalType('expense')}><FiPlus size={14} /> Add Expense</button>
              <button className="fe-btn-primary" onClick={() => setModalType('fuel')}><FiDroplet size={14} /> Add Fuel Record</button>
            </div>
          </div>

          {/* ── KPI GRID ── */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16, marginBottom:32 }}>
            {KPIS.map((kpi, i) => (
              <div key={kpi.label} className="fe-kpi anim-fade-up" style={{ animationDelay:`${0.1 + i*0.05}s` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:`${kpi.color}15`, border:`1px solid ${kpi.color}30`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 16px ${kpi.color}20` }}>
                    <kpi.icon size={20} color={kpi.color} />
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:4, background:kpi.isGood?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', color:kpi.isGood?'#22C55E':'#EF4444', padding:'4px 8px', borderRadius:20, fontSize:11, fontWeight:700 }}>
                    {kpi.isGood ? <FiArrowUpRight size={12}/> : <FiArrowDownRight size={12}/>}
                    {kpi.trend}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:26, fontWeight:900, color:'#fff', fontFamily:'Mulish,sans-serif' }}>{kpi.val}</div>
                  <div style={{ fontSize:13, color:'#9CA3AF', marginTop:2 }}>{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── ANALYTICS CHARTS ── */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:20, marginBottom:32 }}>
            {/* Area Chart: Fuel Consumption Trend */}
            <div className="fe-glass anim-fade-up" style={{ padding:24, animationDelay:'0.3s' }}>
              <h2 className="fe-h2"><FiTrendingUp size={18} color={O} /> Fuel Consumption Trend</h2>
              <div style={{ height:200, position:'relative', display:'flex', alignItems:'flex-end', paddingTop:20 }}>
                {/* Y-axis lines */}
                {[0, 1, 2, 3].map(l => (
                  <div key={l} style={{ position:'absolute', bottom:`${l*25}%`, left:0, right:0, borderTop:'1px dashed rgba(255,255,255,0.05)', zIndex:0 }} />
                ))}
                {/* Fake Area SVG */}
                <svg viewBox="0 0 500 150" style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:1, preserveAspectRatio:'none' }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={O} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={O} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,150 L0,80 Q50,40 100,70 T200,50 T300,90 T400,30 T500,60 L500,150 Z"
                    fill="url(#areaGrad)"
                    style={{ opacity: mounted ? 1 : 0, transition:'opacity 1s ease' }}
                  />
                  <path
                    className="fe-chart-area-path"
                    d="M0,80 Q50,40 100,70 T200,50 T300,90 T400,30 T500,60"
                    fill="none" stroke={O} strokeWidth="3"
                    strokeDasharray={mounted ? "1000 0" : "0 1000"}
                    style={{ filter:'drop-shadow(0 4px 6px rgba(246,111,20,0.5))' }}
                  />
                </svg>
                {/* X-axis labels */}
                <div style={{ position:'absolute', bottom:-25, left:0, right:0, display:'flex', justifyContent:'space-between', zIndex:2 }}>
                  {CHART_MONTHS.map(m => <span key={m} style={{ fontSize:11, color:'#6B7280' }}>{m}</span>)}
                </div>
              </div>
            </div>

            {/* Bar Chart: Monthly Expenses */}
            <div className="fe-glass anim-fade-up" style={{ padding:24, animationDelay:'0.35s' }}>
              <h2 className="fe-h2"><FiBarChart2 size={18} color="#3B82F6" /> Monthly Expense</h2>
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', height:170, gap:8, paddingTop:20 }}>
                {[40, 65, 45, 80, 55, 30].map((val, i) => (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                    <div
                      className="fe-chart-bar"
                      style={{ width:'100%', height: mounted ? `${val}%` : '0%', background:`linear-gradient(to top, #1e3a8a, #3B82F6)`, borderRadius:'4px 4px 0 0', boxShadow:'0 0 10px rgba(59,130,246,0.2)' }}
                    />
                    <span style={{ fontSize:10, color:'#6B7280' }}>{CHART_MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut Chart: Expense Categories */}
            <div className="fe-glass anim-fade-up" style={{ padding:24, animationDelay:'0.4s', display:'flex', flexDirection:'column' }}>
              <h2 className="fe-h2"><FiPieChart size={18} color="#A78BFA" /> Categories</h2>
              <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                <div style={{ position:'relative', width:120, height:120 }}>
                  <svg width="120" height="120" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    {/* Fuel 45% */}
                    <circle className="fe-chart-donut" cx="50" cy="50" r="40" fill="none" stroke={O} strokeWidth="12" strokeDasharray={mounted ? `${0.45 * 251} 251` : "0 251"} style={{ filter:'drop-shadow(0 0 4px rgba(246,111,20,0.5))' }} />
                    {/* Maint 30% */}
                    <circle className="fe-chart-donut" cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray={mounted ? `${0.30 * 251} 251` : "0 251"} strokeDashoffset={mounted ? `-${0.45 * 251}` : "0"} />
                    {/* Salary 25% */}
                    <circle className="fe-chart-donut" cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray={mounted ? `${0.25 * 251} 251` : "0 251"} strokeDashoffset={mounted ? `-${0.75 * 251}` : "0"} />
                  </svg>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:18, fontWeight:900, color:'#fff', fontFamily:'Mulish' }}>₹22L</span>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {[{l:'Fuel', c:O, p:'45%'},{l:'Maint.', c:'#3B82F6', p:'30%'},{l:'Salary', c:'#10B981', p:'25%'}].map(x => (
                    <div key={x.l} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:x.c, boxShadow:`0 0 8px ${x.c}` }} />
                      <div style={{ display:'flex', flexDirection:'column' }}>
                        <span style={{ fontSize:12, fontWeight:700, color:'#E8EAF0' }}>{x.p}</span>
                        <span style={{ fontSize:10, color:'#6B7280' }}>{x.l}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── LOWER SECTION: Tables & Sidebars ── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24 }}>
            
            {/* Left: Data Tables */}
            <div className="fe-glass anim-fade-up" style={{ display:'flex', flexDirection:'column', animationDelay:'0.45s', overflow:'hidden' }}>
              <div style={{ display:'flex', alignItems:'center', gap:4, padding:'16px 24px', borderBottom:'1px solid rgba(246,111,20,0.1)' }}>
                <button onClick={() => setActiveTab('fuel')} style={{ background:activeTab==='fuel'?'rgba(246,111,20,0.1)':'transparent', border:'none', padding:'8px 20px', borderRadius:10, color:activeTab==='fuel'?O:'#9CA3AF', fontWeight:700, fontSize:14, cursor:'pointer', transition:'all .2s' }}>Fuel Log</button>
                <button onClick={() => setActiveTab('expense')} style={{ background:activeTab==='expense'?'rgba(246,111,20,0.1)':'transparent', border:'none', padding:'8px 20px', borderRadius:10, color:activeTab==='expense'?O:'#9CA3AF', fontWeight:700, fontSize:14, cursor:'pointer', transition:'all .2s' }}>Expenses</button>
              </div>

              <div className="fe-table-wrap">
                {activeTab === 'fuel' ? (
                  <table className="fe-table">
                    <thead><tr><th>Date</th><th>Vehicle</th><th>Driver</th><th>Station</th><th>Qty (L)</th><th>Cost</th><th>Efficiency</th><th>Actions</th></tr></thead>
                    <tbody>
                      {FUEL_LOGS.map(f => (
                        <tr key={f.id}>
                          <td>{f.date}</td>
                          <td style={{ color:O, fontWeight:700 }}>{f.vehicle}</td>
                          <td>{f.driver}</td>
                          <td>{f.station}</td>
                          <td style={{ fontWeight:700 }}>{f.qty}</td>
                          <td style={{ color:'#22C55E' }}>₹{f.cost.toLocaleString()}</td>
                          <td><span className="fe-badge" style={{ background:'rgba(59,130,246,0.1)', color:'#3B82F6' }}>{f.eff}</span></td>
                          <td><button style={{ background:'none', border:'none', color:'#9CA3AF', cursor:'pointer' }}><FiFileText size={16}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="fe-table">
                    <thead><tr><th>ID</th><th>Category</th><th>Vehicle</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {EXPENSES.map(e => {
                        const statusColors = { APPROVED:{c:'#22C55E',b:'rgba(34,197,94,0.1)'}, PENDING:{c:'#F59E0B',b:'rgba(245,158,11,0.1)'}, REJECTED:{c:'#EF4444',b:'rgba(239,68,68,0.1)'} };
                        const sc = statusColors[e.status];
                        return (
                          <tr key={e.id}>
                            <td style={{ color:'#A78BFA', fontWeight:700 }}>{e.id}</td>
                            <td>{e.cat}</td>
                            <td>{e.vehicle}</td>
                            <td style={{ color:'#22C55E', fontWeight:700 }}>₹{e.amt.toLocaleString()}</td>
                            <td>{e.date}</td>
                            <td><span className="fe-badge" style={{ background:sc.b, color:sc.c }}>{e.status}</span></td>
                            <td><button style={{ background:'none', border:'none', color:'#9CA3AF', cursor:'pointer' }}><FiFileText size={16}/></button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right: Transactions & Alerts */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              
              {/* Alerts */}
              <div className="fe-glass anim-fade-up" style={{ padding:20, animationDelay:'0.5s' }}>
                <h2 className="fe-h2" style={{ color:'#F9FAFB' }}><FiAlertCircle size={18} color="#F59E0B" /> System Alerts</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {ALERTS.map((a, i) => {
                    const c = a.type === 'danger' ? '#EF4444' : a.type === 'warning' ? '#F59E0B' : '#3B82F6';
                    return (
                      <div key={i} style={{ display:'flex', gap:12, paddingBottom:12, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:c, marginTop:6, boxShadow:`0 0 8px ${c}` }} />
                        <div>
                          <div style={{ fontSize:13, color:'#D1D5DB', lineHeight:1.4 }}>{a.msg}</div>
                          <div style={{ fontSize:10, color:'#6B7280', marginTop:4 }}>{a.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transactions */}
              <div className="fe-glass anim-fade-up" style={{ padding:20, animationDelay:'0.55s' }}>
                <h2 className="fe-h2"><FiCreditCard size={18} color={O} /> Recent Transactions</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {TRANSACTIONS.map((t, i) => {
                    const icons = { fuel:FiDroplet, maint:FiTool, insur:FiShield, toll:FiMapPin, salary:FiUser };
                    const Icon = icons[t.type];
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Icon size={16} color="#9CA3AF" />
                          </div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color:'#F9FAFB' }}>{t.title}</div>
                            <div style={{ fontSize:11, color:'#6B7280' }}>{t.sub} • {t.time}</div>
                          </div>
                        </div>
                        <div style={{ fontSize:14, fontWeight:800, color:'#EF4444', fontFamily:'Mulish' }}>{t.amt}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── MODALS ── */}
        {modalType && (
          <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)' }}>
            <div className="fe-glass" style={{ width:'100%', maxWidth:540, padding:24, animation:'fe-fade-up 0.3s ease' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                <h2 className="fe-h2" style={{ marginBottom:0 }}>{modalType === 'fuel' ? 'Add Fuel Record' : 'Add Expense'}</h2>
                <button onClick={() => setModalType(null)} style={{ background:'none', border:'none', color:'#9CA3AF', cursor:'pointer' }}><FiX size={20}/></button>
              </div>

              {modalType === 'fuel' ? (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div><label className="fe-label">Vehicle</label><select className="fe-input"><option>V-1001</option><option>V-1002</option></select></div>
                  <div><label className="fe-label">Driver</label><select className="fe-input"><option>Ravi Kumar</option><option>Anand Patel</option></select></div>
                  <div><label className="fe-label">Fuel Station</label><input className="fe-input" placeholder="e.g. Reliance" /></div>
                  <div><label className="fe-label">Fuel Type</label><select className="fe-input"><option>Diesel</option><option>Petrol</option><option>CNG</option></select></div>
                  <div><label className="fe-label">Quantity (L)</label><input className="fe-input" type="number" /></div>
                  <div><label className="fe-label">Price/Litre (₹)</label><input className="fe-input" type="number" /></div>
                  <div><label className="fe-label">Odometer</label><input className="fe-input" type="number" /></div>
                  <div><label className="fe-label">Total Cost</label><input className="fe-input" disabled value="₹0.00" /></div>
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div style={{ gridColumn:'1/-1' }}><label className="fe-label">Expense Type</label><select className="fe-input"><option>Maintenance</option><option>Insurance</option><option>Toll</option></select></div>
                  <div><label className="fe-label">Amount (₹)</label><input className="fe-input" type="number" /></div>
                  <div><label className="fe-label">Date</label><input className="fe-input" type="date" /></div>
                  <div style={{ gridColumn:'1/-1' }}><label className="fe-label">Description</label><input className="fe-input" /></div>
                  <div style={{ gridColumn:'1/-1' }}>
                    <div style={{ border:'1px dashed rgba(246,111,20,0.3)', borderRadius:12, padding:20, textAlign:'center', cursor:'pointer', background:'rgba(246,111,20,0.02)' }}>
                      <FiUpload size={20} color={O} style={{ marginBottom:8 }} />
                      <div style={{ fontSize:13, color:'#D1D5DB' }}>Upload Invoice/Receipt</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:24 }}>
                <button className="fe-btn-secondary" onClick={() => setModalType(null)}>Cancel</button>
                <button className="fe-btn-primary">Save Record</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
