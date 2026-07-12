import React from 'react';
import {
  FiMoreVertical, FiTruck, FiUser, FiPackage,
  FiMapPin, FiNavigation, FiClock, FiEye, FiEdit2,
  FiTrash2, FiSend, FiCheckCircle, FiXCircle, FiCalendar,
} from 'react-icons/fi';

const O = '#F66F14';

// Valid status transitions — matches backend service exactly
const ACTIONS = {
  DRAFT:      [
    { label:'Dispatch', icon: FiSend,        next:'DISPATCHED', color:'#3B82F6' },
    { label:'Cancel',   icon: FiXCircle,     next:'CANCELLED',  color:'#EF4444' },
  ],
  DISPATCHED: [
    { label:'Complete', icon: FiCheckCircle, next:'COMPLETED',  color:'#22C55E' },
  ],
  COMPLETED:  [],
  CANCELLED:  [],
};

const PRIORITY_LABELS = ['High','Medium','Low'];

export default function TripCard({ trip, config, onEdit, onView, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [hovered, setHovered]   = React.useState(false);

  const hours      = Math.floor(trip.plannedDistance / 60);
  const mins       = Math.round(trip.plannedDistance % 60);
  const actions    = ACTIONS[trip.status] || [];
  const isTerminal = trip.status === 'COMPLETED' || trip.status === 'CANCELLED';
  const priority   = PRIORITY_LABELS[Math.abs(trip.tripCode?.charCodeAt(4) || 0) % 3];

  const createdDate = trip.createdAt
    ? new Date(trip.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric' })
    : '—';

  const priorityColor = { High:'#EF4444', Medium:'#F59E0B', Low:'#22C55E' }[priority];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'rgba(246,111,20,0.06)'
          : 'rgba(10,14,26,0.8)',
        borderRadius: '14px',
        border: `1px solid ${hovered ? 'rgba(246,111,20,0.4)' : 'rgba(246,111,20,0.12)'}`,
        borderTop: `3px solid ${config?.color || O}`,
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backdropFilter: 'blur(16px)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.5), 0 0 24px ${config?.color || O}20`
          : 'none',
        position: 'relative',
        cursor: 'default',
      }}
    >
      {/* ── HEADER ── */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <div style={{
            fontSize: '13px', fontWeight: 800,
            color: config?.color || O,
            letterSpacing: '0.5px',
            fontFamily: 'Mulish, sans-serif',
          }}>
            {trip.tripCode}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'3px' }}>
            <FiCalendar size={10} color="#374151" />
            <span style={{ fontSize:'10px', color:'#374151', fontFamily:'Inter,sans-serif' }}>{createdDate}</span>
            {/* Priority badge */}
            <span style={{
              fontSize:'9px', fontWeight:700, padding:'1px 6px', borderRadius:'10px',
              background:`${priorityColor}15`, color:priorityColor,
              border:`1px solid ${priorityColor}30`, fontFamily:'Inter,sans-serif',
            }}>
              {priority}
            </span>
          </div>
        </div>

        {/* 3-dot menu */}
        <div style={{ position:'relative' }}>
          <button
            onClick={() => setMenuOpen(p => !p)}
            style={{
              background:'none', border:'none', padding:'4px',
              borderRadius:'7px', color:'#4B5563', cursor:'pointer',
              display:'flex', alignItems:'center',
              transition:'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(246,111,20,0.1)'; e.currentTarget.style.color=O; }}
            onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#4B5563'; }}
          >
            <FiMoreVertical size={15} />
          </button>

          {menuOpen && (
            <>
              <div style={{ position:'fixed', inset:0, zIndex:40 }} onClick={() => setMenuOpen(false)} />
              <div style={{
                position:'absolute', right:0, top:'28px',
                background:'rgba(6,9,16,0.95)',
                border:'1px solid rgba(246,111,20,0.25)',
                borderRadius:'12px',
                boxShadow:'0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(246,111,20,0.1)',
                backdropFilter:'blur(20px)',
                zIndex:50, minWidth:'168px', padding:'5px', overflow:'hidden',
              }}>
                <CardMenuItem icon={FiEye}    label="View Trip"  color="#9CA3AF" onClick={() => { setMenuOpen(false); onView(trip); }} />
                {!isTerminal && <CardMenuItem icon={FiEdit2}  label="Edit Trip"  color="#9CA3AF" onClick={() => { setMenuOpen(false); onEdit(trip); }} />}

                {actions.length > 0 && <MenuDivider />}
                {actions.map(a => (
                  <CardMenuItem
                    key={a.next}
                    icon={a.icon}
                    label={a.label}
                    color={a.color}
                    onClick={() => { setMenuOpen(false); onStatusChange(trip.id, a.next); }}
                  />
                ))}

                {!isTerminal && (
                  <>
                    <MenuDivider />
                    <CardMenuItem icon={FiTrash2} label="Delete" color="#EF4444" onClick={() => { setMenuOpen(false); onDelete(trip.id); }} />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── FIELDS ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
        <TripField icon={FiTruck}   label="Vehicle" value={trip.vehicleId}    />
        <TripField icon={FiUser}    label="Driver"  value={trip.driverId}     />
        <TripField icon={FiPackage} label="Cargo"   value={`${trip.cargoWeight} kg`} />
      </div>

      {/* ── ROUTE ── */}
      <div style={{
        background:'rgba(246,111,20,0.04)',
        borderRadius:'10px', padding:'9px 11px',
        border:'1px solid rgba(246,111,20,0.1)',
        display:'flex', alignItems:'center', gap:'9px',
      }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#3B82F6', boxShadow:'0 0 6px #3B82F6' }} />
          <div style={{ width:'1px', height:'14px', background:'rgba(246,111,20,0.2)' }} />
          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22C55E', boxShadow:'0 0 6px #22C55E' }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:'11px', color:'#9CA3AF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:'5px', fontFamily:'Inter,sans-serif' }}>
            {trip.source}
          </div>
          <div style={{ fontSize:'11px', color:'#9CA3AF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'Inter,sans-serif' }}>
            {trip.destination}
          </div>
        </div>
        <FiMapPin size={11} color="#374151" />
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        paddingTop:'8px', borderTop:'1px solid rgba(246,111,20,0.08)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
          <FiNavigation size={11} color="#3B82F6" />
          <span style={{ fontSize:'11px', color:'#4B5563', fontFamily:'Inter,sans-serif' }}>{trip.plannedDistance} km</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
          <FiClock size={11} color="#F59E0B" />
          <span style={{ fontSize:'11px', color:'#4B5563', fontFamily:'Inter,sans-serif' }}>{hours}h {mins}m</span>
        </div>
        {/* Status badge */}
        <span style={{
          fontSize:'9px', fontWeight:700, padding:'2px 8px', borderRadius:'20px',
          background:`${config?.color || O}15`, color:config?.color || O,
          border:`1px solid ${config?.color || O}30`,
          fontFamily:'Inter,sans-serif', letterSpacing:'0.3px',
          boxShadow:`0 0 8px ${config?.color || O}15`,
        }}>
          {trip.status}
        </span>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function TripField({ icon: Icon, label, value }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
      <Icon size={11} color="#374151" style={{ flexShrink:0 }} />
      <span style={{ fontSize:'10px', color:'#374151', minWidth:'40px', fontFamily:'Inter,sans-serif' }}>{label}</span>
      <span style={{
        fontSize:'11px', color:'#D1D5DB', fontWeight:600,
        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1,
        fontFamily:'Inter,sans-serif',
      }}>
        {value}
      </span>
    </div>
  );
}

function CardMenuItem({ icon: Icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:'flex', alignItems:'center', gap:'8px',
        width:'100%', background:'none', border:'none',
        padding:'8px 12px', color, fontSize:'12px',
        fontWeight:500, cursor:'pointer', borderRadius:'7px',
        transition:'background 0.15s', textAlign:'left',
        fontFamily:'Inter,sans-serif',
      }}
      onMouseEnter={e => e.currentTarget.style.background='rgba(246,111,20,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background='none'}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

function MenuDivider() {
  return <div style={{ height:'1px', background:'rgba(246,111,20,0.1)', margin:'3px 0' }} />;
}
