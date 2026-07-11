import { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebase/config';
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../../../context/ToastContext';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

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

function ProductModal({ product, onClose, onSave }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [quillLoaded, setQuillLoaded] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    comparePrice: '',
    stock: '',
    category: '',
    image: '',
    shortDesc: '',
    desc: '',
    images: [],
    hasVariants: false,
    variants: { groups: [], combinations: [] },
    customTextField: null
  });
  const [extraImages, setExtraImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [variantGroups, setVariantGroups] = useState([]);
  const [variantCombinations, setVariantCombinations] = useState([]);
  const [customFieldEnabled, setCustomFieldEnabled] = useState(false);
  const [variantsEnabled, setVariantsEnabled] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        stock: product.stock || '',
        category: product.category || '',
        image: product.image || '',
        shortDesc: product.shortDesc || '',
        desc: product.desc || '',
        images: product.images || [],
        hasVariants: product.hasVariants || false,
        variants: product.variants || { groups: [], combinations: [] },
        customTextField: product.customTextField || null
      });
      setExtraImages((product.images || []).slice(1));
      setImageUrl(product.image || '');
      
      if (product.hasVariants && product.variants) {
        setVariantGroups(product.variants.groups || []);
        setVariantCombinations(product.variants.combinations || []);
        setVariantsEnabled(true);
      }
      
      if (product.customTextField?.enabled) {
        setCustomFieldEnabled(true);
      }
    }
  }, [product]);

  // ✅ Initialize Quill for description
  useEffect(() => {
    const container = document.getElementById('quill-editor');
    if (!quillInstance.current && container) {
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

        const quill = new Quill(container, {
          theme: 'snow',
          modules: {
            toolbar: toolbarOptions
          },
          placeholder: 'Write product description here...'
        });

        if (formData.desc) {
          quill.root.innerHTML = formData.desc;
        }

        quill.on('text-change', () => {
          const content = quill.root.innerHTML;
          setFormData(prev => ({ ...prev, desc: content }));
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

    return () => {
      if (quillInstance.current) {
        const toolbar = quillInstance.current.getModule('toolbar');
        if (toolbar?.container) {
          toolbar.container.remove();
        }
        container.innerHTML = '';
        container.classList.remove('ql-container', 'ql-snow');
        container.removeAttribute('tabindex');
        quillInstance.current = null;
      }
    };
  }, []);

  // ✅ Update Quill when desc changes externally
  useEffect(() => {
    if (quillInstance.current && formData.desc !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = formData.desc;
    }
  }, [formData.desc]);

  // ✅ Auto-set variant stock from product stock
  useEffect(() => {
    if (variantGroups.length > 0 && formData.stock) {
      const stockValue = parseInt(formData.stock) || 0;
      const updatedCombinations = variantCombinations.map(combo => ({
        ...combo,
        stock: combo.stock || stockValue
      }));
      setVariantCombinations(updatedCombinations);
    }
  }, [formData.stock]);

  // ✅ Auto-set variant price from product price
  useEffect(() => {
    if (variantGroups.length > 0 && formData.price) {
      const priceValue = parseFloat(formData.price) || 0;
      const updatedCombinations = variantCombinations.map(combo => ({
        ...combo,
        price: combo.price || priceValue
      }));
      setVariantCombinations(updatedCombinations);
    }
  }, [formData.price]);

  // Generate combinations when groups change
  useEffect(() => {
    if (variantGroups.length === 0 || !variantGroups.some(g => g.values.length > 0)) {
      setVariantCombinations([]);
      return;
    }

    const groupsWithValues = variantGroups.filter(g => g.values.length > 0);
    if (groupsWithValues.length === 0) {
      setVariantCombinations([]);
      return;
    }

    let combos = [[]];
    groupsWithValues.forEach(group => {
      const next = [];
      combos.forEach(combo => {
        group.values.forEach(value => {
          next.push([...combo, { groupName: group.name, value }]);
        });
      });
      combos = next;
    });

    const defaultStock = parseInt(formData.stock) || 0;
    const defaultPrice = parseFloat(formData.price) || 0;

    const newCombinations = combos.map(combo => {
      const attrs = {};
      const keyParts = [];
      combo.forEach(item => {
        attrs[item.groupName] = item.value.label;
        keyParts.push(item.value.label);
      });
      const key = keyParts.join('__');
      
      const existing = variantCombinations.find(c => c.key === key);
      
      return {
        key,
        attributes: attrs,
        price: existing?.price !== undefined && existing?.price !== '' ? existing.price : defaultPrice,
        stock: existing?.stock !== undefined ? existing.stock : defaultStock,
        image: existing?.image || '',
        color: combo.find(c => c.value.color)?.value?.color || null
      };
    });

    setVariantCombinations(newCombinations);
  }, [variantGroups, formData.stock, formData.price]);

  const handleVariantCombinationChange = (index, field, value) => {
    const updated = [...variantCombinations];
    updated[index] = { ...updated[index], [field]: value };
    setVariantCombinations(updated);
  };

  const addVariantGroup = (type) => {
    const newGroup = {
      id: Date.now(),
      name: type === 'Custom' ? '' : type,
      type: type,
      values: []
    };
    setVariantGroups([...variantGroups, newGroup]);
    setVariantsEnabled(true);
  };

  const removeVariantGroup = (index) => {
    const updated = [...variantGroups];
    updated.splice(index, 1);
    setVariantGroups(updated);
    if (updated.length === 0) {
      setVariantsEnabled(false);
      setVariantCombinations([]);
    }
  };

  const updateVariantGroupName = (index, name) => {
    const updated = [...variantGroups];
    updated[index].name = name;
    setVariantGroups(updated);
  };

  const addVariantValue = (groupIndex) => {
    const group = variantGroups[groupIndex];
    const input = document.getElementById(`vinput-${group.id}`);
    const label = input?.value?.trim();
    if (!label) return;

    const value = { label };
    if (group.type === 'Color') {
      const colorPicker = document.getElementById(`cpicker-${group.id}`);
      if (colorPicker) {
        value.color = colorPicker.value;
      }
    }

    const updated = [...variantGroups];
    updated[groupIndex].values.push(value);
    setVariantGroups(updated);
    if (input) input.value = '';
  };

  const removeVariantValue = (groupIndex, valueIndex) => {
    const updated = [...variantGroups];
    updated[groupIndex].values.splice(valueIndex, 1);
    setVariantGroups(updated);
  };

  const applyStockToAllVariants = () => {
    const stockValue = parseInt(formData.stock) || 0;
    const updated = variantCombinations.map(combo => ({
      ...combo,
      stock: stockValue
    }));
    setVariantCombinations(updated);
  };

  const applyPriceToAllVariants = () => {
    const priceValue = parseFloat(formData.price) || 0;
    const updated = variantCombinations.map(combo => ({
      ...combo,
      price: priceValue
    }));
    setVariantCombinations(updated);
  };

  const toggleVariants = (checked) => {
    setVariantsEnabled(checked);
    if (!checked) {
      setVariantGroups([]);
      setVariantCombinations([]);
    }
  };

  // ✅ Main Image Upload with ImgBB
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
      setFormData({ ...formData, image: event.target.result });
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const url = await uploadToImgBB(file);
      setImageUrl(url);
      setFormData({ ...formData, image: url });
      showToast('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Upload failed: ' + error.message, 'error');
      setImageUrl('');
      setFormData({ ...formData, image: '' });
    }
    setUploadingImage(false);
  };

  const addExtraImage = () => {
    setExtraImages([...extraImages, '']);
  };

  const updateExtraImage = (index, value) => {
    const newImages = [...extraImages];
    newImages[index] = value;
    setExtraImages(newImages);
  };

  const removeExtraImage = (index) => {
    const newImages = [...extraImages];
    newImages.splice(index, 1);
    setExtraImages(newImages);
  };

  // ✅ Fix: Handle spaces and line breaks in description
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      showToast('Please add a main image!', 'warning');
      return;
    }

    setLoading(true);
    try {
      // ✅ Fix: Preserve spaces and line breaks
      let descContent = formData.desc || '';
      
      // Replace empty paragraphs with space (preserve spacing)
      descContent = descContent.replace(/<p><br><\/p>/g, '<p>&nbsp;</p>');
      descContent = descContent.replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');
      
      // Replace multiple spaces with &nbsp; (non-breaking space)
      descContent = descContent.replace(/  /g, ' &nbsp;');
      
      // Preserve line breaks
      descContent = descContent.replace(/\n/g, '<br>');
      
      // Ensure paragraphs have proper spacing
      descContent = descContent.replace(/<p>/g, '<p style="margin-bottom: 1.2em;">');

      const data = {
        name: formData.name,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock) || 0,
        category: formData.category,
        image: formData.image,
        images: [formData.image, ...extraImages].filter(Boolean),
        shortDesc: formData.shortDesc || '',
        desc: descContent, // ✅ Save cleaned content
        hasVariants: variantsEnabled && variantGroups.length > 0 && variantGroups.some(g => g.values.length > 0),
        variants: variantsEnabled && variantGroups.length > 0 && variantGroups.some(g => g.values.length > 0) 
          ? {
              groups: variantGroups,
              combinations: variantCombinations
            }
          : null,
        customTextField: customFieldEnabled ? {
          enabled: true,
          label: document.getElementById('custom-text-label')?.value || 'Custom Text',
          placeholder: document.getElementById('custom-text-placeholder')?.value || '',
          required: document.getElementById('custom-text-required')?.checked || false,
          type: document.getElementById('custom-text-type')?.value || 'text'
        } : null,
        discountPercent: formData.comparePrice && parseFloat(formData.comparePrice) > parseFloat(formData.price) 
          ? Math.round(((parseFloat(formData.comparePrice) - parseFloat(formData.price)) / parseFloat(formData.comparePrice)) * 100) 
          : 0,
        updatedAt: serverTimestamp()
      };

      if (product?.id) {
        await updateDoc(doc(db, 'products', product.id), data);
        showToast('Product updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: serverTimestamp()
        });
        showToast('Product added successfully!', 'success');
      }

      localStorage.removeItem('cached_products');
      localStorage.removeItem('cached_products_time');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error saving product: ' + error.message, 'error');
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
            {product?.id ? 'Edit Product' : 'Add New Product'}
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
          {/* Product Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Price & Compare Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
              {variantGroups.length > 0 && variantCombinations.length > 0 && (
                <button
                  type="button"
                  onClick={applyPriceToAllVariants}
                  style={{
                    marginTop: '4px',
                    fontSize: '0.7rem',
                    color: '#4f46e5',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  <i className="fas fa-sync-alt" style={{ marginRight: '4px' }}></i>
                  Apply price to all variants
                </button>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
                Compare at Price (for discount)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.comparePrice}
                onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
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

          {/* Stock & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
                Stock *
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, stock: val });
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
              {variantGroups.length > 0 && variantCombinations.length > 0 && (
                <button
                  type="button"
                  onClick={applyStockToAllVariants}
                  style={{
                    marginTop: '4px',
                    fontSize: '0.7rem',
                    color: '#4f46e5',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  <i className="fas fa-sync-alt" style={{ marginRight: '4px' }}></i>
                  Apply stock to all variants
                </button>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

          {/* Main Image Upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Main Product Image *
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
            onClick={() => document.getElementById('main-image-input').click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#1A1A1A'; e.currentTarget.style.background = '#fff7ed'; }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa'; }}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith('image/')) {
                const input = document.getElementById('main-image-input');
                const event = { target: { files: [file] } };
                handleMainImageUpload(event);
              }
            }}
            >
              <input
                id="main-image-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleMainImageUpload}
              />
              {uploadingImage ? (
                <div style={{ padding: '20px' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#1A1A1A', display: 'block', marginBottom: '8px' }}></i>
                  <p style={{ color: '#6b7280' }}>Uploading...</p>
                </div>
              ) : imageUrl ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={imageUrl}
                    alt="Main product"
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
                      setImageUrl('');
                      setFormData({ ...formData, image: '' });
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
            <input
              type="text"
              value={formData.image}
              onChange={(e) => {
                setFormData({ ...formData, image: e.target.value });
                setImageUrl(e.target.value);
              }}
              placeholder="Or paste image URL"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.875rem',
                marginTop: '8px'
              }}
            />
          </div>

          {/* Additional Images */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Additional Images
            </label>
            {extraImages.map((url, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updateExtraImage(index, e.target.value)}
                  placeholder="Image URL"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeExtraImage(index)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ef4444',
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addExtraImage}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #6366f1',
                background: 'transparent',
                color: '#6366f1',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <i className="fas fa-plus"></i> Add Image
            </button>
          </div>

          {/* Short Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
              Short Description
            </label>
            <textarea
              rows="2"
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
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

          {/* ✅ Long Description with Quill Editor */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
              Long Description *
            </label>
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'white'
            }}>
              <div
                id="quill-editor"
                style={{
                  minHeight: '200px',
                  maxHeight: '400px',
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

          {/* Custom Text Field */}
          <div style={{
            border: '1px solid #fde68a',
            background: '#fffbeb',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: customFieldEnabled ? '12px' : '0'
            }}>
              <div>
                <h4 style={{ fontWeight: 600, color: '#92400e' }}>
                  <i className="fas fa-pen" style={{ marginRight: '8px', color: '#d97706' }}></i>
                  Custom Text Field
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#92400e' }}>Customer ko custom text enter karne dein</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#92400e' }}>Enable</span>
                <input
                  type="checkbox"
                  checked={customFieldEnabled}
                  onChange={(e) => setCustomFieldEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>
            </div>

            {customFieldEnabled && (
              <div style={{
                borderTop: '1px solid #fde68a',
                paddingTop: '12px',
                marginTop: '12px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#92400e', display: 'block', marginBottom: '4px' }}>
                      Field Label *
                    </label>
                    <input
                      id="custom-text-label"
                      type="text"
                      defaultValue={product?.customTextField?.label || 'Enter Name'}
                      placeholder="e.g. Enter Name..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #fcd34d',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        background: 'white'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#92400e', display: 'block', marginBottom: '4px' }}>
                      Placeholder
                    </label>
                    <input
                      id="custom-text-placeholder"
                      type="text"
                      defaultValue={product?.customTextField?.placeholder || ''}
                      placeholder="e.g. John Smith"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #fcd34d',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        background: 'white'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#92400e' }}>
                    <input id="custom-text-required" type="checkbox" defaultChecked={product?.customTextField?.required || false} />
                    Required
                  </label>
                  <select
                    id="custom-text-type"
                    defaultValue={product?.customTextField?.type || 'text'}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #fcd34d',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      background: 'white'
                    }}
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="number">Number</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Variants Section */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div>
                <h4 style={{ fontWeight: 600 }}>
                  <i className="fas fa-layer-group" style={{ marginRight: '8px', color: '#4f46e5' }}></i>
                  Product Variants
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Color, Size, etc. with separate stock per variant</p>
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: variantsEnabled ? '#111827' : '#6b7280' }}>
                  {variantsEnabled ? 'ON' : 'OFF'}
                </span>
                <div
                  onClick={() => toggleVariants(!variantsEnabled)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    background: variantsEnabled ? '#4f46e5' : '#d1d5db',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    position: 'relative',
                    boxShadow: variantsEnabled ? '0 0 0 3px rgba(26,26,26,0.2)' : 'none'
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'white',
                      position: 'absolute',
                      top: '3px',
                      left: variantsEnabled ? '23px' : '3px',
                      transition: 'all 0.3s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                    }}
                  />
                </div>
              </label>
            </div>

            {variantsEnabled && (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => addVariantGroup('Color')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid #fbcfe8',
                      background: '#fdf2f8',
                      color: '#be185d',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="fas fa-palette"></i> Color
                  </button>
                  <button
                    type="button"
                    onClick={() => addVariantGroup('Size')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid #bfdbfe',
                      background: '#eff6ff',
                      color: '#1e40af',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="fas fa-ruler-combined"></i> Size
                  </button>
                  <button
                    type="button"
                    onClick={() => addVariantGroup('Material')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                      background: '#f0fdf4',
                      color: '#166534',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="fas fa-cube"></i> Material
                  </button>
                  <button
                    type="button"
                    onClick={() => addVariantGroup('Custom')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e9d5ff',
                      background: '#f5f3ff',
                      color: '#6d28d9',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <i className="fas fa-tag"></i> Custom
                  </button>
                </div>

                {variantGroups.map((group, gIdx) => (
                  <div key={group.id} style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '14px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: '#e5e7eb',
                        color: '#374151'
                      }}>
                        {group.type}
                      </span>
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) => updateVariantGroupName(gIdx, e.target.value)}
                        placeholder="Variant label"
                        style={{
                          flex: 1,
                          padding: '4px 10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          background: 'white'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantGroup(gIdx)}
                        style={{
                          color: '#ef4444',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                      {group.values.map((value, vIdx) => (
                        <span key={vIdx} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          fontSize: '0.8rem'
                        }}>
                          {group.type === 'Color' && value.color && (
                            <span style={{
                              display: 'inline-block',
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background: value.color,
                              border: '1px solid #e5e7eb'
                            }}></span>
                          )}
                          {value.label}
                          <button
                            type="button"
                            onClick={() => removeVariantValue(gIdx, vIdx)}
                            style={{
                              color: '#9ca3af',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              padding: '0 2px'
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {group.type === 'Color' && (
                        <input
                          id={`cpicker-${group.id}`}
                          type="color"
                          defaultValue="#3b82f6"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                        />
                      )}
                      <input
                        id={`vinput-${group.id}`}
                        type="text"
                        placeholder={group.type === 'Color' ? 'Color name' : 'Add option...'}
                        style={{
                          flex: 1,
                          minWidth: '120px',
                          padding: '6px 10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          background: 'white'
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addVariantValue(gIdx);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => addVariantValue(gIdx)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#4f46e5',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}
                      >
                        <i className="fas fa-plus"></i> Add
                      </button>
                    </div>
                  </div>
                ))}

                {variantCombinations.length > 0 && (
                  <div style={{
                    marginTop: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '10px 14px',
                      background: '#f9fafb',
                      borderBottom: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h5 style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        <i className="fas fa-table" style={{ marginRight: '6px', color: '#4f46e5' }}></i>
                        Variant Combinations ({variantCombinations.length})
                      </h5>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          Price: {formData.price || 0} | Stock: {formData.stock || 0}
                        </span>
                        <button
                          type="button"
                          onClick={applyPriceToAllVariants}
                          style={{
                            fontSize: '0.7rem',
                            color: '#4f46e5',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            marginRight: '4px'
                          }}
                          title="Apply product price to all variants"
                        >
                          <i className="fas fa-sync-alt"></i> Price
                        </button>
                        <button
                          type="button"
                          onClick={applyStockToAllVariants}
                          style={{
                            fontSize: '0.7rem',
                            color: '#4f46e5',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          title="Apply product stock to all variants"
                        >
                          <i className="fas fa-sync-alt"></i> Stock
                        </button>
                      </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.8rem'
                      }}>
                        <thead style={{ background: '#f9fafb' }}>
                          <tr>
                            {variantGroups.filter(g => g.values.length > 0).map((group, idx) => (
                              <th key={idx} style={{
                                padding: '8px 10px',
                                textAlign: 'left',
                                fontWeight: 600,
                                color: '#374151',
                                borderBottom: '1px solid #e5e7eb'
                              }}>
                                {group.name}
                              </th>
                            ))}
                            <th style={{
                              padding: '8px 10px',
                              textAlign: 'left',
                              fontWeight: 600,
                              color: '#374151',
                              borderBottom: '1px solid #e5e7eb'
                            }}>Price</th>
                            <th style={{
                              padding: '8px 10px',
                              textAlign: 'left',
                              fontWeight: 600,
                              color: '#374151',
                              borderBottom: '1px solid #e5e7eb'
                            }}>Stock</th>
                            <th style={{
                              padding: '8px 10px',
                              textAlign: 'left',
                              fontWeight: 600,
                              color: '#374151',
                              borderBottom: '1px solid #e5e7eb'
                            }}>Image</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variantCombinations.map((combo, idx) => {
                            const groupsWithValues = variantGroups.filter(g => g.values.length > 0);
                            return (
                              <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                {groupsWithValues.map((group) => (
                                  <td key={group.id} style={{ padding: '8px 10px' }}>
                                    {group.type === 'Color' && combo.color && (
                                      <span style={{
                                        display: 'inline-block',
                                        width: '14px',
                                        height: '14px',
                                        borderRadius: '50%',
                                        background: combo.color,
                                        border: '1px solid #e5e7eb',
                                        marginRight: '4px',
                                        verticalAlign: 'middle'
                                      }}></span>
                                    )}
                                    {combo.attributes?.[group.name] || ''}
                                  </td>
                                ))}
                                <td style={{ padding: '8px 10px' }}>
                                  <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    value={combo.price !== undefined && combo.price !== '' ? combo.price : (formData.price || 0)}
                                    onChange={(e) => handleVariantCombinationChange(idx, 'price', e.target.value)}
                                    style={{
                                      width: '80px',
                                      padding: '4px 6px',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '4px',
                                      fontSize: '0.8rem'
                                    }}
                                  />
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="Stock"
                                    value={combo.stock !== undefined ? combo.stock : (formData.stock || 0)}
                                    onChange={(e) => handleVariantCombinationChange(idx, 'stock', parseInt(e.target.value) || 0)}
                                    style={{
                                      width: '70px',
                                      padding: '4px 6px',
                                      border: '1px solid #e5e7eb',
                                      borderRadius: '4px',
                                      fontSize: '0.8rem'
                                    }}
                                  />
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {combo.image && (
                                      <img
                                        src={combo.image}
                                        alt="Variant"
                                        style={{
                                          width: '32px',
                                          height: '32px',
                                          objectFit: 'cover',
                                          borderRadius: '4px',
                                          border: '1px solid #e5e7eb'
                                        }}
                                      />
                                    )}
                                    <input
                                      type="text"
                                      placeholder="URL"
                                      value={combo.image || ''}
                                      onChange={(e) => handleVariantCombinationChange(idx, 'image', e.target.value)}
                                      style={{
                                        width: '100px',
                                        padding: '4px 6px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem'
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage || !quillLoaded}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: '#1A1A1A',
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
            {loading ? 'Saving...' : uploadingImage ? 'Uploading Image...' : !quillLoaded ? 'Loading Editor...' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;