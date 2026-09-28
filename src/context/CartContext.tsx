import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MenuItem, MenuItemVariant, MenuItemAddOn, OrderItem, OrderType } from '../types';
import { useDineFlow } from './DineFlowContext';

interface CartContextType {
  items: OrderItem[];
  tableNumber?: string;
  orderType: OrderType;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderNotes: string;
  discountCode: string;
  discountAmount: number;
  discountMessage: string;
  isOpen: boolean;

  subtotal: number;
  tax: number;
  deliveryFee: number;
  packagingFee: number;
  total: number;
  totalQuantity: number;

  addItem: (
    item: MenuItem,
    variant?: MenuItemVariant,
    addOns?: MenuItemAddOn[],
    quantity?: number,
    notes?: string
  ) => void;
  updateQuantity: (index: number, delta: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  setIsOpen: (open: boolean) => void;
  setTableNumber: (table?: string) => void;
  setOrderType: (type: OrderType) => void;
  setCustomerInfo: (name: string, phone: string, address?: string) => void;
  setOrderNotes: (notes: string) => void;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { restaurant, validateDiscount, recordLostSale } = useDineFlow();

  const [items, setItems] = useState<OrderItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('df_cart_items');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [tableNumber, setTableNumber] = useState<string | undefined>(undefined);
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [customerName, setCustomerName] = useState<string>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('df_cart_name') || '' : '';
  });
  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('df_cart_phone') || '' : '';
  });
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountMessage, setDiscountMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Sync cart to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('df_cart_items', JSON.stringify(items));
      if (customerName) localStorage.setItem('df_cart_name', customerName);
      if (customerPhone) localStorage.setItem('df_cart_phone', customerPhone);
    }
  }, [items, customerName, customerPhone]);

  // Track potential abandoned checkout (Lost Sales) before unloading if cart has items and user entered contact
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (items.length > 0 && customerPhone && customerName) {
        const cartSubtotal = items.reduce((acc, curr) => acc + curr.itemTotal, 0);
        recordLostSale({
          restaurantId: restaurant.id,
          customerName,
          customerPhone,
          items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.unitPrice })),
          subtotal: cartSubtotal,
          potentialTotal: cartSubtotal * 1.05,
          reason: 'Browser tab closed during active checkout session',
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [items, customerName, customerPhone, restaurant.id, recordLostSale]);

  const subtotal = useMemo(() => {
    const sum = items.reduce((acc, curr) => acc + curr.itemTotal, 0);
    return Math.round((sum + Number.EPSILON) * 100) / 100;
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [items]);

  // Recalculate discount if subtotal changes
  useEffect(() => {
    if (discountCode) {
      const res = validateDiscount(discountCode, subtotal);
      if (res.valid) {
        setDiscountAmount(res.discountAmount);
        setDiscountMessage(res.message);
      } else {
        setDiscountAmount(0);
        setDiscountMessage(res.message);
      }
    } else {
      setDiscountAmount(0);
      setDiscountMessage('');
    }
  }, [subtotal, discountCode, validateDiscount]);

  const deliveryFee = useMemo(() => {
    if (orderType !== 'DELIVERY') return 0;
    if (subtotal >= restaurant.freeDeliveryThreshold) return 0;
    return restaurant.deliveryFee;
  }, [orderType, subtotal, restaurant]);

  const packagingFee = useMemo(() => {
    if (orderType === 'TAKEAWAY' || orderType === 'DELIVERY') {
      return restaurant.packagingFee;
    }
    return 0;
  }, [orderType, restaurant]);

  const tax = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const calculated = (taxableAmount * restaurant.taxPercentage) / 100;
    return Math.round((calculated + Number.EPSILON) * 100) / 100;
  }, [subtotal, discountAmount, restaurant.taxPercentage]);

  const total = useMemo(() => {
    const calc = Math.max(0, subtotal - discountAmount) + tax + deliveryFee + packagingFee;
    return Math.round((calc + Number.EPSILON) * 100) / 100;
  }, [subtotal, discountAmount, tax, deliveryFee, packagingFee]);

  const addItem = (
    item: MenuItem,
    variant?: MenuItemVariant,
    addOns?: MenuItemAddOn[],
    quantity = 1,
    notes?: string
  ) => {
    const basePrice = variant ? variant.price : item.price;
    const addOnTotal = addOns ? addOns.reduce((sum, a) => sum + a.price, 0) : 0;
    const unitPrice = basePrice + addOnTotal;
    const itemTotal = unitPrice * quantity;

    const formattedName = variant ? `${item.name} (${variant.name})` : item.name;

    setItems((prev) => {
      // Check if identical item (same ID, variant, and add-ons) already exists
      const existingIdx = prev.findIndex((i) => {
        const sameId = i.menuItemId === item.id;
        const sameVariant = i.selectedVariant?.id === variant?.id;
        const sameAddOns =
          JSON.stringify(i.selectedAddOns?.map((a) => a.id).sort()) ===
          JSON.stringify(addOns?.map((a) => a.id).sort());
        return sameId && sameVariant && sameAddOns;
      });

      if (existingIdx >= 0) {
        const next = [...prev];
        const existing = next[existingIdx];
        const newQty = existing.quantity + quantity;
        next[existingIdx] = {
          ...existing,
          quantity: newQty,
          itemTotal: existing.unitPrice * newQty,
          notes: notes || existing.notes,
        };
        return next;
      }

      return [
        ...prev,
        {
          menuItemId: item.id,
          name: formattedName,
          unitPrice,
          quantity,
          selectedVariant: variant,
          selectedAddOns: addOns,
          itemTotal,
          notes,
        },
      ];
    });

    setIsOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) => {
      const next = [...prev];
      const target = next[index];
      if (!target) return prev;
      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        next[index] = {
          ...target,
          quantity: newQty,
          itemTotal: target.unitPrice * newQty,
        };
      }
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode('');
    setDiscountAmount(0);
    setDiscountMessage('');
    setOrderNotes('');
  };

  const applyDiscountCode = (code: string) => {
    const res = validateDiscount(code, subtotal);
    if (res.valid) {
      setDiscountCode(code.toUpperCase().trim());
      setDiscountAmount(res.discountAmount);
      setDiscountMessage(res.message);
      return { success: true, message: res.message };
    } else {
      return { success: false, message: res.message };
    }
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
    setDiscountAmount(0);
    setDiscountMessage('');
  };

  const setCustomerInfo = (name: string, phone: string, address = '') => {
    setCustomerName(name);
    setCustomerPhone(phone);
    if (address) setCustomerAddress(address);
  };

  const value: CartContextType = {
    items,
    tableNumber,
    orderType,
    customerName,
    customerPhone,
    customerAddress,
    orderNotes,
    discountCode,
    discountAmount,
    discountMessage,
    isOpen,
    subtotal,
    tax,
    deliveryFee,
    packagingFee,
    total,
    totalQuantity,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setIsOpen,
    setTableNumber,
    setOrderType,
    setCustomerInfo,
    setOrderNotes,
    applyDiscountCode,
    removeDiscountCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
