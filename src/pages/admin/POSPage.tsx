import React, { useState } from 'react';
import {
  Calculator,
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Printer,
  CheckCircle,
  IndianRupee,
  CreditCard,
  Banknote,
  QrCode,
  Tag,
  User,
  Phone,
  UtensilsCrossed,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { MenuItem, OrderItem, PaymentMethod } from '../../types';
import { formatCurrency, formatTime } from '../../utils/format';
import { Modal } from '../../components/common/Modal';

export const POSPage: React.FC = () => {
  const {
    menuItems,
    categories,
    tables,
    restaurant,
    createOrder,
    validateDiscount,
  } = useDineFlow();

  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Guest');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 00000');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [orderType, setOrderType] = useState<'WALK_IN' | 'DINE_IN' | 'TAKEAWAY'>('WALK_IN');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState('');
  const [notes, setNotes] = useState('');

  // Receipt Modal after order placement
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Filtered dishes
  const filteredMenu = menuItems.filter((item) => {
    const matchCat = selectedCat === 'ALL' || item.categoryId === selectedCat;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && item.isAvailable;
  });

  const handleAddItem = (item: MenuItem) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.menuItemId === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + 1,
          itemTotal: next[idx].unitPrice * (next[idx].quantity + 1),
        };
        return next;
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          unitPrice: item.price,
          quantity: 1,
          itemTotal: item.price,
        },
      ];
    });
  };

  const handleUpdateQty = (idx: number, delta: number) => {
    setCartItems((prev) => {
      const next = [...prev];
      const target = next[idx];
      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx] = {
          ...target,
          quantity: newQty,
          itemTotal: target.unitPrice * newQty,
        };
      }
      return next;
    });
  };

  const handleClear = () => {
    setCartItems([]);
    setDiscountCode('');
    setDiscountAmount(0);
    setDiscountMessage('');
    setNotes('');
  };

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.itemTotal, 0);

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    const res = validateDiscount(discountCode, subtotal);
    if (res.valid) {
      setDiscountAmount(res.discountAmount);
      setDiscountMessage(res.message);
    } else {
      setDiscountAmount(0);
      setDiscountMessage(res.message);
    }
  };

  const tax = Math.round(((Math.max(0, subtotal - discountAmount) * restaurant.taxPercentage) / 100) * 100) / 100;
  const total = Math.max(0, subtotal - discountAmount) + tax;

  const handleRecordSale = () => {
    if (cartItems.length === 0) return;

    const orderData = {
      restaurantId: restaurant.id,
      orderType: selectedTable ? ('DINE_IN' as const) : orderType,
      tableNumber: selectedTable || undefined,
      customerName,
      customerPhone,
      items: cartItems,
      subtotal,
      discount: discountAmount,
      discountCode: discountAmount > 0 ? discountCode : undefined,
      tax,
      deliveryFee: 0,
      packagingFee: orderType === 'TAKEAWAY' ? 25 : 0,
      total,
      paymentMethod,
      paymentStatus: 'PAID' as const,
      orderStatus: 'SERVED' as const,
      notes,
      estimatedMinutes: 10,
    };

    const newOrder = createOrder(orderData);
    setCompletedOrder(newOrder);
    handleClear();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
            Point of Sale (POS)
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Walk-in & staff terminal · Real-time inventory deduction & payment ledger recording
          </p>
        </div>
      </div>

      {/* POS Two-Column Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Left: Menu & Categories Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Search & Category Pills */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--df-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ position: 'relative' }}>
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
                placeholder="Search menu catalog..."
                className="df-input"
                style={{ paddingLeft: 36 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
              <button
                onClick={() => setSelectedCat('ALL')}
                className={`df-btn df-btn-sm ${
                  selectedCat === 'ALL' ? 'df-btn-primary' : 'df-btn-secondary'
                }`}
                style={{ padding: '6px 14px' }}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCat(c.id)}
                  className={`df-btn df-btn-sm ${
                    selectedCat === c.id ? 'df-btn-primary' : 'df-btn-secondary'
                  }`}
                  style={{ padding: '6px 14px' }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 14,
            }}
          >
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="df-card df-card-interactive"
                style={{
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
                onClick={() => handleAddItem(item)}
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '1px solid var(--df-border)',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.2 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
                      {item.stockQuantity} in stock
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--df-border-subtle)',
                    paddingTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'var(--df-charcoal)',
                    }}
                  >
                    {formatCurrency(item.price)}
                  </span>
                  <button
                    className="df-btn df-btn-secondary df-btn-sm"
                    style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart, Customer & Checkout */}
        <div
          className="df-card"
          style={{
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'sticky',
            top: 84,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--df-border)',
              paddingBottom: 12,
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Active Sale</h3>
            {cartItems.length > 0 && (
              <button
                onClick={handleClear}
                style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Customer & Dining Channel Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {(['WALK_IN', 'DINE_IN', 'TAKEAWAY'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setOrderType(mode)}
                  className={`df-btn df-btn-sm ${
                    orderType === mode ? 'df-btn-primary' : 'df-btn-secondary'
                  }`}
                  style={{ padding: '6px 4px', fontSize: '0.6875rem' }}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>

            {orderType === 'DINE_IN' && (
              <div className="df-form-group" style={{ marginBottom: 0 }}>
                <select
                  className="df-select"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  style={{ fontSize: '0.8125rem', padding: '6px 10px' }}
                >
                  <option value="">Select Table...</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.tableNumber}>
                      Table {t.tableNumber} ({t.capacity} seats · {t.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <input
                type="text"
                placeholder="Guest Name"
                className="df-input"
                style={{ fontSize: '0.8125rem', padding: '6px 10px' }}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="df-input"
                style={{ fontSize: '0.8125rem', padding: '6px 10px' }}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div
            style={{
              maxHeight: 220,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              borderTop: '1px solid var(--df-border-subtle)',
              borderBottom: '1px solid var(--df-border-subtle)',
              padding: '10px 0',
            }}
          >
            {cartItems.length === 0 ? (
              <div
                style={{
                  padding: 24,
                  textAlign: 'center',
                  fontSize: '0.8125rem',
                  color: 'var(--df-text-muted)',
                }}
              >
                No dishes in sale ticket. Tap items on left to add.
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                      {formatCurrency(item.unitPrice)} each
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => handleUpdateQty(idx, -1)}
                      className="df-btn-icon"
                      style={{ width: 24, height: 24, padding: 0 }}
                    >
                      <Minus size={11} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '0.8125rem', minWidth: 16, textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(idx, 1)}
                      className="df-btn-icon"
                      style={{ width: 24, height: 24, padding: 0 }}
                    >
                      <Plus size={11} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '0.8125rem', minWidth: 60, textAlign: 'right' }}>
                      {formatCurrency(item.itemTotal)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Discount Code */}
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              placeholder="Promo Code (e.g. WELCOME10)"
              className="df-input"
              style={{ fontSize: '0.8125rem', textTransform: 'uppercase' }}
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button
              onClick={handleApplyDiscount}
              className="df-btn df-btn-secondary df-btn-sm"
              type="button"
            >
              Apply
            </button>
          </div>
          {discountMessage && (
            <div
              style={{
                fontSize: '0.75rem',
                color: discountAmount > 0 ? '#059669' : '#DC2626',
                fontWeight: 600,
              }}
            >
              {discountMessage}
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--df-text-muted)', marginBottom: 6 }}>
              PAYMENT METHOD
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {[
                { id: 'CASH', label: 'Cash', icon: Banknote },
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'CARD', label: 'Card POS', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`df-btn df-btn-sm ${
                      paymentMethod === m.id ? 'df-btn-primary' : 'df-btn-secondary'
                    }`}
                    style={{ padding: '8px 4px', flexDirection: 'column', gap: 4 }}
                  >
                    <Icon size={14} />
                    <span style={{ fontSize: '0.6875rem' }}>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: '0.8125rem',
              backgroundColor: 'var(--df-bg)',
              padding: 12,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--df-text-muted)' }}>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                <span>Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--df-text-muted)' }}>GST (5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 6,
                marginTop: 2,
                borderTop: '1px solid var(--df-border)',
                fontWeight: 800,
                fontSize: '1.125rem',
                color: 'var(--df-charcoal)',
              }}
            >
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Record Sale Button */}
          <button
            onClick={handleRecordSale}
            className="df-btn df-btn-primary df-btn-lg"
            disabled={cartItems.length === 0}
            style={{ width: '100%', gap: 8 }}
          >
            <CheckCircle size={18} /> Record Sale & Print Receipt
          </button>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {completedOrder && (
        <Modal
          isOpen={!!completedOrder}
          onClose={() => setCompletedOrder(null)}
          title="Payment Recorded & Receipt"
          subtitle={`Order ${completedOrder.id} successfully recorded in system`}
          maxWidth="420px"
        >
          <div
            style={{
              padding: 18,
              border: '1.5px dashed var(--df-charcoal)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FFFFFF',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 6 }}>
              <div style={{ fontWeight: 800, fontSize: '1.0625rem' }}>{restaurant.name}</div>
              <div>{restaurant.address}</div>
              <div>GSTIN: {restaurant.gstin} · FSSAI: {restaurant.fssai}</div>
            </div>

            <div style={{ borderTop: '1px dashed #2C3129', paddingTop: 6 }}>
              <div>Order: {completedOrder.id}</div>
              <div>Date: {formatTime(completedOrder.createdAt)}</div>
              <div>Channel: {completedOrder.orderType} {completedOrder.tableNumber ? `(Table ${completedOrder.tableNumber})` : ''}</div>
              <div>Customer: {completedOrder.customerName}</div>
            </div>

            <div style={{ borderTop: '1px dashed #2C3129', paddingTop: 6 }}>
              {completedOrder.items.map((i: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{i.name} ×{i.quantity}</span>
                  <span>{formatCurrency(i.itemTotal)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #2C3129', paddingTop: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(completedOrder.subtotal)}</span>
              </div>
              {completedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Discount:</span>
                  <span>-{formatCurrency(completedOrder.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST (5%):</span>
                <span>{formatCurrency(completedOrder.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9375rem', marginTop: 4 }}>
                <span>PAID ({completedOrder.paymentMethod}):</span>
                <span>{formatCurrency(completedOrder.total)}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.75rem' }}>
              Thank you for dining at Aster & Oak!
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button onClick={() => setCompletedOrder(null)} className="df-btn df-btn-secondary df-btn-sm">
              Done
            </button>
            <button onClick={() => window.print()} className="df-btn df-btn-primary df-btn-sm">
              <Printer size={15} /> Print Receipt
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
