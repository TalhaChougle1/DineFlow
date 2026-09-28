import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BellRing,
  CookingPot,
  QrCode,
  Utensils,
  Layers,
  Boxes,
  Calculator,
  Users,
  AlertTriangle,
  Bike,
  MapPin,
  CreditCard,
  BarChart3,
  FileSpreadsheet,
  Tag,
  Megaphone,
  Settings,
  Menu as MenuIcon,
  X,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { formatTime } from '../../utils/format';

interface NavSection {
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
    badge?: string | number;
  }[];
}

export const AdminLayout: React.FC = () => {
  const { restaurant, authUser, notifications, unreadCount, markAllNotificationsRead, resetAllDemoData, orders } =
    useDineFlow();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const location = useLocation();

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'SERVED' && o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED'
  ).length;

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          label: 'Live Orders',
          path: '/admin/live-orders',
          icon: BellRing,
          badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
        },
        { label: 'Kitchen Display', path: '/admin/kitchen', icon: CookingPot },
        { label: 'POS Terminal', path: '/admin/pos', icon: Calculator },
      ],
    },
    {
      title: 'RESTAURANT',
      items: [
        { label: 'Tables & QR', path: '/admin/tables', icon: QrCode },
        { label: 'Menu Catalog', path: '/admin/menu', icon: Utensils },
        { label: 'Categories', path: '/admin/categories', icon: Layers },
        { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
      ],
    },
    {
      title: 'PEOPLE & DELIVERY',
      items: [
        { label: 'Customers', path: '/admin/customers', icon: Users },
        { label: 'Riders Roster', path: '/admin/riders', icon: Bike },
        { label: 'Live Tracking', path: '/admin/live-tracking', icon: MapPin },
      ],
    },
    {
      title: 'GROWTH & INSIGHTS',
      items: [
        { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Lost Sales', path: '/admin/lost-sales', icon: AlertTriangle },
        { label: 'Discounts', path: '/admin/discounts', icon: Tag },
        { label: 'Promotions', path: '/admin/promotions', icon: Megaphone },
      ],
    },
    {
      title: 'FINANCE & SYSTEM',
      items: [
        { label: 'Payments', path: '/admin/payments', icon: CreditCard },
        { label: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
        { label: 'Store Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="admin-shell">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="df-drawer-backdrop"
          style={{ zIndex: 49 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid var(--df-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--df-charcoal)',
                color: 'var(--df-sage)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
              }}
            >
              DF
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.0625rem',
                  fontWeight: 800,
                  color: 'var(--df-charcoal)',
                  letterSpacing: '0.04em',
                }}
              >
                DINEFLOW
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--df-sage-dark)',
                  letterSpacing: '0.06em',
                }}
              >
                OS PLATFORM
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="df-btn-icon"
            style={{ width: 30, height: 30, padding: 0, display: 'none' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Restaurant Current Outlet Banner */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: 'var(--df-bg)',
            borderBottom: '1px solid var(--df-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--df-charcoal)',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {restaurant.name}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--df-text-muted)' }}>
              Indiranagar Outlet
            </div>
          </div>
          <span
            className="df-badge"
            style={{
              fontSize: '0.6875rem',
              backgroundColor: '#ECFDF5',
              color: '#047857',
              border: '1px solid #A7F3D0',
            }}
          >
            {restaurant.status}
          </span>
        </div>

        {/* Scrollable Navigation Sections */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {navSections.map((sec) => (
            <div key={sec.title}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--df-text-light)',
                  padding: '4px 10px 6px',
                }}
              >
                {sec.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.84375rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#FFFFFF' : 'var(--df-text-dark)',
                        backgroundColor: isActive ? 'var(--df-charcoal)' : 'transparent',
                        transition: 'all var(--transition-fast)',
                        textDecoration: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Icon
                          size={17}
                          style={{
                            color: isActive ? 'var(--df-sage)' : 'var(--df-text-muted)',
                          }}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          style={{
                            backgroundColor: isActive ? 'var(--df-sage)' : 'var(--df-sage-light)',
                            color: isActive ? '#FFFFFF' : 'var(--df-sage-dark)',
                            padding: '1px 7px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--df-border)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <a
            href={`/menu/${restaurant.slug}`}
            target="_blank"
            rel="noreferrer"
            className="df-btn df-btn-secondary df-btn-sm"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color="var(--df-sage-dark)" />
              Customer Menu
            </span>
            <ExternalLink size={13} />
          </a>

          <button
            onClick={() => setResetModalOpen(true)}
            className="df-btn df-btn-outline df-btn-sm"
            style={{
              width: '100%',
              fontSize: '0.75rem',
              padding: '5px 10px',
              color: 'var(--df-text-muted)',
              borderColor: 'var(--df-border)',
            }}
          >
            <RotateCcw size={13} /> Reset Demo Data
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="df-btn-icon"
              style={{ display: 'inline-flex' }}
              aria-label="Open sidebar"
            >
              <MenuIcon size={18} />
            </button>

            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--df-charcoal)',
                }}
              >
                Aster & Oak
              </span>
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--df-text-muted)',
                  marginLeft: 8,
                }}
              >
                / Artisanal Kitchen
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Quick Public Menu link */}
            <a
              href={`/menu/${restaurant.slug}?table=07`}
              target="_blank"
              rel="noreferrer"
              className="df-btn df-btn-secondary df-btn-sm"
              style={{ display: 'inline-flex' }}
            >
              <QrCode size={14} />
              <span>Test Table 07</span>
            </a>

            {/* Notifications Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="df-btn-icon"
                style={{ position: 'relative' }}
                aria-label="Notifications"
              >
                <BellRing size={17} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'var(--df-terracotta)',
                    }}
                  />
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    width: 320,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--df-border)',
                    zIndex: 100,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--df-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#F8F9F6',
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Notifications</span>
                    <button
                      onClick={markAllNotificationsRead}
                      style={{ fontSize: '0.75rem', color: 'var(--df-sage-dark)', fontWeight: 600 }}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div
                        style={{
                          padding: 24,
                          textAlign: 'center',
                          fontSize: '0.8125rem',
                          color: 'var(--df-text-muted)',
                        }}
                      >
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          style={{
                            padding: '10px 16px',
                            borderBottom: '1px solid var(--df-border-subtle)',
                            backgroundColor: n.read ? '#FFFFFF' : 'var(--df-sage-light)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '0.75rem',
                            }}
                          >
                            <span style={{ fontWeight: 700, color: 'var(--df-charcoal)' }}>
                              {n.title}
                            </span>
                            <span style={{ color: 'var(--df-text-light)' }}>
                              {formatTime(n.createdAt)}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--df-text-muted)',
                              marginTop: 2,
                            }}
                          >
                            {n.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Profile Chip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--df-bg)',
                border: '1px solid var(--df-border)',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: 'var(--df-charcoal)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {authUser.name.charAt(0)}
              </div>
              <div style={{ display: 'none', lineHeight: 1.1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{authUser.name}</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--df-text-muted)' }}>
                  {authUser.role}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetModalOpen && (
        <div className="df-modal-backdrop" onClick={() => setResetModalOpen(false)}>
          <div
            className="df-modal-content"
            style={{ maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>
                Reset Aster & Oak Demo Data?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginBottom: 20 }}>
                This will re-initialize Aster & Oak categories, menus, stock levels, table layouts,
                and initial demo orders.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => setResetModalOpen(false)}
                  className="df-btn df-btn-secondary df-btn-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetAllDemoData();
                    setResetModalOpen(false);
                  }}
                  className="df-btn df-btn-primary df-btn-sm"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
