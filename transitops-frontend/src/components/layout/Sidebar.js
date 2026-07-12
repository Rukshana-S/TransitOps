'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiGrid, FiTruck, FiUsers, FiSend, FiTool,
  FiDroplet, FiBarChart2, FiPieChart, FiSettings,
  FiChevronLeft, FiChevronRight, FiZap,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { label: 'Dashboard',        href: '/',              icon: FiGrid      },
  { label: 'Vehicle Registry', href: '/vehicles',      icon: FiTruck     },
  { label: 'Driver Management',href: '/drivers',       icon: FiUsers     },
  { label: 'Trip Dispatcher',  href: '/trips',         icon: FiSend      },
  { label: 'Maintenance',      href: '/maintenance',   icon: FiTool      },
  { label: 'Fuel & Expenses',  href: '/fuel',          icon: FiDroplet   },
  { label: 'Reports',          href: '/reports',       icon: FiBarChart2 },
  { label: 'Analytics',        href: '/analytics',     icon: FiPieChart  },
  { label: 'Settings',         href: '/settings',      icon: FiSettings  },
];

const O = '#F66F14';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Mulish:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

  .td-sidebar {
    width: 240px;
    min-height: 100vh;
    background: rgba(6, 9, 16, 0.98);
    border-right: 1px solid rgba(246,111,20,0.15);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 30;
    transition: width 0.25s ease;
    backdrop-filter: blur(20px);
  }

  .td-sidebar.collapsed {
    width: 68px;
  }

  .td-sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 16px 16px;
    border-bottom: 1px solid rgba(246,111,20,0.1);
    text-decoration: none;
    overflow: hidden;
  }

  .td-sidebar-logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #F66F14, #c25a0c);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 18px rgba(246,111,20,0.45);
  }

  .td-sidebar-logo-text {
    font-family: 'Mulish', sans-serif;
    font-size: 18px;
    font-weight: 900;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.2s, max-width 0.25s;
    max-width: 160px;
  }

  .td-sidebar.collapsed .td-sidebar-logo-text { max-width: 0; opacity: 0; }

  .td-nav {
    flex: 1;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }

  .td-nav-item {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 10px 12px;
    border-radius: 11px;
    text-decoration: none;
    color: #4B5563;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    transition: all 0.18s ease;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid transparent;
  }

  .td-nav-item:hover {
    color: #E8EAF0;
    background: rgba(246,111,20,0.07);
    border-color: rgba(246,111,20,0.12);
  }

  .td-nav-item.active {
    color: #F66F14;
    background: rgba(246,111,20,0.12);
    border-color: rgba(246,111,20,0.25);
    box-shadow: 0 0 14px rgba(246,111,20,0.1);
  }

  .td-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: #F66F14;
    box-shadow: 0 0 8px #F66F14;
  }

  .td-nav-item-icon { flex-shrink: 0; }

  .td-nav-label {
    overflow: hidden;
    transition: opacity 0.2s, max-width 0.25s;
    max-width: 160px;
  }

  .td-sidebar.collapsed .td-nav-label { max-width: 0; opacity: 0; }

  .td-sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 8px 16px;
    padding: 9px;
    border-radius: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(246,111,20,0.15);
    color: #4B5563;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    gap: 6px;
    transition: all 0.18s;
  }
  .td-sidebar-toggle:hover {
    background: rgba(246,111,20,0.08);
    border-color: rgba(246,111,20,0.3);
    color: #F66F14;
  }

  .td-sidebar-footer {
    padding: 12px 10px;
    border-top: 1px solid rgba(246,111,20,0.08);
    overflow: hidden;
  }

  .td-sidebar-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 10px;
    background: rgba(246,111,20,0.05);
    border: 1px solid rgba(246,111,20,0.1);
    cursor: pointer;
    transition: all 0.18s;
  }
  .td-sidebar-user:hover {
    background: rgba(246,111,20,0.1);
    border-color: rgba(246,111,20,0.25);
  }

  .td-avatar {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: linear-gradient(135deg, #F66F14, #3B82F6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
    color: #fff;
    font-family: 'Mulish', sans-serif;
    flex-shrink: 0;
    box-shadow: 0 0 10px rgba(246,111,20,0.3);
  }

  .td-user-info { overflow: hidden; transition: opacity 0.2s, max-width 0.25s; max-width: 140px; }
  .td-sidebar.collapsed .td-user-info { max-width: 0; opacity: 0; }

  /* Tooltip on collapsed */
  .td-nav-item .td-tooltip {
    display: none;
  }
  .td-sidebar.collapsed .td-nav-item:hover .td-tooltip {
    display: flex;
    position: absolute;
    left: calc(100% + 12px);
    top: 50%;
    transform: translateY(-50%);
    background: rgba(6,9,16,0.97);
    border: 1px solid rgba(246,111,20,0.25);
    border-radius: 8px;
    padding: 6px 12px;
    color: #F9FAFB;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
    z-index: 100;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    pointer-events: none;
  }
`;

export default function Sidebar() {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
      <style>{css}</style>
      <aside className={`td-sidebar${collapsed ? ' collapsed' : ''}`}>

        {/* ── LOGO ── */}
        <Link href="/" className="td-sidebar-logo">
          <div className="td-sidebar-logo-icon">
            <FiZap size={18} color="#fff" />
          </div>
          <span className="td-sidebar-logo-text">TransitOps</span>
        </Link>

        {/* ── NAV ITEMS ── */}
        <nav className="td-nav">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            const Icon   = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`td-nav-item${active ? ' active' : ''}`} title={collapsed ? item.label : ''}>
                <Icon size={17} className="td-nav-item-icon" />
                <span className="td-nav-label">{item.label}</span>
                <span className="td-tooltip">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── COLLAPSE TOGGLE ── */}
        <button className="td-sidebar-toggle" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? <FiChevronRight size={15} /> : <><FiChevronLeft size={15} /><span className="td-nav-label" style={{ maxWidth: 100, fontSize: 11 }}>Collapse</span></>}
        </button>

        {/* ── USER FOOTER ── */}
        <div className="td-sidebar-footer">
          <div className="td-sidebar-user">
            <div className="td-avatar">FM</div>
            <div className="td-user-info">
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#F9FAFB', fontFamily: 'Inter,sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                Fleet Manager
              </div>
              <div style={{ fontSize: '10px', color: '#4B5563', fontFamily: 'Inter,sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                admin@transitops.io
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
