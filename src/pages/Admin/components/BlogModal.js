import { useState, useEffect } from 'react';
import { useBlog } from '../../../context/BlogContext';

function BlogModal({ blog, onClose, onSave }) {
  const { addBlog, updateBlog } = useBlog();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    author: '',
    tags: ''
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        image: blog.image || '',
        category: blog.category || '',
        author: blog.author || '',
        tags: blog.tags ? blog.tags.join(', ') : ''
      });
      setFeaturedImagePreview(blog.image || '');
    }
  }, [blog]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Image is too large. Max size is 4MB.');
      return;
    }

    setUploadingImage(true);
    setFeaturedImagePreview(URL.createObjectURL(file));

    try {
      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = () => reject(new Error('Could not read image file'));
        reader.readAsDataURL(file);
      });

      // Send to API
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          base64: base64
        })
      });

      // ✅ Fix: Check if response is JSON
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Response is not JSON:', text);
        throw new Error('Server returned an error. Please try again.');
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData(prev => ({ ...prev, image: data.url }));
      setFeaturedImagePreview(data.url);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Image upload failed: ' + error.message);
      setFeaturedImagePreview('');
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload a featured image!');
      return;
    }
    
    setLoading(true);
    try {
      const data = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        category: formData.category,
        author: formData.author || 'Ismora',
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (blog?.id) {
        await updateBlog(blog.id, data);
      } else {
        await addBlog(data);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog');
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px'
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    >
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '95vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {blog?.id ? 'Edit Blog' : 'Add New Blog'}
          </h2>
          <button
            onClick={onClose}
            style={{
              fontSize: '2rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Blog Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                const val = e.target.value;
                setFormData(prev => ({ ...prev, title: val, slug: generateSlug(val) }));
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Slug */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Slug (URL) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="auto-generated from title"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Category & Author */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g. Guides, Trends, Care"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Author name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Featured Image Upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Featured Image *
            </label>
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: '#fafafa'
            }}
            onClick={() => document.getElementById('featured-image-input').click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.background = '#fff7ed'; }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa'; }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith('image/')) {
                const input = document.getElementById('featured-image-input');
                const event = { target: { files: [file] } };
                handleFeaturedImageUpload(event);
              }
            }}
            >
              <input
                id="featured-image-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFeaturedImageUpload}
              />
              {uploadingImage ? (
                <div style={{ padding: '20px' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#FF6B35', display: 'block', marginBottom: '8px' }}></i>
                  <p style={{ color: '#6b7280' }}>Uploading...</p>
                </div>
              ) : featuredImagePreview ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={featuredImagePreview}
                    alt="Featured"
                    style={{
                      maxHeight: '200px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeaturedImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#9ca3af', display: 'block', marginBottom: '8px' }}></i>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Click or drag & drop to upload featured image</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '4px' }}>PNG, JPG, WEBP • Max 4MB</p>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g. ring, size, guide"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Excerpt */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Excerpt (Short Description) *
            </label>
            <textarea
              rows="3"
              required
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary of the blog..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Content */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Content *
            </label>
            <textarea
              rows="12"
              required
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your blog content here... You can use HTML tags: <h2>, <p>, <ul>, <li>, etc."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
              <i className="fas fa-info-circle"></i> You can use HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;, etc.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: '#FF6B35',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: (loading || uploadingImage) ? 'not-allowed' : 'pointer',
              opacity: (loading || uploadingImage) ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            <i className="fas fa-save"></i>
            {loading ? 'Saving...' : uploadingImage ? 'Uploading Image...' : 'Save Blog'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BlogModal;