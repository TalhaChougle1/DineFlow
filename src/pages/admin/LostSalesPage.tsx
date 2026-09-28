import React from 'react';
import { AlertTriangle, Clock, ShoppingCart, IndianRupee, Phone } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { formatCurrency, formatDateTime } from '../../utils/format';

export const LostSalesPage: React.FC = () => {
  const { lostSales } = useDineFlow();

  const totalLostValue = lostSales.reduce((sum, item) => sum + item.potentialTotal, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Lost Sales & Abandoned Checkouts
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Real tracking of guests who entered cart checkout but did not complete payment
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>POTENTIAL LOST REVENUE</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626', marginTop: 4 }}>
            {formatCurrency(totalLostValue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)', marginTop: 4 }}>
            Uncaptured checkout intent
          </div>
        </div>

        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>ABANDONED SESSIONS</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)', marginTop: 4 }}>
            {lostSales.length} Carts
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="df-table-container">
        <table className="df-table">
          <thead>
            <tr>
              <th>Abandoned At</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Items In Cart</th>
              <th>Subtotal</th>
              <th>Potential Total</th>
              <th>Reported Reason</th>
            </tr>
          </thead>
          <tbody>
            {lostSales.map((sale) => (
              <tr key={sale.id}>
                <td style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                  {formatDateTime(sale.abandonedAt)}
                </td>
                <td style={{ fontWeight: 700 }}>{sale.customerName}</td>
                <td>{sale.customerPhone}</td>
                <td>
                  <div style={{ fontSize: '0.8125rem' }}>
                    {sale.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                  </div>
                </td>
                <td>{formatCurrency(sale.subtotal)}</td>
                <td style={{ fontWeight: 800, color: '#DC2626' }}>{formatCurrency(sale.potentialTotal)}</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>{sale.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
