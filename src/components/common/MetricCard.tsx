import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  iconBg,
  iconColor,
  onClick,
}) => {
  return (
    <div
      className={`df-metric-card ${onClick ? 'df-card-interactive' : ''}`}
      onClick={onClick}
    >
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        <div
          className="metric-icon-wrap"
          style={{
            backgroundColor: iconBg || 'var(--df-sage-light)',
            color: iconColor || 'var(--df-sage-dark)',
          }}
        >
          <Icon size={18} />
        </div>
      </div>
      <div className="metric-value">{value}</div>
      {(subtext || trendValue) && (
        <div className="metric-subtext">
          {trendValue && (
            <span
              style={{
                fontWeight: 600,
                color:
                  trend === 'up'
                    ? '#059669'
                    : trend === 'down'
                    ? '#DC2626'
                    : 'var(--df-text-muted)',
              }}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  );
};
