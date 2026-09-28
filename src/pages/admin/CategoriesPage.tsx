import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, Check, MoveUp, MoveDown } from 'lucide-react';
import { useDineFlow } from '../../context/DineFlowContext';
import { Category } from '../../types';
import { Modal } from '../../components/common/Modal';

export const CategoriesPage: React.FC = () => {
  const { categories, menuItems, saveCategory, deleteCategory } = useDineFlow();
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setEditingCat({
      restaurantId: 'rest_aster_oak',
      name: '',
      description: '',
      iconName: 'Utensils',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCat({ ...c });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name?.trim()) return;
    saveCategory(editingCat as any);
    setModalOpen(false);
    setEditingCat(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
            Menu Categories
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--df-text-muted)', marginTop: 2 }}>
            Organize Aster & Oak culinary courses & guest browsing hierarchy
          </p>
        </div>
        <button onClick={handleOpenCreate} className="df-btn df-btn-primary df-btn-sm">
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {categories.map((cat, idx) => {
          const itemCount = menuItems.filter((m) => m.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="df-card"
              style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--df-sage-light)',
                        color: 'var(--df-sage-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{cat.name}</h3>
                  </div>
                  <span
                    className="df-badge"
                    style={{
                      backgroundColor: cat.isActive ? '#ECFDF5' : '#F3F4F6',
                      color: cat.isActive ? '#047857' : '#6B7280',
                      border: `1px solid ${cat.isActive ? '#A7F3D0' : '#E5E7EB'}`,
                    }}
                  >
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--df-text-muted)', marginBottom: 16 }}>
                  {cat.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--df-border-subtle)',
                  paddingTop: 12,
                }}
              >
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--df-charcoal)' }}>
                  {itemCount} dishes assigned
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="df-btn-icon"
                    style={{ width: 30, height: 30, padding: 0 }}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${cat.name}" category?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="df-btn-icon"
                    style={{ width: 30, height: 30, padding: 0, color: '#DC2626' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && editingCat && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCat.id ? 'Edit Category' : 'Create Category'}
          subtitle="Customer menu tabs will update immediately"
          maxWidth="460px"
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="df-form-group">
              <label className="df-label">Category Name</label>
              <input
                type="text"
                className="df-input"
                value={editingCat.name || ''}
                onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div className="df-form-group">
              <label className="df-label">Description</label>
              <textarea
                className="df-textarea"
                rows={2}
                value={editingCat.description || ''}
                onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                checked={editingCat.isActive ?? true}
                onChange={(e) => setEditingCat({ ...editingCat, isActive: e.target.checked })}
              />
              Show in Customer Menu navigation
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="df-btn df-btn-secondary df-btn-sm"
              >
                Cancel
              </button>
              <button type="submit" className="df-btn df-btn-primary df-btn-sm">
                Save Category
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
