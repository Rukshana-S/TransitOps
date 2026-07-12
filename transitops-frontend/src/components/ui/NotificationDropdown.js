'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, X, CheckCheck, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function NotificationDropdown({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.slice(0, 6)); // Show latest 6
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 z-50 w-80 rounded-[20px] border border-[rgba(247,114,24,0.15)] bg-[rgba(6,9,16,0.97)] shadow-[0_0_40px_rgba(246,111,20,0.18)] backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#F66F14]" />
          <span className="text-sm font-bold text-white">Incident Alerts</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#F66F14] px-1.5 py-0.5 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#CAC4DA] hover:text-white transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-72 overflow-y-auto p-2 space-y-1.5">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 text-[#F66F14] animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#CAC4DA]">
            No active alerts
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 rounded-xl border p-3 text-sm transition-all ${
                notif.read
                  ? 'border-white/5 bg-white/[0.01] opacity-60'
                  : 'border-rose-500/20 bg-rose-500/5'
              }`}
            >
              <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${notif.read ? 'bg-gray-500' : 'bg-rose-500 animate-pulse'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-xs">{notif.title}</p>
                <p className="mt-0.5 text-[11px] text-[#CAC4DA] leading-relaxed">{notif.message}</p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  title="Mark as read"
                  className="shrink-0 text-[#CAC4DA] hover:text-emerald-400 transition cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-2.5 text-center">
        <span className="text-[10px] text-[#CAC4DA]">
          Realtime PostgreSQL notification feed
        </span>
      </div>
    </div>
  );
}
