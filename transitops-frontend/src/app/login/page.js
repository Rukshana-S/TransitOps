'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2, Bus, Truck, Navigation, Home, BarChart3 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: 'admin@transitops.io', password: 'demo1234' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter your email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      toast.success(`Welcome back, ${res.data.user.name || 'User'}!`);
      // Call AuthContext login which saves token/profile and automatically redirects based on role
      login(res.data.token, res.data.user);
    } catch (err) {
      console.error(err);
      
      // Provide detailed error messages based on error type
      if (err.code === 'ECONNREFUSED' || err.message === 'Network Error') {
        toast.error('Backend server is not running. Please start the backend on port 5000.');
      } else if (err.response?.status === 401) {
        toast.error('Invalid email or password. Test: admin@transitops.io / demo1234');
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || 'Invalid input. Please check your credentials.');
      } else {
        toast.error(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#060910] text-white">
      {/* LEFT SIDE: Large illustration showing Fleet elements */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-[radial-gradient(circle_at_bottom_right,rgba(246,111,20,0.15),transparent_60%)] border-r border-white/5 relative overflow-hidden">
        {/* Glow Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Top Branding Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F66F14] to-amber-600 shadow-[0_0_20px_rgba(246,111,20,0.4)]">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider font-heading uppercase bg-gradient-to-r from-white to-[#CAC4DA] bg-clip-text text-transparent">
            TransitOps
          </span>
        </div>

        {/* Illustration Content */}
        <div className="relative my-auto space-y-8 z-10">
          {/* Ambient Orange Glow Circle */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#F66F14]/10 blur-[80px] pointer-events-none" />

          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#F66F14]">Enterprise Control Room</span>
            <h1 className="text-5xl font-extrabold tracking-tight font-heading mt-2 leading-[1.1]">
              Welcome <br />Back
            </h1>
            <p className="text-base text-[#CAC4DA] mt-4 max-w-md font-body leading-relaxed">
              Login to access your smart transit telemetry dashboard, control vehicle garages, and supervise live route dispatch metrics.
            </p>
          </div>

          {/* Interactive Floating Diagram */}
          <div className="rounded-[22px] border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.30)] p-6 shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-md max-w-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <span className="text-xs font-mono text-[#F66F14] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F66F14] animate-ping" /> System Live Coordinates
              </span>
              <span className="text-[10px] text-[#CAC4DA] font-mono">HQ HUB-01</span>
            </div>
            
            {/* Visual list of items */}
            <div className="space-y-3.5 text-xs text-[#CAC4DA]">
              <div className="flex items-center gap-3">
                <Truck className="h-4.5 w-4.5 text-[#F66F14]" />
                <span>Cargo Fleet Active Route Tracing</span>
              </div>
              <div className="flex items-center gap-3">
                <Bus className="h-4.5 w-4.5 text-sky-400" />
                <span>School Transit Shift Schedules</span>
              </div>
              <div className="flex items-center gap-3">
                <Navigation className="h-4.5 w-4.5 text-emerald-400" />
                <span>GPS Telemetry Waypoints Connected</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4.5 w-4.5 text-purple-400" />
                <span>Real-time Financial Operations Audit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="text-xs text-gray-500 relative z-10">
          © {new Date().getFullYear()} TransitOps Platform. All rights reserved.
        </p>
      </div>

      {/* RIGHT SIDE: Glass Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_top_right,rgba(246,111,20,0.06),transparent_50%)]">
        <div className="w-full max-w-md space-y-8 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.20)] p-8 shadow-[0_0_50px_rgba(246,111,20,0.08)] backdrop-blur-2xl">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white font-heading">Sign In</h2>
            <p className="mt-2 text-sm text-[#CAC4DA] font-body">
              Log in to the Smart Transport Operations Platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[rgba(247,114,24,0.15)] bg-[rgba(6,9,16,0.75)] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 font-body transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">
                    Password
                  </label>
                  <a href="#" className="text-xs text-[#F66F14] hover:underline font-body">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 rounded-2xl border border-[rgba(247,114,24,0.15)] bg-[rgba(6,9,16,0.75)] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40 font-body transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-white transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#CAC4DA] font-body select-none">
                <input 
                  type="checkbox" 
                  className="rounded border-[rgba(247,114,24,0.3)] bg-black/50 text-[#F66F14] focus:ring-0 cursor-pointer h-4 w-4"
                />
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 relative overflow-hidden transition group"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Create account bottom link */}
          <p className="mt-6 text-center text-sm text-[#CAC4DA] font-body">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-[#F66F14] hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
