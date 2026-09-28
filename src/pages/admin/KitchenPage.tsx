import React, { useState } from 'react';
import {
  CookingPot,
  Clock,
  CheckCircle,
  AlertCircle,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { Order, OrderStatus } from '../../types';
import { formatTime, getElapsedMinutes } from '../../utils/format';
import { soundService } from '../../utils/sound';

export const KitchenPage: React.FC = () => {
  const { orders, updateOrderStatus, restaurant } = useDineFlow();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Kitchen relevant orders
  const newOrders = orders.filter((o) => o.orderStatus === 'NEW');
  const preparingOrders = orders.filter(
    (o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PREPARING'
  );
  const readyOrders = orders.filter((o) => o.orderStatus === 'READY');

  const handleAdvance = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    if (soundEnabled) {
      soundService.playStatusChime();
    }
  };

  const renderKitchenCard = (ord: Order, currentColumn: 'NEW' | 'PREPARING' | 'READY') => {
    const elapsed = getElapsedMinutes(ord.createdAt);
    const isLate = elapsed > (ord.estimatedMinutes || 20);

    return (
      <div
        key={ord.id}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: isLate
            ? '2px solid #EF4444'
            : currentColumn === 'NEW'
            ? '2px solid #8B5CF6'
            : currentColumn === 'PREPARING'
            ? '2px solid #F59E0B'
            : '2px solid #10B981',
          boxShadow: 'var(--shadow-md)',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 14,
        }}
      >
        {/* Card Header */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 8,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--df-charcoal)',
                }}
              >
                {ord.id}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                {formatTime(ord.createdAt)} · {ord.orderType.replace('_', ' ')}
              </div>
            </div>

            {/* Table or Target */}
            <div
              style={{
                backgroundColor: ord.tableNumber ? 'var(--df-charcoal)' : 'var(--df-bg)',
                color: ord.tableNumber ? '#FFFFFF' : 'var(--df-text-dark)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.9375rem',
                letterSpacing: '0.04em',
              }}
            >
              {ord.tableNumber ? `TABLE ${ord.tableNumber}` : ord.orderType.replace('_', ' ')}
            </div>
          </div>

          {/* Elapsed Timer */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isLate ? '#FEE2E2' : '#F3F4F6',
              color: isLate ? '#DC2626' : 'var(--df-text-dark)',
              marginBottom: 12,
            }}
          >
            <Clock size={12} />
            <span>{elapsed} min in kitchen</span>
            {isLate && <span>(Rush!)</span>}
          </div>

          {/* Items List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              borderTop: '1px solid var(--df-border-subtle)',
              paddingTop: 10,
            }}
          >
            {ord.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--df-charcoal)' }}>
                  <span style={{ color: 'var(--df-sage-dark)', marginRight: 6 }}>
                    {item.quantity}×
                  </span>
                  {item.name}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--df-text-muted)',
                        paddingLeft: 22,
                      }}
                    >
                      + {item.selectedAddOns.map((a) => a.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {ord.notes && (
            <div
              style={{
                marginTop: 10,
                padding: '8px 10px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: '#991B1B',
                fontWeight: 600,
              }}
            >
              Chef Note: {ord.notes}
            </div>
          )}
        </div>

        {/* Large Touch Target Action Button */}
        <div>
          {currentColumn === 'NEW' && (
            <button
              onClick={() => handleAdvance(ord.id, 'PREPARING')}
              className="df-btn df-btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 700,
                backgroundColor: '#6D28D9',
              }}
            >
              Accept & Start Preparing →
            </button>
          )}

          {currentColumn === 'PREPARING' && (
            <button
              onClick={() => handleAdvance(ord.id, 'READY')}
              className="df-btn df-btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 700,
                backgroundColor: '#D97706',
              }}
            >
              Mark Ready to Serve ✓
            </button>
          )}

          {currentColumn === 'READY' && (
            <button
              onClick={() => handleAdvance(ord.id, 'SERVED')}
              className="df-btn df-btn-sage"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              Order Served / Dispatched ✓
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KDS Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2C3129',
          color: '#FFFFFF',
          padding: '14px 24px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--df-sage)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CookingPot size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
              Kitchen Display Station (KDS)
            </h2>
            <div style={{ fontSize: '0.75rem', color: '#B5BAAE' }}>
              {restaurant.name} Kitchen · Live Real-time Expediter Line
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) soundService.playStatusChime();
            }}
            className="df-btn df-btn-sm"
            style={{
              backgroundColor: soundEnabled ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundEnabled ? 'Chime ON' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* 3 Columns Layout: NEW, PREPARING, READY */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* COLUMN 1: NEW ORDERS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#EDE9FE',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid #DDD6FE',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 800, color: '#6D28D9', fontSize: '0.9375rem' }}>
              1. NEW ORDERS
            </div>
            <span
              style={{
                backgroundColor: '#6D28D9',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.8125rem',
              }}
            >
              {newOrders.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {newOrders.length === 0 ? (
              <div
                style={{
                  padding: 36,
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--df-border)',
                  color: 'var(--df-text-muted)',
                  fontSize: '0.875rem',
                }}
              >
                No pending new orders.
              </div>
            ) : (
              newOrders.map((ord) => renderKitchenCard(ord, 'NEW'))
            )}
          </div>
        </div>

        {/* COLUMN 2: PREPARING */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#FEF3C7',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid #FDE68A',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 800, color: '#B45309', fontSize: '0.9375rem' }}>
              2. IN PREPARATION
            </div>
            <span
              style={{
                backgroundColor: '#B45309',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.8125rem',
              }}
            >
              {preparingOrders.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {preparingOrders.length === 0 ? (
              <div
                style={{
                  padding: 36,
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--df-border)',
                  color: 'var(--df-text-muted)',
                  fontSize: '0.875rem',
                }}
              >
                Kitchen station clear.
              </div>
            ) : (
              preparingOrders.map((ord) => renderKitchenCard(ord, 'PREPARING'))
            )}
          </div>
        </div>

        {/* COLUMN 3: READY TO SERVE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#ECFDF5',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid #A7F3D0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.9375rem' }}>
              3. READY TO SERVE
            </div>
            <span
              style={{
                backgroundColor: '#047857',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.8125rem',
              }}
            >
              {readyOrders.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {readyOrders.length === 0 ? (
              <div
                style={{
                  padding: 36,
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--df-border)',
                  color: 'var(--df-text-muted)',
                  fontSize: '0.875rem',
                }}
              >
                No dishes waiting on the pass.
              </div>
            ) : (
              readyOrders.map((ord) => renderKitchenCard(ord, 'READY'))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
