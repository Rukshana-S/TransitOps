import React from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiNavigation, FiTruck, FiPackage, FiFileText, FiStar } from 'react-icons/fi';

const O = '#F66F14';

const css = `
  .td-modal-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(246,111,20,0.2);
    border-radius: 10px;
    padding: 10px 13px;
    color: #F9FAFB;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
  }
  .td-modal-input::placeholder { color: #374151; }
  .td-modal-input:focus {
    border-color: #F66F14;
    box-shadow: 0 0 0 3px rgba(246,111,20,0.1), 0 0 14px rgba(246,111,20,0.15);
  }
  .td-modal-input:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .td-modal-input.err { border-color: #EF4444; }
  .td-modal-label {
    display: block;
    font-size: 11px; font-weight: 700;
    color: #4B5563;
    margin-bottom: 5px;
    text-transform: uppercase; letter-spacing: 0.7px;
    font-family: 'Inter', sans-serif;
  }
  .td-modal-err { color: #EF4444; font-size: 11px; margin-top: 3px; font-family: 'Inter', sans-serif; }
`;

export default function TripModal({ isOpen, onClose, trip, onSave, isViewOnly }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  React.useEffect(() => {
    if (isOpen) {
      reset(trip ?? {
        source:'', destination:'', vehicleId:'', driverId:'',
        cargoWeight:'', plannedDistance:'',
      });
    }
  }, [isOpen, trip, reset]);

  if (!isOpen) return null;

  const canEdit = !isViewOnly && (!trip || trip.status === 'DRAFT');

  const onSubmit = (data) => {
    onSave({
      ...data,
      cargoWeight:     parseFloat(data.cargoWeight),
      plannedDistance: parseFloat(data.plannedDistance),
    });
  };

  const modalTitle = isViewOnly ? 'Trip Details' : trip ? 'Edit Trip' : 'Create New Trip';
  const modalSub   = isViewOnly
    ? `Viewing ${trip?.tripCode}`
    : trip
      ? `Editing ${trip.tripCode} · Only editable when Draft`
      : 'Fill in the details to dispatch a new trip';

  return (
    <>
      <style>{css}</style>

      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, zIndex:60,
          background:'rgba(0,0,0,0.75)',
          backdropFilter:'blur(8px)',
          animation:'td-fade-in 0.2s ease',
        }}
      />

      {/* PANEL */}
      <div style={{
        position:'fixed', inset:0, zIndex:61,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'16px', pointerEvents:'none',
      }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            pointerEvents:'auto',
            background:'rgba(6,9,16,0.95)',
            border:'1px solid rgba(246,111,20,0.3)',
            borderRadius:'20px',
            boxShadow:'0 0 60px rgba(246,111,20,0.12), 0 32px 80px rgba(0,0,0,0.7)',
            backdropFilter:'blur(32px)',
            width:'100%', maxWidth:'620px',
            maxHeight:'90vh', overflow:'hidden',
            display:'flex', flexDirection:'column',
            animation:'td-slide-in 0.25s ease',
          }}
        >
          {/* ── HEADER ── */}
          <div style={{
            padding:'20px 24px',
            borderBottom:'1px solid rgba(246,111,20,0.12)',
            background:'rgba(246,111,20,0.03)',
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{
                width:'40px', height:'40px', borderRadius:'10px',
                background:'rgba(246,111,20,0.12)',
                border:'1px solid rgba(246,111,20,0.25)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 16px rgba(246,111,20,0.2)',
              }}>
                <FiTruck size={18} color={O} />
              </div>
              <div>
                <h2 style={{ fontSize:'16px', fontWeight:800, color:'#F9FAFB', margin:0, fontFamily:'Mulish,sans-serif' }}>
                  {modalTitle}
                </h2>
                <p style={{ fontSize:'11px', color:'#4B5563', margin:'3px 0 0', fontFamily:'Inter,sans-serif' }}>
                  {modalSub}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                borderRadius:'9px', padding:'7px',
                color:'#6B7280', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=O; e.currentTarget.style.color=O; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#6B7280'; }}
            >
              <FiX size={17} />
            </button>
          </div>

          {/* ── BODY ── */}
          <div style={{ padding:'24px', overflowY:'auto', flex:1 }}>
            <form id="td-trip-form" onSubmit={handleSubmit(onSubmit)}>

              {/* SECTION: Route */}
              <ModalSection icon={FiNavigation} label="Route" color="#3B82F6">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <ModalField label={<><ColorDot color="#3B82F6" /> Pickup Location (Source)</>} error={errors.source?.message}>
                    <input
                      className={`td-modal-input${errors.source ? ' err' : ''}`}
                      disabled={!canEdit} placeholder="e.g. Mumbai"
                      {...register('source', { required:'Source is required' })}
                    />
                  </ModalField>
                  <ModalField label={<><ColorDot color="#22C55E" /> Destination</>} error={errors.destination?.message}>
                    <input
                      className={`td-modal-input${errors.destination ? ' err' : ''}`}
                      disabled={!canEdit} placeholder="e.g. Delhi"
                      {...register('destination', { required:'Destination is required' })}
                    />
                  </ModalField>
                </div>
              </ModalSection>

              {/* SECTION: Vehicle & Driver */}
              <ModalSection icon={FiTruck} label="Assignment" color={O}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <ModalField label="Vehicle" error={errors.vehicleId?.message}>
                    <select
                      className={`td-modal-input${errors.vehicleId ? ' err' : ''}`}
                      disabled={!canEdit}
                      style={{ cursor: canEdit ? 'pointer' : 'not-allowed' }}
                      {...register('vehicleId', { required:'Vehicle is required' })}
                    >
                      <option value="">Select Vehicle</option>
                      <option value="V-1001">V-1001</option>
                      <option value="V-1002">V-1002</option>
                      <option value="V-1003">V-1003</option>
                      {trip?.vehicleId && !['V-1001','V-1002','V-1003'].includes(trip.vehicleId) && (
                        <option value={trip.vehicleId}>{trip.vehicleId}</option>
                      )}
                    </select>
                  </ModalField>
                  <ModalField label="Driver" error={errors.driverId?.message}>
                    <select
                      className={`td-modal-input${errors.driverId ? ' err' : ''}`}
                      disabled={!canEdit}
                      style={{ cursor: canEdit ? 'pointer' : 'not-allowed' }}
                      {...register('driverId', { required:'Driver is required' })}
                    >
                      <option value="">Select Driver</option>
                      <option value="D-5001">D-5001 — John Doe</option>
                      <option value="D-5002">D-5002 — Jane Smith</option>
                      <option value="D-5003">D-5003 — Mike Johnson</option>
                      {trip?.driverId && !['D-5001','D-5002','D-5003'].includes(trip.driverId) && (
                        <option value={trip.driverId}>{trip.driverId}</option>
                      )}
                    </select>
                  </ModalField>
                </div>
              </ModalSection>

              {/* SECTION: Cargo */}
              <ModalSection icon={FiPackage} label="Cargo Details" color="#F59E0B">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <ModalField label="Cargo Weight (kg)" error={errors.cargoWeight?.message}>
                    <input
                      type="number" step="0.1"
                      className={`td-modal-input${errors.cargoWeight ? ' err' : ''}`}
                      disabled={!canEdit} placeholder="e.g. 1500"
                      {...register('cargoWeight', { required:'Required', min:{ value:0.1, message:'Must be > 0' } })}
                    />
                  </ModalField>
                  <ModalField label="Planned Distance (km)" error={errors.plannedDistance?.message}>
                    <input
                      type="number" step="0.1"
                      className={`td-modal-input${errors.plannedDistance ? ' err' : ''}`}
                      disabled={!canEdit} placeholder="e.g. 450"
                      {...register('plannedDistance', { required:'Required', min:{ value:0.1, message:'Must be > 0' } })}
                    />
                  </ModalField>
                </div>
              </ModalSection>
            </form>
          </div>

          {/* ── FOOTER ── */}
          <div style={{
            padding:'14px 24px',
            borderTop:'1px solid rgba(246,111,20,0.1)',
            background:'rgba(246,111,20,0.02)',
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <div style={{ fontSize:'11px', color:'#374151', fontFamily:'Inter,sans-serif' }}>
              {!isViewOnly && !canEdit && (
                <span style={{ color:'#EF4444' }}>⚠ Only Draft trips can be edited</span>
              )}
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button
                type="button" onClick={onClose}
                style={{
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:'10px', padding:'9px 20px',
                  color:'#6B7280', fontSize:'13px', fontWeight:500,
                  cursor:'pointer', fontFamily:'Inter,sans-serif',
                  transition:'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.color='#F9FAFB'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='#6B7280'; }}
              >
                {isViewOnly ? 'Close' : 'Cancel'}
              </button>

              {!isViewOnly && (
                <button
                  type="submit" form="td-trip-form" disabled={isSubmitting}
                  style={{
                    background:'linear-gradient(135deg,#F66F14,#d45c0a)',
                    border:'none', borderRadius:'10px', padding:'9px 24px',
                    color:'#fff', fontSize:'13px', fontWeight:700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    fontFamily:'Inter,sans-serif',
                    boxShadow:'0 0 20px rgba(246,111,20,0.3)',
                    transition:'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.transform='scale(1.03)'; e.currentTarget.style.boxShadow='0 0 28px rgba(246,111,20,0.5)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 0 20px rgba(246,111,20,0.3)'; }}
                >
                  {isSubmitting ? 'Saving…' : trip ? 'Save Changes' : 'Create Trip'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ModalSection({ icon: Icon, label, color, children }) {
  return (
    <div style={{ marginBottom:'22px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
        <Icon size={13} color={color} />
        <span style={{ fontSize:'11px', fontWeight:700, color:'#4B5563', textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:'Inter,sans-serif' }}>
          {label}
        </span>
        <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg, ${color}40, transparent)` }} />
      </div>
      {children}
    </div>
  );
}

function ModalField({ label, error, children }) {
  return (
    <div>
      <label className="td-modal-label">{label}</label>
      {children}
      {error && <p className="td-modal-err">{error}</p>}
    </div>
  );
}

function ColorDot({ color }) {
  return (
    <span style={{
      display:'inline-block', width:'6px', height:'6px',
      borderRadius:'50%', background:color,
      marginRight:'4px', verticalAlign:'middle',
      boxShadow:`0 0 5px ${color}`,
    }} />
  );
}
