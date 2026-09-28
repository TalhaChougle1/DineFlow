import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Sparkles,
  Clock,
  Plus,
  Check,
  AlertCircle,
  X,
  Layers,
  Flame,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { useCart } from '../../context/CartContext';
import { CustomerHeader } from '../../components/customer/CustomerHeader';
import { CartDrawer } from '../../components/customer/CartDrawer';
import { MenuItem, MenuItemVariant, MenuItemAddOn } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Modal } from '../../components/common/Modal';

export const CustomerMenuPage: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');

  const { restaurant, categories, menuItems, tables } = useDineFlow();
  const { addItem, items, totalQuantity, total, setIsOpen, setTableNumber } = useCart();

  const [selectedCatId, setSelectedCatId] = useState<string>('ALL');
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [search, setSearch] = useState('');

  // Customization modal for variants/add-ons
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | undefined>(undefined);
  const [selectedAddOns, setSelectedAddOns] = useState<MenuItemAddOn[]>([]);
  const [itemQuantity, setItemQuantity] = useState<number>(1);

  // Validate restaurant slug
  const isCorrectRestaurant =
    restaurant.slug.toLowerCase() === (restaurantSlug || '').toLowerCase();

  // Validate table
  const matchedTable = tableParam
    ? tables.find((t) => t.tableNumber.toLowerCase() === tableParam.toLowerCase())
    : undefined;

  const isTableValid = matchedTable ? matchedTable.status !== 'DISABLED' : false;

  useEffect(() => {
    if (tableParam && isTableValid) {
      setTableNumber(tableParam);
    } else {
      setTableNumber(undefined);
    }
  }, [tableParam, isTableValid, setTableNumber]);

  // Filter items
  const filteredDishes = menuItems.filter((item) => {
    const matchCat = selectedCatId === 'ALL' || item.categoryId === selectedCatId;
    const matchDietary = dietaryFilter === 'ALL' || item.dietary === dietaryFilter;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDietary && matchSearch;
  });

  const handleOpenCustomize = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      setSelectedVariant(item.variants[0]);
    } else {
      setSelectedVariant(undefined);
    }
    setSelectedAddOns([]);
    setItemQuantity(1);
    setCustomizingItem(item);
  };

  const handleAddToCartConfirm = () => {
    if (!customizingItem) return;
    addItem(customizingItem, selectedVariant, selectedAddOns, itemQuantity);
    setCustomizingItem(null);
  };

  const toggleAddOn = (addOn: MenuItemAddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addOn.id);
      if (exists) return prev.filter((a) => a.id !== addOn.id);
      return [...prev, addOn];
    });
  };

  // If invalid restaurant slug
  if (!isCorrectRestaurant) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
          Restaurant Not Found
        </h2>
        <p style={{ color: 'var(--df-text-muted)', marginBottom: 20 }}>
          The requested restaurant URL &ldquo;{restaurantSlug}&rdquo; does not exist on DineFlow.
        </p>
        <a href="/menu/aster-and-oak" className="df-btn df-btn-primary">
          Open Aster & Oak Menu
        </a>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F9F6', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Brand & Outlet Header */}
      <CustomerHeader
        restaurant={restaurant}
        tableNumber={tableParam || undefined}
        isTableValid={isTableValid}
      />

      {/* Main Container */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px' }}>
        {/* Invalid Table Notice */}
        {tableParam && !isTableValid && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              color: '#991B1B',
              fontSize: '0.8125rem',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <AlertCircle size={16} />
            <span>
              Table {tableParam} is currently out of service. You may still order for takeaway or pick-up.
            </span>
          </div>
        )}

        {/* Search & Dietary Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--df-text-light)',
              }}
            />
            <input
              type="text"
              placeholder="Search dishes, ingredients, pizzas..."
              className="df-input"
              style={{ paddingLeft: 38, borderRadius: 'var(--radius-full)' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Horizontal Category Scroll */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              <button
                onClick={() => setSelectedCatId('ALL')}
                className={`df-btn df-btn-sm ${
                  selectedCatId === 'ALL' ? 'df-btn-primary' : 'df-btn-secondary'
                }`}
                style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
              >
                All Dishes
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCatId(c.id)}
                  className={`df-btn df-btn-sm ${
                    selectedCatId === c.id ? 'df-btn-primary' : 'df-btn-secondary'
                  }`}
                  style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Veg filter toggle */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 8 }}>
              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'VEG' ? 'ALL' : 'VEG')}
                className={`df-btn df-btn-sm ${
                  dietaryFilter === 'VEG' ? 'df-btn-sage' : 'df-btn-secondary'
                }`}
                style={{ borderRadius: 'var(--radius-full)', padding: '5px 10px', fontSize: '0.75rem' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#059669' }} />
                <span>Veg Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dishes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredDishes.length === 0 ? (
            <div
              style={{
                padding: '48px 16px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--df-border)',
                color: 'var(--df-text-muted)',
              }}
            >
              No dishes found matching your search.
            </div>
          ) : (
            filteredDishes.map((item) => {
              const inCartQty = items
                .filter((i) => i.menuItemId === item.id)
                .reduce((s, curr) => s + curr.quantity, 0);

              const hasCustomizations =
                (item.variants && item.variants.length > 0) ||
                (item.addOns && item.addOns.length > 0);

              return (
                <div
                  key={item.id}
                  className="df-card"
                  style={{
                    padding: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 16,
                    opacity: item.isAvailable ? 1 : 0.6,
                  }}
                >
                  {/* Left Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Dietary dot & tags */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor:
                              item.dietary === 'VEG'
                                ? '#059669'
                                : item.dietary === 'NON_VEG'
                                ? '#DC2626'
                                : '#7C3AED',
                            display: 'inline-block',
                          }}
                        />
                        {item.isFeatured && (
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              color: 'var(--df-sage-dark)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3,
                            }}
                          >
                            <Sparkles size={11} /> Chef's Signature
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--df-charcoal)' }}>
                        {item.name}
                      </h3>

                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: 'var(--df-charcoal)',
                          marginTop: 4,
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        {formatCurrency(item.price)}
                      </div>

                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--df-text-muted)',
                          marginTop: 6,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--df-text-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {item.preparationTime} mins
                      </span>
                    </div>
                  </div>

                  {/* Right Image & Add Button */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 120, flexShrink: 0 }}>
                    <div style={{ width: 120, height: 110, position: 'relative' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--df-border)',
                        }}
                      />
                    </div>

                    {item.isAvailable ? (
                      <button
                        onClick={() => {
                          if (hasCustomizations) {
                            handleOpenCustomize(item);
                          } else {
                            addItem(item);
                          }
                        }}
                        className="df-btn df-btn-secondary df-btn-sm"
                        style={{
                          marginTop: -16,
                          backgroundColor: '#FFFFFF',
                          borderColor: 'var(--df-sage-border)',
                          color: 'var(--df-sage-dark)',
                          fontWeight: 800,
                          boxShadow: 'var(--shadow-sm)',
                          zIndex: 2,
                          padding: '6px 16px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {inCartQty > 0 ? `ADDED (${inCartQty})` : 'ADD +'}
                      </button>
                    ) : (
                      <span
                        className="df-badge"
                        style={{
                          marginTop: -16,
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                          zIndex: 2,
                        }}
                      >
                        Sold Out
                      </span>
                    )}

                    {hasCustomizations && item.isAvailable && (
                      <span style={{ fontSize: '0.625rem', color: 'var(--df-text-light)', marginTop: 4 }}>
                        Customizable
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalQuantity > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            right: 16,
            maxWidth: 600,
            margin: '0 auto',
            zIndex: 50,
          }}
        >
          <div
            onClick={() => setIsOpen(true)}
            style={{
              backgroundColor: 'var(--df-charcoal)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 8px 24px rgba(44, 49, 41, 0.3)',
              cursor: 'pointer',
              transition: 'transform var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: 'var(--df-sage)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalQuantity}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                {formatCurrency(total)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.875rem' }}>
              <span>View Cart & Order</span>
              <span>→</span>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Dish Customization Modal */}
      {customizingItem && (
        <Modal
          isOpen={!!customizingItem}
          onClose={() => setCustomizingItem(null)}
          title={`Customize ${customizingItem.name}`}
          subtitle="Choose size variants and culinary add-ons"
          maxWidth="460px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Variants */}
            {customizingItem.variants && customizingItem.variants.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 8 }}>Select Portion / Size</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {customizingItem.variants.map((v) => (
                    <label
                      key={v.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedVariant?.id === v.id ? '2px solid var(--df-sage)' : '1px solid var(--df-border)',
                        backgroundColor: selectedVariant?.id === v.id ? 'var(--df-sage-light)' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                          type="radio"
                          name="variantChoice"
                          checked={selectedVariant?.id === v.id}
                          onChange={() => setSelectedVariant(v)}
                        />
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{v.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrency(v.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {customizingItem.addOns && customizingItem.addOns.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 8 }}>Culinary Add-ons</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {customizingItem.addOns.map((add) => {
                    const isSelected = selectedAddOns.some((a) => a.id === add.id);
                    return (
                      <label
                        key={add.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '1.5px solid var(--df-sage)' : '1px solid var(--df-border)',
                          backgroundColor: isSelected ? 'var(--df-sage-light)' : '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAddOn(add)}
                          />
                          <span style={{ fontSize: '0.875rem' }}>{add.name}</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>+{formatCurrency(add.price)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confirm Add */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                onClick={() => setCustomizingItem(null)}
                className="df-btn df-btn-secondary df-btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddToCartConfirm}
                className="df-btn df-btn-primary df-btn-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
