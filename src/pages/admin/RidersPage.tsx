import React, { useState } from 'react';
import { Bike, Plus, Star, Phone, DollarSign, PackageCheck, AlertCircle } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { Rider, RiderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/format';
import { Modal } from '../../components/common/Modal';

export const RidersPage: React.FC = () => {
  const { riders, saveRider, updateRiderStatus, restaurant } = useDineFlow();
  const [modalOpen, setModalOpen] = useState(false);
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');

  const totalDelivered = riders.reduce((sum, r) => sum + r.completedDeliveries, 0);
  const totalRiderEarnings = riders.reduce((sum, r) => sum + r.earnings, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiderName.trim()) return;

    saveRider({
      restaurantId: restaurant.id,
      name: newRiderName,
      phone: newRiderPhone || '+91 98000 00000',
      status: 'ONLINE',
    });

    setNewRiderName('');
    setNewRiderPhone('');
    setModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Delivery Fleet (Riders)
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            In-house dispatch riders & delivery personnel roster
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="df-btn df-btn-primary df-btn-sm">
          <Plus size={15} /> Add Delivery Rider
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>ACTIVE FLEET</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--df-charcoal)', marginTop: 4 }}>
            {riders.filter((r) => r.status !== 'OFFLINE').length} Online / {riders.length}
          </div>
        </div>

        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>COMPLETED DELIVERIES</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#059669', marginTop: 4 }}>
            {totalDelivered} Trips
          </div>
        </div>

        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>FLEET PAYOUTS</div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--df-charcoal)', marginTop: 4 }}>
            {formatCurrency(totalRiderEarnings)}
          </div>
        </div>
      </div>

      {/* Riders Table */}
      <div className="df-table-container">
        <table className="df-table">
          <thead>
            <tr>
              <th>Rider Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Completed Trips</th>
              <th>Total Earnings</th>
              <th>Current Assignment</th>
              <th>Status Toggle</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'var(--df-charcoal)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                      }}
                    >
                      {r.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 700 }}>{r.name}</span>
                  </div>
                </td>
                <td>{r.phone}</td>
                <td>
                  <StatusBadge status={r.status} type="rider" />
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                    <Star size={13} fill="#F59E0B" color="#F59E0B" /> {r.rating.toFixed(1)}
                  </span>
                </td>
                <td>{r.completedDeliveries}</td>
                <td style={{ fontWeight: 700 }}>{formatCurrency(r.earnings)}</td>
                <td>
                  {r.currentOrderId ? (
                    <span className="df-badge df-badge-charcoal">{r.currentOrderId}</span>
                  ) : (
                    <span style={{ color: 'var(--df-text-muted)', fontSize: '0.8125rem' }}>Idle</span>
                  )}
                </td>
                <td>
                  <select
                    className="df-select"
                    style={{ fontSize: '0.75rem', padding: '4px 8px', width: 'auto' }}
                    value={r.status}
                    onChange={(e) => updateRiderStatus(r.id, e.target.value as RiderStatus)}
                  >
                    <option value="ONLINE">Online</option>
                    <option value="ON_DELIVERY">On Delivery</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add In-House Delivery Rider"
          subtitle="Enlist fleet personnel for Aster & Oak direct dispatch"
          maxWidth="420px"
        >
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="df-form-group">
              <label className="df-label">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Patel"
                className="df-input"
                value={newRiderName}
                onChange={(e) => setNewRiderName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Phone Number</label>
              <input
                type="text"
                placeholder="e.g. +91 98765 12345"
                className="df-input"
                value={newRiderPhone}
                onChange={(e) => setNewRiderPhone(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button type="button" onClick={() => setModalOpen(false)} className="df-btn df-btn-secondary df-btn-sm">
                Cancel
              </button>
              <button type="submit" className="df-btn df-btn-primary df-btn-sm">
                Add Rider
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
