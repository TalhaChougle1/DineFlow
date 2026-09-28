import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  X,
  CheckCircle,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useDineFlow } from '../../context/DineFlowContext';
import { Drawer } from '../common/Drawer';
import { formatCurrency } from '../../utils/format';
import { PaymentMethod } from '../../types';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    setIsOpen,
    tableNumber,
    orderType,
    setOrderType,
    customerName,
    customerPhone,
    customerAddress,
    setCustomerInfo,
    orderNotes,
    setOrderNotes,
    discountCode,
    discountAmount,
    discountMessage,
    applyDiscountCode,
    removeDiscountCode,
    subtotal,
    tax,
    deliveryFee,
    packagingFee,
    total,
    totalQuantity,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const { restaurant, createOrder } = useDineFlow();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    tableNumber ? 'UPI' : 'ONLINE'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscountCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setPromoInput('');
    }
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your name and phone number to place the order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        restaurantId: restaurant.id,
        orderType: tableNumber ? 'DINE_IN' : orderType,
        tableNumber: tableNumber || undefined,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim() || undefined,
        items,
        subtotal,
        discount: discountAmount,
        discountCode: discountCode || undefined,
        tax,
        deliveryFee,
        packagingFee,
        total,
        paymentMethod,
        paymentStatus: 'PAID', // Instant verification
        orderStatus: 'NEW',
        notes: orderNotes.trim() || undefined,
        estimatedMinutes: 20,
      });

      // Celebrate
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      clearCart();
      setIsOpen(false);
      navigate(`/track/${encodeURIComponent(order.id)}`);
    } catch (err) {
      console.error('Order creation error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Your Dining Cart"
      subtitle={
        tableNumber
          ? `Aster & Oak · Table ${tableNumber} (Dine-in)`
          : `Aster & Oak · ${orderType.replace('_', ' ')}`
      }
      footer={
        items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)' }}>To Pay</span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--df-charcoal)',
                }}
              >
                {formatCurrency(total)}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="df-btn df-btn-primary df-btn-lg"
              style={{ width: '100%', gap: 8 }}
            >
              <span>{isSubmitting ? 'Placing Order...' : 'Place Order & Pay'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <div
          style={{
            padding: '48px 16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'var(--df-bg)',
              color: 'var(--df-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={24} />
          </div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Your cart is empty</h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
            Explore the culinary catalog and add wood-fired pizzas, handmade pasta, and small plates.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Order Channel Selector if not at table */}
          {!tableNumber && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <button
                onClick={() => setOrderType('TAKEAWAY')}
                className={`df-btn df-btn-sm ${
                  orderType === 'TAKEAWAY' ? 'df-btn-primary' : 'df-btn-secondary'
                }`}
              >
                Takeaway / Pickup
              </button>
              <button
                onClick={() => setOrderType('DELIVERY')}
                className={`df-btn df-btn-sm ${
                  orderType === 'DELIVERY' ? 'df-btn-primary' : 'df-btn-secondary'
                }`}
              >
                Home Delivery
              </button>
            </div>
          )}

          {/* Table Confirmation Badge */}
          {tableNumber && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--df-sage-light)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--df-sage-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--df-sage-dark)' }}>
                Seated at Table {tableNumber}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--df-text-muted)' }}>
                Orders routed directly to this table
              </span>
            </div>
          )}

          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingBottom: 12,
                  borderBottom: '1px solid var(--df-border-subtle)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--df-charcoal)' }}>
                    {item.name}
                  </div>
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--df-sage-dark)', marginTop: 2 }}>
                      + {item.selectedAddOns.map((a) => a.name).join(', ')}
                    </div>
                  )}
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--df-text-muted)', marginTop: 2 }}>
                    {formatCurrency(item.unitPrice)}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: 'var(--df-bg)',
                      padding: '3px 6px',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(idx, -1)}
                      className="df-btn-icon"
                      style={{ width: 24, height: 24, padding: 0, backgroundColor: '#FFFFFF' }}
                    >
                      <Minus size={11} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '0.8125rem', minWidth: 16, textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(idx, 1)}
                      className="df-btn-icon"
                      style={{ width: 24, height: 24, padding: 0, backgroundColor: '#FFFFFF' }}
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.875rem', minWidth: 60, textAlign: 'right' }}>
                    {formatCurrency(item.itemTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Guest Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Your Details</h4>
            <div className="df-form-group" style={{ marginBottom: 0 }}>
              <input
                type="text"
                placeholder="Full Name"
                className="df-input"
                value={customerName}
                onChange={(e) => setCustomerInfo(e.target.value, customerPhone, customerAddress)}
                required
              />
            </div>
            <div className="df-form-group" style={{ marginBottom: 0 }}>
              <input
                type="tel"
                placeholder="Mobile Number (for live order status)"
                className="df-input"
                value={customerPhone}
                onChange={(e) => setCustomerInfo(customerName, e.target.value, customerAddress)}
                required
              />
            </div>
            {orderType === 'DELIVERY' && !tableNumber && (
              <div className="df-form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  placeholder="Delivery Address"
                  className="df-input"
                  value={customerAddress}
                  onChange={(e) => setCustomerInfo(customerName, customerPhone, e.target.value)}
                  required
                />
              </div>
            )}
            <div className="df-form-group" style={{ marginBottom: 0 }}>
              <input
                type="text"
                placeholder="Special cooking notes (e.g. less spicy, allergy)"
                className="df-input"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Coupon Code Section */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 8 }}>
              Apply Coupon / Discount
            </h4>
            {discountCode ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: '#ECFDF5',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #A7F3D0',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.8125rem' }}>
                    {discountCode} APPLIED
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#065F46' }}>{discountMessage}</div>
                </div>
                <button
                  onClick={removeDiscountCode}
                  style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="e.g. WELCOME10, FLAT100"
                  className="df-input"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                />
                <button type="submit" className="df-btn df-btn-secondary df-btn-sm">
                  Apply
                </button>
              </form>
            )}
            {promoError && (
              <div style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: 4, fontWeight: 600 }}>
                {promoError}
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 8 }}>Payment Method</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { id: 'UPI', label: 'UPI Instant', icon: QrCode },
                { id: 'CARD', label: 'Card Online', icon: CreditCard },
                { id: 'CASH', label: 'Cash at Counter', icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`df-btn df-btn-sm ${
                      paymentMethod === m.id ? 'df-btn-primary' : 'df-btn-secondary'
                    }`}
                    style={{ padding: '10px 4px', flexDirection: 'column', gap: 4 }}
                  >
                    <Icon size={16} />
                    <span style={{ fontSize: '0.6875rem' }}>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bill Breakdown */}
          <div
            style={{
              backgroundColor: 'var(--df-bg)',
              borderRadius: 'var(--radius-md)',
              padding: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: '0.8125rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--df-text-muted)' }}>Items Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                <span>Discount ({discountCode})</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--df-text-muted)' }}>GST ({restaurant.taxPercentage}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            {deliveryFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--df-text-muted)' }}>Delivery Charge</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
            )}
            {packagingFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--df-text-muted)' }}>Eco Packaging</span>
                <span>{formatCurrency(packagingFee)}</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 8,
                marginTop: 4,
                borderTop: '1px solid var(--df-border)',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--df-charcoal)',
              }}
            >
              <span>Total Payable</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};
