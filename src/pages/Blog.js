import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Blog() {
  const { blogs, loading, categories } = useBlog();
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = blogs;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(b => b.category === activeCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(term) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(term))
      );
    }
    setFilteredBlogs(filtered);
  }, [blogs, activeCategory, searchTerm]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ✅ Loading Skeleton Component
  const SkeletonCard = () => (
    <div style={{
      background: 'white',
      border: '1px solid #e8e8f0',
      borderRadius: '16px',
      overflow: 'hidden',
      animation: 'pulse 1.5s ease-in-out infinite'
    }}>
      <div style={{
        height: '200px',
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
      <div style={{ padding: '20px' }}>
        <div style={{
          height: '12px',
          background: '#f0f0f0',
          borderRadius: '4px',
          width: '60%',
          marginBottom: '12px',
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
          height: '20px',
          background: '#f0f0f0',
          borderRadius: '4px',
          width: '80%',
          marginBottom: '12px',
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
          height: '12px',
          background: '#f0f0f0',
          borderRadius: '4px',
          width: '90%',
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
          height: '12px',
          background: '#f0f0f0',
          borderRadius: '4px',
          width: '70%',
          marginBottom: '16px',
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
          width: '40%',
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
  );

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @media (max-width: 768px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: '#1a1a2e',
        padding: '60px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,107,53,0.12) 0%, transparent 60%)'
        }}></div>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'white',
            marginBottom: '12px'
          }}>
            Our Blog
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1.05rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Tips, guides and inspiration for your style journey
          </p>
          {!loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '20px',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '0.85rem'
            }}>
              <span><i className="fas fa-pen" style={{ color: '#FF6B35' }}></i> {blogs.length} Articles</span>
              <span>•</span>
              <span><i className="fas fa-tag" style={{ color: '#FF6B35' }}></i> {categories.length} Categories</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar - Only show when loaded */}
      {!loading && (
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          background: 'white',
          borderBottom: '1px solid #e8e8f0'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                onClick={() => setActiveCategory('all')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  border: `1px solid ${activeCategory === 'all' ? '#FF6B35' : '#e8e8f0'}`,
                  background: activeCategory === 'all' ? '#FF6B35' : 'white',
                  color: activeCategory === 'all' ? 'white' : '#4a4a68',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  transition: 'all 0.2s'
                }}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    border: `1px solid ${activeCategory === cat ? '#FF6B35' : '#e8e8f0'}`,
                    background: activeCategory === cat ? '#FF6B35' : 'white',
                    color: activeCategory === cat ? 'white' : '#4a4a68',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '200px' }}>
              <i className="fas fa-search" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}></i>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #e8e8f0',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#FF6B35'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e8e8f0'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        {loading ? (
          // ✅ Show Skeleton Cards while loading
          <div className="blog-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', display: 'block', marginBottom: '16px', opacity: 0.3 }}></i>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
              No blogs found
            </h3>
            <p style={{ fontSize: '0.875rem' }}>
              {searchTerm ? 'Try adjusting your search or filters' : 'Check back later for new articles'}
            </p>
          </div>
        ) : (
          <div className="blog-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            {filteredBlogs.map(blog => (
              <div key={blog.id} style={{
                background: 'white',
                border: '1px solid #e8e8f0',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'pointer'
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
              >
                <Link to={`/blog/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '200px',
                    background: '#f8f8fc'
                  }}>
                    <img
                      src={blog.image || 'https://placehold.co/600x400/f0f0f0/aaa?text=Blog'}
                      alt={blog.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s'
                      }}
                      onError={(e) => e.target.src = 'https://placehold.co/600x400/f0f0f0/aaa?text=Blog'}
                    />
                    {blog.category && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        background: '#FF6B35',
                        color: 'white'
                      }}>
                        {blog.category}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>{blog.author || 'Ismora'}</span>
                      <span>•</span>
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#1a1a2e',
                      marginBottom: '8px',
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
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {blog.excerpt || 'Read more about this topic...'}
                    </p>
                    <div style={{
                      marginTop: '16px',
                      color: '#FF6B35',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      Read More <i className="fas fa-arrow-right" style={{ fontSize: '0.7rem' }}></i>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Blog;