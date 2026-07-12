'use client';

import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, Briefcase, Shield, Calendar, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <GlassCard className="p-8 text-center text-[#CAC4DA]">
        <p>Loading profile...</p>
      </GlassCard>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const displayName = user.full_name || user.name || 'User';
  const initials = getInitials(displayName);

  const getRoleColor = (role) => {
    switch (role) {
      case 'Fleet Manager': return 'text-[#F66F14] border-[#F66F14]/30 bg-[#F66F14]/10';
      case 'Dispatcher': return 'text-sky-400 border-sky-400/30 bg-sky-400/10';
      case 'Safety Officer': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
      case 'Financial Analyst': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      default: return 'text-[#CAC4DA] border-white/10 bg-white/5';
    }
  };

  const getRolePermissions = (role) => {
    switch (role) {
      case 'Fleet Manager': return ['Full CRUD on all modules', 'Manage vehicles & drivers', 'Dispatch trips', 'Access financial reports', 'Compile & export reports'];
      case 'Dispatcher': return ['Create & manage trip routes', 'View vehicle & driver status', 'Read-only on financial data'];
      case 'Safety Officer': return ['Manage driver profiles', 'Schedule maintenance', 'Read-only access to trips'];
      case 'Financial Analyst': return ['Manage fuel logs', 'Record & audit expenses', 'Compile & export reports', 'Read-only on operations'];
      default: return ['Read-only access'];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Account Center</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">My Profile</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">View your account credentials and access control permissions.</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Identity Card */}
        <GlassCard className="p-6" hover={false}>
          <div className="flex flex-col items-center text-center gap-4">
            {/* Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[radial-gradient(circle,_rgba(246,111,20,0.4),_rgba(246,111,20,0.08))] text-3xl font-bold text-[#F66F14] border-2 border-[rgba(247,114,24,0.3)] shadow-[0_0_30px_rgba(246,111,20,0.2)]">
              {initials}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">{displayName}</h3>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>

            <div className="w-full space-y-3 border-t border-white/5 pt-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <Mail className="h-4 w-4 text-[#F66F14] shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] text-[#CAC4DA] uppercase font-bold tracking-wider">Email</p>
                  <p className="text-sm text-white font-medium">{user.email || '—'}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <Phone className="h-4 w-4 text-[#F66F14] shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] text-[#CAC4DA] uppercase font-bold tracking-wider">Phone</p>
                    <p className="text-sm text-white font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.department && (
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <Briefcase className="h-4 w-4 text-[#F66F14] shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] text-[#CAC4DA] uppercase font-bold tracking-wider">Department</p>
                    <p className="text-sm text-white font-medium">{user.department}</p>
                  </div>
                </div>
              )}

              {user.employee_id && (
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <User className="h-4 w-4 text-[#F66F14] shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] text-[#CAC4DA] uppercase font-bold tracking-wider">Employee ID</p>
                    <p className="text-sm text-white font-medium font-mono">{user.employee_id}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Permissions Card */}
        <GlassCard className="p-6" hover={false}>
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <Shield className="h-5 w-5 text-[#F66F14]" />
            <div>
              <h3 className="text-base font-bold text-white">Access Control Matrix</h3>
              <p className="text-xs text-[#CAC4DA]">Role-based permissions for your account tier</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className={`rounded-xl border p-4 ${getRoleColor(user.role)}`}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1">Current Role</p>
              <p className="text-lg font-extrabold">{user.role}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#CAC4DA]">Granted Permissions</p>
              {getRolePermissions(user.role).map((perm, idx) => (
                <div key={idx} className="flex items-center gap-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 px-3 py-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-400 font-medium">{perm}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 mt-4">
              <p className="text-xs text-[#CAC4DA] leading-relaxed">
                Your session is secured with <strong className="text-white">JWT authentication</strong> and role-based access control enforced on every API endpoint. Tokens expire after <strong className="text-white">30 days</strong>.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
