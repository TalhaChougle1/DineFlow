import React, { useState } from 'react';
import { CreditCard, Search, ArrowUpRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/format';

export const PaymentsPage: React.FC = () => {
  const { payments, restaurant } = useDineFlow();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');

  const totalSettled = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      p.orderId.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(search.toLowerCase());
    const matchMethod = methodFilter === 'ALL' || p.method === methodFilter;
    return matchSearch && matchMethod;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Payment Ledger & Settlements
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Verified financial transaction ledger across Cash, UPI, Card and Gateway
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>TOTAL SETTLED VOLUME</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: 4 }}>
            {formatCurrency(totalSettled)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)', marginTop: 4 }}>
            100% matched to verified orders
          </div>
        </div>

        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>TRANSACTION COUNT</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)', marginTop: 4 }}>
            {payments.length} Records
          </div>
        </div>
      </div>

      {/* Search and Filter */}
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
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--df-text-light)' }} />
          <input
            type="text"
            placeholder="Search ref #, customer, order..."
            className="df-input"
            style={{ paddingLeft: 36 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL', 'UPI', 'CASH', 'CARD', 'ONLINE'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`df-btn df-btn-sm ${methodFilter === m ? 'df-btn-primary' : 'df-btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="df-table-container">
        <table className="df-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Outlet</th>
              <th>Payment Method</th>
              <th>Reference / Txn ID</th>
              <th>Status</th>
              <th>Settled Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id}>
                <td style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                  {formatDateTime(p.createdAt)}
                </td>
                <td style={{ fontWeight: 800 }}>{p.orderId}</td>
                <td>{p.customerName}</td>
                <td>{restaurant.name} (Indiranagar)</td>
                <td>
                  <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{p.method}</span>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                  {p.transactionRef}
                </td>
                <td>
                  <StatusBadge status={p.status} type="payment" />
                </td>
                <td style={{ fontWeight: 800, fontSize: '0.9375rem' }}>
                  {formatCurrency(p.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
