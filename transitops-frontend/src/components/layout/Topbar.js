'use client';

import React from 'react';
import { FiSearch, FiBell, FiCalendar } from 'react-icons/fi';

const css = `
  .td-topbar {
    height: 58px;
    background: rgba(6,9,16,0.97);
    border-bottom: 1px solid rgba(246,111,20,0.12);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 20;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .td-topbar-search {
    position: relative;
    flex: 1;
    max-width: 400px;
  }

  .td-topbar-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #374151;
    pointer-events: none;
  }

  .td-topbar-input {
    width: 100%;
    height: 36px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(246,111,20,0.15);
    border-radius: 10px;
    padding: 0 14px 0 38px;
    color: #E8EAF0;
    font-size: 13px;
    font-family: 'Inter', system-ui, sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .td-topbar-input::placeholder { color: #374151; }
  .td-topbar-input:focus {
    border-color: #F66F14;
    box-shadow: 0 0 0 3px rgba(246,111,20,0.08);
  }

  .td-topbar-spacer { flex: 1; }

  .td-topbar-date {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: #4B5563;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
  }

  .td-topbar-notif {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(246,111,20,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4B5563;
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .td-topbar-notif:hover {
    border-color: rgba(246,111,20,0.4);
    color: #F66F14;
    background: rgba(246,111,20,0.07);
    box-shadow: 0 0 12px rgba(246,111,20,0.15);
  }

  .td-notif-badge {
    position: absolute;
    top: 6px;
    right: 7px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #F66F14;
    border: 1.5px solid #060910;
    box-shadow: 0 0 6px rgba(246,111,20,0.7);
    animation: td-notif-pulse 2s ease infinite;
  }

  .td-topbar-avatar {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: linear-gradient(135deg, #F66F14, #3B82F6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    color: #fff;
    font-family: 'Mulish', sans-serif;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 0 12px rgba(246,111,20,0.3);
    border: 1px solid rgba(246,111,20,0.25);
    transition: box-shadow 0.18s;
  }
  .td-topbar-avatar:hover {
    box-shadow: 0 0 20px rgba(246,111,20,0.5);
  }

  @keyframes td-notif-pulse {
    0%,100% { box-shadow: 0 0 6px rgba(246,111,20,0.7); }
    50%      { box-shadow: 0 0 14px rgba(246,111,20,1); }
  }
`;

export default function Topbar() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <>
      <style>{css}</style>
      <header className="td-topbar">
        {/* Search */}
        <div className="td-topbar-search">
          <FiSearch size={14} className="td-topbar-search-icon" />
          <input
            className="td-topbar-input"
            type="text"
            placeholder="Search trips, vehicles, drivers…"
          />
        </div>

        <div className="td-topbar-spacer" />

        {/* Date */}
        <div className="td-topbar-date">
          <FiCalendar size={13} color="#F66F14" />
          {today}
        </div>

        {/* Notifications */}
        <button className="td-topbar-notif">
          <FiBell size={16} />
          <span className="td-notif-badge" />
        </button>

        {/* Avatar */}
        <div className="td-topbar-avatar" title="Fleet Manager">FM</div>
      </header>
    </>
  );
}
