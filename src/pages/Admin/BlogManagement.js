import { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import BlogModal from './components/BlogModal';

function BlogManagement() {
  const { blogs, loading, deleteBlog } = useBlog();
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const handleAddBlog = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDeleteClick = (blogId) => {
    setBlogToDelete(blogId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    await deleteBlog(blogToDelete);
    setShowDeleteConfirm(false);
    setBlogToDelete(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #f0f0f0',
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}></i>
        Loading blogs...
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
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '12px'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            <i className="fas fa-newspaper" style={{ color: '#1A1A1A', marginRight: '8px' }}></i>
            Blog Management
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: '#6b7280',
              marginLeft: '8px'
            }}>
              ({blogs.length} posts)
            </span>
          </h2>
          <button
            onClick={handleAddBlog}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: '#1A1A1A',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#000000';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1A1A1A';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i className="fas fa-plus"></i> Add Blog
          </button>
        </div>

        {blogs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <i className="fas fa-newspaper" style={{ fontSize: '3rem', display: 'block', marginBottom: '16px', opacity: 0.3 }}></i>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
              No blogs yet
            </h3>
            <p style={{ fontSize: '0.875rem' }}>Click "Add Blog" to create your first blog post</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem'
            }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Author</th>
                  <th style={{ textAlign: 'center', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Views</th>
                  <th style={{ textAlign: 'center', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Date</th>
                  <th style={{ textAlign: 'center', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 600 }}>{blog.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>/{blog.slug}</div>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: '20px',
                        background: '#f3f4f6',
                        color: '#4b5563',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        {blog.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', fontSize: '0.85rem' }}>
                      {blog.author || 'Ismora'}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      {blog.views || 0}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center', fontSize: '0.8rem' }}>
                      {formatDate(blog.createdAt)}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleEditBlog(blog)}
                          style={{
                            color: '#4f46e5',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            padding: '4px 6px',
                            borderRadius: '6px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#eef2ff'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(blog.id)}
                          style={{
                            color: '#ef4444',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            padding: '4px 6px',
                            borderRadius: '6px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
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
          if (e.target === e.currentTarget) {
            setShowDeleteConfirm(false);
            setBlogToDelete(null);
          }
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Delete Blog?</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '24px' }}>
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBlogToDelete(null);
                }}
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
        <BlogModal
          blog={editingBlog}
          onClose={() => setShowModal(false)}
          onSave={() => {}}
        />
      )}
    </>
  );
}

export default BlogManagement;