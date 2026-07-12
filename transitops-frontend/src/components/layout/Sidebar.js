'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  MdDashboard,
} from 'react-icons/md';
import {
  FaTruck,
  FaUserTie,
  FaRoute,
  FaTools,
  FaGasPump,
  FaTruckMoving,
} from 'react-icons/fa';
import {
  HiOutlineDocumentReport,
  HiOutlineChartBar,
} from 'react-icons/hi';
import {
  FiSettings,
  FiUser,
  FiChevronLeft,
} from 'react-icons/fi';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/dashboard',     icon: MdDashboard },
  { label: 'Vehicle Registry',href: '/vehicles',      icon: FaTruck },
  { label: 'Driver Management',href: '/drivers',      icon: FaUserTie },
  { label: 'Trip Dispatch',   href: '/trips',         icon: FaRoute },
  { label: 'Maintenance',     href: '/maintenance',   icon: FaTools },
  { label: 'Fuel & Expenses', href: '/fuel-expenses', icon: FaGasPump },
  { label: 'Reports',         href: '/reports',       icon: HiOutlineDocumentReport },
  { label: 'Analytics',       href: '/analytics',     icon: HiOutlineChartBar },
];

const BOTTOM_NAV = [
  { label: 'Settings', href: '/settings', icon: FiSettings },
  { label: 'Profile',  href: '/profile',  icon: FiUser },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={styles.logoRow}>
        <div className={styles.logoIcon} aria-hidden="true">
          <FaTruckMoving size={20} />
        </div>
        {!collapsed && <span className={styles.logoText}>TransitOps</span>}
        <button
          className={`${styles.collapseBtn} ${collapsed ? styles.collapseBtnRotated : ''}`}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FiChevronLeft size={18} />
        </button>
      </div>

      {/* Main nav */}
      <nav className={styles.nav} aria-label="Primary">
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navItem} ${isActive(href) ? styles.active : ''}`}
                aria-current={isActive(href) ? 'page' : undefined}
                title={collapsed ? label : undefined}
              >
                <span className={styles.navIcon}><Icon size={18} /></span>
                {!collapsed && <span className={styles.navLabel}>{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom nav */}
      <nav className={styles.bottomNav} aria-label="Secondary">
        <ul className={styles.navList} role="list">
          {BOTTOM_NAV.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navItem} ${isActive(href) ? styles.active : ''}`}
                aria-current={isActive(href) ? 'page' : undefined}
                title={collapsed ? label : undefined}
              >
                <span className={styles.navIcon}><Icon size={18} /></span>
                {!collapsed && <span className={styles.navLabel}>{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User card */}
      {!collapsed && (
        <div className={styles.userCard} aria-label="User profile">
          <div className={styles.userAvatar} aria-hidden="true">AK</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Arjun Kapoor</span>
            <span className={styles.userRole}>Fleet Manager</span>
          </div>
        </div>
      )}
    </aside>
  );
}
