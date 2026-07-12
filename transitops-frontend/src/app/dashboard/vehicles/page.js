'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { vehicleService } from '@/services/vehicleService';
import { 
  Bus, Truck, Car, Plus, Search, Trash2, Edit3, Filter, 
  Settings2, Activity, ShieldCheck, ArrowRight, X, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function VehiclesPage() {
  const { isReady, isAuthenticated, role } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [newVehicle, setNewVehicle] = useState({
    id: '',
    regNumber: '',
    type: 'Bus',
    manufacturer: '',
    model: '',
    manufacturingYear: '',
    fuelType: 'Electric',
    mileage: '',
    fuel: '',
    capacity: '',
    status: 'available',
    currentLocation: '',
    notes: ''
  });

  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchVehicles();
    }
  }, [search, statusFilter, isReady, isAuthenticated]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getVehicles(search, statusFilter);
      setVehicles(data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!newVehicle.id || !newVehicle.model || !newVehicle.regNumber) {
      toast.error('Please fill in all required fields (Asset Code, Registration Number, Model)');
      return;
    }

    try {
      const payload = {
        id: newVehicle.id.trim(),
        regNumber: newVehicle.regNumber.trim(),
        type: newVehicle.type,
        manufacturer: newVehicle.manufacturer.trim(),
        model: newVehicle.model.trim(),
        manufacturingYear: newVehicle.manufacturingYear,
        fuelType: newVehicle.fuelType,
        mileage: newVehicle.mileage ? `${newVehicle.mileage} km` : '0 km',
        fuel: newVehicle.fuel ? `${newVehicle.fuel}%` : '100%',
        capacity: newVehicle.capacity,
        status: newVehicle.status,
        currentLocation: newVehicle.currentLocation.trim(),
        notes: newVehicle.notes.trim()
      };

      const created = await vehicleService.createVehicle(payload);
      setVehicles([created, ...vehicles]);
      setShowAddModal(false);
      setNewVehicle({
        id: '',
        regNumber: '',
        type: 'Bus',
        manufacturer: '',
        model: '',
        manufacturingYear: '',
        fuelType: 'Electric',
        mileage: '',
        fuel: '',
        capacity: '',
        status: 'available',
        currentLocation: '',
        notes: ''
      });
      toast.success('Vehicle registered successfully without circular driver links');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register vehicle');
    }
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicle({
      ...vehicle,
      reg_number: vehicle.reg_number || '',
      manufacturer: vehicle.manufacturer || '',
      manufacturing_year: vehicle.manufacturing_year || '',
      fuel_type: vehicle.fuel_type || 'Electric',
      mileage: vehicle.mileage ? parseInt(vehicle.mileage) : '',
      fuel: vehicle.fuel ? parseInt(vehicle.fuel) : '',
      capacity: vehicle.capacity || '',
      current_location: vehicle.current_location || '',
      notes: vehicle.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    if (!editingVehicle.model || !editingVehicle.reg_number) {
      toast.error('Please fill in all required fields (Registration Number, Model)');
      return;
    }

    try {
      const payload = {
        reg_number: editingVehicle.reg_number.trim(),
        type: editingVehicle.type,
        manufacturer: editingVehicle.manufacturer.trim(),
        model: editingVehicle.model.trim(),
        manufacturing_year: editingVehicle.manufacturing_year,
        fuel_type: editingVehicle.fuel_type,
        mileage: editingVehicle.mileage ? `${editingVehicle.mileage} km` : '0 km',
        fuel: editingVehicle.fuel ? `${editingVehicle.fuel}%` : '100%',
        capacity: editingVehicle.capacity,
        status: editingVehicle.status,
        current_location: editingVehicle.current_location.trim(),
        notes: editingVehicle.notes.trim()
      };

      const updated = await vehicleService.updateVehicle(editingVehicle.id, payload);
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? updated : v));
      setShowEditModal(false);
      setEditingVehicle(null);
      toast.success(`Vehicle ${updated.id} updated successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to decommission vehicle ${id}?`)) return;
    
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v.id !== id));
      toast.success(`Asset ${id} decommissioned`);
    } catch (err) {
      toast.error('Failed to delete vehicle record');
    }
  };

  const getVehicleIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'bus':
        return <Bus className="h-5 w-5 text-[#F66F14]" />;
      case 'truck':
        return <Truck className="h-5 w-5 text-[#F66F14]" />;
      default:
        return <Car className="h-5 w-5 text-[#F66F14]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Asset Management</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Vehicle Registry</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Verify registration states, check current telemetry and fuel readings.</p>
        </div>
        {role === 'Fleet Manager' && (
          <div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </div>
        )}
      </div>

      {/* Control panel */}
      <GlassCard className="p-4" hover={false}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] px-3 py-2 text-sm text-[#CAC4DA] w-full md:max-w-md">
            <Search className="h-4.5 w-4.5 text-[#CAC4DA]" />
            <input
              placeholder="Search by ID, model, registration or driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-sm text-white focus:outline-none focus:border-[#F66F14]/40 w-full md:w-44"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="on trip">On Trip</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Table Card */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#F66F14] animate-spin" />
        </div>
      ) : error ? (
        <GlassCard className="p-8 text-center text-rose-400">
          <p>Failed to load vehicle registry. Please verify database connectivity.</p>
        </GlassCard>
      ) : (
        <GlassCard className="p-5" hover={false}>
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-[#CAC4DA] text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Vehicle ID</th>
                  <th className="px-4 py-3 text-left">Registration</th>
                  <th className="px-4 py-3 text-left">Type / Model</th>
                  <th className="px-4 py-3 text-left">Manufacturer</th>
                  <th className="px-4 py-3 text-left">Assigned Driver</th>
                  <th className="px-4 py-3 text-left">Mileage</th>
                  <th className="px-4 py-3 text-left">Fuel / Battery</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  {role === 'Fleet Manager' && <th className="px-4 py-3 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5 font-mono text-white text-xs font-bold">{vehicle.id}</td>
                    <td className="px-4 py-3.5 text-[#CAC4DA] font-mono text-xs">{vehicle.reg_number}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {getVehicleIcon(vehicle.type)}
                        <div>
                          <p className="text-white font-medium">{vehicle.model}</p>
                          <p className="text-[10px] text-[#CAC4DA] capitalize">{vehicle.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[#CAC4DA]">{vehicle.manufacturer || '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className={vehicle.driver === 'Not Assigned' ? 'text-gray-500 text-xs italic' : 'text-white font-medium'}>
                        {vehicle.driver}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#CAC4DA] text-xs font-mono">{vehicle.mileage}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className={`h-full rounded-full ${parseInt(vehicle.fuel) > 40 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: vehicle.fuel }} />
                        </div>
                        <span className="text-white text-xs font-mono">{vehicle.fuel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        vehicle.status === 'available' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                        vehicle.status === 'on trip' ? 'bg-[#F66F14]/10 border border-[#F66F14]/20 text-[#F66F14]' :
                        'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    {role === 'Fleet Manager' && (
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex justify-center gap-1">
                          <button 
                            onClick={() => handleEditClick(vehicle)}
                            className="p-1.5 rounded-lg border border-white/5 hover:border-[#F66F14]/40 hover:bg-[#F66F14]/10 text-[#CAC4DA] hover:text-[#F66F14] transition-all cursor-pointer"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(vehicle.id)}
                            className="p-1.5 rounded-lg border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/10 text-[#CAC4DA] hover:text-rose-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-[#CAC4DA]">
                      No vehicles found matching search parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4 overflow-y-auto">
          <GlassCard className="w-full max-w-lg p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)] my-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Register New Fleet Asset</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#CAC4DA] hover:text-white border border-transparent hover:border-white/10 p-1.5 rounded-lg transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-[#CAC4DA] mb-6">Provide essential telematics metadata below. Driver is assigned later.</p>
            
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Asset Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. V-302"
                    value={newVehicle.id}
                    onChange={(e) => setNewVehicle({ ...newVehicle, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Reg Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL-4C-XY-1234"
                    value={newVehicle.regNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, regNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Asset Type</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g. Tata Motors"
                    value={newVehicle.manufacturer}
                    onChange={(e) => setNewVehicle({ ...newVehicle, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EV-Transit 10"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Mfg Year</label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={newVehicle.manufacturingYear}
                    onChange={(e) => setNewVehicle({ ...newVehicle, manufacturingYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Fuel Type</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="Electric">Electric</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Capacity (Seats/Load)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    value={newVehicle.capacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Mileage (km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15400"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Fuel / Battery %</label>
                  <input
                    type="number"
                    max="100"
                    placeholder="e.g. 85"
                    value={newVehicle.fuel}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Current Status</label>
                  <select
                    value={newVehicle.status}
                    onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="on trip">On Trip</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Current Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Terminal 1 Depot"
                    value={newVehicle.currentLocation}
                    onChange={(e) => setNewVehicle({ ...newVehicle, currentLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Notes</label>
                <textarea
                  placeholder="Additional observations or notes..."
                  value={newVehicle.notes}
                  rows={2}
                  onChange={(e) => setNewVehicle({ ...newVehicle, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm resize-none"
                />
              </div>

              <div className="flex gap-4 items-center justify-between border-t border-white/5 pt-4 text-xs">
                <span className="text-[#CAC4DA]">Assigned Driver: <strong className="text-[#F66F14]">Not Assigned</strong></span>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Vehicle
                  </Button>
                </div>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4 overflow-y-auto">
          <GlassCard className="w-full max-w-lg p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)] my-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Edit Fleet Asset</h3>
              <button 
                onClick={() => { setShowEditModal(false); setEditingVehicle(null); }}
                className="text-[#CAC4DA] hover:text-white border border-transparent hover:border-white/10 p-1.5 rounded-lg transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-[#CAC4DA] mb-6">Modify details for asset code {editingVehicle.id}.</p>
            
            <form onSubmit={handleUpdateVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Asset Code (Fixed)</label>
                  <input
                    type="text"
                    disabled
                    value={editingVehicle.id}
                    className="w-full px-3 py-2 rounded-xl border border-white/5 bg-white/5 text-[#CAC4DA] text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Reg Number *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.reg_number || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, reg_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Asset Type</label>
                  <select
                    value={editingVehicle.type || 'Bus'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Manufacturer</label>
                  <input
                    type="text"
                    value={editingVehicle.manufacturer || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Model *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.model || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Mfg Year</label>
                  <input
                    type="number"
                    value={editingVehicle.manufacturing_year || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, manufacturing_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Fuel Type</label>
                  <select
                    value={editingVehicle.fuel_type || 'Electric'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="Electric">Electric</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Capacity</label>
                  <input
                    type="number"
                    value={editingVehicle.capacity || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Mileage (km)</label>
                  <input
                    type="number"
                    value={editingVehicle.mileage || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, mileage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Fuel / Battery %</label>
                  <input
                    type="number"
                    max="100"
                    value={editingVehicle.fuel || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Status</label>
                  <select
                    value={editingVehicle.status || 'available'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="on trip">On Trip</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Current Location</label>
                  <input
                    type="text"
                    value={editingVehicle.current_location || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, current_location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Notes</label>
                <textarea
                  value={editingVehicle.notes || ''}
                  rows={2}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm resize-none"
                />
              </div>

              <div className="flex gap-4 items-center justify-between border-t border-white/5 pt-4 text-xs font-medium">
                <span className="text-[#CAC4DA]">Assigned Driver: <strong className="text-white">{editingVehicle.driver}</strong></span>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => { setShowEditModal(false); setEditingVehicle(null); }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
