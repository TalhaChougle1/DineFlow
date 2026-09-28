import React, { useState } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  IndianRupee,
  Layers,
} from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { MenuItem, DietaryType, MenuItemVariant, MenuItemAddOn } from '../../types';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/format';

export const MenuPage: React.FC = () => {
  const {
    menuItems,
    categories,
    saveMenuItem,
    deleteMenuItem,
    updateItemPrice,
    toggleItemAvailability,
  } = useDineFlow();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<string>('');

  // Filtered menu
  const filteredItems = menuItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'ALL' || item.categoryId === selectedCat;
    return matchSearch && matchCat;
  });

  const handleOpenCreate = () => {
    setEditingItem({
      restaurantId: 'rest_aster_oak',
      name: '',
      description: '',
      categoryId: categories[0]?.id || '',
      price: 299,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
      isAvailable: true,
      preparationTime: 12,
      stockQuantity: 20,
      trackStock: true,
      isFeatured: false,
      dietary: 'VEG',
      variants: [],
      addOns: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name?.trim()) return;

    saveMenuItem(editingItem as any);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveQuickPrice = (itemId: string) => {
    const val = parseFloat(quickPriceVal);
    if (!isNaN(val) && val >= 0) {
      updateItemPrice(itemId, val);
    }
    setQuickPriceId(null);
    setQuickPriceVal('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
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
            Menu Catalog
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Master culinary catalog · Direct real-time sync with customer digital menu
          </p>
        </div>
        <button onClick={handleOpenCreate} className="df-btn df-btn-primary df-btn-sm">
          <Plus size={15} /> Add Menu Item
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
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
        <div style={{ position: 'relative', width: 280 }}>
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
            placeholder="Search dishes, ingredients..."
            className="df-input"
            style={{ paddingLeft: 36 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', maxWidth: '100%' }}>
          <button
            onClick={() => setSelectedCat('ALL')}
            className={`df-btn df-btn-sm ${
              selectedCat === 'ALL' ? 'df-btn-primary' : 'df-btn-secondary'
            }`}
            style={{ padding: '6px 12px' }}
          >
            All Items ({menuItems.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`df-btn df-btn-sm ${
                selectedCat === c.id ? 'df-btn-primary' : 'df-btn-secondary'
              }`}
              style={{ padding: '6px 12px' }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="df-table-container">
        <table className="df-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Category</th>
              <th>Dietary</th>
              <th>Price</th>
              <th>Prep Time</th>
              <th>Stock</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const cat = categories.find((c) => c.id === item.categoryId);
              const isEditingPrice = quickPriceId === item.id;

              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 'var(--radius-md)',
                          objectFit: 'cover',
                          border: '1px solid var(--df-border)',
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {item.name}
                          {item.isFeatured && (
                            <span title="Featured Dish" style={{ display: 'inline-flex' }}>
                              <Sparkles size={13} color="var(--df-sage-dark)" />
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--df-text-muted)',
                            maxWidth: 320,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {cat?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color:
                          item.dietary === 'VEG'
                            ? '#059669'
                            : item.dietary === 'NON_VEG'
                            ? '#DC2626'
                            : '#7C3AED',
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor:
                            item.dietary === 'VEG'
                              ? '#059669'
                              : item.dietary === 'NON_VEG'
                              ? '#DC2626'
                              : '#7C3AED',
                        }}
                      />
                      {item.dietary}
                    </span>
                  </td>
                  <td>
                    {isEditingPrice ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input
                          type="number"
                          className="df-input"
                          style={{ width: 85, padding: '4px 6px', fontSize: '0.8125rem' }}
                          value={quickPriceVal}
                          onChange={(e) => setQuickPriceVal(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveQuickPrice(item.id);
                            if (e.key === 'Escape') setQuickPriceId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveQuickPrice(item.id)}
                          className="df-btn-icon"
                          style={{ width: 28, height: 28, padding: 0 }}
                        >
                          <Check size={14} color="#059669" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setQuickPriceId(item.id);
                          setQuickPriceVal(item.price.toString());
                        }}
                        style={{
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        title="Click to quickly edit price"
                      >
                        {formatCurrency(item.price)}
                        <span style={{ fontSize: '0.6875rem', color: 'var(--df-text-light)' }}>✎</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)' }}>
                      {item.preparationTime} mins
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color:
                          item.stockQuantity <= 0
                            ? '#DC2626'
                            : item.stockQuantity <= 5
                            ? '#D97706'
                            : 'var(--df-text-dark)',
                      }}
                    >
                      {item.stockQuantity} portions
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`df-btn df-btn-sm ${
                        item.isAvailable ? 'df-btn-sage' : 'df-btn-danger'
                      }`}
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="df-btn-icon"
                        style={{ width: 30, height: 30, padding: 0 }}
                        title="Edit Dish Details"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.name}" from menu?`)) {
                            deleteMenuItem(item.id);
                          }
                        }}
                        className="df-btn-icon"
                        style={{ width: 30, height: 30, padding: 0, color: '#DC2626' }}
                        title="Delete Dish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit / Create Dish Modal */}
      {isModalOpen && editingItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem.id ? `Edit ${editingItem.name}` : 'Create Menu Item'}
          subtitle="Changes immediately sync to Aster & Oak customer menu"
          maxWidth="620px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div className="df-form-group">
                <label className="df-label">Dish Name</label>
                <input
                  type="text"
                  className="df-input"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  required
                />
              </div>

              <div className="df-form-group">
                <label className="df-label">Category</label>
                <select
                  className="df-select"
                  value={editingItem.categoryId || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="df-form-group">
              <label className="df-label">Description & Ingredients</label>
              <textarea
                className="df-textarea"
                rows={2}
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div className="df-form-group">
                <label className="df-label">Base Price (₹)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="df-input"
                  value={editingItem.price ?? ''}
                  onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="df-form-group">
                <label className="df-label">Prep Time (mins)</label>
                <input
                  type="number"
                  min="1"
                  className="df-input"
                  value={editingItem.preparationTime ?? 12}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, preparationTime: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="df-form-group">
                <label className="df-label">Current Stock</label>
                <input
                  type="number"
                  min="0"
                  className="df-input"
                  value={editingItem.stockQuantity ?? 20}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, stockQuantity: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div className="df-form-group">
                <label className="df-label">Dietary Classification</label>
                <select
                  className="df-select"
                  value={editingItem.dietary || 'VEG'}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, dietary: e.target.value as DietaryType })
                  }
                >
                  <option value="VEG">Vegetarian (VEG)</option>
                  <option value="NON_VEG">Non-Vegetarian (NON-VEG)</option>
                  <option value="VEGAN">Vegan (VEGAN)</option>
                </select>
              </div>

              <div className="df-form-group">
                <label className="df-label">Image URL</label>
                <input
                  type="url"
                  className="df-input"
                  value={editingItem.image || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20, margin: '8px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editingItem.isFeatured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                />
                Mark as Chef's Special / Featured
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editingItem.isAvailable ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })}
                />
                Available on Customer Menu
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="df-btn df-btn-secondary df-btn-sm"
              >
                Cancel
              </button>
              <button type="submit" className="df-btn df-btn-primary df-btn-sm">
                Save & Update Menu
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
