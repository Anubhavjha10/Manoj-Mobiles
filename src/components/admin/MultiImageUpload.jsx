import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, ImagePlus, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const MultiImageUpload = ({ value = [], onChange, onUploadError, folder = 'products' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]); // Array of { id, file, preview, progress }
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const processFiles = async (files) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        if (onUploadError) onUploadError(`File ${file.name} is not a valid image.`);
        return false;
      }
      if (file.size > 25 * 1024 * 1024) {
        if (onUploadError) onUploadError(`File ${file.name} exceeds 25MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newUploads = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploads]);

    const successfulUrls = [];
    for (const upload of newUploads) {
      try {
        const secureUrl = await adminService.uploadImage(upload.file, folder);
        const url = typeof secureUrl === 'string' ? secureUrl : (secureUrl?.data || secureUrl?.url || secureUrl?.secure_url || '');
        
        if (url) {
          successfulUrls.push(url);
          setUploadingFiles(prev => prev.filter(u => u.id !== upload.id));
        } else {
          throw new Error("Invalid URL returned");
        }
      } catch (error) {
        console.error("Upload error for", upload.file.name, error);
        setUploadingFiles(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'error' } : u));
        if (onUploadError) onUploadError(`Failed to upload ${upload.file.name}`);
      }
    }
    
    if (successfulUrls.length > 0) {
      onChange([...(value || []), ...successfulUrls]);
    }
  };

  const removeImage = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const removeUploading = (idToRemove) => {
    setUploadingFiles(prev => prev.filter(u => u.id !== idToRemove));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Dropzone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#3B82F6' : '#CBD5E1'}`,
          backgroundColor: isDragging ? '#EFF6FF' : '#F8FAFC',
          borderRadius: '12px',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minHeight: '160px'
        }}
      >
        <div style={{ 
          width: '48px', height: '48px', 
          backgroundColor: isDragging ? '#DBEAFE' : '#F1F5F9',
          color: isDragging ? '#2563EB' : '#64748B',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}>
          <ImagePlus size={24} />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
            Click or drag multiple images here
          </p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
            Supports JPG, PNG, WEBP (Max 25MB each)
          </p>
        </div>
        
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*"
          multiple
        />
      </div>

      {/* Gallery Grid */}
      {(value?.length > 0 || uploadingFiles.length > 0) && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
          gap: '1rem',
          marginTop: '0.5rem'
        }}>
          
          {/* Uploaded Images */}
          {value?.map((url, index) => (
            <div key={index} style={{ 
              position: 'relative', 
              aspectRatio: '1', 
              borderRadius: '8px', 
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              backgroundColor: '#fff',
              group: 'true'
            }} className="multi-image-card">
              <img 
                src={url} 
                alt={`Product image ${index + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                style={{
                  position: 'absolute',
                  top: '0.25rem',
                  right: '0.25rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#EF4444',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <X size={14} strokeWidth={3} />
              </button>
              <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.25rem',
                  textAlign: 'center'
              }}>
                {index === 0 ? 'Primary' : `Image ${index + 1}`}
              </div>
            </div>
          ))}

          {/* Uploading Images */}
          {uploadingFiles.map(upload => (
            <div key={upload.id} style={{ 
              position: 'relative', 
              aspectRatio: '1', 
              borderRadius: '8px', 
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC'
            }}>
              <img 
                src={upload.preview} 
                alt="Uploading..." 
                style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.5 }} 
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.6)'
              }}>
                {upload.status === 'uploading' ? (
                  <Loader2 size={24} className="lucide-spin" style={{ animation: 'spin 1s linear infinite', color: '#3B82F6' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '0.25rem' }}>
                    <p style={{ color: '#EF4444', fontSize: '0.7rem', fontWeight: 600, margin: '0 0 0.25rem' }}>Failed</p>
                    <button 
                      type="button"
                      onClick={() => removeUploading(upload.id)}
                      style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', border: '1px solid #EF4444', color: '#EF4444', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};
