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
  OrderStatus,
  TableStatus,
  SessionStatus,
  RiderStatus,
} from '../types';
import {
  SEED_RESTAURANT,
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  SEED_INVENTORY,
  SEED_TABLES,
  SEED_CUSTOMERS,
  SEED_RIDERS,
  SEED_DISCOUNTS,
  SEED_PROMOTIONS,
  SEED_ORDERS,
  SEED_PAYMENTS,
  SEED_LOST_SALES,
  SEED_NOTIFICATIONS,
  DEFAULT_AUTH_USER,
} from '../data/seedData';
import { soundService } from '../utils/sound';

const STORAGE_KEYS = {
  RESTAURANT: 'df_restaurant_v1',
  CATEGORIES: 'df_categories_v1',
  MENU_ITEMS: 'df_menu_items_v1',
  INVENTORY: 'df_inventory_v1',
  TABLES: 'df_tables_v1',
  SESSIONS: 'df_sessions_v1',
  ORDERS: 'df_orders_v1',
  CUSTOMERS: 'df_customers_v1',
  RIDERS: 'df_riders_v1',
  DISCOUNTS: 'df_discounts_v1',
  PROMOTIONS: 'df_promotions_v1',
  LOST_SALES: 'df_lost_sales_v1',
  PAYMENTS: 'df_payments_v1',
  NOTIFICATIONS: 'df_notifications_v1',
  AUTH: 'df_auth_v1',
};

