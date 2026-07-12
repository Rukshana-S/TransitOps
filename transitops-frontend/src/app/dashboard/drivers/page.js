'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { driverService } from '@/services/driverService';
import { 
  Users, Plus, Search, ShieldCheck, Award, Star, 
  MapPin, Clock, Calendar, AlertCircle, X, Check, Loader2, Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function DriversPage() {
  const { isReady, isAuthenticated, role } = useAuth();
  const isAllowed = ['Fleet Manager', 'Safety Officer'].includes(role);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [newDriver, setNewDriver] = useState({
    name: '',
    employeeId: '',
    license: '',
    licenseExpiry: '',
    phone: '',
    email: '',
    joiningDate: '',
    status: 'Available',
    safetyScore: '90',
  });

  const [editingDriver, setEditingDriver] = useState(null);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchDrivers();
    }
  }, [search, statusFilter, isReady, isAuthenticated]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await driverService.getDrivers(search, statusFilter);
      setDrivers(data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.license || !newDriver.phone) {
      toast.error('Please fill in all required fields (Name, License, Phone)');
      return;
    }

    try {
      const payload = {
        name: newDriver.name.trim(),
        employeeId: newDriver.employeeId.trim(),
        license: newDriver.license.trim(),
        licenseExpiry: newDriver.licenseExpiry,
        phone: newDriver.phone.trim(),
        email: newDriver.email.trim(),
        joiningDate: newDriver.joiningDate,
        status: newDriver.status,
        safetyScore: parseInt(newDriver.safetyScore) || 90,
      };

      const created = await driverService.createDriver(payload);
      setDrivers([created, ...drivers]);
      setShowAddModal(false);
      setNewDriver({
        name: '',
        employeeId: '',
        license: '',
        licenseExpiry: '',
        phone: '',
        email: '',
        joiningDate: '',
        status: 'Available',
        safetyScore: '90',
      });
      toast.success('Driver profile onboarded without circular vehicle dependency');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to onboard driver');
    }
  };

  const handleEditClick = (driver) => {
    setEditingDriver({
      ...driver,
      employee_id: driver.employee_id || '',
      license_expiry: driver.license_expiry ? driver.license_expiry.split('T')[0] : '',
      email: driver.email || '',
      joining_date: driver.joining_date ? driver.joining_date.split('T')[0] : '',
      safety_score: driver.safety_score || '90'
    });
    setShowEditModal(true);
  };

  const handleUpdateDriver = async (e) => {
    e.preventDefault();
    if (!editingDriver.name || !editingDriver.license || !editingDriver.phone) {
      toast.error('Please fill in all required fields (Name, License, Phone)');
      return;
    }

    try {
      const payload = {
        name: editingDriver.name.trim(),
        employee_id: editingDriver.employee_id.trim(),
        license: editingDriver.license.trim(),
        license_expiry: editingDriver.license_expiry,
        phone: editingDriver.phone.trim(),
        email: editingDriver.email.trim(),
        joining_date: editingDriver.joining_date,
        status: editingDriver.status,
        safety_score: parseInt(editingDriver.safety_score) || 90,
      };

      const updated = await driverService.updateDriver(editingDriver.id, payload);
      setDrivers(drivers.map(d => d.id === editingDriver.id ? updated : d));
      setShowEditModal(false);
      setEditingDriver(null);
      toast.success(`Driver ${updated.name} profile updated`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update driver profile');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to offboard driver operator ${id}?`)) return;
    
    try {
      await driverService.deleteDriver(id);
      setDrivers(drivers.filter(d => d.id !== id));
      toast.success(`Driver ${id} offboarded`);
    } catch (err) {
      toast.error('Failed to offboard driver operator');
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Personnel Control</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Driver Registry</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Manage operator profiles, safety compliance, and live shift states.</p>
        </div>
        {isAllowed && (
          <div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Driver
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <GlassCard className="p-4" hover={false}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] px-3 py-2 text-sm w-full md:max-w-md">
            <Search className="h-4.5 w-4.5 text-[#CAC4DA]" />
            <input
              placeholder="Search by driver name, license, ID, or vehicle..."
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
              <option value="Available">Available</option>
              <option value="On Shift">On Shift</option>
              <option value="Resting">Resting</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Driver Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-[#F66F14] animate-spin" />
        </div>
      ) : error ? (
        <GlassCard className="p-8 text-center text-rose-400">
          <p>Failed to load driver profiles. Please verify database connectivity.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <GlassCard key={driver.id} className="p-5 border border-white/10 hover:border-[#F66F14]/30 transition-all duration-300" hover={true}>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Photo initials avatar with gradient glow */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[radial-gradient(circle,_rgba(246,111,20,0.35),_rgba(246,111,20,0.08))] text-lg font-bold text-[#F66F14] border border-[rgba(247,114,24,0.2)] shadow-[0_0_15px_rgba(246,111,20,0.1)]">
                    {getInitials(driver.name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-snug">{driver.name}</h3>
                    <p className="text-xs text-[#CAC4DA] font-mono mt-0.5">{driver.id} • EMP ID: {driver.employee_id || '—'}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">Lic: {driver.license}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  driver.status === 'On Shift' || driver.status === 'Available' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                  driver.status === 'Resting' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                  'bg-white/5 border border-white/10 text-white'
                }`}>
                  {driver.status}
                </span>
              </div>

              {/* Radial Safety score visual and info */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12">
                    <svg className="h-full w-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" className="stroke-white/10" strokeWidth="3" fill="transparent" />
                      <circle cx="24" cy="24" r="20" 
                        className={driver.safety_score >= 90 ? 'stroke-emerald-500' : 'stroke-[#F66F14]'} 
                        strokeWidth="3.5" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 20}
                        strokeDashoffset={((100 - (driver.safety_score || 90)) / 100) * (2 * Math.PI * 20)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{driver.safety_score}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#CAC4DA] uppercase font-bold tracking-wider">Safety Index</p>
                    <p className="text-xs text-white font-semibold">Tier-1 Driver</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#CAC4DA] uppercase block font-bold tracking-wider">Vehicle Assigned</span>
                  <span className={`text-xs font-bold truncate block ${driver.vehicle === 'Not Assigned' ? 'text-gray-500 italic' : 'text-[#F66F14]'}`}>
                    {driver.vehicle}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-[#CAC4DA] font-mono">{driver.phone}</span>
                {isAllowed && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditClick(driver)}
                      className="text-[#F66F14] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <span className="text-white/20">|</span>
                    <button 
                      onClick={() => handleDelete(driver.id)}
                      className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      Offboard
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
          {drivers.length === 0 && (
            <div className="col-span-3 text-center py-12 text-[#CAC4DA] text-sm border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
              No operator profiles found.
            </div>
          )}
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4 overflow-y-auto">
          <GlassCard className="w-full max-w-lg p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)] my-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Onboard Fleet Operator</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#CAC4DA] hover:text-white border border-transparent hover:border-white/10 p-1.5 rounded-lg transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-[#CAC4DA] mb-6">Create new profile records for legal validation. Vehicle is assigned later.</p>

            <form onSubmit={handleAddDriver} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Driver Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Richard Hendricks"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Employee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-204"
                    value={newDriver.employeeId}
                    onChange={(e) => setNewDriver({ ...newDriver, employeeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">License Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LC-DL-88301"
                    value={newDriver.license}
                    onChange={(e) => setNewDriver({ ...newDriver, license: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">License Expiry</label>
                  <input
                    type="date"
                    value={newDriver.licenseExpiry}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseExpiry: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 99000 12345"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. richard@transitops.io"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Joining Date</label>
                  <input
                    type="date"
                    value={newDriver.joiningDate}
                    onChange={(e) => setNewDriver({ ...newDriver, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Duty Status</label>
                  <select
                    value={newDriver.status}
                    onChange={(e) => setNewDriver({ ...newDriver, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="Available">Available</option>
                    <option value="On Shift">On Shift</option>
                    <option value="Resting">Resting</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Safety Score</label>
                  <input
                    type="number"
                    max="100"
                    placeholder="90"
                    value={newDriver.safetyScore}
                    onChange={(e) => setNewDriver({ ...newDriver, safetyScore: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center justify-between border-t border-white/5 pt-4 text-xs">
                <span className="text-[#CAC4DA]">Assigned Vehicle: <strong className="text-[#F66F14]">Not Assigned</strong></span>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Driver
                  </Button>
                </div>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditModal && editingDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060910]/80 backdrop-blur-md p-4 overflow-y-auto">
          <GlassCard className="w-full max-w-lg p-6 border border-[rgba(247,114,24,0.25)] shadow-[0_0_50px_rgba(246,111,20,0.2)] my-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Edit Operator Profile</h3>
              <button 
                onClick={() => { setShowEditModal(false); setEditingDriver(null); }}
                className="text-[#CAC4DA] hover:text-white border border-transparent hover:border-white/10 p-1.5 rounded-lg transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-[#CAC4DA] mb-6">Modify records for driver operator {editingDriver.id}.</p>

            <form onSubmit={handleUpdateDriver} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Driver Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingDriver.name || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Employee ID</label>
                  <input
                    type="text"
                    value={editingDriver.employee_id || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, employee_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">License Serial *</label>
                  <input
                    type="text"
                    required
                    value={editingDriver.license || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, license: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">License Expiry</label>
                  <input
                    type="date"
                    value={editingDriver.license_expiry || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, license_expiry: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={editingDriver.phone || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={editingDriver.email || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Joining Date</label>
                  <input
                    type="date"
                    value={editingDriver.joining_date || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, joining_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Duty Status</label>
                  <select
                    value={editingDriver.status || 'Available'}
                    onChange={(e) => setEditingDriver({ ...editingDriver, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  >
                    <option value="Available">Available</option>
                    <option value="On Shift">On Shift</option>
                    <option value="Resting">Resting</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Safety Score</label>
                  <input
                    type="number"
                    max="100"
                    value={editingDriver.safety_score || ''}
                    onChange={(e) => setEditingDriver({ ...editingDriver, safety_score: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center justify-between border-t border-white/5 pt-4 text-xs font-medium">
                <span className="text-[#CAC4DA]">Assigned Vehicle: <strong className="text-white">{editingDriver.vehicle}</strong></span>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => { setShowEditModal(false); setEditingDriver(null); }}>
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
