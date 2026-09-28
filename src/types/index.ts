export type RestaurantStatus = 'OPEN' | 'CLOSED' | 'FORCED_OPEN' | 'FORCED_CLOSED';

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  slug: string;
  status: RestaurantStatus;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  fssai: string;
  openingTime: string;
  closingTime: string;
  currency: string;
  taxPercentage: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  packagingFee: number;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  logoUrl?: string;
  coverUrl?: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  iconName: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItemVariant {
  id: string;
  name: string; // e.g. "Regular", "Medium", "Large"
  price: number;
}

export interface MenuItemAddOn {
  id: string;
  name: string; // e.g. "Extra Truffle Oil", "Jalapeño Popper", "Burrata Cheese"
  price: number;
}

export type DietaryType = 'VEG' | 'NON_VEG' | 'VEGAN';

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number; // in INR
  image: string;
  isAvailable: boolean;
  preparationTime: number; // minutes
  stockQuantity: number;
  trackStock: boolean;
  isFeatured: boolean;
  dietary: DietaryType;
  variants?: MenuItemVariant[];
  addOns?: MenuItemAddOn[];
}

export interface InventoryItem {
  id: string;
  restaurantId: string;
  menuItemId: string;
  name: string;
  categoryName: string;
  currentStock: number;
  unit: string; // e.g. "portions", "kg", "units", "bottles"
  lowStockThreshold: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastUpdated: string;
}

export type TableStatus = 'FREE' | 'OCCUPIED' | 'BILLING' | 'DISABLED';

export interface Table {
  id: string;
  restaurantId: string;
  tableNumber: string; // e.g. "01", "07"
  capacity: number; // e.g. 2, 4, 6, 8
  status: TableStatus;
  activeSessionId?: string;
  floorArea: 'Main Dining' | 'Terrace Garden' | 'Bar Lounge';
  qrUrl?: string;
}

export type SessionStatus = 'ACTIVE' | 'BILLING' | 'CLOSED';

export interface TableSession {
  id: string;
  restaurantId: string;
  tableId: string;
  tableNumber: string;
  startedAt: string;
  endedAt?: string;
  guestCount: number;
  status: SessionStatus;
  orderIds: string[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customerName?: string;
  customerPhone?: string;
}

export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'WALK_IN';

export type OrderStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'ONLINE';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedVariant?: MenuItemVariant;
  selectedAddOns?: MenuItemAddOn[];
  itemTotal: number;
  notes?: string;
}

export interface Order {
  id: string; // e.g. "#DF-1047"
  restaurantId: string;
  orderType: OrderType;
  tableNumber?: string;
  tableId?: string;
  sessionId?: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  tax: number;
  deliveryFee: number;
  packagingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  totalOrders: number;
  totalSpend: number;
  firstOrderAt: string;
  lastOrderAt: string;
  favoriteItems: string[];
}

export type RiderStatus = 'ONLINE' | 'ON_DELIVERY' | 'OFFLINE';

export interface Rider {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  status: RiderStatus;
  currentOrderId?: string;
  rating: number;
  completedDeliveries: number;
  earnings: number;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Discount {
  id: string;
  restaurantId: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  isActive: boolean;
  usageCount: number;
  usageLimit: number;
  description: string;
}

export interface Promotion {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  code: string;
  discountDisplay: string;
  audience: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface LostSale {
  id: string;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  potentialTotal: number;
  abandonedAt: string;
  reason: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  restaurantId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  restaurantId: string;
  type: 'NEW_ORDER' | 'ORDER_STATUS' | 'LOW_STOCK' | 'TABLE_REQUEST' | 'PAYMENT';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'KITCHEN' | 'STAFF' | 'RIDER';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  restaurantId: string;
  email: string;
}
