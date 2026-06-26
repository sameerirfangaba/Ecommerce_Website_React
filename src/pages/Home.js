import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const { addToCart } = useCart();

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
              catMap.set(cat, { count: 0, image: p.image || '' });
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

  // ✅ Fetch latest blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, 'blogs'),
          orderBy('createdAt', 'desc'),
          limit(4)
        );
        const snapshot = await getDocs(q);
        const blogsData = [];
        snapshot.forEach(doc => {
          blogsData.push({ id: doc.id, ...doc.data() });
        });
        setLatestBlogs(blogsData);
        setBlogsLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatPrice = (price) => {
    return `AED ${Number(price).toFixed(2)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCatImage = (catName) => {
    const lower = catName.toLowerCase().trim();
    const images = {
      'electronics':    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=450&fit=crop',
        'mobile':         'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=450&fit=crop',
        'phones':         'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=450&fit=crop',
        'clothing':       'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=450&fit=crop',
        'fashion':        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=450&fit=crop',
        'clothes':        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=450&fit=crop',
        'sports':         'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=450&fit=crop',
        'accessories':    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop',
        'jewelry':        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=450&fit=crop',
        'jewellery':      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=450&fit=crop',
        'ring':           'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=450&fit=crop',
        'rings':          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=450&fit=crop',
        'customized ring':'https://i.ibb.co/B5SSfqRD/customized-ring.jpg?w=600&h=450&fit=crop',
        'customized bracelet':'https://i.ibb.co/1YsDjXWp/customized-bracelet.jpg?w=600&h=450&fit=crop',
        'necklace':       'https://i.ibb.co/VpD018Dv/customized-necklace.jpg&h=450&fit=crop',
        'customized earring': 'https://i.ibb.co/4Z7Pn15r/customized-earring.jpg&h=450&fit=crop',
        'customized anklets':'https://i.ibb.co/Kzr9xb8y/customized-anklets.jpg&h=450&fit=crop',
        'watches':        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=450&fit=crop',
        'watch':          'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=450&fit=crop',
        'home':           'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=450&fit=crop',
        'kitchen':        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop',
        'beauty':         'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=450&fit=crop',
        'skincare':       'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=450&fit=crop',
        'perfume':        'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=450&fit=crop',
        'toys':           'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=450&fit=crop',
        'books':          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=450&fit=crop',
        'bags':           'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=450&fit=crop',
        'shoes':          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=450&fit=crop',
        'kids':           'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=600&h=450&fit=crop',
        'food':           'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=450&fit=crop',
        'health':         'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=450&fit=crop',
        'garden':         'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=450&fit=crop',
        'furniture':      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop',
        'art':            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=450&fit=crop',
        'stationery':     'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&h=450&fit=crop',
        'gift':           'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=450&fit=crop',
        'gifts':          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=450&fit=crop',
        'earring':        'https://images.unsplash.com/photo-1665520674561-2c5edb9b5435?w=600&h=450&fit=crop'
      };
    for (const [key, url] of Object.entries(images)) {
      if (lower.includes(key) || key.includes(lower)) return url;
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=450&fit=crop';
  };

  const ProductCard = ({ product }) => {
    const hasDiscount = product.comparePrice && product.comparePrice > product.price;
    const discount = hasDiscount ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

    const handleAddToCart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product);
    };

    const handleCardClick = () => {
      window.location.href = `/product/${product.id}`;
    };

    return (
      <div 
        className="product-card" 
        style={{
          background: 'white',
          border: '1px solid #e8e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        onClick={handleCardClick}
      >
        <div className="product-img-wrap" style={{
          position: 'relative',
          aspectRatio: '1',
          overflow: 'hidden',
          background: '#f8f8fc'
        }}>
          <img
            className="product-img"
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s'
            }}
            onError={(e) => e.target.src = 'https://placehold.co/400x400/f0f0f0/aaa?text=IMG'}
          />
          {hasDiscount && (
            <div className="product-badge badge-sale" style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 2,
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: '700',
              background: '#FF6B35',
              color: 'white'
            }}>−{discount}%</div>
          )}
          <div className="product-actions" style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px',
            transform: 'translateY(12px)',
            opacity: 0,
            transition: 'all 0.25s'
          }}>
            <button 
              className="product-atc-btn" 
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '9px',
                border: 'none',
                background: '#1a1a2e',
                color: 'white',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onClick={handleAddToCart}
            >
              <i className="fas fa-cart-plus"></i>Add to Cart
            </button>
            <button className="product-wish-btn" style={{
              width: '40px',
              height: '40px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.92)',
              color: '#4a4a68',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="far fa-heart"></i>
            </button>
          </div>
        </div>
        <div className="product-body" style={{ padding: '16px' }}>
          <div className="product-category" style={{
            fontSize: '0.72rem',
            fontWeight: '600',
            color: '#4a4a68',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '4px'
          }}>{product.category || ''}</div>
          <div className="product-name" style={{
            fontSize: '0.95rem',
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
              fontSize: '1.05rem',
              fontWeight: '700',
              color: '#1a1a2e'
            }}>{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="product-price-old" style={{
                fontSize: '0.85rem',
                color: '#aaa',
                textDecoration: 'line-through'
              }}>{formatPrice(product.comparePrice)}</span>
            )}
          </div>
          <div className="product-rating" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '6px'
          }}>
            <span className="stars" style={{ color: '#fbbf24', fontSize: '0.75rem' }}>★★★★★</span>
            <span className="rating-count" style={{ fontSize: '0.75rem', color: '#4a4a68' }}>(24)</span>
          </div>
        </div>
      </div>
    );
  };

  const CategoryCard = ({ category }) => {
    return (
      <div className="cat-card" style={{
        width: '260px',
        flexShrink: 0,
        borderRadius: '18px',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '4/3',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}>
        <Link to={`/shop?category=${encodeURIComponent(category.name)}`} style={{ textDecoration: 'none' }}>
          <img
            className="cat-img"
            src={getCatImage(category.name)}
            alt={category.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s',
              display: 'block'
            }}
            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=450&fit=crop'}
          />
          <div className="cat-overlay" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(26,26,46,0.9) 0%, rgba(26,26,46,0.35) 55%, rgba(26,26,46,0.1) 100%)',
            transition: 'opacity 0.3s'
          }}></div>
          <div className="cat-content" style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px 18px',
            zIndex: 2
          }}>
            <div className="cat-count" style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '5px'
            }}>{category.count} Product{category.count !== 1 ? 's' : ''}</div>
            <div className="cat-name" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '6px',
              lineHeight: '1.2'
            }}>{category.name}</div>
            <div className="cat-link" style={{
              fontSize: '0.78rem',
              fontWeight: '600',
              color: '#FF6B35',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'gap 0.2s'
            }}>
              Shop Now <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const BlogCard = ({ blog }) => {
    return (
      <div style={{
        background: 'white',
        border: '1px solid #e8e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#e8e8f0';
      }}
      onClick={() => window.location.href = `/blog/${blog.slug}`}
      >
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          height: '180px',
          background: '#f8f8fc'
        }}>
          <img
            src={blog.image || 'https://placehold.co/400x200/f0f0f0/aaa?text=Blog'}
            alt={blog.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s'
            }}
            onError={(e) => e.target.src = 'https://placehold.co/400x200/f0f0f0/aaa?text=Blog'}
          />
          {blog.category && (
            <span style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '0.65rem',
              fontWeight: 600,
              background: '#FF6B35',
              color: 'white'
            }}>
              {blog.category}
            </span>
          )}
        </div>
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: '0.7rem',
            color: '#6b7280',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>{blog.author || 'Ismora'}</span>
            <span>•</span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          <h3 style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#1a1a2e',
            marginBottom: '6px',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {blog.title}
          </h3>
          <p style={{
            color: '#4a4a68',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {blog.excerpt || 'Read more about this topic...'}
          </p>
          <div style={{
            marginTop: '12px',
            color: '#FF6B35',
            fontWeight: 600,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Read More <i className="fas fa-arrow-right" style={{ fontSize: '0.6rem' }}></i>
          </div>
        </div>
      </div>
    );
  };

  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <>
      <Navbar />
      
      <style>{`
        .product-card:hover {
          box-shadow: 0 20px 48px rgba(0,0,0,0.1);
          transform: translateY(-4px);
          border-color: transparent;
        }
        .product-card:hover .product-img {
          transform: scale(1.06);
        }
        .product-card:hover .product-actions {
          transform: translateY(0);
          opacity: 1;
        }
        .cat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.14);
        }
        .cat-card:hover .cat-img {
          transform: scale(1.06);
        }
        .cat-card:hover .cat-overlay {
          opacity: 0.85;
        }
        .cat-card:hover .cat-link {
          gap: 9px;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
          .hero-inner { grid-template-columns: 1fr !important; gap: 40px !important; padding: 56px 20px !important; }
          .hero-visual { display: none !important; }
          .promo-banner { grid-template-columns: 1fr !important; padding: 32px 24px !important; text-align: center !important; }
          .promo-title { font-size: 1.7rem !important; }
          .cat-card { width: 220px !important; }
        }
        @media (max-width: 480px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .cat-card { width: 190px !important; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero" style={{
        background: '#1a1a2e',
        minHeight: '88vh',
        display: 'grid',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,107,53,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,107,53,0.08) 0%, transparent 40%)'
        }}></div>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: '0.04',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
        <div className="hero-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="hero-content">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,107,53,0.15)',
              border: '1px solid rgba(255,107,53,0.3)',
              color: '#FF6B35',
              borderRadius: '100px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: '600',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#FF6B35',
                animation: 'blink 2s infinite'
              }}></span>
              ✦ New Collection 2026
            </div>
            <h1 className="hero-title" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: '700',
              color: 'white',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
              marginBottom: '20px'
            }}>
              Discover <em style={{ fontStyle: 'italic', color: '#FF6B35' }}>Premium</em><br />
              Products For You
            </h1>
            <p className="hero-subtitle" style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              marginBottom: '32px',
              maxWidth: '480px'
            }}>Curated selection of modern essentials — crafted for quality, designed for life.</p>
            <div className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-accent btn-lg" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '15px 32px',
                borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s',
                textDecoration: 'none',
                background: '#FF6B35',
                color: 'white'
              }}>
                <i className="fas fa-shopping-bag"></i>Shop Now
              </Link>
              <Link to="#featured" className="btn btn-lg" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '15px 32px',
                borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1.5px solid rgba(255,255,255,0.2)',
                transition: 'all 0.2s',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.1)',
                color: 'white'
              }}>View Collection</Link>
            </div>
            <div className="hero-stats" style={{
              display: 'flex',
              gap: '32px',
              marginTop: '48px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: 'white',
                  lineHeight: '1'
                }}>500+</div>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '4px'
                }}>Products</div>
              </div>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: 'white',
                  lineHeight: '1'
                }}>10k+</div>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '4px'
                }}>Happy Customers</div>
              </div>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: 'white',
                  lineHeight: '1'
                }}>4.9★</div>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '4px'
                }}>Avg. Rating</div>
              </div>
            </div>
          </div>
          <div className="hero-visual" style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px',
              padding: '12px',
              backdropFilter: 'blur(8px)'
            }}>
              <img
                src="https://i.ibb.co/rGSQPRLy/ismora-banner.jpg"
                alt="Featured Products"
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  aspectRatio: '4/5',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => e.target.src = 'https://placehold.co/600x750/f0f0f0/aaa?text=Ismora'}
              />
              <div style={{
                position: 'absolute',
                background: 'white',
                borderRadius: '14px',
                padding: '12px 16px',
                boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                bottom: '-20px',
                left: '-30px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#FF6B35',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>
                  <i className="fas fa-truck"></i>
                </div>
                <div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#1a1a2e',
                    lineHeight: '1'
                  }}>Free</div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#4a4a68',
                    marginTop: '1px'
                  }}>Shipping on orders</div>
                </div>
              </div>
              <div style={{
                position: 'absolute',
                background: 'white',
                borderRadius: '14px',
                padding: '12px 16px',
                boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                top: '24px',
                right: '-30px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#FF6B35',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>
                  <i className="fas fa-star"></i>
                </div>
                <div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#1a1a2e',
                    lineHeight: '1'
                  }}>4.9/5</div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#4a4a68',
                    marginTop: '1px'
                  }}>Customer Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{
        background: '#f8f8fc',
        borderTop: '1px solid #e8e8f0',
        borderBottom: '1px solid #e8e8f0',
        padding: '18px 0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: '500',
            color: '#4a4a68'
          }}>
            <i className="fas fa-shipping-fast" style={{ color: '#FF6B35', fontSize: '1.1rem' }}></i>
            Free Shipping Over 150 AED
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: '500',
            color: '#4a4a68'
          }}>
            <i className="fas fa-undo-alt" style={{ color: '#FF6B35', fontSize: '1.1rem' }}></i>
            Easy 30-Day Returns
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: '500',
            color: '#4a4a68'
          }}>
            <i className="fas fa-shield-alt" style={{ color: '#FF6B35', fontSize: '1.1rem' }}></i>
            Secure Payments
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: '500',
            color: '#4a4a68'
          }}>
            <i className="fas fa-headset" style={{ color: '#FF6B35', fontSize: '1.1rem' }}></i>
            24/7 Support
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: '500',
            color: '#4a4a68'
          }}>
            <i className="fas fa-certificate" style={{ color: '#FF6B35', fontSize: '1.1rem' }}></i>
            Authentic Products
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="section" id="featured" style={{ padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FF6B35',
                marginBottom: '8px'
              }}>Handpicked For You</p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: '700',
                color: '#1a1a2e',
                letterSpacing: '-0.02em',
                lineHeight: '1.15',
                marginBottom: '12px'
              }}>Featured Products</h2>
              <p style={{
                color: '#4a4a68',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                maxWidth: '520px'
              }}>Discover our most loved items, carefully selected for quality and value.</p>
            </div>
            <Link to="/shop" className="btn btn-outline" style={{
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
            }}>
              View All <i className="fas fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
            </Link>
          </div>
          {loading ? (
            <div className="product-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  background: 'white',
                  border: '1px solid #e8e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    aspectRatio: '1',
                    background: '#f8f8fc',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                      animation: 'shimmer 1.4s infinite'
                    }}></div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ height: '12px', background: '#f8f8fc', borderRadius: '6px', marginBottom: '8px', width: '33%', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                        animation: 'shimmer 1.4s infinite'
                      }}></div>
                    </div>
                    <div style={{ height: '12px', background: '#f8f8fc', borderRadius: '6px', marginBottom: '8px', width: '75%', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                        animation: 'shimmer 1.4s infinite'
                      }}></div>
                    </div>
                    <div style={{ height: '12px', background: '#f8f8fc', borderRadius: '6px', width: '50%', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                        animation: 'shimmer 1.4s infinite'
                      }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="product-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section cat-section" style={{ padding: '80px 0', background: '#f8f8fc' }}>
        <div className="section-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '560px',
            margin: '0 auto 40px'
          }}>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#FF6B35',
              marginBottom: '8px'
            }}>Browse By</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: '700',
              color: '#1a1a2e',
              letterSpacing: '-0.02em',
              lineHeight: '1.15',
              marginBottom: '12px'
            }}>Shop Categories</h2>
            <p style={{
              color: '#4a4a68',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              maxWidth: '520px',
              margin: '8px auto 0'
            }}>Discover products from our curated collections</p>
          </div>
          
          {loading ? (
            <div style={{
              display: 'flex',
              gap: '20px',
              overflow: 'hidden'
            }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  width: '260px',
                  flexShrink: 0,
                  borderRadius: '18px',
                  aspectRatio: '4/3',
                  background: '#e8e8f0',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                    animation: 'shimmer 1.4s infinite'
                  }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              padding: '4px 0 8px',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {categories.map((category, index) => (
                <CategoryCard key={index} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="section-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FF6B35',
                marginBottom: '8px'
              }}>Don't Miss Out</p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: '700',
                color: '#1a1a2e',
                letterSpacing: '-0.02em',
                lineHeight: '1.15',
                marginBottom: '12px'
              }}>New Arrivals</h2>
            </div>
            <Link to="/shop" className="btn btn-outline" style={{
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
            }}>
              See All <i className="fas fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
            </Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#4a4a68' }}>Loading...</div>
          ) : (
            <div className="product-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ✅ LATEST BLOGS SECTION */}
      <section className="section" style={{ padding: '80px 0', background: '#f8f8fc' }}>
        <div className="section-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '40px'
          }}>
            <div>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FF6B35',
                marginBottom: '8px'
              }}>Latest Articles</p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: '700',
                color: '#1a1a2e',
                letterSpacing: '-0.02em',
                lineHeight: '1.15',
                marginBottom: '12px'
              }}>From Our Blog</h2>
              <p style={{
                color: '#4a4a68',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                maxWidth: '520px'
              }}>Tips, guides and inspiration for your style journey.</p>
            </div>
            <Link to="/blog" className="btn btn-outline" style={{
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
            }}>
              View All <i className="fas fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
            </Link>
          </div>

          {blogsLoading ? (
            <div className="blog-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  background: 'white',
                  border: '1px solid #e8e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  height: '280px'
                }}>
                  <div style={{
                    height: '160px',
                    background: '#f0f0f0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite'
                    }}></div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{
                      height: '10px',
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      width: '60%',
                      marginBottom: '8px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite'
                      }}></div>
                    </div>
                    <div style={{
                      height: '16px',
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      width: '80%',
                      marginBottom: '8px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite'
                      }}></div>
                    </div>
                    <div style={{
                      height: '10px',
                      background: '#f0f0f0',
                      borderRadius: '4px',
                      width: '50%',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite'
                      }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : latestBlogs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <i className="fas fa-newspaper" style={{ fontSize: '2rem', display: 'block', marginBottom: '12px', opacity: 0.3 }}></i>
              <p>No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="blog-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px'
            }}>
              {latestBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="section" style={{ padding: '80px 0', paddingTop: '0' }}>
        <div className="section-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="promo-banner" style={{
            background: '#FF6B35',
            borderRadius: '20px',
            padding: '48px 56px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '32px',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '10px'
              }}>Limited Time Offer</div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.2rem',
                fontWeight: '700',
                color: 'white',
                lineHeight: '1.15',
                marginBottom: '12px'
              }}>Get 20% Off Your<br />First Order Today</h2>
              <p style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.95rem',
                maxWidth: '440px'
              }}>Sign up and unlock exclusive deals, early access to new arrivals, and much more.</p>
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Link to="/shop" className="btn btn-white btn-lg" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '15px 32px',
                borderRadius: '12px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s',
                textDecoration: 'none',
                background: 'white',
                color: '#FF6B35'
              }}>
                Claim Offer <i className="fas fa-arrow-right" style={{ fontSize: '0.85rem' }}></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <div style={{
        background: '#1a1a2e',
        padding: '64px 0'
      }}>
        <div style={{
          maxWidth: '560px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '0 24px'
        }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#FF6B35',
            marginBottom: '8px'
          }}>Stay In The Loop</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '12px'
          }}>Join Our Newsletter</h2>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '28px',
            fontSize: '0.95rem'
          }}>Get exclusive deals, new arrivals, and style tips delivered to your inbox.</p>
          <div style={{
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="email"
              placeholder="Enter your email address"
              style={{
                flex: 1,
                padding: '13px 18px',
                borderRadius: '10px',
                border: '1.5px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <button className="btn btn-accent" style={{
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
              border: 'none',
              transition: 'all 0.2s',
              textDecoration: 'none',
              background: '#FF6B35',
              color: 'white'
            }}>Subscribe</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;