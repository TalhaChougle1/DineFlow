import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  CookingPot,
  LayoutDashboard,
  Calculator,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  UtensilsCrossed,
  Layers,
  TrendingUp,
  Boxes,
  Users,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { generateQRCodeDataURL, getMenuUrl, getBaseOrigin } from '../../utils/qr';

export const LandingPage: React.FC = () => {
  const [demoQrUrl, setDemoQrUrl] = useState<string>('');
  const origin = getBaseOrigin();
  const table07Url = `${origin}/menu/aster-and-oak?table=07`;
  const menuUrl = `${origin}/menu/aster-and-oak`;

  useEffect(() => {
    generateQRCodeDataURL(table07Url, 280).then((url) => {
      setDemoQrUrl(url);
    });
  }, [table07Url]);

  return (
    <div style={{ backgroundColor: 'var(--df-warm-ivory)', minHeight: '100vh', color: 'var(--df-charcoal)' }}>
      {/* Navigation Header */}
      <nav
        style={{
          borderBottom: '1px solid #DDDCD2',
          padding: '18px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#252A23',
              color: 'var(--df-sage)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
            }}
          >
            DF
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              DINEFLOW
            </div>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--df-sage-dark)', letterSpacing: '0.08em' }}>
              RESTAURANT OS
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            to="/admin/dashboard"
            className="df-btn df-btn-secondary df-btn-sm"
            style={{ borderColor: '#DDDCD2' }}
          >
            <LayoutDashboard size={14} /> Open Admin
          </Link>
          <a
            href={table07Url}
            target="_blank"
            rel="noreferrer"
            className="df-btn df-btn-primary df-btn-sm"
          >
            <span>Live Guest Demo</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: '72px 24px 60px',
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 48,
          alignItems: 'center',
        }}
      >
        {/* Left Column: Hero Copy */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              backgroundColor: 'var(--df-pale-sage)',
              color: '#3F4D2F',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: 20,
              border: '1px solid #D0DCBF',
            }}
          >
            <Sparkles size={14} />
            <span>Demonstrating: Aster & Oak Artisanal Kitchen</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              color: '#252A23',
              marginBottom: 20,
            }}
          >
            Restaurant operations,{' '}
            <span style={{ color: 'var(--df-terracotta)' }}>beautifully connected.</span>
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              color: '#5C6057',
              lineHeight: 1.6,
              maxWidth: 540,
              marginBottom: 32,
            }}
          >
            From the first QR scan to the final bill, DINEFLOW connects your restaurant&rsquo;s
            digital menu, dining tables, orders, kitchen display, POS, and customers in one unified system.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/admin/dashboard" className="df-btn df-btn-primary df-btn-lg">
              <span>Explore Restaurant OS</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href={table07Url}
              target="_blank"
              rel="noreferrer"
              className="df-btn df-btn-outline df-btn-lg"
              style={{ borderColor: '#252A23' }}
            >
              <Smartphone size={18} /> Test Table 07 Menu
            </a>
          </div>

          {/* Quick link shortcuts */}
          <div
            style={{
              marginTop: 36,
              paddingTop: 24,
              borderTop: '1px solid #DDDCD2',
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            <Link to="/admin/live-orders" style={{ color: '#252A23', display: 'flex', alignItems: 'center', gap: 4 }}>
              • Live Orders
            </Link>
            <Link to="/admin/kitchen" style={{ color: '#252A23', display: 'flex', alignItems: 'center', gap: 4 }}>
              • Kitchen KDS
            </Link>
            <Link to="/admin/pos" style={{ color: '#252A23', display: 'flex', alignItems: 'center', gap: 4 }}>
              • Walk-in POS
            </Link>
            <Link to="/admin/tables" style={{ color: '#252A23', display: 'flex', alignItems: 'center', gap: 4 }}>
              • Floor Plan & QR
            </Link>
          </div>
        </div>

        {/* Right Column: Real Interactive Demo QR Tent Card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '2px solid #252A23',
              boxShadow: '0 16px 40px rgba(37, 42, 35, 0.12)',
              padding: '36px 28px',
              maxWidth: 360,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -12,
                backgroundColor: 'var(--df-terracotta)',
                color: '#FFFFFF',
                fontSize: '0.6875rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              SCAN ON YOUR PHONE
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--df-sage-dark)', letterSpacing: '0.1em' }}>
              DINEFLOW DEMO OUTLET
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 10px' }}>
              ASTER & OAK
            </h3>

            <div
              style={{
                padding: '6px 16px',
                backgroundColor: '#252A23',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              TABLE 07 · TERRACE GARDEN
            </div>

            {/* Dynamic QR */}
            <div
              style={{
                padding: 14,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E8E2',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 4px 12px rgba(44, 49, 41, 0.06)',
                marginBottom: 14,
              }}
            >
              {demoQrUrl ? (
                <img
                  src={demoQrUrl}
                  alt="Aster & Oak Table 07 QR"
                  style={{ width: 200, height: 200, display: 'block' }}
                />
              ) : (
                <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={48} />
                </div>
              )}
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#252A23' }}>
              Scan to try the Aster & Oak experience
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)', marginTop: 4 }}>
              Encodes: <code style={{ fontSize: '0.6875rem' }}>/menu/aster-and-oak?table=07</code>
            </div>

            <a
              href={table07Url}
              target="_blank"
              rel="noreferrer"
              className="df-btn df-btn-secondary df-btn-sm"
              style={{ marginTop: 18, width: '100%', borderColor: '#DDDCD2' }}
            >
              <span>Or Click Here To Open In Browser</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* Connected Architecture Workflow Section */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #DDDCD2', borderBottom: '1px solid #DDDCD2', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 48px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
              One Restaurant. One System. Every Order Connected.
            </h2>
            <p style={{ color: 'var(--df-text-muted)', fontSize: '1rem' }}>
              DineFlow eliminates disconnected silos by synchronizing the entire dining lifecycle across browser tabs and devices in real-time.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              {
                step: '01',
                title: 'Table & QR',
                desc: 'Generate unique table endpoints & printable tent cards with vector SVG and PNG downloads.',
                icon: QrCode,
              },
              {
                step: '02',
                title: 'Customer Menu',
                desc: 'Mobile-first ordering with instant dietary filters, portion size variants, and coupon validation.',
                icon: Smartphone,
              },
              {
                step: '03',
                title: 'Kitchen KDS',
                desc: 'Touch-optimized kitchen display with elapsed time alerts and single-tap order stage advance.',
                icon: CookingPot,
              },
              {
                step: '04',
                title: 'POS & Analytics',
                desc: 'Unified walk-in sale recording, automated stock deductions, and derived financial reporting.',
                icon: Calculator,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  style={{
                    backgroundColor: 'var(--df-warm-ivory)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 24,
                    border: '1px solid #DDDCD2',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#252A23',
                        color: 'var(--df-sage)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--df-sage-dark)' }}>
                      {card.step}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 8 }}>{card.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', lineHeight: 1.5 }}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '36px 24px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
        <div>
          <strong>DINEFLOW</strong> — Connected Commercial Restaurant Operating System
        </div>
        <div style={{ marginTop: 6 }}>
          Demonstration Restaurant: <strong>Aster & Oak</strong> (Indiranagar, Bengaluru)
        </div>
      </footer>
    </div>
  );
};
