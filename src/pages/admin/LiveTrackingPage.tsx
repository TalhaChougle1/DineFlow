import React, { useState } from 'react';
import { MapPin, Navigation, Bike, AlertCircle, Compass, Layers } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const LiveTrackingPage: React.FC = () => {
  const { riders } = useDineFlow();
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);

  const onlineRiders = riders.filter((r) => r.status === 'ONLINE' || r.status === 'ON_DELIVERY');

  const selectedRider = riders.find((r) => r.id === selectedRiderId) || onlineRiders[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Live Fleet Tracking
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Real-time delivery route status and active trip dispatch
          </p>
        </div>
      </div>

      {onlineRiders.length === 0 ? (
        <EmptyState
          icon={Bike}
          title="No riders online right now"
          description="All delivery riders are currently marked offline. When a rider checks in via dispatch, their live trip will appear here."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Active Riders List */}
          <div className="df-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
              Active Riders ({onlineRiders.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {onlineRiders.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRiderId(r.id)}
                  style={{
                    padding: 12,
                    borderRadius: 'var(--radius-md)',
                    border:
                      selectedRider?.id === r.id ? '2px solid var(--df-sage)' : '1px solid var(--df-border)',
                    backgroundColor: selectedRider?.id === r.id ? 'var(--df-sage-light)' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{r.name}</span>
                    <StatusBadge status={r.status} type="rider" />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                    {r.currentLocation?.address || 'Indiranagar Hub'}
                  </div>
                  {r.currentOrderId && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-charcoal)' }}>
                      Trip: {r.currentOrderId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Route / Map Interface */}
          <div className="df-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                  Trip Vector: {selectedRider?.name}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                  {selectedRider?.currentLocation?.address || 'Aster & Oak Central Hub'}
                </div>
              </div>
              <span className="df-badge df-badge-sage">GPS Connected</span>
            </div>

            {/* Stylized Vector Route Canvas */}
            <div
              style={{
                height: 380,
                backgroundColor: '#F8F9F6',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--df-border)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Grid lines background */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(to right, #E6E8E2 1px, transparent 1px), linear-gradient(to bottom, #E6E8E2 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                  opacity: 0.6,
                }}
              />

              {/* Waypoints */}
              <div
                style={{
                  position: 'relative',
                  width: '80%',
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* SVG Route Line */}
                <svg
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 40,
                    right: 40,
                    height: 4,
                    width: 'calc(100% - 80px)',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <line
                    x1="0"
                    y1="2"
                    x2="100%"
                    y2="2"
                    stroke="var(--df-sage)"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                  />
                </svg>

                {/* Point 1: Restaurant Kitchen */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 2 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      backgroundColor: 'var(--df-charcoal)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(44, 49, 41, 0.2)',
                    }}
                  >
                    <Compass size={20} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>Aster & Oak</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--df-text-muted)' }}>Origin Point</span>
                </div>

                {/* Point 2: Live Rider */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 2 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: 'var(--df-sage)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 6px rgba(143, 161, 112, 0.25)',
                    }}
                  >
                    <Bike size={24} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>{selectedRider?.name}</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--df-sage-dark)', fontWeight: 600 }}>
                    In Transit
                  </span>
                </div>

                {/* Point 3: Customer Address */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 2 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: '2px solid var(--df-charcoal)',
                      color: 'var(--df-charcoal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>Guest Destination</span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--df-text-muted)' }}>
                    Indiranagar 12th Main
                  </span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)', textAlign: 'center' }}>
              Map coordinates powered by DineFlow Dispatch Engine · Real telemetry updates every 10s
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
