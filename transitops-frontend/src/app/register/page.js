'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, Eye, EyeOff, Loader2, User, Phone, Briefcase, Award, Shield, CheckSquare, XSquare, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: 'Transport Operations',
    role: 'Fleet Manager',
    password: '',
    confirmPassword: '',
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password Strength State
  const [strength, setStrength] = useState({
    score: 0,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    lengthOk: false,
  });

  // Calculate password strength
  useEffect(() => {
    const pw = form.password;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const lengthOk = pw.length >= 8;

    let score = 0;
    if (pw.length > 0) score += 1;
    if (lengthOk) score += 1;
    if (hasUpper && hasLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    setStrength({ score, hasUpper, hasLower, hasNumber, hasSpecial, lengthOk });
  }, [form.password]);

  const validateForm = () => {
    if (form.fullName.length < 3) {
      toast.error('Full Name must be at least 3 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      toast.error('Phone Number must contain 10 digits');
      return false;
    }

    if (!form.employeeId) {
      toast.error('Employee ID is required');
      return false;
    }

    const { hasUpper, hasLower, hasNumber, hasSpecial, lengthOk } = strength;
    if (!lengthOk || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      toast.error('Password does not meet validation complexity criteria');
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!agreeTerms) {
      toast.error('You must agree to the Terms & Conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await api.post('/auth/register', {
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        employee_id: form.employeeId,
        department: form.department,
        role: form.role,
        password: form.password,
      });

      toast.success(res.data.message || 'Registration successful! Please login.');
      router.push('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#060910] text-white">
      {/* LEFT SIDE: Side Illustration */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between p-12 bg-[radial-gradient(circle_at_bottom_right,rgba(246,111,20,0.15),transparent_60%)] border-r border-white/5 relative overflow-hidden">
        {/* Glow Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F66F14] to-amber-600 shadow-[0_0_20px_rgba(246,111,20,0.4)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider font-heading uppercase bg-gradient-to-r from-white to-[#CAC4DA] bg-clip-text text-transparent">
            TransitOps
          </span>
        </div>

        {/* Content */}
        <div className="relative my-auto space-y-8 z-10">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#F66F14]/10 blur-[80px] pointer-events-none" />

          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#F66F14]">Fleet Onboarding Ledger</span>
            <h1 className="text-4xl font-extrabold tracking-tight font-heading mt-2 leading-[1.2] text-white">
              Welcome to <br />TransitOps
            </h1>
            <p className="text-sm text-[#CAC4DA] mt-4 max-w-sm font-body leading-relaxed">
              Create your account to manage fleet operations, assign delivery routes, monitor diesel metrics, and check overhaul updates.
            </p>
          </div>

          {/* Interactive Floating Diagram */}
          <div className="rounded-[22px] border border-white/5 bg-[rgba(33,33,33,0.20)] p-5 shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-md max-w-sm">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-3">Enterprise Asset Modules</h3>
            <ul className="space-y-2.5 text-xs text-[#CAC4DA]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F66F14]" />
                Cargo Heavy Duty Truck Telemetry
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Intercity School Bus Routes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Warehouse Freight Logs
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                Interactive Operations Control Panel
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-gray-500 relative z-10">
          © {new Date().getFullYear()} TransitOps Platform. All rights reserved.
        </p>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_top_right,rgba(246,111,20,0.06),transparent_50%)] overflow-y-auto">
        <div className="w-full max-w-xl space-y-6 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.18)] p-8 shadow-[0_0_50px_rgba(246,111,20,0.06)] backdrop-blur-3xl my-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white font-heading">Create Account</h2>
            <p className="mt-1.5 text-sm text-[#CAC4DA] font-body">
              Register to access the Transport Operations Platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Richard Hendricks"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 font-body text-sm transition"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 font-body text-sm transition"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 font-body text-sm transition"
                  />
                </div>
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">
                  Employee ID *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-103"
                    value={form.employeeId}
                    onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 font-body text-sm transition"
                  />
                </div>
              </div>

              {/* Department Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">
                  Department *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 font-body text-sm transition cursor-pointer appearance-none"
                  >
                    <option value="Transport Operations">Transport Operations</option>
                    <option value="Fleet Management">Fleet Management</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Finance">Finance</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">
                  Assign Platform Role *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Award className="h-4 w-4" />
                  </span>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40 font-body text-sm transition cursor-pointer appearance-none"
                  >
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">
                Password *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 font-body text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {form.password && (
                <div className="mt-2.5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-[#CAC4DA]">
                    <span>Password Strength</span>
                    <span className="font-semibold uppercase font-mono">
                      {strength.score <= 2 ? 'Weak' : strength.score <= 4 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden flex gap-0.5">
                    <div className={`h-full transition-all duration-300 ${
                      strength.score <= 2 ? 'bg-rose-500 w-1/3' : 
                      strength.score <= 4 ? 'bg-amber-400 w-2/3' : 'bg-emerald-500 w-full'
                    }`} />
                  </div>
                  
                  {/* Indicators checklist */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-[#CAC4DA]">
                    <div className="flex items-center gap-1">
                      {strength.lengthOk ? <CheckSquare className="h-3 w-3 text-emerald-400" /> : <XSquare className="h-3 w-3 text-rose-400" />}
                      At least 8 characters
                    </div>
                    <div className="flex items-center gap-1">
                      {strength.hasUpper ? <CheckSquare className="h-3 w-3 text-emerald-400" /> : <XSquare className="h-3 w-3 text-rose-400" />}
                      One uppercase letter
                    </div>
                    <div className="flex items-center gap-1">
                      {strength.hasLower ? <CheckSquare className="h-3 w-3 text-emerald-400" /> : <XSquare className="h-3 w-3 text-rose-400" />}
                      One lowercase letter
                    </div>
                    <div className="flex items-center gap-1">
                      {strength.hasNumber ? <CheckSquare className="h-3 w-3 text-emerald-400" /> : <XSquare className="h-3 w-3 text-rose-400" />}
                      One number digit
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      {strength.hasSpecial ? <CheckSquare className="h-3 w-3 text-emerald-400" /> : <XSquare className="h-3 w-3 text-rose-400" />}
                      One special character (!@#$%^&*)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 font-body text-sm transition"
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#CAC4DA] font-body select-none">
                <input 
                  type="checkbox" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-[rgba(247,114,24,0.3)] bg-black/50 text-[#F66F14] focus:ring-0 cursor-pointer h-4.5 w-4.5 mt-0.5"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-[#F66F14] hover:underline font-semibold">
                    Terms & Conditions
                  </a>{' '}
                  and policy guidelines of transport operations.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 relative overflow-hidden transition group mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Bottom link */}
          <p className="mt-6 text-center text-sm text-[#CAC4DA] font-body">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#F66F14] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
