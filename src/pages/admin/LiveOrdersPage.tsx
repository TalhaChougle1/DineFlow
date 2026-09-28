import React, { useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  SlidersHorizontal,
  Printer,
  CookingPot,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Drawer } from '../../components/common/Drawer';
import { formatCurrency, formatTime, getElapsedMinutes } from '../../utils/format';

export const LiveOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderPayment } = useDineFlow();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const activeOrders = orders.filter(
    (o) =>
      o.orderStatus !== 'SERVED' &&
      o.orderStatus !== 'DELIVERED' &&
      o.orderStatus !== 'CANCELLED'
  );

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.tableNumber && o.tableNumber.includes(search));

    let matchStatus = true;
    if (statusFilter === 'ACTIVE') {
      matchStatus =
        o.orderStatus !== 'SERVED' &&
        o.orderStatus !== 'DELIVERED' &&
        o.orderStatus !== 'CANCELLED';
    } else if (statusFilter !== 'ALL') {
      matchStatus = o.orderStatus === statusFilter;
    }

    const matchChannel = channelFilter === 'ALL' || o.orderType === channelFilter;

    return matchSearch && matchStatus && matchChannel;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
              Live Order Stream
            </h1>
            {activeOrders.length > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--df-sage-light)',
                  color: 'var(--df-sage-dark)',
                  border: '1px solid var(--df-sage-border)',
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                }}
              >
                {activeOrders.length} In Progress
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Connected dining ticket pipeline · Automatic cross-tab sync with Kitchen & Tables
          </p>
        </div>

        <a href="/admin/kitchen" className="df-btn df-btn-primary df-btn-sm">
          <CookingPot size={15} /> Switch to Kitchen Display (KDS)
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--df-border)',
        }}
      >
        <div style={{ position: 'relative', width: 280 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--df-text-light)',
            }}
          />
          <input
            type="text"
            placeholder="Search order #, customer, table..."
            className="df-input"
            style={{ paddingLeft: 36 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'ACTIVE', label: 'Active Pipeline' },
            { id: 'ALL', label: 'All History' },
            { id: 'NEW', label: 'New' },
            { id: 'CONFIRMED', label: 'Confirmed' },
            { id: 'PREPARING', label: 'Preparing' },
            { id: 'READY', label: 'Ready' },
            { id: 'SERVED', label: 'Served' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`df-btn df-btn-sm ${
                statusFilter === tab.id ? 'df-btn-primary' : 'df-btn-secondary'
              }`}
              style={{ padding: '5px 12px', fontSize: '0.75rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Orders Table */}
      <div className="df-table-container">
        <table className="df-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Channel</th>
              <th>Table</th>
              <th>Items & Modifiers</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Elapsed</th>
              <th>Quick Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--df-text-muted)' }}>
                  No orders found matching the selected filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const elapsed = getElapsedMinutes(ord.createdAt);

                return (
                  <tr key={ord.id}>
                    <td>
                      <span
                        onClick={() => setSelectedOrder(ord)}
                        style={{
                          fontWeight: 800,
                          color: 'var(--df-charcoal)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {ord.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--df-text-muted)' }}>
                          {ord.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                        {ord.orderType.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {ord.tableNumber ? (
                        <span
                          style={{
                            fontWeight: 800,
                            padding: '2px 8px',
                            backgroundColor: 'var(--df-bg)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          T-{ord.tableNumber}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--df-text-light)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ maxWidth: 260 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                          {ord.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                        </div>
                        {ord.notes && (
                          <div style={{ fontSize: '0.6875rem', color: 'var(--df-terracotta)', marginTop: 2 }}>
                            Note: {ord.notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 800 }}>{formatCurrency(ord.total)}</td>
                    <td>
                      <StatusBadge status={ord.paymentStatus} type="payment" />
                    </td>
                    <td>
                      <StatusBadge status={ord.orderStatus} />
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: elapsed > 25 ? '#DC2626' : elapsed > 15 ? '#D97706' : 'var(--df-text-muted)',
                        }}
                      >
                        {elapsed}m ago
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="df-btn-icon"
                          style={{ width: 28, height: 28, padding: 0 }}
                          title="View Order Details"
                        >
                          <Eye size={13} />
                        </button>

                        {ord.orderStatus === 'NEW' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'CONFIRMED')}
                            className="df-btn df-btn-sage df-btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.6875rem' }}
                          >
                            Accept
                          </button>
                        )}
                        {ord.orderStatus === 'CONFIRMED' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'PREPARING')}
                            className="df-btn df-btn-primary df-btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.6875rem' }}
                          >
                            Prepare
                          </button>
                        )}
                        {ord.orderStatus === 'PREPARING' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'READY')}
                            className="df-btn df-btn-primary df-btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.6875rem' }}
                          >
                            Ready
                          </button>
                        )}
                        {ord.orderStatus === 'READY' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'SERVED')}
                            className="df-btn df-btn-sage df-btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.6875rem' }}
                          >
                            Served
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Drawer */}
      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order ${selectedOrder.id}` : ''}
        subtitle={
          selectedOrder
            ? `${selectedOrder.orderType.replace('_', ' ')} · ${formatTime(selectedOrder.createdAt)}`
            : ''
        }
        footer={
          selectedOrder && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedOrder.paymentStatus !== 'PAID' && (
                <button
                  onClick={() => {
                    updateOrderPayment(selectedOrder.id, 'PAID', 'CASH');
                    setSelectedOrder({ ...selectedOrder, paymentStatus: 'PAID' });
                  }}
                  className="df-btn df-btn-secondary"
                  style={{ width: '100%' }}
                >
                  Mark Paid (Collect Cash / UPI)
                </button>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                {selectedOrder.orderStatus === 'NEW' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'CONFIRMED');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'CONFIRMED' });
                    }}
                    className="df-btn df-btn-sage"
                    style={{ flex: 1 }}
                  >
                    Confirm Order
                  </button>
                )}
                {selectedOrder.orderStatus === 'CONFIRMED' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'PREPARING');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'PREPARING' });
                    }}
                    className="df-btn df-btn-primary"
                    style={{ flex: 1 }}
                  >
                    Start Preparing
                  </button>
                )}
                {selectedOrder.orderStatus === 'PREPARING' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'READY');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'READY' });
                    }}
                    className="df-btn df-btn-primary"
                    style={{ flex: 1 }}
                  >
                    Mark Ready to Serve
                  </button>
                )}
                {selectedOrder.orderStatus === 'READY' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'SERVED');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'SERVED' });
                    }}
                    className="df-btn df-btn-primary"
                    style={{ flex: 1 }}
                  >
                    Mark Served
                  </button>
                )}
              </div>
            </div>
          )
        }
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Customer</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedOrder.customerName}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                  {selectedOrder.customerPhone}
                </div>
              </div>
              <StatusBadge status={selectedOrder.orderStatus} />
            </div>

            {selectedOrder.tableNumber && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--df-bg)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                  Dine-In Table
                </span>
                <span style={{ fontWeight: 800 }}>Table {selectedOrder.tableNumber}</span>
              </div>
            )}

            <div>
              <div
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--df-text-muted)',
                  marginBottom: 10,
                }}
              >
                Ordered Items
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      paddingBottom: 8,
                      borderBottom: '1px solid var(--df-border-subtle)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {item.name} × {item.quantity}
                      </div>
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--df-sage-dark)' }}>
                          + {item.selectedAddOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                      {formatCurrency(item.itemTotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial breakdown */}
            <div
              style={{
                backgroundColor: 'var(--df-bg)',
                borderRadius: 'var(--radius-md)',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--df-text-muted)' }}>Subtotal</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Discount ({selectedOrder.discountCode || 'Promo'})</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--df-text-muted)' }}>GST (5%)</span>
                <span>{formatCurrency(selectedOrder.tax)}</span>
              </div>
              {selectedOrder.deliveryFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--df-text-muted)' }}>Delivery Fee</span>
                  <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 8,
                  marginTop: 4,
                  borderTop: '1px solid var(--df-border)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--df-charcoal)',
                }}
              >
                <span>Total</span>
                <span>{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
