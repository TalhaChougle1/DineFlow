import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  CookingPot,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  ArrowLeft,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { formatCurrency, formatTime, getElapsedMinutes } from '../../utils/format';
import { OrderStatus } from '../../types';

export const CustomerTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, restaurant } = useDineFlow();

  const decodedOrderId = decodeURIComponent(orderId || '');
  const order = orders.find((o) => o.id === decodedOrderId);

  if (!order) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Order Not Found</h2>
        <p style={{ color: 'var(--df-text-muted)', marginBottom: 20 }}>
          Unable to locate ticket #{decodedOrderId}. Please check with staff.
        </p>
        <Link to={`/menu/${restaurant.slug}`} className="df-btn df-btn-primary">
          Return to Menu
        </Link>
      </div>
    );
  }

  // Pipeline steps
  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'NEW', label: 'Order Received', desc: 'Ticket sent to kitchen' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Chef accepted ticket' },
    { key: 'PREPARING', label: 'In Kitchen', desc: 'Fired in wood-stone oven' },
    { key: 'READY', label: 'Ready to Serve', desc: 'Plated on the expediter line' },
    { key: 'SERVED', label: 'Served to Table', desc: 'Enjoy your meal!' },
  ];

  const statusHierarchy: Record<OrderStatus, number> = {
    NEW: 0,
    CONFIRMED: 1,
    PREPARING: 2,
    READY: 3,
    SERVED: 4,
    OUT_FOR_DELIVERY: 3,
    DELIVERED: 4,
    CANCELLED: -1,
  };

  const currentLevel = statusHierarchy[order.orderStatus] ?? 0;
  const elapsed = getElapsedMinutes(order.createdAt);

  return (
    <div style={{ backgroundColor: '#F8F9F6', minHeight: '100vh', padding: '24px 16px 80px' }}>
      <div style={{ maxWidth: 540, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Back navigation */}
        <Link
          to={`/menu/${restaurant.slug}${order.tableNumber ? `?table=${order.tableNumber}` : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--df-text-muted)',
          }}
        >
          <ArrowLeft size={14} /> Back to Menu
        </Link>

        {/* Live Status Hero Card */}
        <div
          className="df-card"
          style={{
            padding: 24,
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: 'var(--df-sage-dark)',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            LIVE ORDER TRACKING
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--df-charcoal)',
            }}
          >
            Order {order.id}
          </h2>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 6,
              padding: '4px 14px',
              backgroundColor: 'var(--df-bg)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 700,
            }}
          >
            <span>{restaurant.name}</span>
            {order.tableNumber && <span>· Table {order.tableNumber}</span>}
          </div>

          {/* Stepper Progress */}
          <div
            style={{
              marginTop: 28,
              marginBottom: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              textAlign: 'left',
              padding: '0 8px',
            }}
          >
            {steps.map((s, idx) => {
              const isPast = currentLevel > idx;
              const isCurrent = currentLevel === idx;
              const isUpcoming = currentLevel < idx;

              return (
                <div key={s.key} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  {/* Step indicator node */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: isPast
                        ? 'var(--df-sage)'
                        : isCurrent
                        ? 'var(--df-charcoal)'
                        : '#FFFFFF',
                      border: isUpcoming ? '2px solid var(--df-border)' : 'none',
                      color: isUpcoming ? 'var(--df-text-light)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {isPast ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: isCurrent ? 800 : 600,
                        fontSize: '0.9375rem',
                        color: isCurrent
                          ? 'var(--df-charcoal)'
                          : isPast
                          ? 'var(--df-sage-dark)'
                          : 'var(--df-text-light)',
                      }}
                    >
                      {s.label} {isCurrent && '● (Current Stage)'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid var(--df-border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--df-text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Placed: {formatTime(order.createdAt)}</span>
            <span>Elapsed: {elapsed} mins</span>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="df-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>Itemized Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {order.items.map((item, idx) => (
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

          {/* Totals */}
          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px solid var(--df-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: '0.8125rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--df-text-muted)' }}>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                <span>Discount ({order.discountCode})</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--df-text-muted)' }}>GST</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--df-charcoal)',
                paddingTop: 6,
                borderTop: '1px solid var(--df-border-subtle)',
              }}
            >
              <span>Total Paid ({order.paymentMethod})</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Need Staff Help Bar */}
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--df-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Need assistance at your table?</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
              Call our floor captain or concierge
            </div>
          </div>
          <a href={`tel:${restaurant.phone}`} className="df-btn df-btn-secondary df-btn-sm">
            <Phone size={13} /> Call Staff
          </a>
        </div>
      </div>
    </div>
  );
};
