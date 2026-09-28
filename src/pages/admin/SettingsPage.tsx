import React, { useState } from 'react';
import { Settings, Store, Clock, QrCode, Bell, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { RestaurantStatus } from '../../types';
import { getMenuUrl } from '../../utils/qr';

export const SettingsPage: React.FC = () => {
  const { restaurant, updateRestaurant } = useDineFlow();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(restaurant.name);
  const [tagline, setTagline] = useState(restaurant.tagline);
  const [slug, setSlug] = useState(restaurant.slug);
  const [status, setStatus] = useState<RestaurantStatus>(restaurant.status);
  const [address, setAddress] = useState(restaurant.address);
  const [phone, setPhone] = useState(restaurant.phone);
  const [email, setEmail] = useState(restaurant.email);
  const [gstin, setGstin] = useState(restaurant.gstin);
  const [fssai, setFssai] = useState(restaurant.fssai);
  const [openingTime, setOpeningTime] = useState(restaurant.openingTime);
  const [closingTime, setClosingTime] = useState(restaurant.closingTime);
  const [taxPercentage, setTaxPercentage] = useState(restaurant.taxPercentage);
  const [deliveryFee, setDeliveryFee] = useState(restaurant.deliveryFee);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(restaurant.freeDeliveryThreshold);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurant({
      name,
      tagline,
      slug,
      status,
      address,
      phone,
      email,
      gstin,
      fssai,
      openingTime,
      closingTime,
      taxPercentage: Number(taxPercentage),
      deliveryFee: Number(deliveryFee),
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const publicUrl = getMenuUrl(slug);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Restaurant Configuration & Store Settings
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Master profile, operating hours, compliance IDs, and dynamic QR endpoints
          </p>
        </div>

        {saved && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#059669',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            <CheckCircle2 size={16} /> Changes saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Section 1: Store Operating Status */}
        <div className="df-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Store size={18} /> Store Status & Availability
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {(['OPEN', 'CLOSED', 'FORCED_OPEN', 'FORCED_CLOSED'] as RestaurantStatus[]).map((st) => (
              <label
                key={st}
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  border: status === st ? '2px solid var(--df-charcoal)' : '1px solid var(--df-border)',
                  backgroundColor: status === st ? '#F8F9F6' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <input
                  type="radio"
                  name="restaurantStatus"
                  value={st}
                  checked={status === st}
                  onChange={() => setStatus(st)}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{st.replace('_', ' ')}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--df-text-muted)' }}>
                    {st === 'OPEN'
                      ? 'Accepting digital & QR orders'
                      : st === 'CLOSED'
                      ? 'Kitchen shut down'
                      : 'Manual operational override'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Section 2: Identity & Legal Compliance */}
        <div className="df-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={18} /> Identity & Legal Compliance
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div className="df-form-group">
              <label className="df-label">Restaurant Display Name</label>
              <input
                type="text"
                className="df-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Tagline / Concept</label>
              <input
                type="text"
                className="df-input"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">GSTIN Identification Number</label>
              <input
                type="text"
                className="df-input"
                style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                required
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">FSSAI Food License #</label>
              <input
                type="text"
                className="df-input"
                style={{ fontFamily: 'monospace' }}
                value={fssai}
                onChange={(e) => setFssai(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="df-form-group">
            <label className="df-label">Physical Address</label>
            <input
              type="text"
              className="df-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div className="df-form-group">
              <label className="df-label">Official Phone</label>
              <input
                type="text"
                className="df-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Official Email</label>
              <input
                type="email"
                className="df-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: QR Menu & Routing */}
        <div className="df-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrCode size={18} /> Public Menu & QR Routing
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <div className="df-form-group">
              <label className="df-label">Restaurant URL Slug</label>
              <input
                type="text"
                className="df-input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Live Public Endpoint</label>
              <input
                type="text"
                className="df-input"
                value={publicUrl}
                readOnly
                style={{ backgroundColor: 'var(--df-bg)', color: 'var(--df-text-muted)' }}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Timings & Ordering Policies */}
        <div className="df-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} /> Hours & Financial Rates
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div className="df-form-group">
              <label className="df-label">Opening Time</label>
              <input
                type="time"
                className="df-input"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Closing Time</label>
              <input
                type="time"
                className="df-input"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">GST Tax (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="df-input"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(Number(e.target.value))}
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Delivery Fee (₹)</label>
              <input
                type="number"
                min="0"
                className="df-input"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Free Delivery Over (₹)</label>
              <input
                type="number"
                min="0"
                className="df-input"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="submit" className="df-btn df-btn-primary df-btn-lg">
            <Save size={16} /> Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
