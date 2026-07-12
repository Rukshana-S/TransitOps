'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { 
  Settings2, ShieldAlert, Bell, Globe, Key, 
  Database, RefreshCw, Eye, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [general, setGeneral] = useState({
    timezone: 'Asia/Kolkata (GMT+05:30)',
    units: 'Metric (km, Liters)',
    refreshInterval: '30s',
  });

  const [thresholds, setThresholds] = useState({
    lowFuel: '15',
    maxSpeed: '80',
    maintenanceInterval: '10000',
  });

  const [notifs, setNotifs] = useState({
    expiryAlerts: true,
    maintenanceDue: true,
    breakdowns: true,
    weeklyDigest: false,
  });

  const handleSave = (section) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Saving ${section} configs...`,
        success: `${section} settings written successfully`,
        error: 'Failed to write configurations',
      }
    );
  };

  const handleBackup = () => {
    toast.success('System database backup triggered. Exporting JSON bundle.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Platform Tuning</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">System Settings</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Tune telemetry intervals, set alert levels, and manage API validation codes.</p>
        </div>
        <div>
          <Button variant="secondary" onClick={handleBackup}>
            <Database className="mr-2 h-4 w-4" /> Database Backup
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General settings */}
        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <Globe className="h-5 w-5 text-[#F66F14]" />
            <div>
              <h3 className="text-base font-bold text-white">General Preferences</h3>
              <p className="text-xs text-[#CAC4DA]">Configure local timezone and formatting standards</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">System Timezone</label>
              <select
                value={general.timezone}
                onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
              >
                <option value="Asia/Kolkata (GMT+05:30)">Asia/Kolkata (GMT+05:30)</option>
                <option value="UTC (GMT+00:00)">UTC (GMT+00:00)</option>
                <option value="EST (GMT-05:00)">EST (GMT-05:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Unit Standard</label>
              <select
                value={general.units}
                onChange={(e) => setGeneral({ ...general, units: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
              >
                <option value="Metric (km, Liters)">Metric (km, Liters, ₹)</option>
                <option value="Imperial (miles, Gallons)">Imperial (miles, Gallons, $)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Live Telematics Refresh Rate</label>
              <select
                value={general.refreshInterval}
                onChange={(e) => setGeneral({ ...general, refreshInterval: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
              >
                <option value="10s">Fast refresh (10 seconds)</option>
                <option value="30s">Standard (30 seconds)</option>
                <option value="60s">Conservative (1 minute)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button onClick={() => handleSave('General')}>Save Preferences</Button>
            </div>
          </div>
        </GlassCard>

        {/* Telematics limits */}
        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <ShieldAlert className="h-5 w-5 text-[#F66F14]" />
            <div>
              <h3 className="text-base font-bold text-white">Alert Thresholds</h3>
              <p className="text-xs text-[#CAC4DA]">Set trigger parameters for automated notifications</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Low Fuel Alert Threshold (%)</label>
              <input
                type="number"
                value={thresholds.lowFuel}
                onChange={(e) => setThresholds({ ...thresholds, lowFuel: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Max Speed Warning Limit (km/h)</label>
              <input
                type="number"
                value={thresholds.maxSpeed}
                onChange={(e) => setThresholds({ ...thresholds, maxSpeed: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Service Interval Warning (km)</label>
              <input
                type="number"
                value={thresholds.maintenanceInterval}
                onChange={(e) => setThresholds({ ...thresholds, maintenanceInterval: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
              />
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button onClick={() => handleSave('Alert Threshold')}>Save Thresholds</Button>
            </div>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <Bell className="h-5 w-5 text-[#F66F14]" />
            <div>
              <h3 className="text-base font-bold text-white">Notification Subscriptions</h3>
              <p className="text-xs text-[#CAC4DA]">Subscribe to email or SMS operations triggers</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {[
              { id: 'expiryAlerts', label: 'License & Document Expiry Warnings', desc: 'Warns 30 days prior to operator licensing renewal dates.' },
              { id: 'maintenanceDue', label: 'Preventive Maintenance Notifications', desc: 'Alerts when scheduled odometer service marks are near.' },
              { id: 'breakdowns', label: 'Realtime Vehicle Breakdowns', desc: 'Immediate SMS/Email coordinates on active engine failure reports.' },
              { id: 'weeklyDigest', label: 'Weekly Executive Operations Report', desc: 'Summarizes fuel spend, dispatch counts, and safety averages.' },
            ].map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 p-2 rounded-xl bg-white/[0.01]">
                <div>
                  <span className="font-semibold text-white text-xs">{item.label}</span>
                  <p className="text-[10px] text-[#CAC4DA] mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={notifs[item.id]}
                    onChange={(e) => setNotifs({ ...notifs, [item.id]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#CAC4DA] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F66F14]" />
                </label>
              </div>
            ))}

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <Button onClick={() => handleSave('Notification')}>Save Settings</Button>
            </div>
          </div>
        </GlassCard>

        {/* Security / Credentials */}
        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
            <Key className="h-5 w-5 text-[#F66F14]" />
            <div>
              <h3 className="text-base font-bold text-white">Security & API Keys</h3>
              <p className="text-xs text-[#CAC4DA]">Configure webhook access and telematics endpoints</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Active Webhook Secret</span>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017]">
                <span className="font-mono text-xs text-white truncate max-w-[200px]">whsec_TransitOps_a9B2c4D6e8...</span>
                <button 
                  onClick={() => toast.success('Webhook token copied to clipboard')}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] cursor-pointer"
                >
                  Copy Secret
                </button>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Reset Security Password</span>
              <p className="text-xs text-[#CAC4DA] leading-relaxed">Ensure a multi-factor authenticator is active before updating passwords.</p>
              <button 
                onClick={() => toast.success('Recovery instruction email triggered')}
                className="mt-3 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition cursor-pointer"
              >
                Change Admin Password
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
