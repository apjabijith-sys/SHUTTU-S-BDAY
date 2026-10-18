import React from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(18, 2, 5, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          padding: '48px 40px',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, #fdfbf7 0%, #f7ede6 100%)',
          color: '#34080e',
          position: 'relative',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(230, 190, 175, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
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
            color: '#701b28',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          <X size={20} />
        </button>

        {/* Wax Seal Accent at Top */}
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #851624 0%, #4a0711 100%)',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 18px rgba(74, 14, 23, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Heart size={20} fill="#f7d6d0" color="#f7d6d0" />
        </div>

        {/* Monogram / Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#851624',
              marginBottom: '6px',
            }}
          >
            CONFIDENTIAL • FOR SHUTTU
          </div>
          <h2
            className="editorial-title"
            style={{
              fontSize: '34px',
              color: '#380812',
              fontWeight: 400,
            }}
          >
            Dearest Shuttu,
          </h2>
        </div>

        {/* Letter Body */}
        <div
          className="font-serif"
          style={{
            fontSize: '18px',
            lineHeight: 1.8,
            color: '#420b15',
            letterSpacing: '0.01em',
            textAlign: 'left',
            marginBottom: '32px',
          }}
        >
          <p style={{ marginBottom: '16px' }}>
            Hey my love its been almost 1 year since we are together we had a lot of fights between us not because we dont love each other but only because we care for each other and I love you so much more than anything in this world and you are my first and foremost priority.
          </p>
          <p style={{ marginBottom: '16px' }}>
            I am so lucky to have you in my life and you make every moment of life feel better and thank you for all the love care and every little happiness you give me and I am so grateful that you came into my life.
          </p>
          <p>
            And really love you so so so so much my dear baby, shuttumii, love, wifey, mommy and my everything wishing you all the happiness and Happy birthday my love 💙💋
          </p>
        </div>

        {/* Signature */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid rgba(112, 27, 40, 0.2)',
            paddingTop: '20px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.18em',
                color: '#851624',
                textTransform: 'uppercase',
              }}
            >
              OCTOBER 19 • FOREVER YOURS
            </div>
          </div>
          <div
            className="editorial-italic font-serif"
            style={{
              fontSize: '28px',
              color: '#4a0711',
              fontWeight: 400,
            }}
          >
            With all my love, Soyabean
          </div>
        </div>
      </div>
    </div>
  );
};
