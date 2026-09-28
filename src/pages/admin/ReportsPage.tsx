import React, { useState } from 'react';
import { FileSpreadsheet, Download, Table, ShoppingBag, CreditCard, Boxes, Users } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { formatCurrency, formatDate } from '../../utils/format';

export const ReportsPage: React.FC = () => {
  const { orders, payments, inventory, customers, restaurant } = useDineFlow();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const exportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportOrders = () => {
    const headers = ['Order ID', 'Channel', 'Table', 'Customer', 'Phone', 'Items', 'Subtotal', 'Discount', 'Tax', 'Total', 'Payment Method', 'Payment Status', 'Order Status', 'Created At'];
    const rows = orders.map((o) => [
      o.id,
      o.orderType,
      o.tableNumber || '',
      o.customerName,
      o.customerPhone,
      o.items.map((i) => `${i.name} (${i.quantity})`).join('; '),
      o.subtotal,
      o.discount,
      o.tax,
      o.total,
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
      o.createdAt,
    ]);
    exportCSV('aster-and-oak-orders', headers, rows);
  };

  const handleExportPayments = () => {
    const headers = ['Transaction Ref', 'Order ID', 'Customer', 'Amount', 'Payment Method', 'Status', 'Date'];
    const rows = payments.map((p) => [
      p.transactionRef,
      p.orderId,
      p.customerName,
      p.amount,
      p.method,
      p.status,
      p.createdAt,
    ]);
    exportCSV('aster-and-oak-payments', headers, rows);
  };

  const handleExportInventory = () => {
    const headers = ['Ingredient / Dish', 'Category', 'Current Stock', 'Unit', 'Low Stock Threshold', 'Status', 'Last Updated'];
    const rows = inventory.map((i) => [
      i.name,
      i.categoryName,
      i.currentStock,
      i.unit,
      i.lowStockThreshold,
      i.status,
      i.lastUpdated,
    ]);
    exportCSV('aster-and-oak-inventory', headers, rows);
  };

  const handleExportCustomers = () => {
    const headers = ['Name', 'Phone', 'Email', 'Address', 'Total Orders', 'Total Spent', 'First Order', 'Last Order'];
    const rows = customers.map((c) => [
      c.name,
      c.phone,
      c.email,
      c.address || '',
      c.totalOrders,
      c.totalSpend,
      c.firstOrderAt,
      c.lastOrderAt,
    ]);
    exportCSV('aster-and-oak-customers', headers, rows);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--df-charcoal)' }}>
            Data Reports & CSV Exports
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Download real restaurant audits, GST invoices, and financial records
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#ECFDF5',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          ✓ Successfully exported report for {downloadSuccess}.csv!
        </div>
      )}

      {/* Grid of Report Types */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Orders Report */}
        <div className="df-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <ShoppingBag size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 6 }}>
              Sales & Orders Audit
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)', marginBottom: 20 }}>
              Complete item-by-item audit of all {orders.length} tickets, including dine-in tables, takeaway, and delivery breakdown.
            </p>
          </div>
          <button onClick={handleExportOrders} className="df-btn df-btn-primary df-btn-sm" style={{ width: '100%' }}>
            <Download size={14} /> Export Orders (CSV)
          </button>
        </div>

        {/* Payments Report */}
        <div className="df-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <CreditCard size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 6 }}>
              Settlement & Ledger
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)', marginBottom: 20 }}>
              Reconciliation records across {payments.length} transactions, payment gateway reference numbers, and UPI handles.
            </p>
          </div>
          <button onClick={handleExportPayments} className="df-btn df-btn-primary df-btn-sm" style={{ width: '100%' }}>
            <Download size={14} /> Export Payments (CSV)
          </button>
        </div>

        {/* Inventory Report */}
        <div className="df-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Boxes size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 6 }}>
              Stock & Inventory Audit
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)', marginBottom: 20 }}>
              Current stock count for {inventory.length} tracked items, low stock warnings, and reorder levels.
            </p>
          </div>
          <button onClick={handleExportInventory} className="df-btn df-btn-primary df-btn-sm" style={{ width: '100%' }}>
            <Download size={14} /> Export Inventory (CSV)
          </button>
        </div>

        {/* Customers Report */}
        <div className="df-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', backgroundColor: '#F5F3FF', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 6 }}>
              Customer Profiles & LTV
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)', marginBottom: 20 }}>
              Full directory of {customers.length} registered guests with contact information, visits, and cumulative spend.
            </p>
          </div>
          <button onClick={handleExportCustomers} className="df-btn df-btn-primary df-btn-sm" style={{ width: '100%' }}>
            <Download size={14} /> Export Customers (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};
