import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [customText, setCustomText] = useState('');
  const [activeTab, setActiveTab] = useState('desc');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const [currency, setCurrency] = useState('AED');
  const [currencyPosition, setCurrencyPosition] = useState('left-space');

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'checkout'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          const map = { 'USD':'$', 'PKR':'Rs', 'INR':'₹', 'GBP':'£', 'EUR':'€', 'AED':'AED', 'SAR':'SAR', 'CAD':'C$', 'AUD':'A$' };
          setCurrency(map[data.currency || 'AED'] || 'AED');
          setCurrencyPosition(data.currencyPosition || 'left-space');
        }
      } catch (error) {
        console.error('Error loading currency:', error);
      }
    };
    loadCurrency();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProduct(data);
          
          const images = data.images && data.images.length > 0 ? data.images : [data.image];
          setSelectedImages(images);
          setMainImage(images[0] || '');
          
          if (data.hasVariants && data.variants?.groups) {
            const initial = {};
            data.variants.groups.forEach(g => { initial[g.name] = ''; });
            setSelectedVariants(initial);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    const f = Number(price).toFixed(2);
    switch(currencyPosition) {
      case 'left': return `${currency}${f}`;
      case 'right': return `${f}${currency}`;
      case 'left-space': return `${currency} ${f}`;
      case 'right-space': return `${f} ${currency}`;
      default: return `${currency} ${f}`;
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariant && selectedVariant.price !== undefined) {
      return selectedVariant.price;
    }
    return product?.price || 0;
  };

  const getCurrentStock = () => {
    if (selectedVariant && selectedVariant.stock !== undefined) {
      return selectedVariant.stock;
    }
    return product?.stock || 0;
  };

  const isVariantSelected = () => {
    if (!product?.hasVariants) return true;
    const groups = product.variants?.groups || [];
    return groups.every(g => selectedVariants[g.name] && selectedVariants[g.name].trim() !== '');
  };

  const isInStock = () => {
    return getCurrentStock() > 0;
  };

  const handleVariantSelect = (groupName, value) => {
    setSelectedVariants(prev => ({ ...prev, [groupName]: value }));
  };

  useEffect(() => {
    if (!product?.hasVariants || !product?.variants) return;
    
    const groups = product.variants.groups || [];
    const allSelected = groups.every(g => selectedVariants[g.name] && selectedVariants[g.name].trim() !== '');
    
    if (allSelected) {
      const key = groups.map(g => selectedVariants[g.name]).join('__');
      const combo = product.variants.combinations?.find(c => c.key === key);
      setSelectedVariant(combo || null);
      
      if (combo?.image) {
        setMainImage(combo.image);
      }
    } else {
      setSelectedVariant(null);
    }
  }, [selectedVariants, product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.hasVariants && !isVariantSelected()) {
      alert('Please select all options first!');
      return;
    }
    
    if (!isInStock()) {
      alert('Out of stock!');
      return;
    }
    
    if (product.customTextField?.enabled && product.customTextField?.required && !customText.trim()) {
      alert(`Please fill in "${product.customTextField.label}"!`);
      return;
    }
    
    const price = getCurrentPrice();
    const stock = getCurrentStock();
    
    if (quantity > stock) {
      alert(`Only ${stock} available!`);
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: price,
      image: mainImage || product.image,
      quantity: quantity,
      variantKey: selectedVariant?.key || null,
      variantAttrs: selectedVariant ? { ...selectedVariants } : null,
      customText: customText || null,
      customTextLabel: product.customTextField?.label || null
    };
    
    addToCart(cartItem);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    window.location.href = '/checkout';
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e8e8f0',
            borderTopColor: '#FF6B35',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#4a4a68' }}>Loading product...</p>
        </div>
        <Footer />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ef4444' }}>Product Not Found</h1>
          <Link to="/shop" style={{ color: '#FF6B35', textDecoration: 'none' }}>Back to Shop</Link>
        </div>
        <Footer />
      </>
    );
  }

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discount = hasDiscount ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
  const hasVariants = product.hasVariants && product.variants?.groups?.length > 0;
  const inStock = isInStock();
  const currentPrice = getCurrentPrice();

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .product-card:hover .product-actions {
          transform: translateY(0);
          opacity: 1;
        }
        .variant-btn.active {
          border-color: #1a1a2e;
          background: #f8f8fc;
          font-weight: 600;
        }
        .color-btn.active {
          border-color: #1a1a2e;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #1a1a2e;
        }
        .tab-btn.active {
          color: #1a1a2e;
          border-bottom-color: #1a1a2e;
        }
        .tab-content.active {
          display: block;
        }
        .thumb-image.active {
          border-color: #1a1a2e;
          box-shadow: 0 0 0 1px #1a1a2e;
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .gallery-sticky { position: static !important; }
          .trust-badges { grid-template-columns: repeat(3, 1fr) !important; gap: 6px !important; }
          .trust-badge { padding: 8px 6px !important; }
          .trust-badge span { font-size: 0.62rem !important; }
        }
        @media (max-width: 420px) {
          .trust-badges { grid-template-columns: repeat(2, 1fr) !important; }
          .trust-badge:last-child { display: none !important; }
        }
      `}</style>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 16px 48px'
      }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: '#4a4a68',
          flexWrap: 'wrap',
          marginBottom: '16px'
        }}>
          <Link to="/" style={{ color: '#4a4a68', textDecoration: 'none' }}>Home</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.55rem' }}></i>
          <Link to="/shop" style={{ color: '#4a4a68', textDecoration: 'none' }}>Shop</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.55rem' }}></i>
          <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{product.category || '—'}</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.55rem' }}></i>
          <span style={{
            color: '#1a1a2e',
            fontWeight: 500,
            maxWidth: '140px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            verticalAlign: 'middle'
          }}>{product.name}</span>
        </div>

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start'
        }}>
          {/* Gallery */}
          <div className="gallery-sticky" style={{ position: 'sticky', top: '76px' }}>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#f8f8fc',
              border: '1px solid #e8e8f0',
              marginBottom: '10px',
              cursor: 'pointer'
            }}
            onClick={() => openLightbox(selectedImages.indexOf(mainImage) >= 0 ? selectedImages.indexOf(mainImage) : 0)}
            >
              <img
                src={mainImage}
                alt={product.name}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  transition: 'transform 0.4s'
                }}
                onError={(e) => e.target.src = 'https://placehold.co/600x600/f0f0f0/aaa?text=No+Image'}
              />
              {hasDiscount && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: '#FF6B35',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}>Save {discount}%</div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}>
              {selectedImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  style={{
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                    borderRadius: '9px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: `2px solid ${mainImage === img ? '#1a1a2e' : 'transparent'}`,
                    boxShadow: mainImage === img ? '0 0 0 1px #1a1a2e' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setMainImage(img)}
                  onError={(e) => e.target.src = 'https://placehold.co/68x68/f0f0f0/aaa?text=IMG'}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '8px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#4a4a68'
              }}>{product.category || 'Ismora'}</span>
              <span style={{ color: '#e8e8f0' }}>•</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <div style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: inStock ? '#22c55e' : '#ef4444'
                }}></div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: inStock ? '#22c55e' : '#ef4444'
                }}>
                  <i className={`fas ${inStock ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                  {inStock ? `In Stock (${getCurrentStock()} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
              fontWeight: 700,
              color: '#1a1a2e',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              marginBottom: '12px'
            }}>{product.name}</h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              flexWrap: 'wrap'
            }}>
              <span style={{ color: '#fbbf24', fontSize: '0.88rem', letterSpacing: '1px' }}>★★★★★</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a2e' }}>4.9</span>
              <div style={{ width: '1px', height: '13px', background: '#e8e8f0' }}></div>
              <span style={{ fontSize: '0.82rem', color: '#4a4a68' }}>24 reviews</span>
              <div style={{ width: '1px', height: '13px', background: '#e8e8f0' }}></div>
              <span style={{ fontSize: '0.82rem', color: '#FF6B35', fontWeight: 600, cursor: 'pointer' }}>Write a review</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              marginBottom: '4px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#1a1a2e',
                letterSpacing: '-0.02em'
              }}>{formatPrice(currentPrice)}</span>
              {hasDiscount && (
                <>
                  <span style={{
                    fontSize: '0.95rem',
                    color: '#9ca3af',
                    textDecoration: 'line-through'
                  }}>{formatPrice(product.comparePrice)}</span>
                  <span style={{
                    background: '#dcfce7',
                    color: '#16a34a',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>Save {discount}%</span>
                </>
              )}
            </div>

            {product.shortDesc && (
              <p style={{
                fontSize: '0.82rem',
                color: '#4a4a68',
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>{product.shortDesc}</p>
            )}

            {hasVariants && product.variants.groups.map((group, idx) => {
              const isColor = group.type === 'Color';
              return (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '0.83rem', fontWeight: 600, color: '#1a1a2e' }}>{group.name}</span>
                    <span style={{ fontSize: '0.83rem', color: '#FF6B35', fontWeight: 600 }}>{selectedVariants[group.name] || ''}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {group.values.map((value, vIdx) => {
                      const isSelected = selectedVariants[group.name] === value.label;
                      if (isColor) {
                        return (
                          <button
                            key={vIdx}
                            className={`color-btn ${isSelected ? 'active' : ''}`}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              border: `3px solid ${isSelected ? '#1a1a2e' : 'transparent'}`,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              position: 'relative',
                              background: value.color || '#ccc',
                              boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 4px #1a1a2e' : 'none'
                            }}
                            onClick={() => handleVariantSelect(group.name, value.label)}
                          />
                        );
                      }
                      return (
                        <button
                          key={vIdx}
                          className={`variant-btn ${isSelected ? 'active' : ''}`}
                          style={{
                            padding: '7px 14px',
                            border: `2px solid ${isSelected ? '#1a1a2e' : '#e8e8f0'}`,
                            borderRadius: '8px',
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.83rem',
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected ? '#1a1a2e' : '#4a4a68',
                            background: isSelected ? '#f8f8fc' : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => handleVariantSelect(group.name, value.label)}
                        >
                          {value.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {hasVariants && !isVariantSelected() && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                padding: '9px 12px',
                marginBottom: '12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#92400e'
              }}>
                <i className="fas fa-hand-pointer"></i>
                Please select all options to continue
              </div>
            )}

            {product.customTextField?.enabled && (
              <div style={{
                background: 'linear-gradient(135deg, #fffbeb, #fef9ee)',
                border: '1.5px solid #fde68a',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: '#FF6B35',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.7rem'
                  }}>
                    <i className="fas fa-pen"></i>
                  </div>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#92400e'
                  }}>{product.customTextField.label}</span>
                  {product.customTextField.required && (
                    <span style={{
                      fontSize: '0.65rem',
                      color: 'white',
                      background: '#ef4444',
                      borderRadius: '4px',
                      padding: '1px 5px',
                      fontWeight: 700
                    }}>Required</span>
                  )}
                </div>
                {product.customTextField.type === 'textarea' ? (
                  <textarea
                    placeholder={product.customTextField.placeholder || ''}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1.5px solid #fcd34d',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.875rem',
                      background: 'white',
                      color: '#1a1a2e',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      resize: 'vertical',
                      minHeight: '60px'
                    }}
                  />
                ) : (
                  <input
                    type={product.customTextField.type || 'text'}
                    placeholder={product.customTextField.placeholder || ''}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1.5px solid #fcd34d',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.875rem',
                      background: 'white',
                      color: '#1a1a2e',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                )}
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #e8e8f0',
                borderRadius: '10px',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '48px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: '#4a4a68',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8fc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >−</button>
                <span style={{
                  width: '38px',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  borderLeft: '2px solid #e8e8f0',
                  borderRight: '2px solid #e8e8f0',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(getCurrentStock(), quantity + 1))}
                  style={{
                    width: '40px',
                    height: '48px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: '#4a4a68',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8fc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >+</button>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!inStock || (hasVariants && !isVariantSelected())}
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#1a1a2e',
                  color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: (!inStock || (hasVariants && !isVariantSelected())) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: (!inStock || (hasVariants && !isVariantSelected())) ? 0.45 : 1
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#2d2d4e';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#1a1a2e';
                  }
                }}
              >
                <i className="fas fa-shopping-bag" style={{ fontSize: '0.85rem' }}></i>
                Add to Cart
              </button>
            </div>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={!inStock || (hasVariants && !isVariantSelected())}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '10px',
                border: 'none',
                background: '#FF6B35',
                color: 'white',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: (!inStock || (hasVariants && !isVariantSelected())) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px',
                opacity: (!inStock || (hasVariants && !isVariantSelected())) ? 0.45 : 1
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = '#e55a25';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = '#FF6B35';
                }
              }}
            >
              <i className="fas fa-bolt" style={{ fontSize: '0.85rem' }}></i>
              Buy Now
            </button>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '18px'
            }}>
              <div style={{
                background: '#f8f8fc',
                border: '1px solid #e8e8f0',
                borderRadius: '10px',
                padding: '10px 8px',
                textAlign: 'center'
              }}>
                <i className="fas fa-truck" style={{ fontSize: '0.9rem', color: '#FF6B35', marginBottom: '4px', display: 'block' }}></i>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#4a4a68', lineHeight: '1.3', display: 'block' }}>Free shipping over 150 AED</span>
              </div>
              <div style={{
                background: '#f8f8fc',
                border: '1px solid #e8e8f0',
                borderRadius: '10px',
                padding: '10px 8px',
                textAlign: 'center'
              }}>
                <i className="fas fa-undo-alt" style={{ fontSize: '0.9rem', color: '#FF6B35', marginBottom: '4px', display: 'block' }}></i>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#4a4a68', lineHeight: '1.3', display: 'block' }}>15-day returns</span>
              </div>
              <div style={{
                background: '#f8f8fc',
                border: '1px solid #e8e8f0',
                borderRadius: '10px',
                padding: '10px 8px',
                textAlign: 'center'
              }}>
                <i className="fas fa-shield-alt" style={{ fontSize: '0.9rem', color: '#FF6B35', marginBottom: '4px', display: 'block' }}></i>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#4a4a68', lineHeight: '1.3', display: 'block' }}>Secure checkout</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingTop: '12px',
              borderTop: '1px solid #e8e8f0'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a4a68' }}>Share:</span>
              <button style={{
                width: '30px',
                height: '30px',
                borderRadius: '7px',
                border: '1.5px solid #e8e8f0',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4a4a68',
                fontSize: '0.8rem',
                transition: 'all 0.2s'
              }}>
                <i className="fab fa-facebook-f"></i>
              </button>
              <button style={{
                width: '30px',
                height: '30px',
                borderRadius: '7px',
                border: '1.5px solid #e8e8f0',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4a4a68',
                fontSize: '0.8rem',
                transition: 'all 0.2s'
              }}>
                <i className="fab fa-twitter"></i>
              </button>
              <button style={{
                width: '30px',
                height: '30px',
                borderRadius: '7px',
                border: '1.5px solid #e8e8f0',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4a4a68',
                fontSize: '0.8rem',
                transition: 'all 0.2s'
              }}>
                <i className="fab fa-whatsapp"></i>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Link copied!');
                }}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '7px',
                  border: '1.5px solid #e8e8f0',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4a4a68',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fas fa-link"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          marginTop: '40px',
          borderTop: '1px solid #e8e8f0',
          paddingTop: '36px'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e8e8f0',
            marginBottom: '24px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            <button
              className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
              onClick={() => setActiveTab('desc')}
              style={{
                padding: '10px 20px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 600,
                color: activeTab === 'desc' ? '#1a1a2e' : '#4a4a68',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === 'desc' ? '#1a1a2e' : 'transparent'}`,
                marginBottom: '-1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Description
            </button>
            <button
              className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
              style={{
                padding: '10px 20px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 600,
                color: activeTab === 'info' ? '#1a1a2e' : '#4a4a68',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === 'info' ? '#1a1a2e' : 'transparent'}`,
                marginBottom: '-1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Product Details
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '10px 20px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 600,
                color: activeTab === 'reviews' ? '#1a1a2e' : '#4a4a68',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === 'reviews' ? '#1a1a2e' : 'transparent'}`,
                marginBottom: '-1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Reviews (0)
            </button>
          </div>

          <div style={{ display: activeTab === 'desc' ? 'block' : 'none' }}>
            <div style={{
              color: '#4a4a68',
              lineHeight: '1.7',
              fontSize: '0.88rem'
            }}>
              {product.desc ? (
                <div dangerouslySetInnerHTML={{ __html: product.desc }} />
              ) : (
                <p style={{ color: '#4a4a68' }}>No description available.</p>
              )}
            </div>
          </div>

          <div style={{ display: activeTab === 'info' ? 'block' : 'none' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.88rem'
            }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e8e8f0' }}>
                  <td style={{ padding: '10px 0', fontWeight: 600, color: '#4a4a68', width: '40%' }}>Category</td>
                  <td style={{ padding: '10px 0', color: '#1a1a2e' }}>{product.category || '—'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e8e8f0' }}>
                  <td style={{ padding: '10px 0', fontWeight: 600, color: '#4a4a68' }}>Stock</td>
                  <td style={{ padding: '10px 0', color: '#1a1a2e' }}>{product.stock} units</td>
                </tr>
                {product.hasVariants && (
                  <tr style={{ borderBottom: '1px solid #e8e8f0' }}>
                    <td style={{ padding: '10px 0', fontWeight: 600, color: '#4a4a68' }}>Variants</td>
                    <td style={{ padding: '10px 0', color: '#1a1a2e' }}>
                      {product.variants?.groups?.map(g => g.name).join(', ') || '—'}
                    </td>
                  </tr>
                )}
                {product.customTextField?.enabled && (
                  <tr>
                    <td style={{ padding: '10px 0', fontWeight: 600, color: '#4a4a68' }}>Customization</td>
                    <td style={{ padding: '10px 0', color: '#1a1a2e' }}>{product.customTextField.label}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: activeTab === 'reviews' ? 'block' : 'none' }}>
            <div style={{ textAlign: 'center', padding: '36px 0' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#f8f8fc',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '1.2rem',
                color: '#ccc'
              }}>
                <i className="fas fa-star"></i>
              </div>
              <p style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>No Reviews Yet</p>
              <p style={{ color: '#4a4a68', fontSize: '0.85rem' }}>Be the first to review this product!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.92)',
          cursor: 'zoom-out'
        }}
        onClick={closeLightbox}
        >
          <div style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '20px'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              position: 'relative',
              maxWidth: 'min(90vw, 860px)',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={selectedImages[lightboxIndex]}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                  userSelect: 'none'
                }}
              />
            </div>
          </div>

          <button
            onClick={closeLightbox}
            style={{
              position: 'fixed',
              top: '16px',
              right: '16px',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          >
            <i className="fas fa-times"></i>
          </button>

          {selectedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(Math.max(0, lightboxIndex - 1));
                }}
                disabled={lightboxIndex === 0}
                style={{
                  position: 'fixed',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: '14px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: lightboxIndex === 0 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  zIndex: 10,
                  opacity: lightboxIndex === 0 ? 0.25 : 1
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(Math.min(selectedImages.length - 1, lightboxIndex + 1));
                }}
                disabled={lightboxIndex === selectedImages.length - 1}
                style={{
                  position: 'fixed',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: '14px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: lightboxIndex === selectedImages.length - 1 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  zIndex: 10,
                  opacity: lightboxIndex === selectedImages.length - 1 ? 0.25 : 1
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>

              <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                background: 'rgba(0,0,0,0.4)',
                padding: '5px 14px',
                borderRadius: '20px'
              }}>
                {lightboxIndex + 1} / {selectedImages.length}
              </div>

              <div style={{
                position: 'fixed',
                bottom: '52px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '12px',
                maxWidth: 'calc(100vw - 32px)',
                overflowX: 'auto'
              }}>
                {selectedImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '7px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: `2px solid ${idx === lightboxIndex ? 'white' : 'transparent'}`,
                      opacity: idx === lightboxIndex ? 1 : 0.6,
                      transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(idx);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}

export default ProductDetail;