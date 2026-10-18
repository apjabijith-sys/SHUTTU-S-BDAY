import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';
import { Sparkles, Heart, Gift, Award, CheckCircle2, RotateCcw, ShieldCheck, Flame } from 'lucide-react';

export const ScratchCardSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimToast, setClaimToast] = useState(false);

  // Initialize Golden Foil Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, width, height);

    // 1. Rich Metallic Gold Foil Gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, '#B38728');
    goldGrad.addColorStop(0.2, '#FBF5B7');
    goldGrad.addColorStop(0.4, '#DAA520');
    goldGrad.addColorStop(0.6, '#FBF5B7');
    goldGrad.addColorStop(0.8, '#AA771C');
    goldGrad.addColorStop(1, '#E6CA65');

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Luxury Shimmer Texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rSize = Math.random() * 2 + 1;
      ctx.fillRect(rx, ry, rSize, rSize);
    }

    // 3. Ornate Double Gold Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    ctx.strokeStyle = 'rgba(120, 70, 10, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // 4. Center Gold Stamp / Instructions
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Top icon/label
    ctx.fillStyle = '#4A2A05';
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('✦ EXCLUSIVE REWARD ✦', width / 2, height / 2 - 42);

    // Main Invitation Headline
    ctx.fillStyle = '#2A1400';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SCRATCH TO REVEAL', width / 2, height / 2);

    // Subtle helper text
    ctx.fillStyle = '#5A3508';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Swipe or drag your cursor across the gold foil ✨', width / 2, height / 2 + 38);

    setScratchPercent(0);
    setIsRevealed(false);
  }, []);

  // Set canvas resolution on mount / resize
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      initCanvas();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [initCanvas]);

  // Scratch Action Handler
  const handleScratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Use destination-out to erase foil
    ctx.globalCompositeOperation = 'destination-out';

    // Soft round brush
    const brushRadius = 32;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, brushRadius);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.9)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();

    sound.playScratch();

    // Sample progress periodically
    checkProgress();
  };

  // Calculate percentage scratched
  const checkProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sample 20x20 grid across canvas
    const sampleCols = 20;
    const sampleRows = 16;
    let transparentCount = 0;
    const totalSamples = sampleCols * sampleRows;

    const stepX = canvas.width / sampleCols;
    const stepY = canvas.height / sampleRows;

    for (let r = 0; r < sampleRows; r++) {
      for (let c = 0; c < sampleCols; c++) {
        const px = Math.floor(c * stepX + stepX / 2);
        const py = Math.floor(r * stepY + stepY / 2);
        const pixel = ctx.getImageData(px, py, 1, 1).data;
        if (pixel[3] < 128) {
          transparentCount++;
        }
      }
    }

    const percent = Math.round((transparentCount / totalSamples) * 100);
    setScratchPercent(percent);

    // If 45% or more scratched, trigger grand reveal!
    if (percent >= 45 && !isRevealed) {
      triggerReveal();
    }
  };

  // Grand Reveal Trigger
  const triggerReveal = () => {
    setIsRevealed(true);
    setScratchPercent(100);
    sound.playWinFanfare();

    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 120,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#D4AF37', '#F7D6D0', '#FFFFFF', '#FFB7C5', '#F5E6A3'],
      scalar: 1.1,
      ticks: 180,
    });
  };

  // Mouse / Touch Listeners
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    handleScratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    handleScratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => setIsScratching(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsScratching(true);
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => setIsScratching(false);

  const handleClaimReward = () => {
    sound.playHeartChime();
    setIsClaimed(true);
    setClaimToast(true);

    confetti({
      particleCount: 50,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#FF69B4', '#F7D6D0', '#FFD700'],
      ticks: 120,
    });

    setTimeout(() => setClaimToast(false), 4500);
  };

  return (
    <section
      id="scratch-card"
      style={{
        position: 'relative',
        padding: '110px 0 100px',
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(42, 5, 13, 0.95) 0%, rgba(56, 8, 18, 0.85) 50%, rgba(35, 4, 9, 0.95) 100%)',
        borderTop: '1px solid rgba(247, 214, 208, 0.15)',
        borderBottom: '1px solid rgba(247, 214, 208, 0.15)',
      }}
    >
      <div className="atelier-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '46px' }}>
          <div className="atelier-label" style={{ marginBottom: '14px' }}>
            ✦ EXCLUSIVE PRIVILEGE PASS ✦
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-melodrame)',
              fontSize: 'clamp(38px, 4.8vw, 62px)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: '14px',
            }}
          >
            Scratch & Win Exclusive Prizes
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14.5px',
              color: 'rgba(247, 214, 208, 0.78)',
              maxWidth: '520px',
              margin: '0 auto',
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            A confidential high-fashion prize reserved solely for Shuttu. Scratch away the royal gold foil to uncover your birthday reward.
          </p>
        </div>

        {/* Central Scratch Card Container */}
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Card Border Frame with Gold & Burgundy Styling */}
          <div
            ref={containerRef}
            style={{
              position: 'relative',
              borderRadius: '28px',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #2a040b 0%, #1e0207 100%)',
              border: '2px solid rgba(212, 175, 55, 0.45)',
              boxShadow: `
                0 30px 80px rgba(0, 0, 0, 0.7),
                0 0 35px rgba(212, 175, 55, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.25)
              `,
              minHeight: '440px',
            }}
          >
            {/* ============================================================
                THE UNDERLYING PRIZE LAYER (What is revealed upon scratching)
               ============================================================ */}
            <div
              style={{
                padding: '42px 36px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '440px',
                background: 'radial-gradient(ellipse at 50% 30%, #4a0d18 0%, #200308 100%)',
                color: '#FFFFFF',
              }}
            >
              {/* Grand VIP Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.25) 0%, rgba(255, 215, 0, 0.4) 50%, rgba(212, 175, 55, 0.25) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.6)',
                  padding: '7px 20px',
                  borderRadius: '9999px',
                  marginBottom: '18px',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
                }}
              >
                <Award size={16} color="#FFD700" />
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#FFF2C6',
                  }}
                >
                  OFFICIAL GRAND BIRTHDAY PRIZE
                </span>
              </div>

              {/* Main Headline: Exactly What Was Requested */}
              {/* Main Headline: Exactly What Was Requested */}
              <h3
                style={{
                  fontFamily: 'var(--font-melodrame)',
                  fontSize: 'clamp(28px, 3.8vw, 44px)',
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: '#FFF8F0',
                  marginBottom: '16px',
                  textShadow: '0 0 30px rgba(247, 214, 208, 0.5)',
                }}
              >
                You Get <span style={{ color: '#FFD700' }}>Premium Hugs</span> & <br />
                <span style={{ color: '#F7D6D0' }}>Kiss Access</span> From Me For Lifetime <br />
                <span
                  style={{
                    fontSize: 'clamp(22px, 2.8vw, 30px)',
                    color: '#FFD700',
                    fontStyle: 'italic',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px',
                  }}
                >
                  and many more 🌚
                </span>
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '16px',
                  color: 'rgba(251, 247, 245, 0.85)',
                  marginBottom: '28px',
                  maxWidth: '480px',
                }}
              >
                “Unconditional, non-transferable, and redeemable anytime you want to feel loved, safe, and adored.”
              </p>

              {/* VIP Perks Breakdown Box (Black Card / Atelier Style) */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  background: 'rgba(15, 1, 4, 0.65)',
                  border: '1px solid rgba(247, 214, 208, 0.2)',
                  borderRadius: '16px',
                  padding: '20px 22px',
                  marginBottom: '28px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Heart size={14} color="#FF7B90" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFF' }}>Kiss Access</div>
                      <div style={{ color: 'rgba(247, 214, 208, 0.7)', fontSize: '11px' }}>Unlimited on-demand</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Flame size={14} color="#FFB84D" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFF' }}>Premium Hugs</div>
                      <div style={{ color: 'rgba(247, 214, 208, 0.7)', fontSize: '11px' }}>Max warmth, zero cooldown</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <ShieldCheck size={14} color="#4ADE80" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFF' }}>Validity</div>
                      <div style={{ color: 'rgba(247, 214, 208, 0.7)', fontSize: '11px' }}>Lifetime & Beyond</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Sparkles size={14} color="#FFD700" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFF' }}>Secret Perks</div>
                      <div style={{ color: '#FFD700', fontSize: '11px' }}>and many more 🌚</div>
                    </div>
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-start', gap: '8px', borderTop: '1px solid rgba(247, 214, 208, 0.12)', paddingTop: '10px' }}>
                    <Award size={14} color="#F7D6D0" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFF' }}>Issued By</div>
                      <div style={{ color: 'rgba(247, 214, 208, 0.7)', fontSize: '11px' }}>Soyabean (Your Soyabean)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={handleClaimReward}
                  className="btn-pill-white"
                  style={{
                    background: isClaimed ? '#4ADE80' : '#FFFFFF',
                    color: isClaimed ? '#052e16' : '#2A040B',
                    borderColor: isClaimed ? '#4ADE80' : '#FFFFFF',
                    padding: '13px 28px',
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                  }}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Privilege Claimed!</span>
                    </>
                  ) : (
                    <>
                      <Heart size={15} fill="#E11D48" color="#E11D48" />
                      <span>Claim Your Reward</span>
                    </>
                  )}
                </button>

                <button
                  onClick={initCanvas}
                  className="btn-pill-outline"
                  title="Scratch the golden foil again"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Scratch Again</span>
                </button>
              </div>
            </div>

            {/* ============================================================
                THE GOLDEN SCRATCHABLE CANVAS OVERLAY
               ============================================================ */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                cursor: isRevealed ? 'default' : 'crosshair',
                opacity: isRevealed ? 0 : 1,
                pointerEvents: isRevealed ? 'none' : 'auto',
                transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                touchAction: 'none',
              }}
            />

            {/* Scratch Percentage Indicator Pill */}
            {!isRevealed && scratchPercent > 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '18px',
                  right: '18px',
                  background: 'rgba(26, 3, 7, 0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-sans)',
                  color: '#FFD700',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              >
                <span>{scratchPercent}% Uncovered</span>
              </div>
            )}
          </div>

          {/* Claim Toast Notice */}
          {claimToast && (
            <div
              style={{
                marginTop: '18px',
                textAlign: 'center',
                padding: '12px 20px',
                borderRadius: '9999px',
                background: 'rgba(74, 14, 23, 0.95)',
                border: '1px solid rgba(247, 214, 208, 0.4)',
                color: '#FFF',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              <Sparkles size={14} color="#FFD700" />
              <span>Privilege Officially Sealed! Redeemable anytime by looking cute or asking Soyabean. 💕</span>
            </div>
          )}

          {/* Ticket Security Authentication Footer */}
          <div
            style={{
              marginTop: '22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
              color: 'rgba(247, 214, 208, 0.55)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '0 10px',
            }}
          >
            <span>VOUCHER NO. SHUTTU-2026-VIP</span>
            <span>NON-EXPIRING • 100% EXCLUSIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
