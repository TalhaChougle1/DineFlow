import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Search,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatTime } from '../../utils/format';

export const InventoryPage: React.FC = () => {
  const { inventory, adjustStock } = useDineFlow();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const totalItems = inventory.length;
  const inStockCount = inventory.filter((i) => i.status === 'IN_STOCK').length;
  const lowStockCount = inventory.filter((i) => i.status === 'LOW_STOCK').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'OUT_OF_STOCK').length;

  const filteredInventory = inventory.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Inventory & Stock Tracking
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Real-time kitchen inventory · Reaching 0 portions automatically disables dishes on customer menu
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>
            TOTAL TRACKED INGREDIENTS
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--df-charcoal)', marginTop: 4 }}>
            {totalItems}
          </div>
        </div>

        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>
            HEALTHY STOCK
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#059669', marginTop: 4 }}>
            {inStockCount}
          </div>
        </div>

        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>
            LOW STOCK ALERTS
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#D97706', marginTop: 4 }}>
            {lowStockCount}
          </div>
        </div>

        <div className="df-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>
            OUT OF STOCK (DISABLED)
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#DC2626', marginTop: 4 }}>
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--df-border)',
        }}
      >
        <div style={{ position: 'relative', width: 280 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--df-text-light)',
            }}
          />
          <input
            type="text"
            placeholder="Search inventory items..."
            className="df-input"
            style={{ paddingLeft: 36 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`df-btn df-btn-sm ${
                filterStatus === st ? 'df-btn-primary' : 'df-btn-secondary'
              }`}
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="df-table-container">
        <table className="df-table">
          <thead>
            <tr>
              <th>Dish / Ingredient</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Threshold</th>
              <th>Status</th>
              <th>Stock Adjustment</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 700 }}>{item.name}</td>
                <td>{item.categoryName}</td>
                <td>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color:
                        item.currentStock <= 0
                          ? '#DC2626'
                          : item.currentStock <= item.lowStockThreshold
                          ? '#D97706'
                          : 'var(--df-charcoal)',
                    }}
                  >
                    {item.currentStock} {item.unit}
                  </span>
                </td>
                <td style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                  &le; {item.lowStockThreshold} {item.unit}
                </td>
                <td>
                  <StatusBadge status={item.status} type="inventory" />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => adjustStock(item.id, -1)}
                      className="df-btn-icon"
                      style={{ width: 28, height: 28, padding: 0 }}
                      title="Deduct 1 unit"
                      disabled={item.currentStock <= 0}
                    >
                      <Minus size={13} />
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, 1)}
                      className="df-btn-icon"
                      style={{ width: 28, height: 28, padding: 0 }}
                      title="Add 1 unit"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, 10)}
                      className="df-btn df-btn-secondary df-btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.6875rem' }}
                      title="Restock +10 portions"
                    >
                      +10
                    </button>
                  </div>
                </td>
                <td style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                  {formatTime(item.lastUpdated)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
