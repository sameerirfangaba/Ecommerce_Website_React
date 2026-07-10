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
        incrementViews(data.id);
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

  // ✅ Function to clean and render HTML content properly
  const renderContent = (html) => {
    if (!html) return <p>No content available.</p>;
    
    // Clean the HTML to preserve formatting
    let content = html;
    
    // Ensure paragraphs have proper spacing
    content = content.replace(/<p><\/p>/g, '<p>&nbsp;</p>');
    content = content.replace(/<p>\s*<br>\s*<\/p>/g, '<p>&nbsp;</p>');
    
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  // Loading Spinner
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '40px 20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #1A1A1A',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            fontWeight: 500,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            Loading blog...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#ef4444' }}></i>
          </div>
          <h1 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '16px' }}>Blog Not Found</h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" style={{ 
            color: '#1A1A1A', 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600
          }}>
            <i className="fas fa-arrow-left"></i> Back to Blog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <style>{`
        /* ✅ Blog Content Styles - Fix White Space */
        .blog-content {
          color: #6B6B6B;
          line-height: 1.8;
          font-size: 1rem;
        }
        
        .blog-content p {
          margin-bottom: 1.2em;
          line-height: 1.8;
        }
        
        .blog-content h1, 
        .blog-content h2, 
        .blog-content h3, 
        .blog-content h4 {
          font-family: 'DM Sans', sans-serif;
          color: #1A1A1A;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .blog-content h1 { font-size: 2rem; }
        .blog-content h2 { font-size: 1.5rem; }
        .blog-content h3 { font-size: 1.2rem; }
        
        .blog-content ul, 
        .blog-content ol {
          margin: 0.5em 0 1em 1.5em;
          padding-left: 1em;
        }
        
        .blog-content li {
          margin-bottom: 0.3em;
          line-height: 1.8;
        }
        
        .blog-content img {
          max-width: 100%;
          border-radius: 12px;
          margin: 1.5em 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        
        .blog-content blockquote {
          border-left: 4px solid #1A1A1A;
          padding: 0.5em 1.5em;
          margin: 1em 0;
          background: #FAFAFA;
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: #1A1A1A;
        }
        
        .blog-content a {
          color: #1A1A1A;
          text-decoration: underline;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        
        .blog-content table td,
        .blog-content table th {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
        }
        
        .blog-content table th {
          background: #f9fafb;
          font-weight: 600;
        }
        
        .blog-content br {
          display: block;
          content: "";
          margin: 0.5em 0;
        }
        
        .blog-content .ql-align-center {
          text-align: center;
        }
        
        .blog-content .ql-align-right {
          text-align: right;
        }
        
        .blog-content .ql-align-justify {
          text-align: justify;
        }
        
        @media (max-width: 768px) {
          .blog-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .blog-content h1 { font-size: 1.5rem; }
          .blog-content h2 { font-size: 1.2rem; }
        }
      `}</style>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: '#6B6B6B',
          marginBottom: '24px'
        }}>
          <Link to="/" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Home</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
          <Link to="/blog" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Blog</Link>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
          <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{blog.title}</span>
        </div>

        {/* Blog Content */}
        <div className="blog-detail-grid" style={{
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
                  background: '#1A1A1A',
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
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 700,
              color: '#1A1A1A',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              {blog.title}
            </h1>

            {/* ✅ Content with proper formatting */}
            <div className="blog-content">
              {blog.content ? (
                renderContent(blog.content)
              ) : (
                <p>No content available.</p>
              )}
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #EAEAEA'
              }}>
                <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>Tags:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {blog.tags.map((tag, idx) => (
                    <span key={idx} style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: '#f3f4f6',
                      color: '#6B6B6B',
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
              border: '1px solid #EAEAEA',
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
                  background: '#1A1A1A',
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
              <p style={{ color: '#6B6B6B', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Passionate about sharing knowledge and inspiring others through well-crafted content.
              </p>
            </div>

            {relatedBlogs.length > 0 && (
              <div style={{
                background: 'white',
                border: '1px solid #EAEAEA',
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
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
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
                        color: '#1A1A1A',
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