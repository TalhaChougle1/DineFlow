import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { db } from '../services/db';
import {
  Restaurant,
  Category,
  MenuItem,
  InventoryItem,
  Table,
  TableSession,
  Order,
  Customer,
  Rider,
  Discount,
  Promotion,
  LostSale,
  PaymentRecord,
  NotificationItem,
  AuthUser,
} from '../types';

interface DineFlowContextType {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  tables: Table[];
  sessions: TableSession[];
  orders: Order[];
  customers: Customer[];
  riders: Rider[];
  discounts: Discount[];
  promotions: Promotion[];
  lostSales: LostSale[];
  payments: PaymentRecord[];
  notifications: NotificationItem[];
  authUser: AuthUser;
  unreadCount: number;

  // DB Methods
  createOrder: typeof db.createOrder;
  updateOrderStatus: typeof db.updateOrderStatus;
  updateOrderPayment: typeof db.updateOrderPayment;
  saveMenuItem: typeof db.saveMenuItem;
  updateItemPrice: typeof db.updateItemPrice;
  toggleItemAvailability: typeof db.toggleItemAvailability;
  deleteMenuItem: typeof db.deleteMenuItem;
  adjustStock: typeof db.adjustStock;
  saveTable: typeof db.saveTable;
  updateTableStatus: typeof db.updateTableStatus;
  deleteTable: typeof db.deleteTable;
  createOrGetTableSession: typeof db.createOrGetTableSession;
  updateSessionStatus: typeof db.updateSessionStatus;
  saveCategory: typeof db.saveCategory;
  deleteCategory: typeof db.deleteCategory;
  validateDiscount: typeof db.validateDiscount;
  saveDiscount: typeof db.saveDiscount;
  savePromotion: typeof db.savePromotion;
  recordPayment: typeof db.recordPayment;
  recordLostSale: typeof db.recordLostSale;
  saveRider: typeof db.saveRider;
  updateRiderStatus: typeof db.updateRiderStatus;
  updateRestaurant: typeof db.updateRestaurant;
  updateAuthUser: typeof db.updateAuthUser;
  markNotificationRead: typeof db.markNotificationRead;
  markAllNotificationsRead: typeof db.markAllNotificationsRead;
  resetAllDemoData: typeof db.resetAllDemoData;
}

const DineFlowContext = createContext<DineFlowContextType | undefined>(undefined);

export const DineFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  const restaurant = useMemo(() => db.getRestaurant(), [/* tick */]);
  const categories = useMemo(() => db.getCategories(), [/* tick */]);
  const menuItems = useMemo(() => db.getMenuItems(), [/* tick */]);
  const inventory = useMemo(() => db.getInventory(), [/* tick */]);
  const tables = useMemo(() => db.getTables(), [/* tick */]);
  const sessions = useMemo(() => db.getTableSessions(), [/* tick */]);
  const orders = useMemo(() => db.getOrders(), [/* tick */]);
  const customers = useMemo(() => db.getCustomers(), [/* tick */]);
  const riders = useMemo(() => db.getRiders(), [/* tick */]);
  const discounts = useMemo(() => db.getDiscounts(), [/* tick */]);
  const promotions = useMemo(() => db.getPromotions(), [/* tick */]);
  const lostSales = useMemo(() => db.getLostSales(), [/* tick */]);
  const payments = useMemo(() => db.getPayments(), [/* tick */]);
  const notifications = useMemo(() => db.getNotifications(), [/* tick */]);
  const authUser = useMemo(() => db.getAuthUser(), [/* tick */]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value: DineFlowContextType = {
    restaurant,
    categories,
    menuItems,
    inventory,
    tables,
    sessions,
    orders,
    customers,
    riders,
    discounts,
    promotions,
    lostSales,
    payments,
    notifications,
    authUser,
    unreadCount,

    createOrder: db.createOrder.bind(db),
    updateOrderStatus: db.updateOrderStatus.bind(db),
    updateOrderPayment: db.updateOrderPayment.bind(db),
    saveMenuItem: db.saveMenuItem.bind(db),
    updateItemPrice: db.updateItemPrice.bind(db),
    toggleItemAvailability: db.toggleItemAvailability.bind(db),
    deleteMenuItem: db.deleteMenuItem.bind(db),
    adjustStock: db.adjustStock.bind(db),
    saveTable: db.saveTable.bind(db),
    updateTableStatus: db.updateTableStatus.bind(db),
    deleteTable: db.deleteTable.bind(db),
    createOrGetTableSession: db.createOrGetTableSession.bind(db),
    updateSessionStatus: db.updateSessionStatus.bind(db),
    saveCategory: db.saveCategory.bind(db),
    deleteCategory: db.deleteCategory.bind(db),
    validateDiscount: db.validateDiscount.bind(db),
    saveDiscount: db.saveDiscount.bind(db),
    savePromotion: db.savePromotion.bind(db),
    recordPayment: db.recordPayment.bind(db),
    recordLostSale: db.recordLostSale.bind(db),
    saveRider: db.saveRider.bind(db),
    updateRiderStatus: db.updateRiderStatus.bind(db),
    updateRestaurant: db.updateRestaurant.bind(db),
    updateAuthUser: db.updateAuthUser.bind(db),
    markNotificationRead: db.markNotificationRead.bind(db),
    markAllNotificationsRead: db.markAllNotificationsRead.bind(db),
    resetAllDemoData: db.resetAllDemoData.bind(db),
  };

  return <DineFlowContext.Provider value={value}>{children}</DineFlowContext.Provider>;
};

export const useDineFlow = () => {
  const context = useContext(DineFlowContext);
  if (!context) {
    throw new Error('useDineFlow must be used within a DineFlowProvider');
  }
  return context;
};
