import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, QrCode } from 'lucide-react';
import { Restaurant } from '../../types';

interface CustomerHeaderProps {
  restaurant: Restaurant;
  tableNumber?: string;
  isTableValid?: boolean;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  restaurant,
  tableNumber,
  isTableValid = true,
}) => {
  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--df-border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Top Banner if ordering at a specific table */}
      {tableNumber && (
        <div
          style={{
            backgroundColor: isTableValid ? 'var(--df-charcoal)' : '#DC2626',
            color: '#FFFFFF',
            padding: '6px 16px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            letterSpacing: '0.04em',
          }}
        >
          <QrCode size={14} />
          {isTableValid ? (
            <span>ORDERING AT TABLE {tableNumber} · DINE-IN</span>
          ) : (
            <span>TABLE {tableNumber} IS CURRENTLY UNAVAILABLE</span>
          )}
        </div>
      )}

      {/* Main Restaurant Branding */}
      <div style={{ padding: '16px 20px', maxWidth: 800, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                color: 'var(--df-sage-dark)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 2,
              }}
            >
              DIGITAL MENU
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--df-charcoal)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {restaurant.name}
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
              {restaurant.tagline}
            </p>
          </div>

          {/* Restaurant Status Chip */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4,
            }}
          >
            <span
              className="df-badge"
              style={{
                backgroundColor: restaurant.status === 'OPEN' ? '#ECFDF5' : '#FEF2F2',
                color: restaurant.status === 'OPEN' ? '#047857' : '#DC2626',
                border: `1px solid ${restaurant.status === 'OPEN' ? '#A7F3D0' : '#FECACA'}`,
                padding: '4px 10px',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
              {restaurant.status === 'OPEN' ? 'Open Now' : 'Closed'}
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--df-text-muted)' }}>
              {restaurant.openingTime} - {restaurant.closingTime}
            </span>
          </div>
        </div>

        {/* Location & Contact Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
            paddingTop: 10,
            borderTop: '1px solid var(--df-border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--df-text-muted)',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={13} color="var(--df-sage-dark)" />
            <span>{restaurant.address}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href={`tel:${restaurant.phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--df-charcoal)', fontWeight: 600 }}
            >
              <Phone size={13} />
              <span>Call</span>
            </a>
            {restaurant.whatsappEnabled && (
              <a
                href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#059669', fontWeight: 600 }}
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
