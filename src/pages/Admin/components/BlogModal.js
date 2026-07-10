import { useState, useEffect, useRef } from 'react';
import { useBlog } from '../../../context/BlogContext';
import { useToast } from '../../../context/ToastContext';
import { loadQuill } from '../../../utils/loadQuill';

// ✅ ImgBB Upload Function
const uploadToImgBB = async (file) => {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  if (file.size > 32 * 1024 * 1024) {
    throw new Error('Image is too large. Max size is 32MB.');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', '396308e8c9d3f49bcdefd40a5ad2727d');

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  return data.data.url;
};

function BlogModal({ blog, onClose, onSave }) {
  const { addBlog, updateBlog } = useBlog();
  const { showToast } = useToast(); // ✅ Use Toast
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [quillLoaded, setQuillLoaded] = useState(false);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  
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

  // ✅ Initialize Quill from CDN
  useEffect(() => {
    const initQuill = () => {
      if (typeof window !== 'undefined' && window.Quill && editorRef.current && !quillInstance.current) {
        try {
          const toolbarOptions = [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            ['clean']
          ];

          const quill = new window.Quill(editorRef.current, {
            theme: 'snow',
            modules: {
              toolbar: toolbarOptions
            },
            placeholder: 'Write your blog content here...'
          });

          if (formData.content) {
            quill.root.innerHTML = formData.content;
          }

          quill.on('text-change', () => {
            const content = quill.root.innerHTML;
            setFormData(prev => ({ ...prev, content }));
          });

          const toolbar = quill.getModule('toolbar');
          if (toolbar) {
            toolbar.addHandler('image', () => {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.click();

              input.onchange = async () => {
                const file = input.files[0];
                if (!file) return;

                try {
                  const range = quill.getSelection();
                  if (range) {
                    quill.insertText(range.index, '⏳ Uploading image...', 'bold');
                    quill.setSelection(range.index + 19);
                  }

                  const url = await uploadToImgBB(file);

                  if (range) {
                    quill.deleteText(range.index, 19);
                    quill.insertEmbed(range.index, 'image', url);
                    quill.setSelection(range.index + 1);
                  }
                  
                  // ✅ Toast for image upload success
                  showToast('Image uploaded successfully!', 'success');
                } catch (error) {
                  showToast('Image upload failed: ' + error.message, 'error');
                  const range = quill.getSelection();
                  if (range) {
                    quill.deleteText(range.index - 19, 19);
                  }
                }
              };
            });
          }

          quillInstance.current = quill;
          setQuillLoaded(true);
        } catch (error) {
          console.error('Quill init error:', error);
        }
      }
    };

    const checkQuill = () => {
      if (typeof window !== 'undefined' && window.Quill) {
        initQuill();
        return true;
      }
      return false;
    };

    loadQuill();

    if (checkQuill()) return;

    const interval = setInterval(() => {
      if (checkQuill()) {
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!quillInstance.current) {
        console.warn('Quill failed to load from CDN');
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (quillInstance.current && formData.content !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = formData.content;
    }
  }, [formData.content]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    setUploadingImage(true);
    setFeaturedImagePreview(URL.createObjectURL(file));

    try {
      const url = await uploadToImgBB(file);
      
      if (url) {
        setFormData(prev => ({ ...prev, image: url }));
        setFeaturedImagePreview(url);
        showToast('Featured image uploaded successfully!', 'success');
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed');
      setFeaturedImagePreview('');
      showToast('Image upload failed: ' + error.message, 'error');
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      showToast('Please upload a featured image!', 'warning');
      return;
    }
    
    setLoading(true);
    try {
      let content = formData.content || '';
      
      content = content.replace(/<p><br><\/p>/g, '<p>&nbsp;</p>');
      content = content.replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');
      content = content.replace(/\n/g, '<br>');
      
      const data = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: content,
        image: formData.image,
        category: formData.category,
        author: formData.author || 'Ismora',
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (blog?.id) {
        await updateBlog(blog.id, data);
        showToast('Blog updated successfully!', 'success');
      } else {
        await addBlog(data);
        showToast('Blog created successfully!', 'success');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving blog:', error);
      showToast('Error saving blog: ' + error.message, 'error');
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
        maxWidth: '1000px',
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
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Click or drag & drop to upload</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '4px' }}>PNG, JPG, WEBP • Max 32MB</p>
                </>
              )}
            </div>
            {uploadError && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>
                ❌ {uploadError}
              </p>
            )}
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

          {/* Content with Quill Editor */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
              Content *
            </label>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'white'
            }}>
              <div
                ref={editorRef}
                style={{
                  minHeight: '300px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  background: 'white'
                }}
              />
              {!quillLoaded && (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Loading editor...
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
              <i className="fas fa-info-circle"></i> Use the toolbar to format text. Click the <strong>image icon</strong> to upload images.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage || !quillLoaded}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: '#FF6B35',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: (loading || uploadingImage || !quillLoaded) ? 'not-allowed' : 'pointer',
              opacity: (loading || uploadingImage || !quillLoaded) ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            <i className="fas fa-save"></i>
            {loading ? 'Saving...' : uploadingImage ? 'Uploading Image...' : !quillLoaded ? 'Loading Editor...' : 'Save Blog'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BlogModal; 