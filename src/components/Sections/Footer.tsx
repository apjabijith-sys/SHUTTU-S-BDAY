import React, { useState, useRef } from 'react';
import { Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const Footer: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleMute = () => {
    sound.playHover();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#120205',
        borderTop: '1px solid rgba(247, 214, 208, 0.12)',
        padding: '70px 0 40px',
      }}
    >
      <div className="atelier-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '40px',
            marginBottom: '50px',
          }}
        >
          {/* Brand Column */}
          <div>
            <div
              className="font-serif"
              style={{
                fontSize: '24px',
                fontWeight: 400,
                color: '#FFFFFF',
                letterSpacing: '0.1em',
                marginBottom: '10px',
              }}
            >
              SHUTTU
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12.5px',
                color: 'rgba(247, 214, 208, 0.65)',
                maxWidth: '320px',
                lineHeight: 1.6,
              }}
            >
              A luxury celebration sanctuary crafted with unreserved devotion for Shuttu on her birthday.
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#F7D6D0',
                  marginBottom: '16px',
                }}
              >
                NAVIGATION
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Hero', 'Philosophy', 'Collections', 'Favourites', 'Signature Edit', 'Forever Agreement'].map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={`#${link.toLowerCase().replace(' ', '-')}`}
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12.5px',
                        color: 'rgba(251, 247, 245, 0.7)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(251, 247, 245, 0.7)')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#F7D6D0',
                  marginBottom: '16px',
                }}
              >
                SPECIAL
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>
                  <span style={{ fontSize: '12.5px', color: 'rgba(251, 247, 245, 0.7)' }}>
                    October 19, 2026
                  </span>
                </li>
                <li>
                  <span style={{ fontSize: '12.5px', color: 'rgba(251, 247, 245, 0.7)' }}>
                    Created by Soyabean
                  </span>
                </li>
                <li>
                  <span style={{ fontSize: '12.5px', color: 'rgba(251, 247, 245, 0.7)' }}>
                    Forever & Always
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(247, 214, 208, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '11px',
            color: 'rgba(247, 214, 208, 0.5)',
            letterSpacing: '0.08em',
          }}
        >
          <div>© {new Date().getFullYear()} SHUTTU • ALL LOVE RESERVED</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with</span>
            <Heart size={12} fill="#F7D6D0" color="#F7D6D0" />
            <span>for Shuttu</span>
          </div>
        </div>

        {/* ============================================================
            ALL THE WAY DOWN: CRYING CHARACTER WITH DIALOG BOX (LOOP)
           ============================================================ */}
        <div
          style={{
            marginTop: '36px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(247, 214, 208, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Video with Transparent Background (mix-blend-mode: screen eliminates black background) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '260px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <video
              ref={videoRef}
              src="/videos/person_crying.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'contain',
                display: 'block',
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 10px 25px rgba(225, 29, 72, 0.25))',
                cursor: 'pointer',
              }}
              onClick={toggleMute}
              title="Click to hear cries"
            />

            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={toggleMute}
              style={{
                marginTop: '-10px',
                background: 'rgba(26, 3, 7, 0.85)',
                border: '1px solid rgba(247, 214, 208, 0.35)',
                borderRadius: '9999px',
                padding: '6px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#F7D6D0',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                zIndex: 5,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFD700';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(247, 214, 208, 0.35)';
                e.currentTarget.style.transform = 'scale(1.0)';
              }}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} color="#FF7B90" />}
              <span>{isMuted ? 'Tap to hear cries 😭' : 'Mute cries 🔇'}</span>
            </button>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '14px',
              color: 'rgba(247, 214, 208, 0.75)',
              marginTop: '12px',
              textAlign: 'center',
            }}
          >
            “Literally me crying whenever you're away from me 💕”
          </p>
        </div>
      </div>
    </footer>
  );
};
