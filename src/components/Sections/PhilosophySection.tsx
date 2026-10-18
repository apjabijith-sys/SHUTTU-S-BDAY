import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface PhilosophySectionProps {
  onDiscoverClick: () => void;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({ onDiscoverClick }) => {
  return (
    <section
      id="philosophy"
      style={{
        position: 'relative',
        padding: '110px 0 90px',
        zIndex: 10,
        borderTop: '1px solid rgba(247, 214, 208, 0.12)',
        background: 'linear-gradient(180deg, rgba(74, 14, 23, 0.4) 0%, rgba(42, 5, 13, 0.7) 100%)',
      }}
    >
      <div className="atelier-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)',
            gap: '60px',
            alignItems: 'flex-start',
          }}
          className="philosophy-grid"
        >
          {/* Left Column */}
          <div>
            <div
              className="atelier-label"
              style={{
                marginBottom: '22px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#F7D6D0',
                letterSpacing: '0.2em',
              }}
            >
              <span>— OUR LITTLE UNIVERSE</span>
            </div>

            <h2
              className="editorial-title"
              style={{
                fontSize: 'clamp(36px, 4.2vw, 54px)',
                fontWeight: 400,
                lineHeight: 1.15,
                marginBottom: '32px',
                color: '#FFFFFF',
              }}
            >
              A Love Written <br />
              <span className="editorial-italic" style={{ color: '#F7D6D0' }}>
                Across Miles
              </span>
            </h2>

            <button
              onClick={onDiscoverClick}
              className="btn-pill-outline"
              onMouseEnter={() => sound.playHover()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>Our story, in a few words</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Right Column: High-Fashion Italic Quote & Body - aligned with headline */}
          <div
            style={{
              paddingLeft: '32px',
              borderLeft: '1px solid rgba(247, 214, 208, 0.18)',
              paddingTop: '20px',
            }}
          >
            <blockquote
              className="font-serif editorial-italic"
              style={{
                fontSize: 'clamp(20px, 2.2vw, 28px)',
                lineHeight: 1.45,
                color: '#F7D6D0',
                marginBottom: '24px',
                fontWeight: 300,
              }}
            >
              “Somehow, in this enormous world, I found my favourite person in you.”
            </blockquote>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                lineHeight: 1.85,
                color: 'rgba(251, 247, 245, 0.85)',
                fontWeight: 300,
                letterSpacing: '0.01em',
                marginBottom: '30px',
              }}
            >
              From November 21, 2025, to every little moment still waiting for us. Different places may hold us for now, but none of those miles could change what you mean to me.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '9999px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.38)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#FFD700',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={13} color="#FFD700" />
              <span>TWO HEARTS. ONE STORY. STILL UNFOLDING.</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .philosophy-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};
