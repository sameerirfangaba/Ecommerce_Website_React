import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [openInfoSection, setOpenInfoSection] = useState(null);
  const { addToCart } = useCart();
  const searchInputRef = useRef(null);
  const sidebarSearchRef = useRef(null);

  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        
        const catMap = new Map();
        productsData.forEach(p => {
          if (p.category) {
            const cat = p.category.trim();
            if (!catMap.has(cat)) {
              catMap.set(cat, { count: 0 });
            }
            catMap.get(cat).count++;
          }
        });
        setCategories(Array.from(catMap.entries()).map(([name, data]) => ({ name, ...data })));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lower) ||
        (p.category && p.category.toLowerCase().includes(lower)) ||
        (p.shortDesc && p.shortDesc.toLowerCase().includes(lower))
      );
    }

    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setVisibleCount(12);
  }, [products, activeCategory, searchQuery, sortBy]);

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
      if (searchInputRef.current) searchInputRef.current.value = urlSearch;
      if (sidebarSearchRef.current) sidebarSearchRef.current.value = urlSearch;
    }
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlSearch, urlCategory]);

  const formatPrice = (price) => {
    return `AED ${Number(price).toFixed(2)}`;
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (searchInputRef.current) searchInputRef.current.value = value;
    if (sidebarSearchRef.current) sidebarSearchRef.current.value = value;
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('default');
    if (searchInputRef.current) searchInputRef.current.value = '';
    if (sidebarSearchRef.current) sidebarSearchRef.current.value = '';
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const ProductCard = ({ product }) => {
    const hasDiscount = product.comparePrice && product.comparePrice > product.price;
    const discount = hasDiscount ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
    const isListView = view === 'list';
    const colorGroup = product.hasVariants && product.variants?.groups?.find(g => g.type === 'Color');

    const handleCardClick = () => {
      window.location.href = `/product/${product.id}`;
    };

    return (
      <div 
        className="product-card" 
        style={{
          background: 'white',
          border: '1px solid #EAEAEA',
          borderRadius: '2px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          ...(isListView ? { display: 'grid', gridTemplateColumns: '160px 1fr', gap: 0 } : {})
        }}
        onClick={handleCardClick}
      >
        <div 
          className="product-img-wrap" 
          style={{
            position: 'relative',
            aspectRatio: isListView ? 'auto' : '1',
            height: isListView ? '160px' : 'auto',
            overflow: 'hidden',
            background: '#FAFAFA'
          }}
        >
          <img
            className="product-img"
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'
            }}
            onError={(e) => e.target.src = 'https://placehold.co/400x400/f0f0f0/aaa?text=IMG'}
          />
          {hasDiscount && (
            <div className="product-badge badge-sale" style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 2,
              padding: '3px 8px',
              border: '1px solid #1A1A1A',
              fontSize: '0.65rem',
              fontWeight: '600',
              background: 'white',
              color: '#1A1A1A',
              letterSpacing: '0.04em'
            }}>
              −{discount}%
            </div>
          )}
          {!isListView && (
            <button
              className="product-atc-btn"
              title="Add to Cart"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #1A1A1A',
                background: 'white',
                color: '#1A1A1A',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={handleAddToCart}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1A1A1A'; }}
            >
              +
            </button>
          )}
        </div>
        <div className="product-body" style={{
          padding: isListView ? '20px' : '14px',
          display: isListView ? 'flex' : 'block',
          flexDirection: isListView ? 'column' : 'column',
          justifyContent: isListView ? 'space-between' : 'flex-start'
        }}>
          <div>
            <div className="product-category" style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              color: '#6B6B6B',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '5px'
            }}>{product.category || 'General'}</div>
            <div className="product-name" style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#1A1A1A',
              marginBottom: '8px',
              lineHeight: '1.35'
            }}>{product.name}</div>
            <div className="product-price-row" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="product-price" style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#1A1A1A'
              }}>{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="product-price-old" style={{
                  fontSize: '0.82rem',
                  color: '#aaa',
                  textDecoration: 'line-through'
                }}>{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            {colorGroup && colorGroup.values?.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
                {colorGroup.values.slice(0, 5).map((v, i) => (
                  <span key={i} style={{
                    width: '13px',
                    height: '13px',
                    borderRadius: '50%',
                    border: '1px solid #EAEAEA',
                    background: v.color || '#ccc',
                    display: 'inline-block',
                    flexShrink: 0
                  }} title={v.label}></span>
                ))}
                <span style={{ fontSize: '0.72rem', color: '#6B6B6B', marginLeft: '2px' }}>{colorGroup.values[0]?.label}</span>
              </div>
            )}
            {product.stock < 1 && (
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '600', marginTop: '6px' }}>
                <i className="fas fa-times-circle" style={{ marginRight: '3px' }}></i>Out of Stock
              </div>
            )}
          </div>
          {isListView && (
            <div className="product-actions" style={{
              display: 'flex',
              gap: '8px',
              marginTop: '12px',
              justifyContent: 'flex-start'
            }}>
              <button
                className="product-atc-btn"
                style={{
                  maxWidth: '200px',
                  padding: '10px 20px',
                  border: '1px solid #1A1A1A',
                  background: '#1A1A1A',
                  color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className="skeleton-card" style={{
      background: 'white',
      border: '1px solid #EAEAEA',
      borderRadius: '2px',
      overflow: 'hidden'
    }}>
      <div className="skeleton-img" style={{
        aspectRatio: '1',
        background: '#FAFAFA',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="shimmer" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
          animation: 'shimmer 1.4s infinite'
        }}></div>
      </div>
      <div className="skeleton-body" style={{ padding: '14px' }}>
        <div className="skeleton-line w1" style={{
          height: '11px',
          background: '#FAFAFA',
          borderRadius: '6px',
          marginBottom: '8px',
          width: '35%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="shimmer" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
            animation: 'shimmer 1.4s infinite'
          }}></div>
        </div>
        <div className="skeleton-line w3" style={{
          height: '11px',
          background: '#FAFAFA',
          borderRadius: '6px',
          marginBottom: '8px',
          width: '75%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="shimmer" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
            animation: 'shimmer 1.4s infinite'
          }}></div>
        </div>
        <div className="skeleton-line w2" style={{
          height: '11px',
          background: '#FAFAFA',
          borderRadius: '6px',
          width: '50%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="shimmer" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
            animation: 'shimmer 1.4s infinite'
          }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .product-card:hover {
          box-shadow: 0 16px 40px rgba(0,0,0,0.09);
          transform: translateY(-3px);
          border-color: transparent;
        }
        .product-card:hover .product-img {
          transform: scale(1.06);
        }
        .product-card:hover .product-actions {
          transform: translateY(0);
          opacity: 1;
        }
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .shop-toolbar {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 0' }}>
        <h1 style={{
          fontSize: '1.3rem',
          fontWeight: '700',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#1A1A1A',
          marginBottom: '10px'
        }}>{activeCategory !== 'all' ? activeCategory : 'All Products'}</h1>
        <p style={{
          color: '#6B6B6B',
          fontSize: '0.9rem',
          lineHeight: '1.7',
          maxWidth: '760px'
        }}>Browse our full range — from customized rings, bracelets and necklaces to everyday accessories and more. Every piece is chosen for quality and lasting value.</p>

        <div className="shop-toolbar" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '28px',
          paddingBottom: '16px',
          borderBottom: '1px solid #EAEAEA',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <button
              onClick={resetFilters}
              style={{
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: activeCategory === 'all' ? '1.5px solid #1A1A1A' : '1.5px solid transparent',
                color: activeCategory === 'all' ? '#1A1A1A' : '#6B6B6B',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0 0 4px',
                transition: 'color 0.15s'
              }}
              onMouseEnter={(e) => { if (activeCategory !== 'all') e.currentTarget.style.color = '#1A1A1A'; }}
              onMouseLeave={(e) => { if (activeCategory !== 'all') e.currentTarget.style.color = '#6B6B6B'; }}
            >
              View All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                style={{
                  background: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: activeCategory === cat.name ? '1.5px solid #1A1A1A' : '1.5px solid transparent',
                  color: activeCategory === cat.name ? '#1A1A1A' : '#6B6B6B',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '0 0 4px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => { if (activeCategory !== cat.name) e.currentTarget.style.color = '#1A1A1A'; }}
                onMouseLeave={(e) => { if (activeCategory !== cat.name) e.currentTarget.style.color = '#6B6B6B'; }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <p style={{ fontSize: '0.8rem', color: '#6B6B6B', margin: 0, whiteSpace: 'nowrap' }}>
              {loading ? 'Loading...' : `${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''}`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 26px 6px 4px',
                border: 'none',
                borderBottom: '1px solid #EAEAEA',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#1A1A1A',
                background: 'white',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%231A1A1A\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 2px center',
                backgroundSize: '13px'
              }}
            >
              <option value="default">Sort</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setView('grid')}
                style={{
                  width: '30px', height: '30px', border: 'none', background: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: view === 'grid' ? '#1A1A1A' : '#ccc', fontSize: '0.9rem'
                }}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                onClick={() => setView('list')}
                style={{
                  width: '30px', height: '30px', border: 'none', background: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: view === 'list' ? '#1A1A1A' : '#ccc', fontSize: '0.9rem'
                }}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px 0' }}>
        <div className="products-grid" style={{
          display: 'grid',
          gridTemplateColumns: view === 'list' ? '1fr' : 'repeat(4, 1fr)',
          gap: '18px'
        }}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state" style={{
              textAlign: 'center',
              padding: '80px 24px',
              gridColumn: '1 / -1'
            }}>
              <div className="empty-icon" style={{
                width: '80px',
                height: '80px',
                background: '#FAFAFA',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#ccc'
              }}>
                <i className="fas fa-search"></i>
              </div>
              <h3 className="empty-title" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1.4rem',
                fontWeight: '600',
                color: '#1A1A1A',
                marginBottom: '8px'
              }}>No Products Found</h3>
              <p className="empty-sub" style={{
                color: '#6B6B6B',
                fontSize: '0.9rem',
                marginBottom: '24px'
              }}>Try adjusting your search or filters</p>
              <button
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '2px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1.5px solid #1A1A1A',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  background: 'transparent',
                  color: '#1A1A1A'
                }}
                onClick={resetFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProducts.slice(0, visibleCount).map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {!loading && filteredProducts.length > visibleCount && (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <button
              onClick={() => setVisibleCount(c => c + 12)}
              style={{
                padding: '14px 48px',
                border: '1px solid #1A1A1A',
                background: 'white',
                color: '#1A1A1A',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1A1A1A'; }}
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Info Accordion */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 24px 64px' }}>
        <div style={{ borderTop: '1px solid #EAEAEA' }}>
          {[
            { key: 'collection', label: 'About This Collection', body: "Ismora's collection spans customized jewelry — rings, bracelets, necklaces, earrings and anklets made to order — alongside a curated range of everyday accessories and essentials. We're a new UAE-based brand, and we're building the collection deliberately rather than all at once." },
            { key: 'shipping', label: 'Shipping & Returns', body: 'We currently ship UAE-wide, with free shipping on orders over 150 AED. Items can be returned within 15 days of delivery — see our Returns Policy for full details.' },
            { key: 'custom', label: 'Custom Orders', body: "Looking for something personalized? Many of our jewelry pieces can be customized with engravings, names, or specific sizing. Reach out via our Contact page and we'll help bring your design to life." }
          ].map(section => (
            <div key={section.key} style={{ borderBottom: '1px solid #EAEAEA' }}>
              <button
                onClick={() => setOpenInfoSection(openInfoSection === section.key ? null : section.key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: '#1A1A1A'
                }}
              >
                {section.label}
                <span style={{ fontSize: '1.1rem', fontWeight: 400 }}>{openInfoSection === section.key ? '−' : '+'}</span>
              </button>
              {openInfoSection === section.key && (
                <p style={{ padding: '0 4px 20px', color: '#6B6B6B', fontSize: '0.88rem', lineHeight: '1.7', maxWidth: '760px' }}>
                  {section.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Shop;