class DineFlowDatabase {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initStorage();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('dineflow_sync_channel');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'SYNC') {
            this.notifyListeners(false);
          }
        };
      } catch {
        // Fallback for environments without BroadcastChannel
      }
    }
  }

  private initStorage() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.RESTAURANT)) {
      localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(SEED_RESTAURANT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(SEED_MENU_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(SEED_INVENTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(SEED_TABLES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      // Seed existing occupied/billing sessions
      const initialSessions: TableSession[] = [
        {
          id: 'sess_103',
          restaurantId: 'rest_aster_oak',
          tableId: 'tbl_03',
          tableNumber: '03',
          startedAt: new Date(Date.now() - 48 * 60000).toISOString(),
          guestCount: 2,
          status: 'ACTIVE',
          orderIds: ['#DF-1041'],
          subtotal: 1066,
          discount: 106.6,
          tax: 47.97,
          total: 1007.37,
          customerName: 'Aarav Sharma',
          customerPhone: '+91 98201 11223',
        },
        {
          id: 'sess_105',
          restaurantId: 'rest_aster_oak',
          tableId: 'tbl_05',
          tableNumber: '05',
          startedAt: new Date(Date.now() - 65 * 60000).toISOString(),
          guestCount: 4,
          status: 'BILLING',
          orderIds: ['#DF-1042'],
          subtotal: 1447,
          discount: 100,
          tax: 67.35,
          total: 1414.35,
          customerName: 'Priya Iyer',
          customerPhone: '+91 98451 99887',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(initialSessions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RIDERS)) {
      localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(SEED_RIDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DISCOUNTS)) {
      localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(SEED_DISCOUNTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROMOTIONS)) {
      localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(SEED_PROMOTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(SEED_PAYMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOST_SALES)) {
      localStorage.setItem(STORAGE_KEYS.LOST_SALES, JSON.stringify(SEED_LOST_SALES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(DEFAULT_AUTH_USER));
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(broadcast = true) {
    this.listeners.forEach((fn) => fn());
    if (broadcast && this.channel) {
      this.channel.postMessage({ type: 'SYNC', timestamp: Date.now() });
    }
  }

  // --- RESTAURANT ---
  getRestaurant(): Restaurant {
    const data = localStorage.getItem(STORAGE_KEYS.RESTAURANT);
    return data ? JSON.parse(data) : SEED_RESTAURANT;
  }

  updateRestaurant(updates: Partial<Restaurant>): Restaurant {
    const current = this.getRestaurant();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(updated));
    this.notifyListeners();
    return updated;
  }

  // --- AUTH USER ---
  getAuthUser(): AuthUser {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : DEFAULT_AUTH_USER;
  }

  updateAuthUser(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    this.notifyListeners();
  }

  // --- CATEGORIES ---
  getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  }

  saveCategory(cat: Omit<Category, 'id'> & { id?: string }): Category {
    const categories = this.getCategories();
    let saved: Category;
    if (cat.id) {
      saved = cat as Category;
      const idx = categories.findIndex((c) => c.id === cat.id);
      if (idx >= 0) categories[idx] = saved;
      else categories.push(saved);
    } else {
      saved = {
        ...cat,
        id: `cat_${Date.now()}`,
        displayOrder: categories.length + 1,
      };
      categories.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notifyListeners();
    return saved;
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notifyListeners();
  }

  // --- MENU ITEMS ---
  getMenuItems(): MenuItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    return data ? JSON.parse(data) : [];
  }

  saveMenuItem(item: Omit<MenuItem, 'id'> & { id?: string }): MenuItem {
    const items = this.getMenuItems();
    let saved: MenuItem;
    if (item.id) {
      saved = item as MenuItem;
      const idx = items.findIndex((i) => i.id === item.id);
      if (idx >= 0) items[idx] = saved;
      else items.push(saved);
    } else {
      saved = {
        ...item,
        id: `item_${Date.now()}`,
      };
      items.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));

    // Synchronize or create corresponding inventory item
    this.syncItemToInventory(saved);

    this.notifyListeners();
    return saved;
  }

  updateItemPrice(id: string, newPrice: number): void {
    const items = this.getMenuItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0) {
      items[idx].price = Math.max(0, newPrice);
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
      this.notifyListeners();
    }
  }

  toggleItemAvailability(id: string, isAvailable?: boolean): void {
    const items = this.getMenuItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0) {
      items[idx].isAvailable =
        isAvailable !== undefined ? isAvailable : !items[idx].isAvailable;
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
      this.notifyListeners();
    }
  }

  deleteMenuItem(id: string): void {
    const items = this.getMenuItems().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    this.notifyListeners();
  }

  // --- INVENTORY ---
  getInventory(): InventoryItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return data ? JSON.parse(data) : [];
  }

  adjustStock(inventoryId: string, delta: number): void {
    const inventory = this.getInventory();
    const inv = inventory.find((i) => i.id === inventoryId);
    if (!inv) return;

    inv.currentStock = Math.max(0, inv.currentStock + delta);
    inv.lastUpdated = new Date().toISOString();

    if (inv.currentStock <= 0) {
      inv.status = 'OUT_OF_STOCK';
    } else if (inv.currentStock <= inv.lowStockThreshold) {
      inv.status = 'LOW_STOCK';
    } else {
      inv.status = 'IN_STOCK';
    }

    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));

    // Critical Requirement: When stock reaches 0, update corresponding Menu item availability!
    const menuItems = this.getMenuItems();
    const menuItem = menuItems.find((m) => m.id === inv.menuItemId);
    if (menuItem) {
      if (inv.currentStock <= 0) {
        menuItem.isAvailable = false;
        menuItem.stockQuantity = 0;
      } else {
        menuItem.stockQuantity = inv.currentStock;
      }
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
    }

    // Trigger low-stock notification if reached threshold
    if (inv.status === 'LOW_STOCK' || inv.status === 'OUT_OF_STOCK') {
      this.addNotification({
        type: 'LOW_STOCK',
        title: inv.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Low Stock Alert',
        message: `${inv.name} is ${inv.status === 'OUT_OF_STOCK' ? 'out of stock' : `down to ${inv.currentStock} ${inv.unit}`}.`,
        link: '/admin/inventory',
      });
    }

    this.notifyListeners();
  }

  private syncItemToInventory(item: MenuItem) {
    const inventory = this.getInventory();
    const existing = inventory.find((inv) => inv.menuItemId === item.id);
    const category = this.getCategories().find((c) => c.id === item.categoryId);

    if (existing) {
      existing.name = item.name;
      existing.currentStock = item.stockQuantity;
      existing.categoryName = category?.name || 'General';
      existing.status =
        existing.currentStock <= 0
          ? 'OUT_OF_STOCK'
          : existing.currentStock <= existing.lowStockThreshold
          ? 'LOW_STOCK'
          : 'IN_STOCK';
      existing.lastUpdated = new Date().toISOString();
    } else {
      inventory.push({
        id: `inv_${item.id}`,
        restaurantId: item.restaurantId,
        menuItemId: item.id,
        name: item.name,
        categoryName: category?.name || 'General',
        currentStock: item.stockQuantity,
        unit: 'portions',
        lowStockThreshold: 5,
        status:
          item.stockQuantity <= 0
            ? 'OUT_OF_STOCK'
            : item.stockQuantity <= 5
            ? 'LOW_STOCK'
            : 'IN_STOCK',
        lastUpdated: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }

  // --- TABLES & SESSIONS ---
  getTables(): Table[] {
    const data = localStorage.getItem(STORAGE_KEYS.TABLES);
    return data ? JSON.parse(data) : [];
  }

  getTableByNumber(tableNumber: string): Table | undefined {
    return this.getTables().find(
      (t) => t.tableNumber.toLowerCase() === tableNumber.toLowerCase()
    );
  }

  saveTable(table: Omit<Table, 'id'> & { id?: string }): Table {
    const tables = this.getTables();
    let saved: Table;
    if (table.id) {
      saved = table as Table;
      const idx = tables.findIndex((t) => t.id === table.id);
      if (idx >= 0) tables[idx] = saved;
      else tables.push(saved);
    } else {
      // Ensure zero-padded table number if single digit
      const formattedNum = table.tableNumber.trim().padStart(2, '0');
      saved = {
        ...table,
        tableNumber: formattedNum,
        id: `tbl_${Date.now()}`,
        status: table.status || 'FREE',
      };
      tables.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    this.notifyListeners();
    return saved;
  }

  updateTableStatus(tableId: string, status: TableStatus): void {
    const tables = this.getTables();
    const tbl = tables.find((t) => t.id === tableId);
    if (tbl) {
      tbl.status = status;
      if (status === 'FREE') {
        tbl.activeSessionId = undefined;
      }
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      this.notifyListeners();
    }
  }

  deleteTable(tableId: string): void {
    const tables = this.getTables().filter((t) => t.id !== tableId);
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    this.notifyListeners();
  }

  getTableSessions(): TableSession[] {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  }

  getActiveSessionForTable(tableIdOrNumber: string): TableSession | undefined {
    const sessions = this.getTableSessions();
    return sessions.find(
      (s) =>
        (s.tableId === tableIdOrNumber || s.tableNumber === tableIdOrNumber) &&
        (s.status === 'ACTIVE' || s.status === 'BILLING')
    );
  }

  createOrGetTableSession(tableNumber: string, customerName?: string, customerPhone?: string): TableSession {
    const existing = this.getActiveSessionForTable(tableNumber);
    if (existing) {
      if (customerName && !existing.customerName) existing.customerName = customerName;
      if (customerPhone && !existing.customerPhone) existing.customerPhone = customerPhone;
      return existing;
    }

    const table = this.getTableByNumber(tableNumber);
    const newSession: TableSession = {
      id: `sess_${Date.now()}`,
      restaurantId: 'rest_aster_oak',
      tableId: table ? table.id : `tbl_${tableNumber}`,
      tableNumber,
      startedAt: new Date().toISOString(),
      guestCount: table?.capacity || 2,
      status: 'ACTIVE',
      orderIds: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      customerName,
      customerPhone,
    };

    const sessions = this.getTableSessions();
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Update table status to ACTIVE/OCCUPIED
    if (table) {
      table.status = 'OCCUPIED';
      table.activeSessionId = newSession.id;
      const tables = this.getTables();
      const idx = tables.findIndex((t) => t.id === table.id);
      if (idx >= 0) tables[idx] = table;
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    }

    this.notifyListeners();
    return newSession;
  }

  updateSessionStatus(sessionId: string, status: SessionStatus): void {
    const sessions = this.getTableSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    session.status = status;
    if (status === 'CLOSED') {
      session.endedAt = new Date().toISOString();
    }
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Table state derived from session
    const tables = this.getTables();
    const table = tables.find((t) => t.id === session.tableId || t.tableNumber === session.tableNumber);
    if (table) {
      if (status === 'BILLING') {
        table.status = 'BILLING';
      } else if (status === 'CLOSED') {
        table.status = 'FREE';
        table.activeSessionId = undefined;
      }
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    }

    this.notifyListeners();
  }

  // --- ORDERS ---
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Order {
    const orders = this.getOrders();
    const orderNumber = 1040 + orders.length + 1;
    const orderId = orderData.id || `#DF-${orderNumber}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Deduct stock for all items ordered
    newOrder.items.forEach((item) => {
      const invList = this.getInventory();
      const inv = invList.find((i) => i.menuItemId === item.menuItemId);
      if (inv) {
        this.adjustStock(inv.id, -item.quantity);
      }
    });

    // If Dine-In, associate with Table & Session
    if (newOrder.orderType === 'DINE_IN' && newOrder.tableNumber) {
      const session = this.createOrGetTableSession(
        newOrder.tableNumber,
        newOrder.customerName,
        newOrder.customerPhone
      );
      session.orderIds.push(newOrder.id);
      session.subtotal += newOrder.subtotal;
      session.discount += newOrder.discount;
      session.tax += newOrder.tax;
      session.total += newOrder.total;

      const sessions = this.getTableSessions();
      const sIdx = sessions.findIndex((s) => s.id === session.id);
      if (sIdx >= 0) sessions[sIdx] = session;
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

      // Table is OCCUPIED
      const table = this.getTableByNumber(newOrder.tableNumber);
      if (table) {
        table.status = 'OCCUPIED';
        table.activeSessionId = session.id;
        const tables = this.getTables();
        const tIdx = tables.findIndex((t) => t.id === table.id);
        if (tIdx >= 0) tables[tIdx] = table;
        localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
      }
    }

    // Record Payment if marked PAID
    if (newOrder.paymentStatus === 'PAID') {
      this.recordPayment({
        orderId: newOrder.id,
        restaurantId: newOrder.restaurantId,
        customerName: newOrder.customerName,
        amount: newOrder.total,
        method: newOrder.paymentMethod,
        status: 'PAID',
        transactionRef: `${newOrder.paymentMethod}-ORD-${Date.now().toString().slice(-6)}`,
      });
    }

    // Register / update customer profile
    if (newOrder.customerPhone && newOrder.customerName) {
      this.syncCustomerFromOrder(newOrder);
    }

    // Add alert notification for Admin & Kitchen
    this.addNotification({
      type: 'NEW_ORDER',
      title: `New ${newOrder.orderType.replace('_', ' ')} Order`,
      message: `Order ${newOrder.id} (${newOrder.tableNumber ? `Table ${newOrder.tableNumber} · ` : ''}₹${newOrder.total.toFixed(2)}) placed.`,
      link: '/admin/live-orders',
    });

    // Sound chime!
    soundService.playOrderChime();

    this.notifyListeners();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();

    if (status === 'SERVED' || status === 'DELIVERED') {
      // If payment was pending upon serve/delivery, mark paid or handle according to method
      if (order.paymentStatus === 'PAID') {
        // already paid
      }
    }

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Play subtle status chime
    soundService.playStatusChime();

    this.notifyListeners();
  }

  updateOrderPayment(orderId: string, paymentStatus: Order['paymentStatus'], method?: Order['paymentMethod']): void {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.paymentStatus = paymentStatus;
    if (method) order.paymentMethod = method;
    order.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    if (paymentStatus === 'PAID') {
      this.recordPayment({
        orderId: order.id,
        restaurantId: order.restaurantId,
        customerName: order.customerName,
        amount: order.total,
        method: order.paymentMethod,
        status: 'PAID',
        transactionRef: `${order.paymentMethod}-ORD-${Date.now().toString().slice(-6)}`,
      });
    }

    this.notifyListeners();
  }

  // --- CUSTOMERS ---
  getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  }

  private syncCustomerFromOrder(order: Order) {
    const customers = this.getCustomers();
    let customer = customers.find(
      (c) => c.phone === order.customerPhone || (order.customerId && c.id === order.customerId)
    );

    if (customer) {
      customer.name = order.customerName || customer.name;
      customer.totalOrders += 1;
      customer.totalSpend += order.total;
      customer.lastOrderAt = order.createdAt;
      if (order.customerAddress && !customer.address) {
        customer.address = order.customerAddress;
      }
      order.items.forEach((item) => {
        if (!customer!.favoriteItems.includes(item.name)) {
          customer!.favoriteItems.push(item.name);
        }
      });
    } else {
      customer = {
        id: `cust_${Date.now()}`,
        restaurantId: order.restaurantId,
        name: order.customerName,
        phone: order.customerPhone,
        email: `${order.customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        address: order.customerAddress,
        totalOrders: 1,
        totalSpend: order.total,
        firstOrderAt: order.createdAt,
        lastOrderAt: order.createdAt,
        favoriteItems: order.items.map((i) => i.name),
      };
      customers.push(customer);
    }

    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  // --- RIDERS ---
  getRiders(): Rider[] {
    const data = localStorage.getItem(STORAGE_KEYS.RIDERS);
    return data ? JSON.parse(data) : [];
  }

  updateRiderStatus(riderId: string, status: RiderStatus): void {
    const riders = this.getRiders();
    const rider = riders.find((r) => r.id === riderId);
    if (rider) {
      rider.status = status;
      localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(riders));
      this.notifyListeners();
    }
  }

  saveRider(
    rider: Omit<Rider, 'id' | 'rating' | 'completedDeliveries' | 'earnings'> & {
      id?: string;
      rating?: number;
      completedDeliveries?: number;
      earnings?: number;
    }
  ): Rider {
    const riders = this.getRiders();
    let saved: Rider;
    if (rider.id) {
      saved = rider as Rider;
      const idx = riders.findIndex((r) => r.id === rider.id);
      if (idx >= 0) riders[idx] = saved;
      else riders.push(saved);
    } else {
      saved = {
        ...rider,
        id: `rdr_${Date.now()}`,
        completedDeliveries: rider.completedDeliveries ?? 0,
        earnings: rider.earnings ?? 0,
        rating: rider.rating ?? 5.0,
      };
      riders.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(riders));
    this.notifyListeners();
    return saved;
  }

  // --- DISCOUNTS ---
  getDiscounts(): Discount[] {
    const data = localStorage.getItem(STORAGE_KEYS.DISCOUNTS);
    return data ? JSON.parse(data) : [];
  }

  saveDiscount(discount: Omit<Discount, 'id'> & { id?: string }): Discount {
    const discounts = this.getDiscounts();
    let saved: Discount;
    if (discount.id) {
      saved = discount as Discount;
      const idx = discounts.findIndex((d) => d.id === discount.id);
      if (idx >= 0) discounts[idx] = saved;
      else discounts.push(saved);
    } else {
      saved = {
        ...discount,
        id: `disc_${Date.now()}`,
        code: discount.code.toUpperCase().trim(),
        usageCount: 0,
      };
      discounts.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(discounts));
    this.notifyListeners();
    return saved;
  }

  validateDiscount(code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string; discount?: Discount } {
    const discounts = this.getDiscounts();
    const match = discounts.find(
      (d) => d.code.toUpperCase() === code.toUpperCase().trim() && d.isActive
    );

    if (!match) {
      return { valid: false, discountAmount: 0, message: 'Invalid or inactive promo code.' };
    }

    if (subtotal < match.minOrder) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order of ₹${match.minOrder} required for code ${match.code}.`,
      };
    }

    let discountAmount = 0;
    if (match.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * match.value) / 100;
      if (match.maxDiscount && discountAmount > match.maxDiscount) {
        discountAmount = match.maxDiscount;
      }
    } else {
      discountAmount = Math.min(match.value, subtotal);
    }

    discountAmount = Math.round((discountAmount + Number.EPSILON) * 100) / 100;

    return {
      valid: true,
      discountAmount,
      message: `Coupon ${match.code} applied! Saved ₹${discountAmount.toFixed(2)}`,
      discount: match,
    };
  }

  // --- PROMOTIONS ---
  getPromotions(): Promotion[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    return data ? JSON.parse(data) : [];
  }

  savePromotion(promo: Omit<Promotion, 'id'> & { id?: string }): Promotion {
    const promos = this.getPromotions();
    let saved: Promotion;
    if (promo.id) {
      saved = promo as Promotion;
      const idx = promos.findIndex((p) => p.id === promo.id);
      if (idx >= 0) promos[idx] = saved;
      else promos.push(saved);
    } else {
      saved = {
        ...promo,
        id: `promo_${Date.now()}`,
      };
      promos.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promos));
    this.notifyListeners();
    return saved;
  }

  // --- PAYMENTS ---
  getPayments(): PaymentRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
  }

  recordPayment(payment: Omit<PaymentRecord, 'id' | 'createdAt'>): PaymentRecord {
    const payments = this.getPayments();
    const record: PaymentRecord = {
      ...payment,
      id: `pay_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    payments.unshift(record);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    this.notifyListeners();
    return record;
  }

  // --- LOST SALES ---
  getLostSales(): LostSale[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOST_SALES);
    return data ? JSON.parse(data) : [];
  }

  recordLostSale(lostSale: Omit<LostSale, 'id' | 'abandonedAt'>): LostSale {
    const list = this.getLostSales();
    const record: LostSale = {
      ...lostSale,
      id: `lost_${Date.now()}`,
      abandonedAt: new Date().toISOString(),
    };
    list.unshift(record);
    localStorage.setItem(STORAGE_KEYS.LOST_SALES, JSON.stringify(list));
    this.notifyListeners();
    return record;
  }

  // --- NOTIFICATIONS ---
  getNotifications(): NotificationItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read' | 'restaurantId'>): NotificationItem {
    const notifications = this.getNotifications();
    const item: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      restaurantId: 'rest_aster_oak',
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(item);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    this.notifyListeners();
    return item;
  }

  markNotificationRead(id: string): void {
    const notifications = this.getNotifications();
    const item = notifications.find((n) => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      this.notifyListeners();
    }
  }

  markAllNotificationsRead(): void {
    const notifications = this.getNotifications();
    notifications.forEach((n) => (n.read = true));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    this.notifyListeners();
  }

  // --- RESET DEMO DATA ---
  resetAllDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(SEED_RESTAURANT));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(SEED_MENU_ITEMS));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(SEED_INVENTORY));
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(SEED_TABLES));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(SEED_RIDERS));
    localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(SEED_DISCOUNTS));
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(SEED_PROMOTIONS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(SEED_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.LOST_SALES, JSON.stringify(SEED_LOST_SALES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(DEFAULT_AUTH_USER));
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    this.initStorage();
    this.notifyListeners();
  }
}

export const db = new DineFlowDatabase();
