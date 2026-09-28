import React, { useState } from 'react';
import { Megaphone, Plus, Calendar, Users, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { Promotion } from '../../types';
import { Modal } from '../../components/common/Modal';

export const PromotionsPage: React.FC = () => {
  const { promotions, savePromotion, restaurant } = useDineFlow();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Partial<Promotion> | null>(null);

  const handleOpenCreate = () => {
    setEditingPromo({
      restaurantId: restaurant.id,
      title: '',
      description: '',
      code: 'SPECIAL20',
      discountDisplay: '20% Special Discount',
      audience: 'All Customers',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo || !editingPromo.title?.trim()) return;
    savePromotion(editingPromo as any);
    setModalOpen(false);
    setEditingPromo(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Marketing Promotions
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Chef seasonal campaigns & broadcast highlights
          </p>
        </div>
        <button onClick={handleOpenCreate} className="df-btn df-btn-primary df-btn-sm">
          <Plus size={15} /> Create Campaign
        </button>
      </div>

      {/* Integration Notice as mandated by Rule 32 */}
      <div
        style={{
          padding: '12px 18px',
          backgroundColor: '#FFFBEB',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <AlertCircle size={18} color="#B45309" />
        <div style={{ fontSize: '0.8125rem', color: '#92400E' }}>
          <strong>WhatsApp Business API:</strong> Ready for webhook configuration. Automatic bulk broadcasting requires Twilio or Meta Cloud API credentials in Settings.
        </div>
      </div>

      {/* Promotions Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {promotions.map((promo) => (
          <div key={promo.id} className="df-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span
                  className="df-badge"
                  style={{
                    backgroundColor: promo.isActive ? '#ECFDF5' : '#F3F4F6',
                    color: promo.isActive ? '#047857' : '#6B7280',
                    border: `1px solid ${promo.isActive ? '#A7F3D0' : '#E5E7EB'}`,
                  }}
                >
                  {promo.isActive ? 'Active Campaign' : 'Completed'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                  Target: {promo.audience}
                </span>
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 6 }}>{promo.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)', marginBottom: 14 }}>
                {promo.description}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--df-bg)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--df-text-muted)' }}>Coupon: </span>
                <span style={{ fontWeight: 800, fontFamily: 'monospace' }}>{promo.code}</span>
              </div>
              <div>
                <span style={{ color: 'var(--df-text-muted)' }}>Validity: </span>
                <span>{promo.startDate} - {promo.endDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Promotion Modal */}
      {modalOpen && editingPromo && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Create Promotional Campaign"
          subtitle="Configure dining incentive and audience targeting"
          maxWidth="480px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="df-form-group">
              <label className="df-label">Campaign Title</label>
              <input
                type="text"
                placeholder="e.g. Sourdough Weekend Carnival"
                className="df-input"
                value={editingPromo.title || ''}
                onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                required
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Campaign Description</label>
              <textarea
                className="df-textarea"
                rows={2}
                value={editingPromo.description || ''}
                onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div className="df-form-group">
                <label className="df-label">Associated Code</label>
                <input
                  type="text"
                  className="df-input"
                  value={editingPromo.code || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="df-form-group">
                <label className="df-label">Audience Segment</label>
                <select
                  className="df-select"
                  value={editingPromo.audience || 'All Customers'}
                  onChange={(e) => setEditingPromo({ ...editingPromo, audience: e.target.value })}
                >
                  <option value="All Customers">All Customers</option>
                  <option value="Dine-In Guests">Dine-In Guests</option>
                  <option value="VIP Loyalists">VIP Loyalists</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button type="button" onClick={() => setModalOpen(false)} className="df-btn df-btn-secondary df-btn-sm">
                Cancel
              </button>
              <button type="submit" className="df-btn df-btn-primary df-btn-sm">
                Launch Campaign
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
