import React, { useState } from 'react';
import {
  QrCode,
  Plus,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Users,
  Clock,
  IndianRupee,
  Layers,
  UtensilsCrossed,
  Receipt,
  CheckCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { Table, TableStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Drawer } from '../../components/common/Drawer';
import { QRCard } from '../../components/common/QRCard';
import { formatCurrency, formatTime, getElapsedMinutes } from '../../utils/format';
import { getMenuUrl } from '../../utils/qr';

export const TablesPage: React.FC = () => {
  const {
    tables,
    sessions,
    orders,
    restaurant,
    saveTable,
    updateTableStatus,
    deleteTable,
    updateSessionStatus,
  } = useDineFlow();

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [qrModalTable, setQrModalTable] = useState<Table | null>(null);
  const [bulkPrintOpen, setBulkPrintOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Table Form state
  const [newTableNum, setNewTableNum] = useState('');
  const [newCapacity, setNewCapacity] = useState(4);
  const [newArea, setNewArea] = useState<'Main Dining' | 'Terrace Garden' | 'Bar Lounge'>('Main Dining');

  // Metrics
  const freeTables = tables.filter((t) => t.status === 'FREE').length;
  const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED').length;
  const billingTables = tables.filter((t) => t.status === 'BILLING').length;
  const activeSessions = sessions.filter((s) => s.status === 'ACTIVE' || s.status === 'BILLING');

  const currentGuests = tables
    .filter((t) => t.status === 'OCCUPIED' || t.status === 'BILLING')
    .reduce((sum, t) => sum + t.capacity, 0);

  const tableRevenueToday = orders
    .filter((o) => o.orderType === 'DINE_IN' && o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);

  // Filtered tables
  const filteredTables = tables.filter((t) => {
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchArea = selectedArea === 'ALL' || t.floorArea === selectedArea;
    return matchStatus && matchArea;
  });

  const areas = ['ALL', 'Main Dining', 'Terrace Garden', 'Bar Lounge'];

  const handleCopyLink = (tableNum: string) => {
    const url = getMenuUrl(restaurant.slug, tableNum);
    navigator.clipboard.writeText(url);
    setCopiedId(tableNum);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum.trim()) return;
    saveTable({
      restaurantId: restaurant.id,
      tableNumber: newTableNum.trim(),
      capacity: Number(newCapacity),
      floorArea: newArea,
      status: 'FREE',
    });
    setNewTableNum('');
    setCreateModalOpen(false);
  };

  // Get active session for selected table
  const activeSession = selectedTable
    ? sessions.find(
        (s) =>
          (s.tableId === selectedTable.id || s.tableNumber === selectedTable.tableNumber) &&
          (s.status === 'ACTIVE' || s.status === 'BILLING')
      )
    : null;

  // Active session orders
  const sessionOrders = activeSession
    ? orders.filter((o) => activeSession.orderIds.includes(o.id))
    : [];

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
            Tables & Floor Plan
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Real-time table occupancy, interactive floor map, and dynamic QR ordering endpoints
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setBulkPrintOpen(true)}
            className="df-btn df-btn-secondary df-btn-sm"
          >
            <Printer size={15} /> Bulk QR Print
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="df-btn df-btn-primary df-btn-sm"
          >
            <Plus size={15} /> Add Table
          </button>
        </div>
      </div>

      {/* Top Telemetry KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
        }}
      >
        <div className="df-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>
            FREE TABLES
          </div>
          <div
            style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              color: '#059669',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {freeTables} <span style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', fontWeight: 500 }}>/ {tables.length}</span>
          </div>
        </div>

        <div className="df-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>
            OCCUPIED TABLES
          </div>
          <div
            style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              color: '#2563EB',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {occupiedTables}
          </div>
        </div>

        <div className="df-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>
            BILLING REQUESTS
          </div>
          <div
            style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              color: '#D97706',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {billingTables}
          </div>
        </div>

        <div className="df-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>
            CURRENT GUESTS
          </div>
          <div
            style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              color: 'var(--df-charcoal)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {currentGuests}
          </div>
        </div>

        <div className="df-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)' }}>
            DINE-IN SALES TODAY
          </div>
          <div
            style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              color: 'var(--df-charcoal)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {formatCurrency(tableRevenueToday)}
          </div>
        </div>
      </div>

      {/* Filter and Area Selector Tabs */}
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
        {/* Floor Area Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Layers size={16} color="var(--df-text-muted)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, marginRight: 4 }}>Area:</span>
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`df-btn df-btn-sm ${
                selectedArea === area ? 'df-btn-primary' : 'df-btn-secondary'
              }`}
              style={{ padding: '4px 12px' }}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SlidersHorizontal size={15} color="var(--df-text-muted)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, marginRight: 4 }}>Status:</span>
          {['ALL', 'FREE', 'OCCUPIED', 'BILLING', 'DISABLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`df-btn df-btn-sm ${
                filterStatus === st ? 'df-btn-primary' : 'df-btn-secondary'
              }`}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Floor Plan Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {filteredTables.map((tbl) => {
          const isDemoTable = tbl.tableNumber === '07';
          const session = sessions.find(
            (s) =>
              (s.tableId === tbl.id || s.tableNumber === tbl.tableNumber) &&
              (s.status === 'ACTIVE' || s.status === 'BILLING')
          );

          return (
            <div
              key={tbl.id}
              className="df-card df-card-interactive"
              style={{
                padding: 20,
                border: isDemoTable
                  ? '2px solid var(--df-sage)'
                  : tbl.status === 'OCCUPIED'
                  ? '1.5px solid #BFDBFE'
                  : tbl.status === 'BILLING'
                  ? '1.5px solid #FDE68A'
                  : '1px solid var(--df-border)',
                backgroundColor:
                  tbl.status === 'OCCUPIED'
                    ? '#F8FAFC'
                    : tbl.status === 'BILLING'
                    ? '#FFFDF5'
                    : '#FFFFFF',
                position: 'relative',
              }}
              onClick={() => setSelectedTable(tbl)}
            >
              {isDemoTable && (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    backgroundColor: 'var(--df-sage)',
                    color: '#FFFFFF',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    letterSpacing: '0.06em',
                  }}
                >
                  KEY DEMO TABLE
                </div>
              )}

              {/* Card Header: Table Number & Status */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: 'var(--df-charcoal)',
                      lineHeight: 1,
                    }}
                  >
                    {tbl.tableNumber}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                    ({tbl.capacity} Seats)
                  </span>
                </div>
                <StatusBadge status={tbl.status} type="table" />
              </div>

              {/* Area & Active info */}
              <div style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)', marginBottom: 12 }}>
                {tbl.floorArea}
              </div>

              {/* Session State snapshot */}
              {session ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--df-border)',
                    marginBottom: 14,
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>{session.customerName || 'Guest'}</span>
                    <span style={{ color: 'var(--df-charcoal)' }}>
                      {formatCurrency(session.total)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: 'var(--df-text-muted)',
                      marginTop: 4,
                    }}
                  >
                    <span>{session.orderIds.length} orders placed</span>
                    <span>{getElapsedMinutes(session.startedAt)} min elapsed</span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#F8F9F6',
                    marginBottom: 14,
                    fontSize: '0.75rem',
                    color: 'var(--df-text-muted)',
                    textAlign: 'center',
                  }}
                >
                  Table is ready for seating & QR scan
                </div>
              )}

              {/* Quick Actions */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  borderTop: '1px solid var(--df-border-subtle)',
                  paddingTop: 12,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setQrModalTable(tbl)}
                  className="df-btn df-btn-secondary df-btn-sm"
                  style={{ flex: 1, padding: '5px 8px', fontSize: '0.75rem' }}
                  title="View QR Code"
                >
                  <QrCode size={13} /> View QR
                </button>

                <button
                  onClick={() => handleCopyLink(tbl.tableNumber)}
                  className="df-btn df-btn-secondary df-btn-sm"
                  style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                  title="Copy Direct Menu URL"
                >
                  {copiedId === tbl.tableNumber ? (
                    <Check size={13} color="#059669" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>

                <a
                  href={getMenuUrl(restaurant.slug, tbl.tableNumber)}
                  target="_blank"
                  rel="noreferrer"
                  className="df-btn df-btn-outline df-btn-sm"
                  style={{ padding: '5px 10px' }}
                  title="Open Customer Menu for this Table"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Table Detail Drawer */}
      <Drawer
        isOpen={!!selectedTable}
        onClose={() => setSelectedTable(null)}
        title={selectedTable ? `Table ${selectedTable.tableNumber}` : ''}
        subtitle={
          selectedTable
            ? `${selectedTable.floorArea} · ${selectedTable.capacity} Seats · Status: ${selectedTable.status}`
            : ''
        }
        footer={
          selectedTable && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedTable.status === 'OCCUPIED' && (
                <button
                  onClick={() => {
                    if (activeSession) {
                      updateSessionStatus(activeSession.id, 'BILLING');
                    } else {
                      updateTableStatus(selectedTable.id, 'BILLING');
                    }
                    setSelectedTable({ ...selectedTable, status: 'BILLING' });
                  }}
                  className="df-btn df-btn-primary"
                  style={{ width: '100%' }}
                >
                  <Receipt size={16} /> Generate Bill (Move to Billing)
                </button>
              )}

              {selectedTable.status === 'BILLING' && (
                <button
                  onClick={() => {
                    if (activeSession) {
                      updateSessionStatus(activeSession.id, 'CLOSED');
                    }
                    updateTableStatus(selectedTable.id, 'FREE');
                    setSelectedTable({ ...selectedTable, status: 'FREE' });
                  }}
                  className="df-btn df-btn-sage"
                  style={{ width: '100%' }}
                >
                  <CheckCircle size={16} /> Close Session & Release Table (FREE)
                </button>
              )}

              {selectedTable.status === 'FREE' && (
                <button
                  onClick={() => {
                    updateTableStatus(selectedTable.id, 'OCCUPIED');
                    setSelectedTable({ ...selectedTable, status: 'OCCUPIED' });
                  }}
                  className="df-btn df-btn-secondary"
                  style={{ width: '100%' }}
                >
                  Seat Guests (Manual Check-in)
                </button>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    setQrModalTable(selectedTable);
                  }}
                  className="df-btn df-btn-secondary df-btn-sm"
                  style={{ flex: 1 }}
                >
                  <QrCode size={14} /> Open QR Card
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove Table ${selectedTable.tableNumber}?`)) {
                      deleteTable(selectedTable.id);
                      setSelectedTable(null);
                    }
                  }}
                  className="df-btn df-btn-danger df-btn-sm"
                >
                  Delete Table
                </button>
              </div>
            </div>
          )
        }
      >
        {selectedTable && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Table Details Info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                backgroundColor: 'var(--df-bg)',
                padding: 16,
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Status</span>
                <div>
                  <StatusBadge status={selectedTable.status} type="table" />
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Capacity</span>
                <div style={{ fontWeight: 700 }}>{selectedTable.capacity} Guests</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Location</span>
                <div style={{ fontWeight: 600 }}>{selectedTable.floorArea}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>Direct Menu</span>
                <div>
                  <a
                    href={getMenuUrl(restaurant.slug, selectedTable.tableNumber)}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--df-sage-dark)',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    Open Link <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Active Session details if occupied */}
            {activeSession ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Active Dining Session</h4>

                <div
                  style={{
                    border: '1px solid var(--df-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 14,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--df-text-muted)' }}>Customer Name</span>
                    <span style={{ fontWeight: 700 }}>{activeSession.customerName || 'Walk-in Guest'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--df-text-muted)' }}>Session Started</span>
                    <span>{formatTime(activeSession.startedAt)} ({getElapsedMinutes(activeSession.startedAt)}m ago)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--df-text-muted)' }}>Orders Placed</span>
                    <span style={{ fontWeight: 700 }}>{activeSession.orderIds.length} orders</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--df-border-subtle)',
                      paddingTop: 8,
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                    }}
                  >
                    <span>Current Session Total</span>
                    <span>{formatCurrency(activeSession.total)}</span>
                  </div>
                </div>

                {/* Orders in this session */}
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: 6 }}>Session Orders</h4>
                {sessionOrders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      padding: 12,
                      border: '1px solid var(--df-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#FAFBF9',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{ord.id}</span>
                      <StatusBadge status={ord.orderStatus} />
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                      {ord.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 6,
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                      }}
                    >
                      <span>{formatTime(ord.createdAt)}</span>
                      <span>{formatCurrency(ord.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: 32,
                  textAlign: 'center',
                  backgroundColor: 'var(--df-bg)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--df-text-muted)',
                  fontSize: '0.875rem',
                }}
              >
                No active order or session on this table.
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Single Table QR Card Modal */}
      {qrModalTable && (
        <Modal
          isOpen={!!qrModalTable}
          onClose={() => setQrModalTable(null)}
          title={`Table ${qrModalTable.tableNumber} QR Code`}
          subtitle="Real encoded public ordering route for tabletop placement"
          maxWidth="460px"
        >
          <QRCard
            restaurantName={restaurant.name}
            restaurantSlug={restaurant.slug}
            tableNumber={qrModalTable.tableNumber}
            capacity={qrModalTable.capacity}
          />
        </Modal>
      )}

      {/* Bulk QR Print Modal */}
      {bulkPrintOpen && (
        <Modal
          isOpen={bulkPrintOpen}
          onClose={() => setBulkPrintOpen(false)}
          title="Bulk QR Code Cards — Print Preview"
          subtitle={`Ready to print high-resolution QR tent cards for all ${tables.length} tables`}
          maxWidth="900px"
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={() => window.print()} className="df-btn df-btn-primary">
              <Printer size={16} /> Print All QR Cards
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 20,
              maxHeight: '65vh',
              overflowY: 'auto',
              padding: 10,
            }}
          >
            {tables.map((tbl) => (
              <div
                key={tbl.id}
                style={{
                  border: '1.5px solid #2C3129',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--df-sage-dark)' }}>
                  ASTER & OAK
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    margin: '4px 0',
                  }}
                >
                  TABLE {tbl.tableNumber}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--df-text-muted)' }}>
                  {tbl.capacity} Seats · {tbl.floorArea}
                </div>
                <div style={{ margin: '14px auto', display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      getMenuUrl(restaurant.slug, tbl.tableNumber)
                    )}`}
                    alt={`QR Table ${tbl.tableNumber}`}
                    style={{ width: 140, height: 140, display: 'block' }}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>Scan to view menu & order</div>
                <div
                  style={{
                    fontSize: '0.5625rem',
                    color: 'var(--df-text-muted)',
                    marginTop: 4,
                    wordBreak: 'break-all',
                  }}
                >
                  {getMenuUrl(restaurant.slug, tbl.tableNumber)}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Create Table Modal */}
      {createModalOpen && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Add New Dining Table"
          subtitle="Generate new table endpoint and dynamic QR code"
          maxWidth="440px"
        >
          <form onSubmit={handleCreateTable}>
            <div className="df-form-group">
              <label className="df-label">Table Number / Label</label>
              <input
                type="text"
                placeholder="e.g. 10, 11, VIP-1"
                className="df-input"
                value={newTableNum}
                onChange={(e) => setNewTableNum(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Seating Capacity</label>
              <input
                type="number"
                min="1"
                max="24"
                className="df-input"
                value={newCapacity}
                onChange={(e) => setNewCapacity(Number(e.target.value))}
                required
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Floor Area</label>
              <select
                className="df-select"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value as any)}
              >
                <option value="Main Dining">Main Dining</option>
                <option value="Terrace Garden">Terrace Garden</option>
                <option value="Bar Lounge">Bar Lounge</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="df-btn df-btn-secondary df-btn-sm"
              >
                Cancel
              </button>
              <button type="submit" className="df-btn df-btn-primary df-btn-sm">
                Create & Generate QR
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
