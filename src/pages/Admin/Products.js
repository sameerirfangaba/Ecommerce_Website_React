import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import ProductModal from './components/ProductModal';
import CSVModal from './components/CSVModal';

function Products({ formatPrice }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      const data = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setProducts(data);
      setFilteredProducts(data);
      
      const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = products;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.shortDesc && p.shortDesc.toLowerCase().includes(term))
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, products]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await deleteDoc(doc(db, 'products', productToDelete));
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleDuplicateProduct = async (product) => {
    try {
      const { id, ...data } = product;
      await addDoc(collection(db, 'products'), {
        ...data,
        name: data.name + ' (Copy)',
        createdAt: new Date()
      });
      loadProducts();
    } catch (error) {
      console.error('Error duplicating product:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
  };

  // Helper to get variant display text
  const getVariantDisplay = (product) => {
    if (!product.hasVariants || !product.variants) return null;
    
    const groups = product.variants.groups || [];
    const combinations = product.variants.combinations || [];
    
    if (groups.length === 0 || combinations.length === 0) return null;
    
    const groupNames = groups.map(g => g.name).join(', ');
    const comboCount = combinations.length;
    
    return `${groupNames} (${comboCount} combinations)`;
  };

  // Helper to check if product has custom field
  const hasCustomField = (product) => {
    return product.customTextField?.enabled === true;
  };

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              height: '280px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'loading 1.5s infinite',
              borderRadius: '12px'
            }}></div>
          ))}
        </div>
        <style>{`
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #f0f0f0'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              <i className="fas fa-box" style={{ color: '#FF6B35', marginRight: '8px' }}></i>
              Products
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#6b7280',
                marginLeft: '8px'
              }}>
                ({filteredProducts.length})
              </span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowCSVModal(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid #a7f3d0',
                background: '#ecfdf5',
                color: '#065f46',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#d1fae5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ecfdf5'}
            >
              <i className="fas fa-file-export"></i> Export
            </button>
            <button
              onClick={() => setShowCSVModal(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid #ddd6fe',
                background: '#f5f3ff',
                color: '#5b21b6',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#ede9fe'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f5f3ff'}
            >
              <i className="fas fa-file-import"></i> Import
            </button>
            <button
              onClick={handleAddProduct}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#FF6B35',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(255,107,53,0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e55a25';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FF6B35';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-plus"></i> Add Product
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '0.9rem'
            }}></i>
            <input
              type="text"
              placeholder="Search products by name, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s',
                background: 'white'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#FF6B35';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '0.9rem',
              outline: 'none',
              background: 'white',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {(searchTerm || categoryFilter !== 'all') && (
            <button
              onClick={clearFilters}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <i className="fas fa-times"></i> Clear
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', display: 'block', marginBottom: '16px', opacity: 0.3 }}></i>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
              No products found
            </h3>
            <p style={{ fontSize: '0.875rem' }}>
              {searchTerm ? 'Try adjusting your search or filters' : 'Click "Add Product" to get started'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {filteredProducts.map((product) => {
              const hasDiscount = product.comparePrice && product.comparePrice > product.price;
              const discount = hasDiscount ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
              const variantDisplay = getVariantDisplay(product);
              const hasCustom = hasCustomField(product);
              
              return (
                <div key={product.id} style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: '16px',
                  border: '1px solid #e8e8f0',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e8e8f0';
                }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '160px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        background: '#f8f8fc'
                      }}
                      onError={(e) => e.target.src = 'https://placehold.co/300x160/f0f0f0/aaa?text=No+Image'}
                    />
                    {hasDiscount && (
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        boxShadow: '0 2px 8px rgba(239,68,68,0.3)'
                      }}>
                        -{discount}%
                      </span>
                    )}
                    {/* Variant Badge */}
                    {variantDisplay && (
                      <span style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: 'rgba(26,26,46,0.8)',
                        backdropFilter: 'blur(4px)',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <i className="fas fa-layer-group" style={{ fontSize: '0.5rem' }}></i>
                        {variantDisplay}
                      </span>
                    )}
                    {/* Custom Field Badge */}
                    {hasCustom && (
                      <span style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        background: 'rgba(245,158,11,0.9)',
                        backdropFilter: 'blur(4px)',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <i className="fas fa-pen" style={{ fontSize: '0.5rem' }}></i>
                        Customizable
                      </span>
                    )}
                  </div>
                  
                  <h3 style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '4px'
                  }}>
                    {product.name}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ color: '#FF6B35', fontWeight: 700, fontSize: '1rem' }}>
                      {formatPrice(product.price)}
                    </span>
                    {hasDiscount && (
                      <span style={{
                        color: '#aaa',
                        fontSize: '0.8rem',
                        textDecoration: 'line-through'
                      }}>
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    marginBottom: '12px',
                    flexWrap: 'wrap',
                    gap: '4px'
                  }}>
                    <span style={{
                      background: '#f3f4f6',
                      padding: '2px 10px',
                      borderRadius: '20px',
                      color: '#4b5563',
                      fontWeight: 500
                    }}>
                      <i className="fas fa-tag" style={{ fontSize: '0.6rem', marginRight: '4px' }}></i>
                      {product.category || 'Uncategorized'}
                    </span>
                    <span style={{
                      color: product.stock > 0 ? '#16a34a' : '#ef4444',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <i className={`fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}`} 
                         style={{ fontSize: '0.6rem' }}></i>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  
                  {/* Variant details in product card */}
                  {variantDisplay && (
                    <div style={{
                      fontSize: '0.65rem',
                      color: '#6b7280',
                      marginBottom: '8px',
                      padding: '4px 8px',
                      background: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexWrap: 'wrap'
                    }}>
                      <i className="fas fa-cubes" style={{ fontSize: '0.5rem', color: '#4f46e5' }}></i>
                      <span>Variants: {variantDisplay}</span>
                    </div>
                  )}
                  
                  {hasCustom && (
                    <div style={{
                      fontSize: '0.65rem',
                      color: '#92400e',
                      marginBottom: '8px',
                      padding: '4px 8px',
                      background: '#fffbeb',
                      borderRadius: '6px',
                      border: '1px solid #fde68a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <i className="fas fa-pen" style={{ fontSize: '0.5rem' }}></i>
                      <span>Custom: {product.customTextField?.label || 'Text Field'}</span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#f3f4f6',
                        color: '#1f2937',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    >
                      <i className="fas fa-edit" style={{ marginRight: '4px' }}></i> Edit
                    </button>
                    <button
                      onClick={() => handleDuplicateProduct(product)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#eff6ff'}
                    >
                      <i className="fas fa-copy" style={{ marginRight: '4px' }}></i> Copy
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#fef2f2',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                    >
                      <i className="fas fa-trash" style={{ marginRight: '4px' }}></i> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleDeleteCancel();
        }}
        >
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#ef4444' }}></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Delete Product?</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '24px' }}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleDeleteCancel}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <i className="fas fa-trash" style={{ marginRight: '6px' }}></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSave={loadProducts}
        />
      )}

      {showCSVModal && (
        <CSVModal
          onClose={() => setShowCSVModal(false)}
          onImport={loadProducts}
        />
      )}
    </>
  );
}

export default Products;