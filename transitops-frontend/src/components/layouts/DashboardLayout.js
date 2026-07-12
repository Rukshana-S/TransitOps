'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layouts/Sidebar';
import Navbar from '@/components/layouts/Navbar';
import { useAuth } from '@/context/AuthContext';

const sectionMeta = {
  dashboard: { title: 'Dashboard', subtitle: 'Welcome back! Manage your fleet efficiently.' },
  vehicles: { title: 'Vehicle Registry', subtitle: 'Track every vehicle in the network.' },
  drivers: { title: 'Driver Management', subtitle: 'Monitor driver readiness and safety.' },
  trips: { title: 'Trip Dispatcher', subtitle: 'Coordinate routes and live dispatch.' },
  maintenance: { title: 'Maintenance Control', subtitle: 'Stay ahead of service schedules.' },
  fuel: { title: 'Fuel Analytics', subtitle: 'Optimize fuel economy and track refuels.' },
  expenses: { title: 'Fleet Expenses', subtitle: 'Detailed overview of operating costs and spend.' },
  reports: { title: 'Operations Reports', subtitle: 'Share concise operational insights.' },
  analytics: { title: 'Performance Analytics', subtitle: 'Understand trends and utilization.' },
  settings: { title: 'System Settings', subtitle: 'Tune platform defaults and rules.' },
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const activeSection = useMemo(() => {
    const key = pathname.split('/').filter(Boolean).pop() || 'dashboard';
    return sectionMeta[key] ? key : 'dashboard';
  }, [pathname]);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, isReady]);

  if (!isReady) {
    return <div className="min-h-screen bg-[#060910]" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const meta = sectionMeta[activeSection];

  return (
    <div className="min-h-screen bg-[#060910] text-white">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed((prev) => !prev)} />
        <div className="flex-1 p-3 sm:p-6">
          <Navbar
            onMenuToggle={() => setCollapsed((prev) => !prev)}
            title={meta.title}
            subtitle={meta.subtitle}
          />
          <main className="mt-6 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
