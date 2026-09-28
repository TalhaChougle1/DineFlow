import React from 'react';
import { OrderStatus, TableStatus, PaymentStatus, RiderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus | TableStatus | PaymentStatus | RiderStatus | string;
  type?: 'order' | 'table' | 'payment' | 'rider' | 'inventory';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'order' }) => {
  const cleanStatus = status.toUpperCase();

  // Order Status mapping
  if (type === 'order') {
    const labels: Record<string, string> = {
      NEW: 'New Order',
      CONFIRMED: 'Confirmed',
      PREPARING: 'Preparing',
      READY: 'Ready to Serve',
      SERVED: 'Served',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
    };
    return (
      <span className={`df-badge df-status-${cleanStatus}`}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
        {labels[cleanStatus] || cleanStatus}
      </span>
    );
  }

  // Table Status mapping
  if (type === 'table') {
    const classMap: Record<string, string> = {
      FREE: 'df-badge-free',
      OCCUPIED: 'df-badge-occupied',
      BILLING: 'df-badge-billing',
      DISABLED: 'df-badge-disabled',
    };
    return (
      <span className={`df-badge ${classMap[cleanStatus] || 'df-badge-charcoal'}`}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
        {cleanStatus}
      </span>
    );
  }

  // Payment Status mapping
  if (type === 'payment') {
    const styleMap: Record<string, { bg: string; color: string; border: string }> = {
      PAID: { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' },
      PENDING: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
      FAILED: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
      REFUNDED: { bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB' },
    };
    const s = styleMap[cleanStatus] || { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' };
    return (
      <span
        className="df-badge"
        style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      >
        {cleanStatus}
      </span>
    );
  }

  // Rider Status mapping
  if (type === 'rider') {
    const styleMap: Record<string, { bg: string; color: string; border: string; label: string }> = {
      ONLINE: { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0', label: 'Online' },
      ON_DELIVERY: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', label: 'On Delivery' },
      OFFLINE: { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB', label: 'Offline' },
    };
    const s = styleMap[cleanStatus] || { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB', label: cleanStatus };
    return (
      <span
        className="df-badge"
        style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
        {s.label}
      </span>
    );
  }

  // Inventory Status mapping
  if (type === 'inventory') {
    const styleMap: Record<string, { bg: string; color: string; border: string; label: string }> = {
      IN_STOCK: { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0', label: 'In Stock' },
      LOW_STOCK: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', label: 'Low Stock' },
      OUT_OF_STOCK: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', label: 'Out of Stock' },
    };
    const s = styleMap[cleanStatus] || { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB', label: cleanStatus };
    return (
      <span
        className="df-badge"
        style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      >
        {s.label}
      </span>
    );
  }

  return <span className="df-badge df-badge-charcoal">{cleanStatus}</span>;
};
