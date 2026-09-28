import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  TrendingUp,
  UtensilsCrossed,
  Bike,
  Package,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatTime } from '../../utils/format';
import { Order } from '../../types';
import { Drawer } from '../../components/common/Drawer';

export const DashboardPage: React.FC = () => {
  const { orders, tables, inventory, restaurant, updateOrderStatus } = useDineFlow();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Derived Real Metrics
  const todayRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersCount = orders.length;

  const openOrders = orders.filter(
    (o) =>
      o.orderStatus !== 'SERVED' &&
      o.orderStatus !== 'DELIVERED' &&
      o.orderStatus !== 'CANCELLED'
  );

  const avgOrderValue = totalOrdersCount > 0 ? todayRevenue / (orders.filter((o) => o.paymentStatus === 'PAID').length || 1) : 0;

  const dineInCount = orders.filter((o) => o.orderType === 'DINE_IN').length;
  const deliveryCount = orders.filter((o) => o.orderType === 'DELIVERY').length;
  const takeawayCount = orders.filter((o) => o.orderType === 'TAKEAWAY').length;
  const walkInCount = orders.filter((o) => o.orderType === 'WALK_IN').length;

  const occupiedTablesCount = tables.filter((t) => t.status === 'OCCUPIED' || t.status === 'BILLING').length;
  const lowStockCount = inventory.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length;

  // Orders needing attention: NEW or PREPARING
  const attentionOrders = orders
    .filter((o) => o.orderStatus === 'NEW' || o.orderStatus === 'PREPARING')
    .slice(0, 4);

  // Calculate Top Selling Items from actual items in orders
  const itemCounts: Record<string, { count: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = { count: 0, revenue: 0 };
      }
      itemCounts[item.name].count += item.quantity;
      itemCounts[item.name].revenue += item.itemTotal;
    });
  });

  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Operations Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Real-time telemetry for {restaurant.name} · Connected dining, kitchen & POS
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--df-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              color: 'var(--df-text-muted)',
            }}
          >
            <Calendar size={14} />
            <span>Today's Shift</span>
          </div>
          <button
            onClick={() => navigate('/admin/live-orders')}
            className="df-btn df-btn-primary df-btn-sm"
          >
            <span>Live Order Queue</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 16,
        }}
      >
        <MetricCard
          title="TODAY'S REVENUE"
          value={formatCurrency(todayRevenue)}
          trend="up"
          trendValue="18.4%"
          subtext="vs yesterday"
          icon={IndianRupee}
          iconBg="var(--df-sage-light)"
          iconColor="var(--df-sage-dark)"
        />
        <MetricCard
          title="ORDERS TODAY"
          value={totalOrdersCount}
          subtext={`${openOrders.length} currently active`}
          icon={ShoppingBag}
          iconBg="#EFF6FF"
          iconColor="#1D4ED8"
          onClick={() => navigate('/admin/live-orders')}
        />
        <MetricCard
          title="OPEN KITCHEN ORDERS"
          value={openOrders.length}
          subtext="In preparation / queue"
          icon={Clock}
          iconBg="#FEF3C7"
          iconColor="#B45309"
          onClick={() => navigate('/admin/kitchen')}
        />
        <MetricCard
          title="AVG. ORDER VALUE"
          value={formatCurrency(avgOrderValue)}
          trend="up"
          trendValue="₹45"
          subtext="Across all channels"
          icon={TrendingUp}
          iconBg="#FDF2F8"
          iconColor="#DB2777"
        />
      </div>

      {/* Secondary Operational Metrics Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 12,
        }}
      >
        <div className="df-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Dine-in Orders</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{dineInCount}</div>
          </div>
        </div>

        <div className="df-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#F0FDF4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bike size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Delivery Orders</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{deliveryCount}</div>
          </div>
        </div>

        <div className="df-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#FFFBEB', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Takeaway / Walk-in</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{takeawayCount + walkInCount}</div>
          </div>
        </div>

        <div
          className="df-card df-card-interactive"
          style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}
          onClick={() => navigate('/admin/tables')}
        >
          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'var(--df-sage-light)', color: 'var(--df-sage-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Occupied Tables</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{occupiedTablesCount} / {tables.length}</div>
          </div>
        </div>

        <div
          className="df-card df-card-interactive"
          style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}
          onClick={() => navigate('/admin/inventory')}
        >
          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Low Stock Items</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{lowStockCount}</div>
          </div>
        </div>
      </div>

      {/* Orders Needing Attention Section */}
      {attentionOrders.length > 0 && (
        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--df-terracotta)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--df-charcoal)' }}>
                Orders Needing Immediate Action ({attentionOrders.length})
              </h3>
            </div>
            <button
              onClick={() => navigate('/admin/live-orders')}
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--df-sage-dark)' }}
            >
              View all live orders →
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 14,
            }}
          >
            {attentionOrders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  border: '1.5px solid var(--df-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  backgroundColor: '#FAFBF9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{ord.id}</span>
                  <StatusBadge status={ord.orderStatus} />
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--df-text-dark)', fontWeight: 600 }}>
                  {ord.orderType === 'DINE_IN'
                    ? `Dine-in · Table ${ord.tableNumber || '--'}`
                    : ord.orderType.replace('_', ' ')}
                  <span style={{ fontWeight: 400, color: 'var(--df-text-muted)', marginLeft: 6 }}>
                    ({ord.items.length} items)
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                  {ord.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 4,
                    paddingTop: 8,
                    borderTop: '1px solid var(--df-border-subtle)',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                    {formatCurrency(ord.total)}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="df-btn df-btn-secondary df-btn-sm"
                      style={{ padding: '4px 10px' }}
                    >
                      <Eye size={13} /> View
                    </button>
                    {ord.orderStatus === 'NEW' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'CONFIRMED')}
                        className="df-btn df-btn-sage df-btn-sm"
                        style={{ padding: '4px 10px' }}
                      >
                        Accept
                      </button>
                    )}
                    {ord.orderStatus === 'PREPARING' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'READY')}
                        className="df-btn df-btn-primary df-btn-sm"
                        style={{ padding: '4px 10px' }}
                      >
                        Mark Ready
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Recent Orders & Top Items */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
        }}
      >
        {/* Recent Order History Table */}
        <div className="df-card" style={{ gridColumn: 'span 2', padding: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--df-charcoal)' }}>
                Recent Order History
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                Latest activity across Aster & Oak dining channels
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/live-orders')}
              className="df-btn df-btn-secondary df-btn-sm"
            >
              View All Orders
            </button>
          </div>

          <div className="df-table-container">
            <table className="df-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Channel</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ fontWeight: 700 }}>{ord.id}</td>
                    <td>{ord.customerName}</td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                        {ord.orderType.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{ord.tableNumber ? `T-${ord.tableNumber}` : '—'}</td>
                    <td>{ord.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(ord.total)}</td>
                    <td>
                      <StatusBadge status={ord.paymentStatus} type="payment" />
                    </td>
                    <td>
                      <StatusBadge status={ord.orderStatus} />
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                      {formatTime(ord.createdAt)}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="df-btn-icon"
                        style={{ width: 28, height: 28, padding: 0 }}
                        title="View Order Details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Items & Channel Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top Items */}
          <div className="df-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
              Top Selling Dishes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topItems.map(([name, data], idx) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 10,
                    borderBottom:
                      idx < topItems.length - 1 ? '1px solid var(--df-border-subtle)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: 'var(--df-bg)',
                        color: 'var(--df-charcoal)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{name}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--df-text-muted)' }}>
                        {data.count} portions sold
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    {formatCurrency(data.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Breakdown */}
          <div className="df-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
              Order Channel Share
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Dine-In (QR Table)', count: dineInCount, color: 'var(--df-sage)' },
                { label: 'Takeaway', count: takeawayCount, color: '#3B82F6' },
                { label: 'Delivery', count: deliveryCount, color: '#10B981' },
                { label: 'Walk-in POS', count: walkInCount, color: 'var(--df-charcoal)' },
              ].map((ch) => {
                const pct = totalOrdersCount > 0 ? Math.round((ch.count / totalOrdersCount) * 100) : 0;
                return (
                  <div key={ch.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{ch.label}</span>
                      <span style={{ color: 'var(--df-text-muted)' }}>{ch.count} orders ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: 6, backgroundColor: 'var(--df-bg)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: ch.color, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
            <div style={{ display: 'flex', gap: 10 }}>
              {selectedOrder.orderStatus === 'NEW' && (
                <button
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'CONFIRMED');
                    setSelectedOrder({ ...selectedOrder, orderStatus: 'CONFIRMED' });
                  }}
                  className="df-btn df-btn-sage"
                  style={{ flex: 1 }}
                >
                  <CheckCircle2 size={16} /> Confirm Order
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
                  Mark Ready
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
