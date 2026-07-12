'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { maintenanceService } from '@/services/maintenanceService';
import { 
  Wrench, ShieldCheck, Clock, AlertTriangle, Calendar, 
  Plus, Search, ArrowRight, Settings2, Trash2, X, Check, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function MaintenancePage() {
  const { isReady, isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    type: 'Oil Change',
    asset: '',
    date: '',
    cost: '',
    progress: '0',
    status: 'Scheduled',
  });

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchMaintenance();
    }
  }, [isReady, isAuthenticated]);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getMaintenance();
      setServices(data);
      setError(false);
    } catch (err) {
      console.error('Error fetching maintenance:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.asset || !newService.date || !newService.cost) {
      toast.error('Please fill in asset reference, schedule date, and estimated cost');
      return;
    }

    try {
      const payload = {
        type: newService.type,
        asset: newService.asset,
        date: newService.date,
        cost: newService.cost,
        progress: parseInt(newService.progress) || 0,
        status: newService.status,
      };

      const created = await maintenanceService.createMaintenance(payload);
      setServices([created, ...services]);
      setShowAddModal(false);
      setNewService({
        type: 'Oil Change',
        asset: '',
        date: '',
        cost: '',
        progress: '0',
        status: 'Scheduled',
      });
      toast.success('Maintenance scheduled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule maintenance');
    }
  };

  const handleUpdateProgress = async (id, change) => {
    const target = services.find(s => s.id === id);
    if (!target) return;

    try {
      const nextProg = Math.min(100, Math.max(0, target.progress + change));
      const status = nextProg === 100 ? 'Completed' : nextProg > 0 ? 'In Progress' : 'Scheduled';

      const updated = await maintenanceService.updateMaintenance(id, { progress: nextProg, status });
      setServices(services.map(s => s.id === id ? updated : s));
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const handleComplete = async (id) => {
    try {
      const updated = await maintenanceService.updateMaintenance(id, { progress: 100, status: 'Completed' });
      setServices(services.map(s => s.id === id ? updated : s));
      toast.success(`Service ticket ${id} marked complete`);
    } catch (err) {
      toast.error('Failed to complete maintenance');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Operations Garage</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Maintenance Control</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Schedule diagnostic inspections, record mechanic logs, and monitor overhaul progress.</p>
        </div>
        <div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Schedule Service
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#F66F14] animate-spin" />
        </div>
      ) : error ? (
        <GlassCard className="p-8 text-center text-rose-400">
          <p>Failed to load maintenance records. Please verify database connectivity.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          {/* Service Queue Progress Checklist */}
          <GlassCard className="p-5" hover={false}>
            <h3 className="text-lg font-bold text-white mb-2">Live Workshops Queue</h3>
            <p className="text-xs text-[#CAC4DA] mb-6">Active repair checklists and operational sign-offs</p>

            <div className="space-y-4">
              {services.map((svc) => (
                <div key={svc.id} className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#F66F14] font-bold">{svc.id}</span>
                      <h4 className="text-base font-bold text-white mt-0.5">{svc.type}</h4>
                      <p className="text-xs text-[#CAC4DA] font-medium">{svc.asset} • Est: {svc.cost}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      svc.status === 'Completed' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                      svc.status === 'In Progress' ? 'bg-[#F66F14]/10 border border-[#F66F14]/20 text-[#F66F14]' :
                      'bg-white/5 border border-white/10 text-[#CAC4DA]'
                    }`}>
                      {svc.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-[#CAC4DA] mb-1">
                      <span>Task Completion</span>
                      <span>{svc.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-[#F66F14] transition-all duration-300" style={{ width: `${svc.progress}%` }} />
                    </div>
                  </div>

                  {/* Service Control buttons */}
                  <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                    {svc.status !== 'Completed' && (
                      <>
                        <button 
                          onClick={() => handleUpdateProgress(svc.id, -10)} 
                          className="px-2 py-1 border border-white/10 hover:border-white/20 rounded text-[10px] text-[#CAC4DA] transition cursor-pointer"
                        >
                          -10%
                        </button>
                        <button 
                          onClick={() => handleUpdateProgress(svc.id, 10)} 
                          className="px-2 py-1 border border-white/10 hover:border-white/20 rounded text-[10px] text-[#CAC4DA] transition cursor-pointer"
                        >
                          +10%
                        </button>
                        <button 
                          onClick={() => handleComplete(svc.id)} 
                          className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded text-[10px] text-emerald-400 font-bold transition cursor-pointer"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    {svc.status === 'Completed' && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Sign-off Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="text-center py-10 text-[#CAC4DA]">No workshop items registered.</div>
              )}
            </div>
          </GlassCard>

          {/* Timeline visualization */}
          <GlassCard className="p-5" hover={false}>
            <h3 className="text-lg font-bold text-white mb-2">Upcoming Maintenance Timeline</h3>
            <p className="text-xs text-[#CAC4DA] mb-8">Asset service calendar timeline</p>

            <div className="relative border-l border-white/10 pl-6 ml-3 space-y-6">
              {services.filter(s => s.status !== 'Completed').map((svc) => (
                <div key={svc.id} className="relative">
                  {/* Timeline node dot */}
                  <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#060910] border-2 border-[#F66F14]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F66F14]" />
                  </span>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#F66F14] font-bold font-mono">
                        {new Date(svc.date).toISOString().split('T')[0]}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-white/30" />
                      <span className="text-xs text-[#CAC4DA]">{svc.id}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{svc.type}</h4>
                    <p className="text-xs text-[#CAC4DA]">Asset: <strong className="text-white font-medium">{svc.asset}</strong> • Cost: <strong className="text-white font-medium">{svc.cost}</strong></p>
                  </div>
                </div>
              ))}
              {services.filter(s => s.status !== 'Completed').length === 0 && (
                <div className="text-center py-10 text-[#CAC4DA] text-sm">
                  No upcoming service tickets active.
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Schedule Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4">
          <GlassCard className="w-full max-w-md p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Create Service Record</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#CAC4DA] hover:text-white border border-transparent hover:border-white/10 p-1.5 rounded-lg transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-[#CAC4DA] mb-6">Authorize scheduled fleet repair bills.</p>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Service Type</label>
                <select
                  value={newService.type}
                  onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
                >
                  <option value="Oil Change">Oil Change</option>
                  <option value="Brake Service">Brake Service</option>
                  <option value="Tyre Replacement">Tyre Replacement</option>
                  <option value="Engine Inspection">Engine Inspection</option>
                  <option value="Vehicle Inspection">Vehicle Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Vehicle Asset Reference *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. V-198"
                  value={newService.asset}
                  onChange={(e) => setNewService({ ...newService, asset: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Schedule Date *</label>
                  <input
                    type="date"
                    required
                    value={newService.date}
                    onChange={(e) => setNewService({ ...newService, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Est Cost (INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={newService.cost}
                    onChange={(e) => setNewService({ ...newService, cost: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Initial Progress</label>
                <input
                  type="number"
                  max="100"
                  placeholder="0"
                  value={newService.progress}
                  onChange={(e) => setNewService({ ...newService, progress: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Schedule Service
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
