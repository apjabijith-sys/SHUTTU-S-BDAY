import React from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import { MemoryItem } from '../Sections/CollectionsSection';

interface CollectionModalProps {
  item: MemoryItem | null;
  onClose: () => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(18, 2, 5, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '840px',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'rgba(42, 5, 13, 0.95)',
          border: '1.5px solid rgba(247, 214, 208, 0.3)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
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
            background: 'rgba(26, 3, 7, 0.6)',
            border: '1px solid rgba(247, 214, 208, 0.3)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={18} />
        </button>

        {/* Left Column: Image */}
        <div style={{ position: 'relative', height: '100%', minHeight: '380px' }}>
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: item.objectPosition || 'center center',
              display: 'block',
            }}
          />
        </div>

        {/* Right Column: Editorial Details */}
        <div
          style={{
            padding: '44px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div className="atelier-label" style={{ marginBottom: '12px' }}>
            {item.tag}
          </div>

          <h3
            className="editorial-title"
            style={{
              fontSize: '34px',
              fontWeight: 400,
              color: '#FFFFFF',
              marginBottom: '6px',
            }}
          >
            {item.title}
          </h3>

          <div
            style={{
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              color: '#F7D6D0',
              letterSpacing: '0.06em',
              marginBottom: '24px',
            }}
          >
            {item.subtitle}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'rgba(251, 247, 245, 0.8)',
              fontWeight: 300,
              marginBottom: '32px',
            }}
          >
            {item.description}
          </p>

          <div
            style={{
              borderTop: '1px solid rgba(247, 214, 208, 0.15)',
              paddingTop: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              letterSpacing: '0.14em',
              color: 'rgba(247, 214, 208, 0.6)',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={12} color="#F7D6D0" />
            <span>Our Exclusive Memories</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .glass-panel {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
