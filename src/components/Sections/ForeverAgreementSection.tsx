import React, { useRef, useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  PenTool,
  RotateCcw,
  CheckCircle,
  Download,
  ShieldCheck,
  Award,
  Scroll,
  Lock,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface Point {
  x: number;
  y: number;
}

export const ForeverAgreementSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [inkColor, setInkColor] = useState<'#D4AF37' | '#E11D48' | '#FAF5F2'>('#D4AF37');
  const [isSealed, setIsSealed] = useState(false);
  const [sealedDate, setSealedDate] = useState<string>('');
  const lastPointRef = useRef<Point | null>(null);

  // Initialize canvas with proper resolution for Retina / iPad displays
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  // Restore saved signature if exists
  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);

    try {
      const savedSig = localStorage.getItem('shuttu_forever_signature');
      const savedDate = localStorage.getItem('shuttu_forever_signature_date');
      if (savedSig) {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const dpr = window.devicePixelRatio || 1;
          ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
          setHasDrawn(true);
          setIsSealed(true);
          setSealedDate(savedDate || 'Ratified Forever');
        };
        img.src = savedSig;
      }
    } catch {
      // Ignore
    }

    return () => {
      window.removeEventListener('resize', initCanvas);
    };
  }, []);

  // Helper to extract canvas coordinates from touch or mouse
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return null;
  };

  // Touch & Mouse Event Handlers
  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isSealed) return;
    const pt = getCoordinates(e);
    if (!pt) return;

    setIsDrawing(true);
    setHasDrawn(true);
    lastPointRef.current = pt;
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isSealed) return;
    const pt = getCoordinates(e);
    if (!pt || !lastPointRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = inkColor === '#D4AF37' ? 3.2 : 2.8;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    lastPointRef.current = pt;
  };

  const handleEnd = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  // Clear Signature
  const handleClear = () => {
    sound.playHover();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasDrawn(false);
    setIsSealed(false);
    localStorage.removeItem('shuttu_forever_signature');
    localStorage.removeItem('shuttu_forever_signature_date');
  };

  // Seal & Stamp Agreement with Love
  const handleSealAgreement = () => {
    if (!hasDrawn) {
      sound.playError();
      return;
    }

    sound.playUnlockChime();
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    setIsSealed(true);
    setSealedDate(formattedDate);

    // Save canvas signature
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        localStorage.setItem('shuttu_forever_signature', dataUrl);
        localStorage.setItem('shuttu_forever_signature_date', formattedDate);
      } catch {
        // Ignored
      }
    }

    // Celebrate with hearts and gold sparks
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#E11D48', '#FFB8C6', '#FFFFFF'],
      scalar: 1.1,
    });
  };

  // Download Snapshot Certificate
  const handleDownload = () => {
    sound.playHeartChime();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create virtual canvas with certificate seal
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1200;
    exportCanvas.height = 800;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Luxury background
    ctx.fillStyle = '#1A0307';
    ctx.fillRect(0, 0, 1200, 800);

    // Gold border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1140, 740);

    // Inner contour
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, 1112, 712);

    // Header
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ OFFICIAL ETERNAL COVENANT • DECREE NO. 1019 ✦', 600, 100);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic 46px serif';
    ctx.fillText('The Forever & Always Agreement', 600, 160);

    ctx.fillStyle = '#F7D6D0';
    ctx.font = '20px sans-serif';
    ctx.fillText('Ratified between Shuttu & Soyabean • Valid for Infinity', 600, 205);

    // Clauses summary
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';
    const clauses = [
      '1. Strict Belonging: The Party of the Second Part irrevocably covenants to stay mine forever.',
      '2. Baby Mode: All adult seriousness is permanently suspended when in our space.',
      '3. Table & Door Integrity: Full immunity for broken tables, crazy zoomies, and chaotic energy.',
      '4. Hug & Kiss Tax: Unlimited daily forehead kisses and warm cuddles on demand.',
      '5. Fry Theft Immunity: Sovereign right to steal fries and snacks even after saying "not hungry".',
      '6. Miles Annihilation: Different places may hold us, but heart distance is strictly 0.00 mm.',
      '7. Spider-Man & Hello Kitty Pact: Eternal love, loyalty, and lifelong protector bond.',
      '8. Strict No-Refund Policy: Non-refundable, non-exchangeable, stuck together forever.',
    ];

    clauses.forEach((c, i) => {
      ctx.fillText(c, 80, 260 + i * 36);
    });

    // Signature label & signature drawing
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(750, 680);
    ctx.lineTo(1100, 680);
    ctx.stroke();

    ctx.fillStyle = '#FFD700';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AUTHORIZED SIGNATURE (HER IPAD)', 925, 710);
    ctx.fillText(`Dated: ${sealedDate || 'October 19, 2026'}`, 925, 735);

    // Draw user's canvas signature onto certificate
    ctx.drawImage(canvas, 750, 540, 350, 130);

    // Red Wax Seal Stamp Graphic
    ctx.beginPath();
    ctx.arc(220, 640, 65, 0, Math.PI * 2);
    ctx.fillStyle = '#8B0000';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIALLY SEALED', 220, 630);
    ctx.fillText('MINE FOREVER', 220, 650);
    ctx.fillText('✦ 10.19 ✦', 220, 670);

    // Download trigger
    const link = document.createElement('a');
    link.download = 'Forever_Agreement_Shuttu_Soyabean.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const CLAUSES = [
    {
      num: '01',
      title: 'The Eternal Belonging Covenant',
      desc: 'The Party of the Second Part (You, my sweet baby) hereby covenants, warrants, and promises to remain solely, wholly, and irrevocably MINE for all days, all nights, and all lifetimes to come.',
      icon: '💍',
    },
    {
      num: '02',
      title: 'The Baby Mode & Shared Brain Cell Protocol',
      desc: 'Upon entering each other’s presence or videocalling after 10 PM, all adult seriousness is rendered null and void. Mutual babytalk, unhinged giggles, and acting like absolute fools are legally mandatory.',
      icon: '👶',
    },
    {
      num: '03',
      title: 'The Broken Table & Door Zoomies Immunity',
      desc: 'The Party of the First Part is granted lifetime legal immunity for all accidentally broken coffee tables, slammed doors, chaotic zoomies, or playful wrestling matches. No questions asked.',
      icon: '🚪',
    },
    {
      num: '04',
      title: 'The Non-Negotiable Hug & Kiss Tax',
      desc: 'A daily minimum quota of warm forehead kisses, tight rib-crushing hugs, and cheek squishes is payable upon demand at any hour, with strictly zero expiration date.',
      icon: '💋',
    },
    {
      num: '05',
      title: 'The Fry & Snack Embezzlement Privilege',
      desc: 'The Party of the Second Part retains unconditional sovereign authority to steal French fries, sips of drinks, and dessert bites from my plate, even after explicitly swearing "I’m not hungry."',
      icon: '🍟',
    },
    {
      num: '06',
      title: 'The Distance & Miles Annihilation Clause',
      desc: 'Different coordinates may temporarily hold our bodies, but no number of miles, train tracks, or time zones can ever change what you mean to me. Distance between our souls is perpetually 0.00 mm.',
      icon: '✈️',
    },
    {
      num: '07',
      title: 'The Spider-Man & Hello Kitty Forever Pact',
      desc: 'Every friendly neighbourhood Spider-Man shall remain the loyal bodyguard, personal cheerleader, and devoted lover of his Hello Kitty, cherishing her cuteness and fierceness forever.',
      icon: '🕸️',
    },
    {
      num: '08',
      title: 'Strict No-Return & No-Exchange Policy',
      desc: 'This agreement is 100% final, irrevocable, and non-refundable across all universes and dimensions. There is no return policy. You are stuck with me forever and ever 💕',
      icon: '♾️',
    },
  ];

  return (
    <section
      id="forever-agreement"
      ref={containerRef}
      style={{
        position: 'relative',
        padding: '130px 0 120px',
        zIndex: 10,
        background: 'radial-gradient(ellipse at 50% 10%, #3e0713 0%, #1a0206 50%, #0d0103 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.35)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background ornamentations */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="atelier-container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
        {/* ============================================================
            SECTION HEADER: ROYAL DECREE
           ============================================================ */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 20px',
              borderRadius: '9999px',
              background: 'rgba(212, 175, 55, 0.14)',
              border: '1.5px solid rgba(212, 175, 55, 0.55)',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
              marginBottom: '16px',
            }}
          >
            <Award size={14} color="#FFD700" />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#FFD700',
                textTransform: 'uppercase',
              }}
            >
              ✦ OFFICIAL ETERNAL COVENANT • DECREE NO. 1019 ✦
            </span>
            <Award size={14} color="#FFD700" />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-melodrame)',
              fontSize: 'clamp(40px, 5.2vw, 68px)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#FFFFFF',
              letterSpacing: '0.01em',
              margin: '0 0 14px',
            }}
          >
            The Forever & Always Agreement
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              fontStyle: 'italic',
              color: 'var(--color-blush-200)',
              maxWidth: '680px',
              margin: '0 auto 12px',
              lineHeight: 1.6,
            }}
          >
            “A solemn, legally binding, and extremely cute contract declaring that you will stay mine for all of eternity.”
          </p>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13.5px',
              color: 'rgba(247, 214, 208, 0.72)',
              fontWeight: 300,
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            Effective Date: <strong style={{ color: '#FFD700' }}>November 21, 2025 – Infinity</strong> • Jurisdiction: <strong style={{ color: '#FFD700' }}>Our Universe</strong>
          </p>
        </div>

        {/* ============================================================
            THE ROYAL PARCHMENT CERTIFICATE CONTAINER
           ============================================================ */}
        <div
          style={{
            position: 'relative',
            borderRadius: '28px',
            background: 'linear-gradient(155deg, rgba(46, 6, 14, 0.95) 0%, rgba(20, 2, 6, 0.98) 100%)',
            border: '2.5px solid rgba(212, 175, 55, 0.75)',
            boxShadow: '0 30px 100px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 175, 55, 0.2)',
            padding: 'clamp(28px, 4vw, 54px)',
            overflow: 'hidden',
          }}
        >
          {/* Inner Ornate Gold Filigree Contour */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              pointerEvents: 'none',
            }}
          />

          {/* Ornate Corner Stars */}
          <span style={{ position: 'absolute', top: '20px', left: '20px', color: '#FFD700', fontSize: '18px' }}>✦</span>
          <span style={{ position: 'absolute', top: '20px', right: '20px', color: '#FFD700', fontSize: '18px' }}>✦</span>
          <span style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#FFD700', fontSize: '18px' }}>✦</span>
          <span style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#FFD700', fontSize: '18px' }}>✦</span>

          {/* Parties Introduction Box */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(247, 214, 208, 0.18)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '36px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-sans)', letterSpacing: '0.16em', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 700 }}>
                PARTY OF THE FIRST PART
              </span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#FFFFFF', marginTop: '2px' }}>
                Soyabean (Shuttu’s Personal Protector)
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(247, 214, 208, 0.7)', margin: '4px 0 0' }}>
                Devoted lover, table-breaker accomplice, and biggest fan.
              </p>
            </div>

            <div>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-sans)', letterSpacing: '0.16em', color: '#FFB8C6', textTransform: 'uppercase', fontWeight: 700 }}>
                PARTY OF THE SECOND PART
              </span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#FFFFFF', marginTop: '2px' }}>
                Shuttu (The Birthday Queen & Forever Baby)
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(247, 214, 208, 0.7)', margin: '4px 0 0' }}>
                Sweetest Hello Kitty, owner of my heart, and forever mine.
              </p>
            </div>
          </div>

          {/* ============================================================
              THE 8 CUTE BINDING CLAUSES
             ============================================================ */}
          <div style={{ marginBottom: '44px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
              }}
            >
              <Scroll size={18} color="#FFD700" />
              <h3
                className="font-serif"
                style={{
                  fontSize: '24px',
                  color: '#FFFFFF',
                  fontWeight: 400,
                  margin: 0,
                  letterSpacing: '0.02em',
                }}
              >
                Covenants & Non-Negotiable Terms
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '18px',
              }}
            >
              {CLAUSES.map((clause) => (
                <div
                  key={clause.num}
                  style={{
                    background: 'rgba(28, 4, 9, 0.65)',
                    border: '1px solid rgba(247, 214, 208, 0.15)',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(247, 214, 208, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: '#D4AF37',
                        textTransform: 'uppercase',
                      }}
                    >
                      CLAUSE {clause.num}
                    </span>
                    <span style={{ fontSize: '18px' }}>{clause.icon}</span>
                  </div>

                  <h4
                    className="font-serif"
                    style={{
                      fontSize: '18px',
                      color: '#FFFFFF',
                      fontWeight: 400,
                      margin: '0 0 6px',
                    }}
                  >
                    {clause.title}
                  </h4>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12.5px',
                      color: 'rgba(251, 247, 245, 0.8)',
                      lineHeight: 1.65,
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    {clause.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================
              INTERACTIVE IPAD / TOUCHSCREEN SIGNATURE CANVAS
             ============================================================ */}
          <div
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(35, 4, 11, 0.8) 0%, rgba(13, 1, 3, 0.95) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.65)',
              borderRadius: '24px',
              padding: '30px 26px',
              boxShadow: 'inset 0 0 35px rgba(0, 0, 0, 0.85), 0 15px 40px rgba(0, 0, 0, 0.6)',
              position: 'relative',
            }}
          >
            {/* Header with Tools */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PenTool size={16} color="#FFD700" />
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      color: '#FFD700',
                      textTransform: 'uppercase',
                    }}
                  >
                    ✦ IPAD / TOUCHSCREEN DIGITAL SIGNATURE PAD ✦
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: 'rgba(247, 214, 208, 0.75)', margin: '4px 0 0' }}>
                  Use your Apple Pencil, stylus, or finger to sign your consent right here on your screen.
                </p>
              </div>

              {/* Ink Selection & Clear */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(247, 214, 208, 0.65)', fontFamily: 'var(--font-sans)' }}>
                  Ink:
                </span>
                <button
                  type="button"
                  onClick={() => setInkColor('#D4AF37')}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#D4AF37',
                    border: inkColor === '#D4AF37' ? '2px solid #FFFFFF' : '1px solid rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    transform: inkColor === '#D4AF37' ? 'scale(1.15)' : 'scale(1.0)',
                    transition: 'all 0.2s',
                  }}
                  title="Royal Gold Ink"
                />
                <button
                  type="button"
                  onClick={() => setInkColor('#E11D48')}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#E11D48',
                    border: inkColor === '#E11D48' ? '2px solid #FFFFFF' : '1px solid rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    transform: inkColor === '#E11D48' ? 'scale(1.15)' : 'scale(1.0)',
                    transition: 'all 0.2s',
                  }}
                  title="Rose Crimson Ink"
                />
                <button
                  type="button"
                  onClick={() => setInkColor('#FAF5F2')}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#FAF5F2',
                    border: inkColor === '#FAF5F2' ? '2px solid #D4AF37' : '1px solid rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    transform: inkColor === '#FAF5F2' ? 'scale(1.15)' : 'scale(1.0)',
                    transition: 'all 0.2s',
                  }}
                  title="Pearl White Ink"
                />

                <button
                  type="button"
                  onClick={handleClear}
                  className="btn-pill-outline"
                  style={{
                    fontSize: '11px',
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginLeft: '8px',
                  }}
                  title="Clear & Re-sign"
                >
                  <RotateCcw size={12} />
                  <span>Re-sign</span>
                </button>
              </div>
            </div>

            {/* The Signature Canvas Area */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '220px',
                borderRadius: '16px',
                background: 'rgba(10, 1, 3, 0.9)',
                border: '1.5px dashed rgba(212, 175, 55, 0.45)',
                overflow: 'hidden',
                touchAction: 'none', // Crucial for iPad Apple Pencil drawing without scrolling
                boxShadow: 'inset 0 4px 18px rgba(0, 0, 0, 0.95)',
                cursor: isSealed ? 'default' : 'crosshair',
              }}
            >
              {/* Watermark / Signature Guideline Line */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '48px',
                  left: '40px',
                  right: '40px',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
                  pointerEvents: 'none',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '22px',
                  left: '42px',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '13px',
                  color: 'rgba(247, 214, 208, 0.45)',
                  pointerEvents: 'none',
                }}
              >
                Sign here with Apple Pencil or finger: ✕ _____________________________________
              </span>

              {/* Guide prompt if empty */}
              {!hasDrawn && (
                <div
                  style={{
                    position: 'absolute',
                    top: '42%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    color: 'rgba(247, 214, 208, 0.35)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    letterSpacing: '0.08em',
                  }}
                >
                  ✍️ Draw your signature here
                </div>
              )}

              {/* The Active HTML5 Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                }}
              />

              {/* Physical 3D Wax Seal Animation Overlay when Sealed */}
              {isSealed && (
                <div
                  style={{
                    position: 'absolute',
                    top: '25px',
                    right: '35px',
                    width: '115px',
                    height: '115px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #b91c1c 0%, #7f1d1d 60%, #450a0a 100%)',
                    border: '3px solid #D4AF37',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.9), inset 0 2px 6px rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFD700',
                    textAlign: 'center',
                    padding: '8px',
                    transform: 'rotate(-12deg) scale(1.05)',
                    animation: 'sealDrop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                >
                  <Heart size={18} fill="#FFD700" color="#FFD700" style={{ marginBottom: '2px' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', fontWeight: 900, letterSpacing: '0.14em' }}>
                    SEALED FOREVER
                  </span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '8px', fontStyle: 'italic', color: '#FFFFFF' }}>
                    Mine for Life
                  </span>
                  <span style={{ fontSize: '8px', fontWeight: 700, marginTop: '2px' }}>
                    ✦ 10 • 19 ✦
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions: Stamp Agreement Button & Download Certificate */}
            <div
              style={{
                marginTop: '22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSealed ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontSize: '13px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                    <CheckCircle size={16} color="#4ADE80" />
                    <span>Agreement Officially Sealed & Legally Binding on {sealedDate || 'Today'} 💕</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: 'rgba(247, 214, 208, 0.65)', fontFamily: 'var(--font-sans)' }}>
                    {hasDrawn ? 'Signature captured! Now stamp with love below ↓' : 'Awaiting your lovely signature on the pad above...'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {!isSealed ? (
                  <button
                    type="button"
                    onClick={handleSealAgreement}
                    disabled={!hasDrawn}
                    style={{
                      padding: '14px 28px',
                      borderRadius: '9999px',
                      background: hasDrawn
                        ? 'linear-gradient(135deg, #D4AF37 0%, #F5D77F 100%)'
                        : 'rgba(255, 255, 255, 0.15)',
                      color: hasDrawn ? '#2A040B' : 'rgba(255, 255, 255, 0.4)',
                      border: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: hasDrawn ? 'pointer' : 'not-allowed',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: hasDrawn ? '0 10px 30px rgba(212, 175, 55, 0.4)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={() => {
                      if (hasDrawn) sound.playHover();
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>Stamp & Seal Agreement with Love</span>
                    <Sparkles size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDownload}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '9999px',
                      background: 'rgba(212, 175, 55, 0.16)',
                      border: '1.5px solid rgba(212, 175, 55, 0.55)',
                      color: '#FFD700',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      sound.playHover();
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.28)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.16)';
                    }}
                    title="Save High-Res Certificate to iPad Photos"
                  >
                    <Download size={15} />
                    <span>Save Signed Certificate to iPad</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Certificate Footer Stamp */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '36px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(247, 214, 208, 0.14)',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              color: 'rgba(247, 214, 208, 0.65)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={13} color="#D4AF37" />
              <span>Certified under Section 143 of Eternal Romance & Unlimited Madness</span>
            </div>
            <div style={{ color: '#FFD700', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '11px' }}>
              ✦ WITNESSED BY SOYABEAN & SHUTTU ✦
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sealDrop {
          0% {
            transform: scale(2.2) rotate(35deg);
            opacity: 0;
          }
          70% {
            transform: scale(0.95) rotate(-15deg);
            opacity: 1;
          }
          100% {
            transform: scale(1.05) rotate(-12deg);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};
