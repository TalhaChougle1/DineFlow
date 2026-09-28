import React, { useEffect, useState, useRef } from 'react';
import { Download, Copy, Printer, Check, ExternalLink, QrCode } from 'lucide-react';
import { generateQRCodeDataURL, downloadQRCodePNG, downloadQRCodeSVG, getMenuUrl } from '../../utils/qr';

interface QRCardProps {
  restaurantName: string;
  restaurantSlug: string;
  tableNumber?: string;
  capacity?: number;
  onClose?: () => void;
  showPrintCard?: boolean;
}

export const QRCard: React.FC<QRCardProps> = ({
  restaurantName,
  restaurantSlug,
  tableNumber,
  capacity,
  showPrintCard = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  const fullUrl = getMenuUrl(restaurantSlug, tableNumber);
  const fileName = tableNumber
    ? `${restaurantSlug}-table-${tableNumber}-qr`
    : `${restaurantSlug}-menu-qr`;

  useEffect(() => {
    let isMounted = true;
    generateQRCodeDataURL(fullUrl, 360).then((url) => {
      if (isMounted) setQrDataUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [fullUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Branded QR Card Container (designed for tabletop display) */}
      <div
        ref={printRef}
        className="df-card print-card"
        style={{
          padding: '32px 24px',
          textAlign: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--df-border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--df-sage-dark)',
            marginBottom: 4,
          }}
        >
          DINEFLOW CONNECTED DINING
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--df-charcoal)',
            letterSpacing: '-0.02em',
          }}
        >
          {restaurantName.toUpperCase()}
        </h3>

        {tableNumber ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 10,
              padding: '6px 18px',
              backgroundColor: 'var(--df-charcoal)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            TABLE {tableNumber}
            {capacity && (
              <span style={{ opacity: 0.65, fontSize: '0.8125rem' }}>
                · {capacity} Seats
              </span>
            )}
          </div>
        ) : (
          <div
            style={{
              marginTop: 10,
              padding: '4px 14px',
              backgroundColor: 'var(--df-sage-light)',
              color: 'var(--df-sage-dark)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            Restaurant Digital Menu
          </div>
        )}

        {/* QR Code Canvas/Image */}
        <div
          style={{
            margin: '24px 0 16px',
            padding: 16,
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--df-border)',
            boxShadow: '0 4px 12px rgba(44, 49, 41, 0.05)',
            display: 'inline-flex',
          }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for Table ${tableNumber || 'Menu'}`}
              style={{ width: 200, height: 200, display: 'block' }}
            />
          ) : (
            <div
              style={{
                width: 200,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--df-text-muted)',
              }}
            >
              <QrCode size={40} />
            </div>
          )}
        </div>

        <p
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--df-charcoal)',
            marginBottom: 4,
          }}
        >
          Scan to view menu & order
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
          No app download required · Instant digital ordering
        </p>

        {/* Encoded URL display for transparency */}
        <div
          style={{
            marginTop: 18,
            fontSize: '0.6875rem',
            color: 'var(--df-text-light)',
            wordBreak: 'break-all',
            padding: '6px 12px',
            backgroundColor: '#F7F8F5',
            borderRadius: 'var(--radius-sm)',
            maxWidth: '100%',
          }}
        >
          {fullUrl}
        </div>
      </div>

      {/* Action Controls (Hidden in Print Mode) */}
      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <button
            onClick={() => downloadQRCodePNG(fullUrl, fileName)}
            className="df-btn df-btn-secondary df-btn-sm"
          >
            <Download size={15} /> PNG (Print Quality)
          </button>
          <button
            onClick={() => downloadQRCodeSVG(fullUrl, fileName)}
            className="df-btn df-btn-secondary df-btn-sm"
          >
            <Download size={15} /> Vector SVG
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <button onClick={handleCopyLink} className="df-btn df-btn-secondary df-btn-sm">
            {copied ? <Check size={15} color="#059669" /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button onClick={handlePrint} className="df-btn df-btn-primary df-btn-sm">
            <Printer size={15} /> Print Card
          </button>
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="df-btn df-btn-outline df-btn-sm"
          >
            <ExternalLink size={15} /> Open Menu
          </a>
        </div>
      </div>
    </div>
  );
};
