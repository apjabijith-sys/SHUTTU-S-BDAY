import React from 'react';

export const MarqueeBanner: React.FC = () => {
  const items = [
    'Shuttu',
    'Unlimited Madness',
    'A Little Universe',
    'Special Edition',
    'Shuttu & Soyabean',
    'October 19',
    'Timeless Love',
    'Shuttu',
    'Forever Yours',
    'Happy Birthday',
  ];

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#1f0308',
        borderTop: '1px solid rgba(247, 214, 208, 0.15)',
        borderBottom: '1px solid rgba(247, 214, 208, 0.15)',
        padding: '16px 0',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div className="marquee-track">
        {/* Render twice for seamless loop */}
        {[...items, ...items].map((text, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              paddingRight: '28px',
              color: 'var(--color-blush-200)',
              fontFamily: 'var(--font-serif)',
              fontSize: '15px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              opacity: 0.85,
            }}
          >
            <span>{text}</span>
            <span style={{ fontSize: '8px', opacity: 0.5 }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
