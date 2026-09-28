import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DineFlowProvider } from './context/DineFlowContext';
import { CartProvider } from './context/CartContext';
import { AdminLayout } from './components/layout/AdminLayout';

// Landing Page
import { LandingPage } from './pages/landing/LandingPage';

// Customer Pages
import { CustomerMenuPage } from './pages/customer/CustomerMenuPage';
import { CustomerTrackingPage } from './pages/customer/CustomerTrackingPage';

// Admin Pages
import { DashboardPage } from './pages/admin/DashboardPage';
import { LiveOrdersPage } from './pages/admin/LiveOrdersPage';
import { KitchenPage } from './pages/admin/KitchenPage';
import { POSPage } from './pages/admin/POSPage';
import { TablesPage } from './pages/admin/TablesPage';
import { MenuPage } from './pages/admin/MenuPage';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { InventoryPage } from './pages/admin/InventoryPage';
import { CustomersPage } from './pages/admin/CustomersPage';
import { RidersPage } from './pages/admin/RidersPage';
import { LiveTrackingPage } from './pages/admin/LiveTrackingPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { LostSalesPage } from './pages/admin/LostSalesPage';
import { DiscountsPage } from './pages/admin/DiscountsPage';
import { PromotionsPage } from './pages/admin/PromotionsPage';
import { PaymentsPage } from './pages/admin/PaymentsPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

export function App() {
  return (
    <DineFlowProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Customer Public Menu & QR Endpoints */}
            <Route path="/menu/:restaurantSlug" element={<CustomerMenuPage />} />
            <Route path="/track/:orderId" element={<CustomerTrackingPage />} />

            {/* Admin Backoffice System */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/live-orders" element={<LiveOrdersPage />} />
              <Route path="/admin/kitchen" element={<KitchenPage />} />
              <Route path="/admin/pos" element={<POSPage />} />
              <Route path="/admin/tables" element={<TablesPage />} />
              <Route path="/admin/menu" element={<MenuPage />} />
              <Route path="/admin/categories" element={<CategoriesPage />} />
              <Route path="/admin/inventory" element={<InventoryPage />} />
              <Route path="/admin/customers" element={<CustomersPage />} />
              <Route path="/admin/riders" element={<RidersPage />} />
              <Route path="/admin/live-tracking" element={<LiveTrackingPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/lost-sales" element={<LostSalesPage />} />
              <Route path="/admin/discounts" element={<DiscountsPage />} />
              <Route path="/admin/promotions" element={<PromotionsPage />} />
              <Route path="/admin/payments" element={<PaymentsPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </DineFlowProvider>
  );
}

export default App;
