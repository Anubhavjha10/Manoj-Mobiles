import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const PremiumImageUpload = ({ value, onChange, onUploadError, folder = 'general' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'url'
  const [urlInput, setUrlInput] = useState(value || '');
  const [localPreview, setLocalPreview] = useState(null);
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
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      if (onUploadError) onUploadError("Please select a valid image file.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      if (onUploadError) onUploadError("File size exceeds 25MB limit.");
      return;
    }
    
    // Create instant local preview object URL
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setIsUploading(true);

    try {
      const secureUrl = await adminService.uploadImage(file, folder);
      const url = typeof secureUrl === 'string' ? secureUrl : (secureUrl?.data || secureUrl?.url || secureUrl?.secure_url || '');
      if (url) {
        onChange(url);
        setUrlInput(url);
      } else {
        throw new Error("Invalid URL returned from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setLocalPreview(null);
      if (onUploadError) onUploadError("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setLocalPreview(null);
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
    setLocalPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activeImage = value || localPreview;

  // If we have an active image (either uploaded or local preview), show the preview and hide the dropzone!
  if (activeImage) {
    return (
      <div style={{ position: 'relative', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F8FAFC', padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={activeImage} 
            alt="Preview" 
            style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', opacity: isUploading ? 0.6 : 1 }} 
            onError={(e) => { e.target.src = 'https://placehold.co/400x400/F1F5F9/94A3B8?text=Invalid+Image'; }}
          />
          {isUploading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', gap: '0.5rem' }}>
              <Loader2 size={32} className="lucide-spin" style={{ animation: 'spin 1s linear infinite', color: '#3B82F6' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E40AF' }}>Uploading to Cloud...</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '0.5rem', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isUploading ? '#3B82F6' : '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>
            {isUploading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />} 
            {isUploading ? 'Uploading...' : 'Uploaded Successfully'}
          </div>
          <button 
            type="button" 
            onClick={clearImage}
            disabled={isUploading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer' }}
          >
            <X size={12} /> Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      
      {/* Mode Switcher */}
      <div style={{ display: 'flex', background: '#F1F5F9', padding: '0.25rem', borderRadius: '8px', width: 'max-content' }}>
        <button 
          type="button"
          onClick={() => setInputMode('upload')}
          style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', borderRadius: '6px', background: inputMode === 'upload' ? '#FFFFFF' : 'transparent', color: inputMode === 'upload' ? '#0F172A' : '#64748B', boxShadow: inputMode === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <UploadCloud size={14} /> Upload File
        </button>
        <button 
          type="button"
          onClick={() => setInputMode('url')}
          style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', borderRadius: '6px', background: inputMode === 'url' ? '#FFFFFF' : 'transparent', color: inputMode === 'url' ? '#0F172A' : '#64748B', boxShadow: inputMode === 'url' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <LinkIcon size={14} /> Link URL
        </button>
      </div>

      {inputMode === 'upload' ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? '#3B82F6' : '#CBD5E1'}`,
            borderRadius: '12px',
            backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.05)' : '#F8FAFC',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#3B82F6', gap: '0.75rem' }}>
              <Loader2 size={32} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748B', gap: '0.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                <UploadCloud size={24} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Click to upload <span style={{ fontWeight: 400 }}>or drag and drop</span>
                </span>
                <span style={{ fontSize: '0.75rem' }}>PNG, JPG, WEBP or GIF (max. 5MB)</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="url" 
            placeholder="https://example.com/image.png" 
            className="form-input" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
