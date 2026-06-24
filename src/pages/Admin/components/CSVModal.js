import { useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function CSVModal({ onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState([]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      processFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        alert('CSV file is empty or invalid');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      if (!headers.includes('name') || !headers.includes('price') || !headers.includes('image')) {
        alert('CSV must contain name, price, and image columns');
        return;
      }

      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] || '';
        });
        rows.push(row);
      }
      setPreview(rows.slice(0, 5));
    };
    reader.readAsText(file);
  };

  const uploadProducts = async () => {
    if (!file) return;

    setUploading(true);
    setStatus([]);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const total = lines.length - 1;
      let success = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] || '';
        });

        try {
          const extraImages = row.images ? row.images.split('|').map(u => u.trim()).filter(Boolean) : [];
          await addDoc(collection(db, 'products'), {
            name: row.name,
            price: parseFloat(row.price) || 0,
            comparePrice: row.compareprice ? parseFloat(row.compareprice) : null,
            stock: parseInt(row.stock) || 0,
            category: row.category || '',
            image: row.image || '',
            images: [row.image, ...extraImages].filter(Boolean),
            shortDesc: row.shortdesc || '',
            desc: row.desc || '',
            tags: row.tags ? row.tags.split('|').map(t => t.trim()).filter(Boolean) : [],
            hasVariants: false,
            variants: null,
            customTextField: null,
            discountPercent: row.compareprice && parseFloat(row.compareprice) > parseFloat(row.price) 
              ? Math.round(((parseFloat(row.compareprice) - parseFloat(row.price)) / parseFloat(row.compareprice)) * 100) 
              : 0,
            createdAt: serverTimestamp()
          });
          success++;
          setProgress((i / total) * 100);
          setStatus(prev => [...prev, { name: row.name, status: 'success' }]);
        } catch (error) {
          setStatus(prev => [...prev, { name: row.name, status: 'error', error: error.message }]);
        }
      }

      localStorage.removeItem('cached_products');
      localStorage.removeItem('cached_products_time');
      setUploading(false);
      onImport();
      setTimeout(onClose, 2000);
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const headers = ['name', 'price', 'comparePrice', 'stock', 'category', 'image', 'images', 'shortDesc', 'desc', 'tags'];
    const rows = [
      ['Classic White T-Shirt', '29.99', '49.99', '100', 'Clothing', 'https://i.ibb.co/example/shirt.jpg', 'https://i.ibb.co/example/shirt2.jpg|https://i.ibb.co/example/shirt3.jpg', 'Premium cotton t-shirt', 'Made from 100% organic cotton.', 'tshirt|clothing']
    ];

    const escape = (value) => {
      const str = String(value || '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    let csv = headers.map(escape).join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(escape).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ismora_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 400,
      padding: '16px'
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget && !uploading) onClose();
    }}
    >
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-file-csv" style={{ color: '#7c3aed', marginRight: '8px' }}></i>
              CSV Bulk Import
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
              Bulk products upload karo
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            style={{
              fontSize: '2rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.5 : 1
            }}
          >
            ×
          </button>
        </div>

        {/* Step 1: Download Sample */}
        <div style={{
          background: '#eef2ff',
          border: '1px solid #c7d2fe',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#c7d2fe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontWeight: 700, color: '#4f46e5' }}>1</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 600, color: '#3730a3', marginBottom: '4px' }}>Sample CSV Download Karo</h3>
              <p style={{ fontSize: '0.875rem', color: '#4338ca', marginBottom: '12px' }}>
                Pehle template download karo, fill karo, phir upload karo.
              </p>
              <button
                onClick={downloadSample}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#4f46e5',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                <i className="fas fa-download"></i>
                Download Sample
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Upload CSV */}
        <div style={{
          background: '#f5f3ff',
          border: '1px solid #ddd6fe',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#ddd6fe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontWeight: 700, color: '#7c3aed' }}>2</span>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 600, color: '#6d28d9', marginBottom: '4px' }}>CSV Upload Karo</h3>
              <div
                style={{
                  border: '2px dashed #c7d2fe',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: '#f5f7ff'
                }}
                onClick={() => document.getElementById('csv-file-input').click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#4f46e5';
                  e.currentTarget.style.background = '#eef2ff';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = '#c7d2fe';
                  e.currentTarget.style.background = '#f5f7ff';
                }}
                onDrop={handleFileDrop}
              >
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#a78bfa', display: 'block', marginBottom: '8px' }}></i>
                <p style={{ color: '#7c3aed', fontWeight: 500, marginBottom: '4px' }}>CSV file drag karo ya click karo</p>
                <p style={{ color: '#8b5cf6', fontSize: '0.75rem' }}>Sirf .csv files</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {preview.length > 0 && !uploading && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 600 }}>
                <span id="csv-row-count">{preview.length}</span> products
              </h3>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview([]);
                }}
                style={{
                  fontSize: '0.75rem',
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-times"></i> Remove
              </button>
            </div>
            <div style={{
              overflowX: 'auto',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.75rem'
              }}>
                <thead>
                  <tr>
                    {Object.keys(preview[0] || {}).slice(0, 6).map(key => (
                      <th key={key} style={{
                        padding: '8px 10px',
                        background: '#f1f5f9',
                        textAlign: 'left',
                        fontWeight: 600,
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        whiteSpace: 'nowrap'
                      }}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).slice(0, 6).map((val, vIdx) => (
                        <td key={vIdx} style={{
                          padding: '7px 10px',
                          border: '1px solid #e2e8f0',
                          color: '#334155',
                          maxWidth: '140px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {val || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={uploadProducts}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: '#FF6B35',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1,
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <i className="fas fa-upload"></i>
              Upload ({preview.length} products)
            </button>
          </div>
        )}

        {/* Progress */}
        {uploading && (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>
                <span>Uploading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div style={{
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '99px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                  borderRadius: '99px',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            </div>
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {status.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  background: item.status === 'success' ? '#dcfce7' : '#fee2e2',
                  color: item.status === 'success' ? '#166534' : '#991b1b'
                }}>
                  <i className={`fas ${item.status === 'success' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                  <span>{item.name}</span>
                  {item.error && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>{item.error}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CSVModal;