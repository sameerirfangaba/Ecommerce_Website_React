import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function BlogDetail() {
  const { slug } = useParams();
  const { getBlogBySlug, incrementViews, blogs } = useBlog();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const data = await getBlogBySlug(slug);
      if (data) {
        setBlog(data);
        await incrementViews(data.id);
        const related = blogs.filter(b => 
          b.id !== data.id && 
          b.category === data.category
        ).slice(0, 3);
        setRelatedBlogs(related);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [slug]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <p style={{ color: '#4a4a68' }}>Loading blog...</p>
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

  if (!blog) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <h1 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '16px' }}>Blog Not Found</h1>
          <Link to="/blog" style={{ color: '#FF6B35', textDecoration: 'none' }}>← Back to Blog</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: '#4a4a68',
          marginBottom: '24px'
        }}>
          <Link to="/" style={{ color: '#4a4a68', textDecoration: 'none' }}>Home</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
          <Link to="/blog" style={{ color: '#4a4a68', textDecoration: 'none' }}>Blog</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
          <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{blog.title}</span>
        </div>

        {/* Blog Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '48px'
        }}>
          <div>
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  marginBottom: '24px',
                  maxHeight: '400px',
                  objectFit: 'cover'
                }}
                onError={(e) => e.target.src = 'https://placehold.co/800x400/f0f0f0/aaa?text=Blog+Image'}
              />
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '16px',
              fontSize: '0.85rem',
              color: '#6b7280'
            }}>
              {blog.category && (
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: '#FF6B35',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {blog.category}
                </span>
              )}
              <span><i className="far fa-user"></i> {blog.author || 'Ismora'}</span>
              <span><i className="far fa-calendar"></i> {formatDate(blog.createdAt)}</span>
              <span><i className="far fa-eye"></i> {blog.views || 0} views</span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 700,
              color: '#1a1a2e',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              {blog.title}
            </h1>

            <div style={{
              color: '#4a4a68',
              lineHeight: '1.8',
              fontSize: '1rem'
            }}>
              {blog.content ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              ) : (
                <p>No content available.</p>
              )}
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e8e8f0'
              }}>
                <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>Tags:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {blog.tags.map((tag, idx) => (
                    <span key={idx} style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: '#f3f4f6',
                      color: '#4a4a68',
                      fontSize: '0.8rem'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div style={{
              background: 'white',
              border: '1px solid #e8e8f0',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>About the Author</h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#FF6B35',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.2rem'
                }}>
                  {blog.author ? blog.author.charAt(0).toUpperCase() : 'I'}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{blog.author || 'Ismora'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Content Writer</div>
                </div>
              </div>
              <p style={{ color: '#4a4a68', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Passionate about sharing knowledge and inspiring others through well-crafted content.
              </p>
            </div>

            {relatedBlogs.length > 0 && (
              <div style={{
                background: 'white',
                border: '1px solid #e8e8f0',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Related Posts</h4>
                {relatedBlogs.map(related => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px 0',
                      borderBottom: '1px solid #f3f4f6',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8fc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <img
                      src={related.image || 'https://placehold.co/80x80/f0f0f0/aaa?text=Blog'}
                      alt={related.title}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                      onError={(e) => e.target.src = 'https://placehold.co/80x80/f0f0f0/aaa?text=Blog'}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#1a1a2e',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {related.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '4px' }}>
                        {formatDate(related.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BlogDetail;