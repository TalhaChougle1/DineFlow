import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, CheckCircle2, XCircle, Percent, IndianRupee } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { Discount } from '../../types';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/format';

export const DiscountsPage: React.FC = () => {
  const { discounts, saveDiscount, restaurant } = useDineFlow();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDisc, setEditingDisc] = useState<Partial<Discount> | null>(null);

  const handleOpenCreate = () => {
    setEditingDisc({
      restaurantId: restaurant.id,
      code: '',
      discountType: 'PERCENTAGE',
      value: 10,
      minOrder: 500,
      maxDiscount: 150,
      isActive: true,
      usageLimit: 100,
      description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (d: Discount) => {
    setEditingDisc({ ...d });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDisc || !editingDisc.code?.trim()) return;
    saveDiscount(editingDisc as any);
    setModalOpen(false);
    setEditingDisc(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Discounts & Coupons
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Promo codes validated instantly across Customer Menu checkout & Walk-in POS
          </p>
        </div>
        <button onClick={handleOpenCreate} className="df-btn df-btn-primary df-btn-sm">
          <Plus size={15} /> Create Coupon
        </button>
      </div>

      {/* Grid of Discounts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {discounts.map((disc) => (
          <div
            key={disc.id}
            className="df-card"
            style={{
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '1.125rem',
                    backgroundColor: 'var(--df-bg)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--df-border)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {disc.code}
                </span>
                <span
                  className="df-badge"
                  style={{
                    backgroundColor: disc.isActive ? '#ECFDF5' : '#F3F4F6',
                    color: disc.isActive ? '#047857' : '#6B7280',
                    border: `1px solid ${disc.isActive ? '#A7F3D0' : '#E5E7EB'}`,
                  }}
                >
                  {disc.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--df-charcoal)', marginBottom: 4 }}>
                {disc.discountType === 'PERCENTAGE' ? `${disc.value}% OFF` : `FLAT ₹${disc.value} OFF`}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                {disc.description}
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#FAFBF9',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                border: '1px solid var(--df-border-subtle)',
              }}
            >
              <div>
                <span style={{ color: 'var(--df-text-muted)' }}>Min Order: </span>
                <span style={{ fontWeight: 700 }}>₹{disc.minOrder}</span>
              </div>
              {disc.maxDiscount && (
                <div>
                  <span style={{ color: 'var(--df-text-muted)' }}>Max Discount: </span>
                  <span style={{ fontWeight: 700 }}>₹{disc.maxDiscount}</span>
                </div>
              )}
              <div>
                <span style={{ color: 'var(--df-text-muted)' }}>Used: </span>
                <span style={{ fontWeight: 700 }}>{disc.usageCount} / {disc.usageLimit}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <button
                onClick={() => handleOpenEdit(disc)}
                className="df-btn df-btn-secondary df-btn-sm"
              >
                <Edit2 size={13} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && editingDisc && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingDisc.id ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
          subtitle="Will validate against order subtotals automatically"
          maxWidth="480px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="df-form-group">
              <label className="df-label">Coupon Code (Uppercase)</label>
              <input
                type="text"
                placeholder="e.g. WELCOME10, CHEF20"
                className="df-input"
                style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}
                value={editingDisc.code || ''}
                onChange={(e) => setEditingDisc({ ...editingDisc, code: e.target.value.toUpperCase() })}
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div className="df-form-group">
                <label className="df-label">Discount Type</label>
                <select
                  className="df-select"
                  value={editingDisc.discountType || 'PERCENTAGE'}
                  onChange={(e) => setEditingDisc({ ...editingDisc, discountType: e.target.value as any })}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>

              <div className="df-form-group">
                <label className="df-label">Value ({editingDisc.discountType === 'PERCENTAGE' ? '%' : '₹'})</label>
                <input
                  type="number"
                  min="1"
                  className="df-input"
                  value={editingDisc.value ?? 10}
                  onChange={(e) => setEditingDisc({ ...editingDisc, value: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div className="df-form-group">
                <label className="df-label">Minimum Order (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="df-input"
                  value={editingDisc.minOrder ?? 500}
                  onChange={(e) => setEditingDisc({ ...editingDisc, minOrder: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="df-form-group">
                <label className="df-label">Max Discount (₹, Optional)</label>
                <input
                  type="number"
                  min="0"
                  className="df-input"
                  value={editingDisc.maxDiscount ?? ''}
                  onChange={(e) => setEditingDisc({ ...editingDisc, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="df-form-group">
              <label className="df-label">Customer Description</label>
              <input
                type="text"
                placeholder="e.g. 10% off for orders above ₹500"
                className="df-input"
                value={editingDisc.description || ''}
                onChange={(e) => setEditingDisc({ ...editingDisc, description: e.target.value })}
                required
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                checked={editingDisc.isActive ?? true}
                onChange={(e) => setEditingDisc({ ...editingDisc, isActive: e.target.checked })}
              />
              Active & redeemable by guests
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button type="button" onClick={() => setModalOpen(false)} className="df-btn df-btn-secondary df-btn-sm">
                Cancel
              </button>
              <button type="submit" className="df-btn df-btn-primary df-btn-sm">
                Save Coupon
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
