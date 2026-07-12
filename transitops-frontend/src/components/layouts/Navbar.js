'use client';

import { Bell, Menu, Search, Settings2 } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import NotificationDropdown from '@/components/ui/NotificationDropdown';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ onMenuToggle, title, subtitle }) {
  const [openNotifications, setOpenNotifications] = useState(false);
  const { user } = useAuth();

  // Build initials from user's full name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.full_name || user?.name || 'User';
  const displayRole = user?.role || 'Guest';
  const initials = getInitials(displayName);

  return (
    <header className="flex items-center justify-between gap-4 rounded-[24px] border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.30)] px-4 py-4 shadow-[0_0_45px_rgba(246,111,20,0.08)] backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-2xl border border-[rgba(247,114,24,0.15)] p-2 text-[#CAC4DA] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#F66F14]">{title}</p>
          <h1 className="text-xl font-semibold text-white">{subtitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-2xl border border-[rgba(247,114,24,0.15)] bg-[rgba(6,9,16,0.5)] px-3 py-2 text-sm text-[#CAC4DA] md:flex">
          <Search className="h-4 w-4" />
          <input
            placeholder="Search fleet"
            className="w-40 border-none bg-transparent text-sm outline-none placeholder:text-[#CAC4DA]"
          />
        </label>
        <div className="relative">
          <button
            onClick={() => setOpenNotifications((prev) => !prev)}
            className="rounded-2xl border border-[rgba(247,114,24,0.15)] p-2 text-[#CAC4DA] transition hover:text-white cursor-pointer"
          >
            <Bell className="h-5 w-5" />
          </button>
          {openNotifications && <NotificationDropdown onClose={() => setOpenNotifications(false)} />}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[rgba(247,114,24,0.15)] bg-[rgba(6,9,16,0.6)] px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[radial-gradient(circle,_rgba(246,111,20,0.4),_rgba(246,111,20,0.1))] text-sm font-semibold text-[#F66F14]">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="text-xs text-[#CAC4DA]">{displayRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
