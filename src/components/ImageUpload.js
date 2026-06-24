import { useState } from 'react';

function ImageUpload({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setError('Image is too large. Max size is 4MB');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(',')[1];
        const fileName = file.name;

        // Call your API endpoint
        const response = await fetch('/api/upload-product-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName,
            contentType: file.type,
            base64
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        setProgress(100);
        setUploading(false);

        // Call the callback with the uploaded image URL
        if (onImageUploaded) {
          onImageUploaded(data.url);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image');
      setUploading(false);
    }
  };

  return (
    <div style={{
      border: '2px dashed #e8e8f0',
      borderRadius: '12px',
      padding: '40px 20px',
      textAlign: 'center',
      background: '#fafafa',
      transition: 'all 0.3s'
    }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="image-upload-input"
      />
      <label
        htmlFor="image-upload-input"
        style={{
          display: 'block',
          cursor: 'pointer',
          padding: '20px'
        }}
      >
        <i className="fas fa-cloud-upload-alt" style={{
          fontSize: '3rem',
          color: '#FF6B35',
          display: 'block',
          marginBottom: '12px'
        }}></i>
        <p style={{ fontWeight: 600, color: '#1a1a2e' }}>
          {uploading ? 'Uploading...' : 'Click or drag to upload image'}
        </p>
        <p style={{ fontSize: '0.85rem', color: '#4a4a68', marginTop: '4px' }}>
          PNG, JPG, WEBP • Max 4MB
        </p>
      </label>

      {uploading && (
        <div style={{
          marginTop: '16px',
          background: '#f0f0f0',
          borderRadius: '8px',
          height: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#FF6B35',
            transition: 'width 0.3s',
            borderRadius: '8px'
          }}></div>
        </div>
      )}

      {error && (
        <p style={{
          marginTop: '12px',
          color: '#ef4444',
          fontSize: '0.85rem'
        }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </p>
      )}
    </div>
  );
}

export default ImageUpload;