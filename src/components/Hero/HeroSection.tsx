import React, { useRef, useState } from 'react';
import { ArrowRight, Camera, Sparkles, Heart } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface HeroSectionProps {
  currentPhotoUrl: string;
  onOpenPhotoModal: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentPhotoUrl,
  onOpenPhotoModal,
  onExploreClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // State for 3D card tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  // Handle magnetic button effect
  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnOffset({ x: x * 0.28, y: y * 0.28 });
  };

  const handleButtonMouseLeave = () => {
    setBtnOffset({ x: 0, y: 0 });
  };

  // Handle Photo Card 3D tilt
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 12, y: x * 15 });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '110px',
        paddingBottom: '60px',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      <div className="atelier-container" style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)',
            gap: '48px',
            alignItems: 'center',
          }}
          className="hero-split-grid"
        >
          {/* ============================================================
              LEFT HALF: Ribbed Glass Texture & Editorial Typography
             ============================================================ */}
          <div
            style={{
              position: 'relative',
              borderRadius: '28px',
              padding: '56px 44px',
              overflow: 'hidden',
              background: 'rgba(56, 8, 18, 0.42)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(247, 214, 208, 0.22)',
              boxShadow: '0 30px 60px rgba(26, 3, 7, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            {/* Architectural Ribbed / Fluted Glass Texture Background */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/images/glass_texture.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.24,
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
              }}
            />

            {/* Subtle Gradient Vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 20% 30%, rgba(247, 214, 208, 0.08) 0%, rgba(42, 5, 13, 0.6) 85%)',
                pointerEvents: 'none',
              }}
            />

            {/* Content Container */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Small Uppercase Subtitle */}
              {/* Small Uppercase Subtitle - optically flush with headline */}
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-blush-200)',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: 0.9,
                }}
              >
                <span>TO THE LOVELIEST PERSON</span>
              </div>

              {/* Giant High-Contrast Serif Headline with Relationship of Melodrame Font */}
              <h1
                style={{
                  fontFamily: 'var(--font-melodrame)',
                  fontSize: 'clamp(50px, 5.8vw, 84px)',
                  fontWeight: 400,
                  lineHeight: 1.16,
                  marginBottom: '26px',
                  color: '#FFFFFF',
                  textShadow: '0 4px 28px rgba(0, 0, 0, 0.45)',
                  letterSpacing: '0.01em',
                }}
              >
                <span>Happy Birthday,</span> <br />
                <span
                  style={{
                    color: '#F7D6D0',
                    fontFamily: 'var(--font-melodrame)',
                  }}
                >
                  Shuttu
                </span>
              </h1>

              {/* Warm romantic one-liner in clean, lightweight typography */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  lineHeight: 1.82,
                  fontWeight: 300,
                  color: 'rgba(251, 247, 245, 0.88)',
                  maxWidth: '490px',
                  marginBottom: '38px',
                  letterSpacing: '0.012em',
                }}
              >
                Happiest birthday to my limited-edition gem, my Cutie. I love you so much, and I wish for you to receive all the beautiful things this world has to offer. And among all those wonderful things, I hope to be one of them. ❤️ iykyk
              </p>

              {/* Interactive Pill Buttons - perfectly matched height & alignment */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  ref={buttonRef}
                  onClick={onExploreClick}
                  onMouseMove={handleButtonMouseMove}
                  onMouseLeave={handleButtonMouseLeave}
                  className="btn-pill-white"
                  style={{
                    height: '46px',
                    padding: '0 28px',
                    transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
                    transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, background 0.3s ease',
                  }}
                >
                  <span>Explore Your Day</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={onOpenPhotoModal}
                  className="btn-pill-outline"
                  title="Customize Shuttu's Photograph"
                  style={{
                    height: '46px',
                    padding: '0 24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Camera size={14} />
                  <span>Update Portrait</span>
                </button>
              </div>

              {/* Atelier Date / Location Detail */}
              <div
                style={{
                  marginTop: '46px',
                  paddingTop: '22px',
                  borderTop: '1px solid rgba(247, 214, 208, 0.16)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  fontFamily: 'var(--font-sans)',
                  color: 'rgba(247, 214, 208, 0.65)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                <span>EDITION • OCTOBER 19</span>
                <span>SHUTTU & SOYABEAN</span>
              </div>
            </div>
          </div>

          {/* ============================================================
              CENTER / RIGHT COMPOSITION: Framed Photo Placeholder & 3D Florals
             ============================================================ */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '520px',
            }}
          >
            {/* Elegant Framed Photo Placeholder with rounded corners & glass borders */}
            <div
              ref={cardRef}
              id="shuttu_photo"
              data-image-placeholder-id="shuttu_photo"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onClick={onOpenPhotoModal}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '620px',
                aspectRatio: '16 / 10',
                borderRadius: '26px',
                overflow: 'hidden',
                background: 'rgba(42, 5, 13, 0.85)',
                border: '1.5px solid rgba(247, 214, 208, 0.32)',
                boxShadow: `
                  0 35px 80px rgba(18, 2, 5, 0.75),
                  0 10px 30px rgba(0, 0, 0, 0.5),
                  inset 0 1px 1px rgba(255, 255, 255, 0.25)
                `,
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.2s ease-out, box-shadow 0.3s ease',
                cursor: 'pointer',
                zIndex: 3,
              }}
              title="Click to view or replace photograph (image_placeholder_id: shuttu_photo)"
            >
              {/* Photo Image */}
              <img
                src={currentPhotoUrl}
                alt="Shuttu Birthday Portrait"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 25%',
                  display: 'block',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Subtle Warm Vignette Scrim */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(26, 3, 7, 0.82) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Bottom Card Label */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '22px',
                  left: '24px',
                  right: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  color: '#FFFFFF',
                  zIndex: 2,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '10px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#F7D6D0',
                      marginBottom: '4px',
                    }}
                  >
                    MUSE OF THE DAY
                  </div>
                  <div
                    className="font-serif"
                    style={{
                      fontSize: '22px',
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                    }}
                  >
                    Shuttu
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-sans)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <Camera size={13} />
                  <span>Tap to change</span>
                </div>
              </div>

              {/* Top Shimmer Tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'rgba(42, 5, 13, 0.65)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(247, 214, 208, 0.25)',
                  borderRadius: '9999px',
                  padding: '5px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  color: '#F7D6D0',
                  textTransform: 'uppercase',
                }}
              >
                <Sparkles size={11} />
                <span>#shuttu_photo</span>
              </div>
            </div>

            {/* Subtle Floating Pearl White Flora Silhouette Accents for depth */}
            <div
              style={{
                position: 'absolute',
                top: '-35px',
                right: '-25px',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 250, 240, 0.22) 0%, transparent 70%)',
                filter: 'blur(32px)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: '-25px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(148, 37, 52, 0.3) 0%, transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-split-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};
