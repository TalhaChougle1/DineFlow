import React, { useState } from 'react';
import { Users, Search, IndianRupee, ShoppingBag, Eye, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { Customer } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { Drawer } from '../../components/common/Drawer';

export const CustomersPage: React.FC = () => {
  const { customers, orders } = useDineFlow();
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalGuests = customers.length;
  const totalLTV = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  const avgSpendPerGuest = totalGuests > 0 ? totalLTV / totalGuests : 0;

  // Orders for selected customer
  const customerOrders = selectedCust
    ? orders.filter((o) => o.customerPhone === selectedCust.phone || o.customerId === selectedCust.id)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Customer Directory (CRM)
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Guest profiles, lifetime value (LTV), dining preferences, and order history
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>REGISTERED GUESTS</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--df-charcoal)', marginTop: 4 }}>
            {totalGuests}
          </div>
        </div>

        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>TOTAL LIFETIME VALUE</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#059669', marginTop: 4 }}>
            {formatCurrency(totalLTV)}
          </div>
        </div>

        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>AVERAGE GUEST SPEND</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--df-charcoal)', marginTop: 4 }}>
            {formatCurrency(avgSpendPerGuest)}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--df-border)' }}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--df-text-light)' }} />
          <input
            type="text"
            placeholder="Search by guest name, phone, or email..."
            className="df-input"
            style={{ paddingLeft: 36 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="df-table-container">
        <table className="df-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Total Orders</th>
              <th>Lifetime Spend</th>
              <th>First Visit</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        backgroundColor: 'var(--df-sage-light)',
                        color: 'var(--df-sage-dark)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{cust.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>{cust.address || 'In-store'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{cust.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>{cust.email}</div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 700 }}>{cust.totalOrders} orders</span>
                </td>
                <td style={{ fontWeight: 800 }}>{formatCurrency(cust.totalSpend)}</td>
                <td style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>{formatDate(cust.firstOrderAt)}</td>
                <td style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>{formatDate(cust.lastOrderAt)}</td>
                <td>
                  <button
                    onClick={() => setSelectedCust(cust)}
                    className="df-btn-icon"
                    style={{ width: 30, height: 30, padding: 0 }}
                    title="View Profile & Orders"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Drawer */}
      <Drawer
        isOpen={!!selectedCust}
        onClose={() => setSelectedCust(null)}
        title={selectedCust?.name || ''}
        subtitle="Customer Dining History & Preferences"
      >
        {selectedCust && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                backgroundColor: 'var(--df-bg)',
                borderRadius: 'var(--radius-md)',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={14} color="var(--df-text-muted)" />
                <span>{selectedCust.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={14} color="var(--df-text-muted)" />
                <span>{selectedCust.email}</span>
              </div>
              {selectedCust.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={14} color="var(--df-text-muted)" />
                  <span>{selectedCust.address}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div className="df-card" style={{ padding: 14 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Total Orders</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedCust.totalOrders}</div>
              </div>
              <div className="df-card" style={{ padding: 14 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Lifetime Spend</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                  {formatCurrency(selectedCust.totalSpend)}
                </div>
              </div>
            </div>

            {selectedCust.favoriteItems.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 8 }}>Favorite Dishes</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedCust.favoriteItems.map((fav) => (
                    <span key={fav} className="df-badge df-badge-sage">
                      {fav}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 10 }}>Order History</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      padding: 12,
                      border: '1px solid var(--df-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#FAFBF9',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.875rem' }}>
                      <span>{ord.id}</span>
                      <span>{formatCurrency(ord.total)}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
                      {ord.orderType.replace('_', ' ')} · {formatDate(ord.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
