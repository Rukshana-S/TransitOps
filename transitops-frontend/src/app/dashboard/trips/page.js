'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { tripService } from '@/services/tripService';
import { vehicleService } from '@/services/vehicleService';
import { driverService } from '@/services/driverService';
import { 
  Truck, ArrowRight, Plus, MapPin, Navigation, 
  CheckCircle, AlertCircle, XCircle, ArrowUpRight,
  Clock, Package, ShieldCheck, X, Loader2, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const COLUMNS = ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'];

const columnStyles = {
  'Pending': { border: 'border-white/10', text: 'text-[#CAC4DA]', bg: 'bg-[#CAC4DA]/5' },
  'Assigned': { border: 'border-sky-500/20', text: 'text-sky-400', bg: 'bg-sky-500/5' },
  'In Progress': { border: 'border-[#F66F14]/20', text: 'text-[#F66F14]', bg: 'bg-[#F66F14]/5' },
  'Completed': { border: 'border-emerald-500/20', text: 'text-emerald-400', bg: 'bg-emerald-500/5' },
  'Cancelled': { border: 'border-rose-500/20', text: 'text-rose-400', bg: 'bg-rose-500/5' },
};

export default function TripsPage() {
  const { isReady, isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newTrip, setNewTrip] = useState({
    vehicle: '',
    driver: '',
    cargo: '',
    pickup: '',
    destination: '',
    distance: '',
    eta: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchTripsAndAssets();
    }
  }, [isReady, isAuthenticated]);

  const fetchTripsAndAssets = async () => {
    try {
      setLoading(true);
      setError(false);

      // 1. Fetch current trips
      const tripsData = await tripService.getTrips();
      setTrips(tripsData);

      // 2. Fetch vehicles & drivers to filter available assets not on another trip
      const allVehicles = await vehicleService.getVehicles();
      const allDrivers = await driverService.getDrivers();

      // Only display vehicles whose status is 'available'
      const unassignedVehicles = allVehicles.filter(v => v.status === 'available');
      setAvailableVehicles(unassignedVehicles);

      // Only display drivers whose status is 'Available' (or Resting)
      const unassignedDrivers = allDrivers.filter(
        d => d.status.toLowerCase() === 'available' || d.status.toLowerCase() === 'resting'
      );
      setAvailableDrivers(unassignedDrivers);

    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const target = trips.find(t => t.id === id);
    if (!target) return;

    try {
      const updated = await tripService.updateTrip(id, { ...target, status: newStatus });
      setTrips(trips.map(trip => trip.id === id ? updated : trip));
      toast.success(`Trip ${id} moved to ${newStatus}`);
      // Refresh available assets on status change (e.g. if completed, vehicle/driver become available again)
      await fetchTripsAndAssets();
    } catch (err) {
      toast.error('Failed to change trip dispatch status');
    }
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    if (!newTrip.vehicle || !newTrip.driver || !newTrip.pickup || !newTrip.destination) {
      toast.error('Please fill in vehicle, driver, and routing fields');
      return;
    }

    try {
      const payload = {
        vehicle: newTrip.vehicle.trim(),
        driver: newTrip.driver.trim(),
        cargo: newTrip.cargo.trim() || 'General Freight',
        pickup: newTrip.pickup.trim(),
        destination: newTrip.destination.trim(),
        distance: newTrip.distance ? `${newTrip.distance} km` : '15 km',
        eta: newTrip.eta || '15:00',
        status: newTrip.status,
      };

      const created = await tripService.createTrip(payload);
      setTrips([created, ...trips]);
      setShowAddModal(false);
      setNewTrip({
        vehicle: '',
        driver: '',
        cargo: '',
        pickup: '',
        destination: '',
        distance: '',
        eta: '',
        status: 'Pending',
      });
      toast.success('Trip scheduled & dispatched');
      await fetchTripsAndAssets(); // refresh available assets
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch route');
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!confirm(`Are you sure you want to delete trip dispatch log ${id}?`)) return;
    
    try {
      await tripService.deleteTrip(id);
      setTrips(trips.filter(t => t.id !== id));
      toast.success(`Trip dispatch log ${id} deleted`);
      await fetchTripsAndAssets(); // refresh available assets
    } catch (err) {
      toast.error('Failed to delete dispatch log');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4 text-[#CAC4DA]" />;
      case 'Assigned':
        return <ShieldCheck className="h-4 w-4 text-sky-400" />;
      case 'In Progress':
        return <Navigation className="h-4 w-4 text-[#F66F14] animate-pulse" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Logistics Coordinator</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Trip Dispatcher</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Organize dispatches across active columns, check ETA states, and track route drivers.</p>
        </div>
        <div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Schedule Trip
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#F66F14] animate-spin" />
        </div>
      ) : error ? (
        <GlassCard className="p-8 text-center text-rose-400">
          <p>Failed to load trip schedules. Please verify database connectivity.</p>
        </GlassCard>
      ) : (
        /* Kanban Board Grid */
        <div className="grid gap-4 xl:grid-cols-5 items-start">
          {COLUMNS.map((colName) => {
            const colTrips = trips.filter(t => t.status === colName);
            const style = columnStyles[colName];

            return (
              <div key={colName} className="flex flex-col rounded-2xl border border-white/5 bg-black/20 p-3 h-full min-h-[500px]">
                {/* Column Title */}
                <div className="mb-3 flex items-center justify-between p-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(colName)}
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${style.text}`}>{colName}</span>
                  </div>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[#CAC4DA] font-bold">
                    {colTrips.length}
                  </span>
                </div>

                {/* Kanban List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTrips.map((trip) => (
                    <GlassCard key={trip.id} className="p-4 border border-white/5 hover:border-[#F66F14]/25 transition-all duration-300" hover={true}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#F66F14] font-bold">{trip.id}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#CAC4DA]">
                          <Clock className="h-3 w-3" /> {trip.eta}
                          <button 
                            onClick={() => handleDeleteTrip(trip.id)}
                            className="text-rose-400 hover:text-rose-300 p-0.5 rounded hover:bg-white/5 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        <p className="font-semibold text-white flex items-center gap-2">
                          <Truck className="h-3.5 w-3.5 text-[#F66F14] shrink-0" />
                          {trip.vehicle}
                        </p>
                        
                        <div className="space-y-1 pl-5.5 text-[#CAC4DA] text-[11px]">
                          <p className="truncate"><span className="text-[#CAC4DA]">Driver:</span> <strong className="text-white font-medium">{trip.driver}</strong></p>
                          <p className="truncate"><span className="text-[#CAC4DA]">Cargo:</span> <strong className="text-white font-medium">{trip.cargo}</strong></p>
                        </div>

                        {/* Path route indicators */}
                        <div className="flex items-center gap-2 border-t border-b border-white/5 py-2 mt-2">
                          <div className="shrink-0 space-y-3">
                            <MapPin className="h-3 w-3 text-sky-400" />
                            <MapPin className="h-3 w-3 text-[#F66F14]" />
                          </div>
                          <div className="text-[10px] text-[#CAC4DA] truncate space-y-1">
                            <p className="truncate"><span className="text-white/40 uppercase text-[8px] block leading-none">Pickup</span>{trip.pickup}</p>
                            <p className="truncate"><span className="text-white/40 uppercase text-[8px] block leading-none">Dest</span>{trip.destination}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#CAC4DA] pt-1">
                          <span>Distance: <strong>{trip.distance}</strong></span>
                        </div>
                      </div>

                      {/* Column transition actions */}
                      <div className="mt-4 flex flex-wrap gap-1 border-t border-white/5 pt-3">
                        {colName === 'Pending' && (
                          <button 
                            onClick={() => handleStatusChange(trip.id, 'Assigned')}
                            className="w-full text-center px-2 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase transition hover:bg-sky-500/20 cursor-pointer"
                          >
                            Assign Driver
                          </button>
                        )}
                        {colName === 'Assigned' && (
                          <button 
                            onClick={() => handleStatusChange(trip.id, 'In Progress')}
                            className="w-full text-center px-2 py-1.5 rounded-lg bg-[#F66F14]/10 border border-[#F66F14]/20 text-[#F66F14] text-[10px] font-bold uppercase transition hover:bg-[#F66F14]/20 cursor-pointer"
                          >
                            Start Route
                          </button>
                        )}
                        {colName === 'In Progress' && (
                          <div className="grid grid-cols-2 gap-1 w-full">
                            <button 
                              onClick={() => handleStatusChange(trip.id, 'Completed')}
                              className="text-center px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase transition hover:bg-emerald-500/20 cursor-pointer"
                            >
                              Arrived
                            </button>
                            <button 
                              onClick={() => handleStatusChange(trip.id, 'Cancelled')}
                              className="text-center px-2 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-bold uppercase transition hover:bg-rose-500/20 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {(colName === 'Completed' || colName === 'Cancelled') && (
                          <span className="text-[9px] text-[#CAC4DA] text-center w-full block bg-white/5 py-1 rounded">Archived log</span>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                  {colTrips.length === 0 && (
                    <div className="flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl p-6 text-center text-[#CAC4DA] text-xs">
                      Empty list
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4">
          <GlassCard className="w-full max-w-md p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Dispatch New Route</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#CAC4DA] hover:text-white border border-transparent hover:border-white/10 p-1.5 rounded-lg transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-[#CAC4DA] mb-6">Provision active dispatch tokens and routing directions.</p>

            <form onSubmit={handleAddTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Select Vehicle *</label>
                  <select
                    value={newTrip.vehicle}
                    required
                    onChange={(e) => setNewTrip({ ...newTrip, vehicle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="">-- Select Available --</option>
                    {availableVehicles.map(v => (
                      <option key={v.id} value={`${v.id} (${v.type})`}>
                        {v.id} - {v.model} ({v.type})
                      </option>
                    ))}
                  </select>
                  {availableVehicles.length === 0 && (
                    <p className="text-[10px] text-gray-500 italic mt-1">No available vehicles ready.</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Select Driver *</label>
                  <select
                    value={newTrip.driver}
                    required
                    onChange={(e) => setNewTrip({ ...newTrip, driver: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="">-- Select Available --</option>
                    {availableDrivers.map(d => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.id})
                      </option>
                    ))}
                  </select>
                  {availableDrivers.length === 0 && (
                    <p className="text-[10px] text-gray-500 italic mt-1">No available drivers ready.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Cargo Manifest / Route</label>
                <input
                  type="text"
                  placeholder="e.g. Cold storage electronics or Route A"
                  value={newTrip.cargo}
                  onChange={(e) => setNewTrip({ ...newTrip, cargo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Pickup Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North Terminal"
                    value={newTrip.pickup}
                    onChange={(e) => setNewTrip({ ...newTrip, pickup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. South Depot"
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Distance (km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 58"
                    value={newTrip.distance}
                    onChange={(e) => setNewTrip({ ...newTrip, distance: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">ETA / Schedule</label>
                  <input
                    type="text"
                    placeholder="e.g. 16:45"
                    value={newTrip.eta}
                    onChange={(e) => setNewTrip({ ...newTrip, eta: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Initial Dispatch Queue</label>
                <select
                  value={newTrip.status}
                  onChange={(e) => setNewTrip({ ...newTrip, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={availableVehicles.length === 0 || availableDrivers.length === 0}>
                  Schedule Route
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
