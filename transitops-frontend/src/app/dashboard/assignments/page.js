'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { assignmentService } from '@/services/assignmentService';
import { vehicleService } from '@/services/vehicleService';
import { driverService } from '@/services/driverService';
import { 
  Link2, Link2Off, Loader2, Plus, Trash2, ShieldCheck, CarFront, 
  Activity, Info, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '@/context/AuthContext';

export default function VehicleAssignmentPage() {
  const { isReady, isAuthenticated } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchData();
    }
  }, [isReady, isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      
      // 1. Fetch current assignments
      const current = await assignmentService.getAssignments();
      setAssignments(current);

      // 2. Fetch vehicles & drivers to filter
      const allVehicles = await vehicleService.getVehicles();
      const allDrivers = await driverService.getDrivers();

      // Only show vehicles whose status is 'available' and driver is 'Not Assigned'
      const filteredVehicles = allVehicles.filter(
        v => v.status === 'available' && v.driver === 'Not Assigned'
      );
      setAvailableVehicles(filteredVehicles);

      // Only show drivers whose status is 'Available' and vehicle is 'Not Assigned'
      const filteredDrivers = allDrivers.filter(
        d => d.status === 'Available' && d.vehicle === 'Not Assigned'
      );
      setAvailableDrivers(filteredDrivers);

      setSelectedVehicle('');
      setSelectedDriver('');
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedDriver) {
      toast.error('Please select both a vehicle and a driver');
      return;
    }

    try {
      setSubmitLoading(true);
      await assignmentService.createAssignment(selectedVehicle, selectedDriver);
      toast.success('Vehicle and Driver successfully linked');
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to establish assignment link');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteAssignment = async (vehicleId) => {
    if (!confirm('Are you sure you want to delete this vehicle-driver assignment?')) return;

    try {
      await assignmentService.deleteAssignment(vehicleId);
      toast.success('Assignment deleted. Both assets are now unassigned.');
      await fetchData();
    } catch (err) {
      toast.error('Failed to clear assignment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Asset Matching</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Vehicle Assignment</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Link available fleet vehicles with resting drivers before routing schedules.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#F66F14] animate-spin" />
        </div>
      ) : error ? (
        <GlassCard className="p-8 text-center text-rose-400">
          <p>Failed to load vehicle-driver assignments. Please verify database connection status.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* Create Assignment Form */}
          <GlassCard className="p-6 border border-[rgba(247,114,24,0.15)]" hover={false}>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Link2 className="h-5 w-5 text-[#F66F14]" /> Establish Live Assignment
            </h3>
            <p className="text-xs text-[#CAC4DA] mb-6">Select from verified unassigned fleet assets below.</p>

            <form onSubmit={handleAssign} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Select Vehicle *</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-sm text-white focus:outline-none focus:border-[#F66F14]/40"
                >
                  <option value="">-- Choose Available Vehicle --</option>
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.id} - {v.model} ({v.reg_number})
                    </option>
                  ))}
                </select>
                {availableVehicles.length === 0 && (
                  <p className="text-[10px] text-gray-500 italic mt-1">No unassigned available vehicles found.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Select Driver *</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-sm text-white focus:outline-none focus:border-[#F66F14]/40"
                >
                  <option value="">-- Choose Available Driver --</option>
                  {availableDrivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} - {d.name} (Safety: {d.safety_score}%)
                    </option>
                  ))}
                </select>
                {availableDrivers.length === 0 && (
                  <p className="text-[10px] text-gray-500 italic mt-1">No unassigned available drivers found.</p>
                )}
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-[#CAC4DA] flex gap-2">
                <Info className="h-4 w-4 text-[#F66F14] shrink-0" />
                <p>Establishing assignment binds the operator profile to the asset registry, making them ready for trip dispatches.</p>
              </div>

              <Button 
                type="submit" 
                className="w-full justify-center" 
                disabled={submitLoading || availableDrivers.length === 0 || availableVehicles.length === 0}
              >
                {submitLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Create Link Assignment</>
                )}
              </Button>
            </form>
          </GlassCard>

          {/* List assignments */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-5" hover={false}>
              <h3 className="text-base font-bold text-white mb-1">Active Assignment Ledger</h3>
              <p className="text-xs text-[#CAC4DA] mb-4">Current mapped operations assets.</p>

              <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.01]">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-[#CAC4DA] text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Vehicle Model</th>
                      <th className="px-4 py-3 text-left">Vehicle ID</th>
                      <th className="px-4 py-3 text-left">Driver Name</th>
                      <th className="px-4 py-3 text-left">Driver ID / Phone</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {assignments.map((item) => (
                      <tr key={item.vehicle_id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-white font-medium">
                          <div className="flex items-center gap-2">
                            <CarFront className="h-4 w-4 text-[#F66F14]" />
                            <div>
                              <p className="text-white font-medium">{item.vehicle_model}</p>
                              <p className="text-[10px] text-[#CAC4DA] font-mono">{item.vehicle_reg}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#CAC4DA] font-mono text-xs">{item.vehicle_id}</td>
                        <td className="px-4 py-3 text-white font-medium">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            <span>{item.driver_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white text-xs font-mono">{item.driver_id}</p>
                          <p className="text-[10px] text-[#CAC4DA] font-mono">{item.driver_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteAssignment(item.vehicle_id)}
                            className="p-1.5 rounded-lg border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/10 text-[#CAC4DA] hover:text-rose-400 transition cursor-pointer"
                            title="Remove Link Assignment"
                          >
                            <Link2Off className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {assignments.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-[#CAC4DA] italic">
                          No active vehicle assignments established. Link a vehicle and driver on the left panel.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
