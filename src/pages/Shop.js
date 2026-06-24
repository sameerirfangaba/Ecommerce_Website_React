import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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

    return (
      <div 
        className="product-card" 
        style={{
          background: 'white',
          border: '1px solid #e8e8f0',
          borderRadius: '14px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          ...(isListView ? { display: 'grid', gridTemplateColumns: '160px 1fr', gap: 0 } : {})
        }}
        onClick={() => window.location = `/product/${product.id}`}
      >
        <div 
          className="product-img-wrap" 
          style={{
            position: 'relative',
            aspectRatio: isListView ? 'auto' : '1',
            height: isListView ? '160px' : 'auto',
            overflow: 'hidden',
            background: '#f8f8fc'
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
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: '700',
              background: '#FF6B35',
              color: 'white',
              letterSpacing: '0.04em'
            }}>
              −{discount}%
            </div>
          )}
          {!isListView && (
            <div className="product-actions" style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              display: 'flex',
              gap: '8px',
              transform: 'translateY(10px)',
              opacity: 0,
              transition: 'all 0.25s'
            }}>
              <button 
                className="product-atc-btn" 
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  background: '#1a1a2e',
                  color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={(e) => handleAddToCart(product, e)}
              >
                <i className="fas fa-cart-plus"></i>
              </button>
              <button className="product-wish-btn" style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.92)',
                color: '#4a4a68',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}>
                <i className="far fa-heart"></i>
              </button>
            </div>
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
              color: '#4a4a68',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '5px'
            }}>{product.category || 'General'}</div>
            <div className="product-name" style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#1a1a2e',
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
                color: '#1a1a2e'
              }}>{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="product-price-old" style={{
                  fontSize: '0.82rem',
                  color: '#aaa',
                  textDecoration: 'line-through'
                }}>{formatPrice(product.comparePrice)}</span>
              )}
            </div>
            <div className="product-rating" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '5px'
            }}>
              <span className="stars" style={{ color: '#fbbf24', fontSize: '0.7rem' }}>★★★★★</span>
              <span className="rating-count" style={{ fontSize: '0.72rem', color: '#4a4a68' }}>(24)</span>
            </div>
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
                  flex: 1,
                  maxWidth: '160px',
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  background: '#1a1a2e',
                  color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={(e) => handleAddToCart(product, e)}
              >
                <i className="fas fa-cart-plus"></i> Add to Cart
              </button>
              <button className="product-wish-btn" style={{
                width: '38px',
                height: '38px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.92)',
                color: '#4a4a68',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="far fa-heart"></i>
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
      border: '1px solid #e8e8f0',
      borderRadius: '14px',
      overflow: 'hidden'
    }}>
      <div className="skeleton-img" style={{
        aspectRatio: '1',
        background: '#f8f8fc',
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
          background: '#f8f8fc',
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
          background: '#f8f8fc',
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
          background: '#f8f8fc',
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
        .cat-item:hover {
          background: #f8f8fc;
          color: #1a1a2e;
        }
        .cat-item.active {
          background: #1a1a2e;
          color: white;
        }
        .cat-item.active .cat-count {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        @media (max-width: 768px) {
          .shop-body {
            grid-template-columns: 1fr !important;
          }
          .filter-sidebar {
            position: static !important;
          }
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>

      <div className="shop-header" style={{
        background: '#1a1a2e',
        padding: '48px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,107,53,0.12) 0%, transparent 60%)'
        }}></div>
        <div className="shop-header-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="breadcrumb" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '16px'
          }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
            <i className="fas fa-chevron-right" style={{ fontSize: '0.65rem' }}></i>
            <span style={{ color: 'white' }}>Shop</span>
          </div>
          <h1 className="shop-title" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.4rem',
            fontWeight: '700',
            color: 'white',
            letterSpacing: '-0.02em',
            marginBottom: '8px'
          }}>All Products</h1>
          <p className="shop-subtitle" style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.95rem'
          }}>Explore our full collection of premium products</p>
        </div>
      </div>

      <div className="shop-body" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '32px',
        alignItems: 'start'
      }}>
        <aside className="filter-sidebar" style={{
          position: 'sticky',
          top: '88px'
        }}>
          <div className="filter-panel" style={{
            background: 'white',
            border: '1px solid #e8e8f0',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px'
          }}>
            <div className="filter-panel-title" style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#4a4a68',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span><i className="fas fa-search" style={{ marginRight: '6px', color: '#FF6B35' }}></i>Search</span>
            </div>
            <div className="search-box" style={{ position: 'relative' }}>
              <i className="fas fa-search" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#aaa',
                fontSize: '0.85rem'
              }}></i>
              <input
                ref={sidebarSearchRef}
                type="text"
                placeholder="Search products..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  border: '1.5px solid #e8e8f0',
                  borderRadius: '10px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.875rem',
                  color: '#1a1a2e',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (searchInputRef.current) searchInputRef.current.value = val;
                }}
              />
            </div>
          </div>

          <div className="filter-panel" style={{
            background: 'white',
            border: '1px solid #e8e8f0',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px'
          }}>
            <div className="filter-panel-title" style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#4a4a68',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span><i className="fas fa-tag" style={{ marginRight: '6px', color: '#FF6B35' }}></i>Categories</span>
              <button 
                className="filter-clear" 
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#FF6B35',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  fontFamily: "'DM Sans', sans-serif"
                }}
                onClick={resetFilters}
              >
                All
              </button>
            </div>
            <div className="category-list" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <div 
                className={`cat-item ${activeCategory === 'all' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: activeCategory === 'all' ? 'white' : '#4a4a68',
                  background: activeCategory === 'all' ? '#1a1a2e' : 'transparent'
                }}
                onClick={() => handleCategoryClick('all')}
              >
                <span>All Products</span>
                <span className="cat-count" style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  background: activeCategory === 'all' ? 'rgba(255,255,255,0.2)' : '#f8f8fc',
                  color: activeCategory === 'all' ? 'white' : '#4a4a68',
                  padding: '2px 7px',
                  borderRadius: '100px'
                }}>{products.length}</span>
              </div>
              {categories.map((cat) => (
                <div 
                  key={cat.name}
                  className={`cat-item ${activeCategory === cat.name ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: activeCategory === cat.name ? 'white' : '#4a4a68',
                    background: activeCategory === cat.name ? '#1a1a2e' : 'transparent'
                  }}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <span>{cat.name}</span>
                  <span className="cat-count" style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    background: activeCategory === cat.name ? 'rgba(255,255,255,0.2)' : '#f8f8fc',
                    color: activeCategory === cat.name ? 'white' : '#4a4a68',
                    padding: '2px 7px',
                    borderRadius: '100px'
                  }}>{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-panel" style={{
            background: 'white',
            border: '1px solid #e8e8f0',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px'
          }}>
            <div className="filter-panel-title" style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#4a4a68',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span><i className="fas fa-sort-amount-down" style={{ marginRight: '6px', color: '#FF6B35' }}></i>Sort By</span>
            </div>
            <select 
              className="sort-select" 
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1.5px solid #e8e8f0',
                borderRadius: '10px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                color: '#1a1a2e',
                background: 'white',
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%234a4a68\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
          </div>
        </aside>

        <main>
          <div className="shop-toolbar" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <p className="product-count" style={{
              fontSize: '0.875rem',
              color: '#4a4a68',
              fontWeight: '500'
            }}>
              {loading ? 'Loading products...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
            </p>
            <div className="view-toggle" style={{ display: 'flex', gap: '4px' }}>
              <button 
                className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1.5px solid #e8e8f0',
                  borderRadius: '8px',
                  background: view === 'grid' ? '#1a1a2e' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: view === 'grid' ? 'white' : '#4a4a68',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s'
                }}
                onClick={() => setView('grid')}
              >
                <i className="fas fa-th"></i>
              </button>
              <button 
                className={`view-btn ${view === 'list' ? 'active' : ''}`}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1.5px solid #e8e8f0',
                  borderRadius: '8px',
                  background: view === 'list' ? '#1a1a2e' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: view === 'list' ? 'white' : '#4a4a68',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s'
                }}
                onClick={() => setView('list')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>

          <div className="products-grid" style={{
            display: 'grid',
            gridTemplateColumns: view === 'list' ? '1fr' : 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            {loading ? (
              <>
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
                  background: '#f8f8fc',
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
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  marginBottom: '8px'
                }}>No Products Found</h3>
                <p className="empty-sub" style={{
                  color: '#4a4a68',
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
                    borderRadius: '10px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: '1.5px solid #1a1a2e',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    background: 'transparent',
                    color: '#1a1a2e'
                  }}
                  onClick={resetFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Shop;