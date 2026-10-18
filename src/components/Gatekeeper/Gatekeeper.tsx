import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { Lock, Sparkles, KeyRound, Heart } from 'lucide-react';

interface GatekeeperProps {
  onUnlock: () => void;
}

export const Gatekeeper: React.FC<GatekeeperProps> = ({ onUnlock }) => {
  const [passphrase, setPassphrase] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Grand Multi-Cannon Fireworks Display
  const triggerFireworks = () => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 38, spread: 360, ticks: 85, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    // 1. Initial Grand Blooming Burst in center
    confetti({
      particleCount: 110,
      spread: 140,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#FFD700', '#E11D48', '#FF69B4', '#FFFFFF', '#F7D6D0', '#C084FC'],
      scalar: 1.35,
      ticks: 120,
      zIndex: 10000,
    });

    // 2. Continuous multi-cannon bursts across the sky for 5 seconds
    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 45 * (timeLeft / duration);

      // Left aerial burst
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.12, 0.35), y: randomInRange(0.15, 0.45) },
        colors: ['#FFD700', '#E11D48', '#FF85A2', '#F7D6D0', '#FFFFFF'],
        scalar: 1.2,
      });

      // Right aerial burst
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.65, 0.88), y: randomInRange(0.15, 0.45) },
        colors: ['#FFD700', '#FF3366', '#FFB8C6', '#FFFFFF', '#AA771C'],
        scalar: 1.2,
      });

      // High center starburst
      if (Math.random() > 0.45) {
        confetti({
          ...defaults,
          particleCount: 35,
          origin: { x: randomInRange(0.42, 0.58), y: randomInRange(0.1, 0.3) },
          colors: ['#FFD700', '#FFFFFF', '#E11D48', '#FFDF70'],
          scalar: 1.45,
          shapes: ['circle'],
        });
      }
    }, 240);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDissolving) return;

    const normalized = passphrase.trim().toLowerCase();

    if (normalized === 'shunda') {
      // SUCCESS! Play Happy Birthday music & fireworks animation
      setErrorMessage('');
      setIsDissolving(true);
      sound.playHappyBirthday();
      sound.playUnlockChime();
      triggerFireworks();

      // Allow the dissolve and fireworks show to bloom across the screen
      setTimeout(() => {
        onUnlock();
      }, 950);
    } else {
      // INCORRECT
      sound.playError();
      setIsShaking(true);
      setErrorMessage('Try again, sweetheart.');

      // Clear shake class after animation completes
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(26, 3, 7, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease',
        opacity: isDissolving ? 0 : 1,
        transform: isDissolving ? 'scale(1.08)' : 'scale(1)',
        filter: isDissolving ? 'blur(12px)' : 'none',
        pointerEvents: isDissolving ? 'none' : 'auto',
      }}
    >
      {/* Central Frosted Glass Panel */}
      <div
        className={`glass-panel ${isShaking ? 'animate-shake' : ''}`}
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '48px 36px',
          borderRadius: '24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(56, 8, 18, 0.72)',
          border: '1px solid rgba(247, 214, 208, 0.28)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
        }}
      >
        {/* Decorative Top Accent Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(247, 214, 208, 0.8), transparent)',
          }}
        />

        {/* Subtle Icon Badge */}
        <div
          style={{
            width: '44px',
            height: '44px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            background: 'rgba(247, 214, 208, 0.08)',
            border: '1px solid rgba(247, 214, 208, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F7D6D0',
          }}
        >
          <Lock size={18} strokeWidth={1.75} />
        </div>

        {/* Subtle Uppercase Label */}
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#F7D6D0',
            opacity: 0.85,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>✦ SPECIAL ACCESS ✦</span>
        </div>

        {/* Security Prompt Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-melodrame)',
            fontSize: '38px',
            lineHeight: 1.2,
            marginBottom: '10px',
            fontWeight: 400,
            letterSpacing: '0.01em',
            color: '#FFFFFF',
          }}
        >
          Shuttu + Unda = ?
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            color: 'rgba(247, 214, 208, 0.72)',
            marginBottom: '32px',
            fontWeight: 300,
            letterSpacing: '0.02em',
          }}
        >
          An intimate secret formula known only to two hearts.
        </p>

        {/* Input & Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <input
              ref={inputRef}
              type="text"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Type your answer..."
              aria-label="Security Answer"
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '9999px',
                background: 'rgba(26, 3, 7, 0.6)',
                border: errorMessage
                  ? '1px solid rgba(255, 90, 110, 0.7)'
                  : '1px solid rgba(247, 214, 208, 0.28)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-serif)',
                fontSize: '18px',
                letterSpacing: '0.04em',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: errorMessage
                  ? '0 0 15px rgba(255, 80, 100, 0.3)'
                  : 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(247, 214, 208, 0.65)';
                e.currentTarget.style.boxShadow = '0 0 22px rgba(247, 214, 208, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.3)';
              }}
              onBlur={(e) => {
                if (!errorMessage) {
                  e.currentTarget.style.borderColor = 'rgba(247, 214, 208, 0.28)';
                  e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.4)';
                }
              }}
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                color: '#FF94A0',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.04em',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Heart size={13} fill="#FF94A0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Minimalist White Pill Submit Button */}
          <button
            type="submit"
            className="btn-pill-white"
            style={{
              width: '100%',
              padding: '15px 30px',
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <span>Unlock</span>
            <Sparkles size={14} />
          </button>
        </form>

        {/* Subtle Footer Note */}
        <div
          style={{
            marginTop: '28px',
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: 'rgba(247, 214, 208, 0.45)',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
          }}
        >
          SHUTTU • PRIVATE ARCHIVE
        </div>
      </div>
    </div>
  );
};
