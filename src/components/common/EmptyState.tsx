import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '56px 24px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--df-border)',
        maxWidth: 520,
        margin: '24px auto',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'var(--df-sage-light)',
          color: 'var(--df-sage-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Icon size={26} />
      </div>
      <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--df-charcoal)', marginBottom: 6 }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', maxWidth: 380, marginBottom: 20 }}>
        {description}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {actionLabel && onAction && (
            <button onClick={onAction} className="df-btn df-btn-primary df-btn-sm">
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button onClick={onSecondaryAction} className="df-btn df-btn-secondary df-btn-sm">
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
