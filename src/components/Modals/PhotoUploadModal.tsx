import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, Check, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl: string;
  onSavePhoto: (newUrl: string) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  onSavePhoto,
}) => {
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl);
  const [urlInput, setUrlInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
          sound.playHover();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    sound.playHeartChime();
    onSavePhoto(previewUrl);
    onClose();
  };

  const handleResetToEditorial = () => {
    sound.playHover();
    setPreviewUrl('/images/shuttu_photo_editorial.jpg');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(18, 2, 5, 0.82)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '36px',
          borderRadius: '24px',
          background: 'rgba(56, 8, 18, 0.92)',
          border: '1.5px solid rgba(247, 214, 208, 0.3)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--color-blush-200)',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="atelier-label" style={{ marginBottom: '8px' }}>
            IMAGE_PLACEHOLDER_ID: "shuttu_photo"
          </div>
          <h3 className="editorial-title" style={{ fontSize: '26px', color: '#FFFFFF' }}>
            Customize Muse Portrait
          </h3>
          <p style={{ fontSize: '13px', color: 'rgba(247, 214, 208, 0.7)', marginTop: '4px' }}>
            Drop in your favourite photo of Shuttu to make this completely personal.
          </p>
        </div>

        {/* Live Preview & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 10',
            maxHeight: '280px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: isDragOver
              ? '2px dashed #FFFFFF'
              : '1.5px dashed rgba(247, 214, 208, 0.4)',
            background: 'rgba(26, 3, 7, 0.6)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 25%',
            }}
          />

          {/* Hover instruction overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(42, 5, 13, 0.65)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#FFFFFF',
              opacity: isDragOver ? 1 : 0.88,
              transition: 'opacity 0.2s',
            }}
          >
            <Upload size={28} color="#F7D6D0" />
            <span style={{ fontSize: '13px', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
              Click or drag photo here to replace
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(247, 214, 208, 0.6)' }}>
              Supports JPG, PNG, WEBP
            </span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        {/* Or Paste URL */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '11px',
              color: '#F7D6D0',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Or Enter Image Web URL:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="https://example.com/photo.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(26, 3, 7, 0.7)',
                border: '1px solid rgba(247, 214, 208, 0.25)',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => {
                if (urlInput.trim()) {
                  setPreviewUrl(urlInput.trim());
                  sound.playHover();
                }
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'rgba(247, 214, 208, 0.15)',
                border: '1px solid rgba(247, 214, 208, 0.3)',
                color: '#FFFFFF',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleResetToEditorial}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 18px',
              borderRadius: '9999px',
              background: 'transparent',
              border: '1px solid rgba(247, 214, 208, 0.25)',
              color: 'var(--color-blush-200)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            <span>Reset Default</span>
          </button>

          <button
            onClick={handleSave}
            className="btn-pill-white"
            style={{
              flex: 1,
              padding: '12px 24px',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <Check size={14} />
            <span>Confirm & Update Hero</span>
          </button>
        </div>
      </div>
    </div>
  );
};
