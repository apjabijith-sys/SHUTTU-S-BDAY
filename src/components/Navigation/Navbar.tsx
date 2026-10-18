import React, { useState } from 'react';
import { Heart, Volume2, VolumeX, Lock, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface NavbarProps {
  onReLock?: () => void;
  onOpenLoveLetter?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReLock, onOpenLoveLetter }) => {
  const [loveCount, setLoveCount] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    sound.playHeartChime();
    setLoveCount((prev) => prev + 1);
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 400);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 18,
      spread: 45,
      origin: { x, y },
      colors: ['#F7D6D0', '#FFFFFF', '#942534'],
      scalar: 0.7,
      ticks: 70,
    });
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const scrollToSection = (id: string) => {
    sound.playHover();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'linear-gradient(180deg, rgba(42, 5, 13, 0.88) 0%, rgba(42, 5, 13, 0.0) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="atelier-container"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
      {/* Left Monogram / Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <a
          href="#"
          style={{
            textDecoration: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            FOR SHUTTU
          </span>
        </a>
      </div>

      {/* Right Navigation Links & Interactive Controls */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <button
          onClick={() => scrollToSection('scratch-card')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'opacity 0.2s, color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
          onMouseEnter={(e) => {
            sound.playHover();
            e.currentTarget.style.color = '#FFD700';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-cream)';
            e.currentTarget.style.opacity = '0.9';
          }}
        >
          <Sparkles size={12} color="#FFD700" />
          <span>Prizes</span>
        </button>

        <button
          onClick={() => scrollToSection('memories')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            sound.playHover();
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-cream)';
            e.currentTarget.style.opacity = '0.85';
          }}
        >
          Memories
        </button>

        <button
          onClick={() => scrollToSection('favourites')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            sound.playHover();
            e.currentTarget.style.color = '#FFD700';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-cream)';
            e.currentTarget.style.opacity = '0.85';
          }}
        >
          Favourites
        </button>

        <button
          onClick={() => {
            if (onOpenLoveLetter) onOpenLoveLetter();
            else scrollToSection('signature-wishes');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            sound.playHover();
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-cream)';
            e.currentTarget.style.opacity = '0.85';
          }}
        >
          Wishes
        </button>

        <button
          onClick={() => scrollToSection('philosophy')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            sound.playHover();
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-cream)';
            e.currentTarget.style.opacity = '0.85';
          }}
        >
          Our Story
        </button>

        <button
          onClick={() => scrollToSection('forever-agreement')}
          style={{
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '9999px',
            padding: '5px 12px',
            color: '#FFD700',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            sound.playHover();
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.3)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
            e.currentTarget.style.transform = 'scale(1.0)';
          }}
        >
          📜 Agreement
        </button>

        <button
          onClick={() => {
            sound.playHappyBirthday();
            confetti({
              particleCount: 85,
              spread: 120,
              origin: { y: 0.5 },
              colors: ['#FFD700', '#E11D48', '#FF69B4', '#FFFFFF', '#F7D6D0'],
              scalar: 1.2,
            });
          }}
          title="Play Happy Birthday Music Box & Fireworks"
          style={{
            background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.25) 0%, rgba(212, 175, 55, 0.25) 100%)',
            border: '1px solid rgba(255, 184, 198, 0.5)',
            borderRadius: '9999px',
            padding: '5px 12px',
            color: '#FFFFFF',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
          onMouseEnter={(e) => {
            sound.playHover();
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1.0)';
          }}
        >
          <span>🎂 Melody</span>
        </button>

        {/* Delicate Heart Icon with counter */}
        <button
          onClick={handleHeartClick}
          aria-label="Send Love"
          title="Send Shuttu Love"
          style={{
            background: 'rgba(247, 214, 208, 0.08)',
            border: '1px solid rgba(247, 214, 208, 0.25)',
            borderRadius: '9999px',
            padding: '7px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            color: '#F7D6D0',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            transform: isHeartAnimating ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <Heart
            size={15}
            fill="#F7D6D0"
            color="#F7D6D0"
            style={{
              transition: 'transform 0.2s ease',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            {loveCount}
          </span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          title={isMuted ? 'Sound muted' : 'Sound enabled'}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(247, 214, 208, 0.7)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            transition: 'color 0.2s',
          }}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Relock Button for Testing */}
        {onReLock && (
          <button
            onClick={onReLock}
            aria-label="Re-lock Screen"
            title="Lock screen again"
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(247, 214, 208, 0.45)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F7D6D0')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(247, 214, 208, 0.45)')}
          >
            <Lock size={15} />
          </button>
        )}
      </nav>
      </div>
    </header>
  );
};
