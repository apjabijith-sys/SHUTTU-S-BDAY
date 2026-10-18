import React, { useState } from 'react';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface SignatureInstallationProps {
  onOpenLetter: () => void;
}

export const SignatureInstallation: React.FC<SignatureInstallationProps> = ({ onOpenLetter }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="signature-wishes"
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        overflow: 'hidden',
        background: '#1a0307',
      }}
    >
      {/* Background Floral Installation Image with Subtle Parallax */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/floral_installation_1792255720565.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'brightness(0.72) contrast(1.15)',
          transform: isHovered ? 'scale(1.04)' : 'scale(1.0)',
          transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Dark Velvet Scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(56, 8, 18, 0.45) 0%, rgba(26, 3, 7, 0.88) 100%)',
        }}
      />

      {/* Centered Floating Frosted Glass Tile Card (matching reference design) */}
      <div
        onMouseEnter={() => {
          sound.playHover();
          setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          zIndex: 5,
          width: '90%',
          maxWidth: '560px',
          padding: '52px 40px',
          borderRadius: '26px',
          textAlign: 'center',
          background: 'rgba(56, 8, 18, 0.65)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1.5px solid rgba(247, 214, 208, 0.28)',
          boxShadow: '0 40px 90px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Subtle Decorative Pill Label */}
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#F7D6D0',
            marginBottom: '16px',
            opacity: 0.9,
          }}
        >
          ✦ SPECIAL BIRTHDAY EDITION ✦
        </div>

        {/* Serif Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-melodrame)',
            fontSize: 'clamp(42px, 5.2vw, 64px)',
            fontWeight: 400,
            lineHeight: 1.16,
            marginBottom: '18px',
            color: '#FFFFFF',
            letterSpacing: '0.01em',
          }}
        >
          <span>The Birthday</span> <br />
          <span style={{ color: '#F7D6D0', fontFamily: 'var(--font-melodrame)' }}>
            Edit
          </span>
        </h2>

        {/* Romantic Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            lineHeight: 1.7,
            color: 'rgba(251, 247, 245, 0.8)',
            maxWidth: '420px',
            margin: '0 auto 34px',
            fontWeight: 300,
          }}
        >
          A confidential handwritten devotion sealed with wax and pure love, crafted specifically for this milestone day.
        </p>

        {/* Pill Button */}
        <button
          onClick={() => {
            sound.playHeartChime();
            onOpenLetter();
          }}
          className="btn-pill-white"
          style={{
            padding: '14px 34px',
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
          onMouseEnter={() => sound.playHover()}
        >
          <span>Read Birthday Letter</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};
