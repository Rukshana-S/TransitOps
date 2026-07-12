import React from 'react';
import {
  FiEye, FiEdit2, FiTrash2, FiArrowRight, FiTruck,
  FiChevronUp, FiChevronDown, FiNavigation, FiClock, FiPlus
} from 'react-icons/fi';

const STATUS_NEXT = {
  DRAFT:      { label: 'Dispatch', next: 'DISPATCHED', color: '#3B82F6' },
  DISPATCHED: { label: 'Complete', next: 'COMPLETED',  color: '#22C55E' },
};

export default function TripTableView({
  trips, onView, onEdit, onDelete, onStatusChange, onCreate, columnConfig
}) {
  const [sortKey, setSortKey]   = React.useState('tripCode');
  const [sortDir, setSortDir]   = React.useState('asc');
  const [actionMenu, setActionMenu] = React.useState(null); // trip.id

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...trips].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc'
      ? <FiChevronUp size={12} style={{ marginLeft: '4px' }} />
      : <FiChevronDown size={12} style={{ marginLeft: '4px' }} />;
  };

  const thStyle = (col) => ({
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: 700,
    color: sortKey === col ? '#FF8A30' : '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    textAlign: 'left',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    background: '#0F1623',
    borderBottom: '1px solid #1F2937',
  });

  if (trips.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '360px',
        background: '#111827', borderRadius: '16px', border: '1px solid #1F2937',
        padding: '48px',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'rgba(255,138,48,0.08)', border: '1px solid rgba(255,138,48,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
        }}>
          <FiTruck size={32} color="#FF8A30" />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F9FAFB', margin: '0 0 8px' }}>No trips found</h3>
        <p style={{ fontSize: '14px', color: '#4B5563', margin: '0 0 24px', textAlign: 'center', maxWidth: '320px' }}>
          Your dispatch board is empty. Create your first trip to get started.
        </p>
        <button
          onClick={onCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #FF8A30, #ea580c)',
            border: 'none', borderRadius: '10px',
            padding: '10px 22px', color: '#fff',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255,138,48,0.3)',
          }}
        >
          <FiPlus size={16} />
          Create First Trip
        </button>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #1F2937' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '130px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '110px' }} />
            <col style={{ width: '120px' }} />
            <col />
            <col />
            <col style={{ width: '100px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '80px' }} />
          </colgroup>
          <thead>
            <tr>
              {[
                { key: 'tripCode',        label: 'Trip #'      },
                { key: 'vehicleId',       label: 'Vehicle'     },
                { key: 'driverId',        label: 'Driver'      },
                { key: 'cargoWeight',     label: 'Cargo (kg)'  },
                { key: 'source',          label: 'From'        },
                { key: 'destination',     label: 'To'          },
                { key: 'plannedDistance', label: 'Distance'    },
                { key: null,              label: 'Est. Time'   },
                { key: 'status',          label: 'Status'      },
                { key: null,              label: ''            },
              ].map((col, i) => (
                <th
                  key={i}
                  style={thStyle(col.key)}
                  onClick={() => col.key && handleSort(col.key)}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {col.label}
                    {col.key && <SortIcon col={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((trip, idx) => {
              const cfg = columnConfig[trip.status] || {};
              const hours = Math.floor(trip.plannedDistance / 60);
              const mins  = Math.round(trip.plannedDistance % 60);
              const next  = STATUS_NEXT[trip.status];
              const isMenuOpen = actionMenu === trip.id;

              return (
                <tr
                  key={trip.id}
                  style={{
                    borderBottom: '1px solid #1F2937',
                    background: idx % 2 === 0 ? '#111827' : '#0F1623',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#161B26'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#111827' : '#0F1623'}
                >
                  {/* Trip # */}
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: cfg.color || '#FF8A30' }}>
                      {trip.tripCode}
                    </span>
                  </td>

                  {/* Vehicle */}
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: '13px', color: '#D1D5DB', fontWeight: 500 }}>{trip.vehicleId}</span>
                  </td>

                  {/* Driver */}
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: '13px', color: '#D1D5DB' }}>{trip.driverId}</span>
                  </td>

                  {/* Cargo */}
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{trip.cargoWeight} kg</span>
                  </td>

                  {/* From */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {trip.source}
                      </span>
                    </div>
                  </td>

                  {/* To */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {trip.destination}
                      </span>
                    </div>
                  </td>

                  {/* Distance */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiNavigation size={12} color="#3B82F6" />
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>{trip.plannedDistance} km</span>
                    </div>
                  </td>

                  {/* Est. Time */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiClock size={12} color="#F59E0B" />
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>{hours}h {mins}m</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                      background: `${cfg.color}15`,
                      color: cfg.color,
                      border: `1px solid ${cfg.color}30`,
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.color }} />
                      {cfg.title}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '13px 12px' }}>
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                      <button
                        onClick={() => setActionMenu(isMenuOpen ? null : trip.id)}
                        style={{
                          background: 'none', border: '1px solid #2A3143',
                          borderRadius: '7px', padding: '5px 8px',
                          color: '#6B7280', cursor: 'pointer', fontSize: '12px',
                          display: 'flex', alignItems: 'center', gap: '4px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF8A30'; e.currentTarget.style.color = '#FF8A30'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A3143'; e.currentTarget.style.color = '#6B7280'; }}
                      >
                        Actions
                      </button>

                      {isMenuOpen && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setActionMenu(null)} />
                          <div style={{
                            position: 'absolute', right: 0, top: '30px',
                            background: '#0F1623', border: '1px solid #2A3143',
                            borderRadius: '10px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                            zIndex: 20, minWidth: '170px', padding: '4px',
                          }}>
                            {[
                              { label: 'View',   icon: FiEye,   action: () => { setActionMenu(null); onView(trip); },   color: '#9CA3AF' },
                              { label: 'Edit',   icon: FiEdit2, action: () => { setActionMenu(null); onEdit(trip); },   color: '#9CA3AF' },
                            ].map(item => (
                              <button
                                key={item.label}
                                onClick={item.action}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '8px',
                                  width: '100%', background: 'none', border: 'none',
                                  padding: '8px 12px', color: item.color, fontSize: '13px',
                                  fontWeight: 500, cursor: 'pointer', borderRadius: '6px',
                                  transition: 'background 0.15s', textAlign: 'left',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#2A3143'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                              >
                                <item.icon size={13} />
                                {item.label}
                              </button>
                            ))}

                            {next && (
                              <>
                                <div style={{ height: '1px', background: '#2A3143', margin: '2px 0' }} />
                                <button
                                  onClick={() => { setActionMenu(null); onStatusChange(trip.id, next.next); }}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    width: '100%', background: 'none', border: 'none',
                                    padding: '8px 12px', color: next.color, fontSize: '13px',
                                    fontWeight: 600, cursor: 'pointer', borderRadius: '6px',
                                    transition: 'background 0.15s', textAlign: 'left',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#2A3143'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                  <FiArrowRight size={13} />
                                  {next.label}
                                </button>
                              </>
                            )}

                            <div style={{ height: '1px', background: '#2A3143', margin: '2px 0' }} />
                            <button
                              onClick={() => { setActionMenu(null); onDelete(trip.id); }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                width: '100%', background: 'none', border: 'none',
                                padding: '8px 12px', color: '#EF4444', fontSize: '13px',
                                fontWeight: 500, cursor: 'pointer', borderRadius: '6px',
                                transition: 'background 0.15s', textAlign: 'left',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#2A3143'}
                              onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                              <FiTrash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      <div style={{
        padding: '12px 16px',
        background: '#0F1623',
        borderTop: '1px solid #1F2937',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '12px', color: '#4B5563' }}>
          Showing <span style={{ color: '#9CA3AF', fontWeight: 600 }}>{trips.length}</span> trip{trips.length !== 1 ? 's' : ''}
        </span>
        <span style={{ fontSize: '11px', color: '#374151' }}>Click column headers to sort</span>
      </div>
    </div>
  );
}
