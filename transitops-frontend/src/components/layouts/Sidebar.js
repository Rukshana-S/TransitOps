'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Bus, CarFront, Fuel, LayoutGrid, LifeBuoy, LogOut, Settings, ShieldCheck, Truck, Wallet, Wrench } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/vehicles', label: 'Vehicles', icon: Bus },
  { href: '/dashboard/drivers', label: 'Drivers', icon: ShieldCheck },
  { href: '/dashboard/assignments', label: 'Vehicle Assignment', icon: CarFront },
  { href: '/dashboard/trips', label: 'Trip Dispatcher', icon: Truck },
  { href: '/dashboard/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/dashboard/fuel', label: 'Fuel', icon: Fuel },
  { href: '/dashboard/expenses', label: 'Expenses', icon: Wallet },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onCollapse }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-[rgba(247,114,24,0.15)] bg-[rgba(6,9,16,0.92)] backdrop-blur-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}
    >
      <div className="flex items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[radial-gradient(circle,_rgba(246,111,20,0.35),_rgba(246,111,20,0.08))] shadow-[0_0_20px_rgba(246,111,20,0.25)] border border-[rgba(247,114,24,0.2)]">
            <Bus className="h-5 w-5 text-[#F66F14]" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-lg font-bold text-white tracking-wider">TransitOps</span>
              <p className="text-[10px] text-[#F66F14] uppercase tracking-[0.2em] font-semibold">Command Center</p>
            </div>
          )}
        </div>
        <button
          onClick={onCollapse}
          className="rounded-xl border border-[rgba(247,114,24,0.15)] p-1.5 text-[#CAC4DA] transition-all hover:text-white hover:border-[#F66F14]/40 hover:bg-[rgba(246,111,20,0.05)] cursor-pointer"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 overflow-y-auto">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 border ${active ? 'bg-[rgba(246,111,20,0.12)] border-[rgba(247,114,24,0.25)] text-white shadow-[0_0_15px_rgba(246,111,20,0.12)]' : 'border-transparent text-[#CAC4DA] hover:bg-[rgba(255,255,255,0.03)] hover:text-white'}`}
            >
              <Icon className={`h-4.5 w-4.5 transition-colors duration-300 ${active ? 'text-[#F66F14] drop-shadow-[0_0_5px_rgba(246,111,20,0.5)]' : 'text-[#CAC4DA] group-hover:text-[#F66F14]'}`} />
              {!collapsed && <span className="font-medium">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[rgba(247,114,24,0.15)] p-3 space-y-1.5">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#CAC4DA] transition hover:bg-[rgba(255,255,255,0.03)] hover:text-white cursor-pointer">
          <LifeBuoy className="h-4.5 w-4.5 text-[#CAC4DA]" />
          {!collapsed && <span className="font-medium">Support</span>}
        </button>
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-400/90 transition hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
