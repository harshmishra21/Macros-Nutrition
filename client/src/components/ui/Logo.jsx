import React from 'react';

export function Logo({ 
  variant = 'icon', // 'icon' | 'horizontal' | 'vertical' | 'footer'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showTagline = true,
  style = {} 
}) {
  // Size dimensions for the SVG icon (scaled up for better visibility)
  const iconSizes = {
    sm: { width: 44, height: 36 },
    md: { width: 68, height: 55 },
    lg: { width: 110, height: 90 },
    xl: { width: 180, height: 146 }
  };

  const currentSize = iconSizes[size] || iconSizes.md;

  const monogram = (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="20 15 160 135" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        {/* Metallic Gold Gradients */}
        <linearGradient id="logo-gold-left" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A6B22" />
          <stop offset="30%" stopColor="#C9A84C" />
          <stop offset="50%" stopColor="#FFE596" />
          <stop offset="70%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#6E5013" />
        </linearGradient>

        <linearGradient id="logo-gold-right" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8A6B22" />
          <stop offset="30%" stopColor="#C9A84C" />
          <stop offset="50%" stopColor="#FFE596" />
          <stop offset="70%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#6E5013" />
        </linearGradient>

        {/* Metallic Silver Gradients */}
        <linearGradient id="logo-silver-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8B4C0" />
          <stop offset="30%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#E5E8EB" />
          <stop offset="100%" stopColor="#8795A3" />
        </linearGradient>

        <linearGradient id="logo-silver-dark" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6B7280" />
          <stop offset="50%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>

        {/* Subtle Drop Shadow for 3D depth */}
        <filter id="logo-depth-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.55" />
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#logo-depth-shadow)">
        {/* Layer 1: Top Chevron (Back of the fold) */}
        {/* Left Silver Side */}
        <path d="M 40 45 L 100 90 L 100 105 L 40 60 Z" fill="url(#logo-silver-light)" />
        {/* Right Gold Side */}
        <path d="M 100 90 L 160 45 L 160 60 L 100 105 Z" fill="url(#logo-gold-right)" />

        {/* Layer 2: Middle Ribbon Chevron */}
        {/* Left Silver Side */}
        <path d="M 60 90 L 100 118 L 100 130 L 60 102 Z" fill="url(#logo-silver-light)" />
        {/* Right Gold Side */}
        <path d="M 100 118 L 140 90 L 140 102 L 100 130 Z" fill="url(#logo-gold-right)" opacity="0.95" />

        {/* Layer 3: Left Pillar (Gold Foreground) */}
        <path d="M 40 45 L 60 30 L 60 90 L 52 90 L 52 140 L 40 140 Z" fill="url(#logo-gold-left)" />
        {/* Left Pillar Inner Bevel Shadow */}
        <path d="M 52 90 L 60 90 L 60 30 L 52 36 Z" fill="#000000" opacity="0.15" />

        {/* Layer 3: Right Pillar (Gold Foreground) */}
        <path d="M 160 45 L 140 30 L 140 90 L 148 90 L 148 140 L 160 140 Z" fill="url(#logo-gold-right)" />
        {/* Right Pillar Inner Bevel Shadow */}
        <path d="M 148 90 L 140 90 L 140 30 L 148 36 Z" fill="#000000" opacity="0.15" />

        {/* Layer 4: Center Embossed Shield (Foreground Cap) */}
        {/* Left Half (Bright Silver) */}
        <path d="M 88 88 L 100 78 L 100 128 L 88 118 Z" fill="url(#logo-silver-light)" />
        {/* Right Half (Shaded Silver for 3D Bevel) */}
        <path d="M 100 78 L 112 88 L 112 118 L 100 128 Z" fill="url(#logo-silver-dark)" />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div 
        style={{ 
          width: `${currentSize.width}px`, 
          height: `${currentSize.height}px`,
          ...style 
        }}
      >
        {monogram}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: size === 'sm' ? '14px' : size === 'lg' ? '22px' : '18px',
          textDecoration: 'none',
          ...style 
        }}
      >
        <div style={{ width: `${currentSize.width}px`, height: `${currentSize.height}px`, flexShrink: 0 }}>
          {monogram}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span 
            style={{
              fontFamily: 'var(--ff-display)',
              fontSize: size === 'sm' ? '24px' : size === 'lg' ? '40px' : '32px',
              fontWeight: 'normal',
              lineHeight: '1',
              background: 'linear-gradient(135deg, #FFFFFF 0%, var(--silver) 50%, #8795A3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '2.5px',
              textTransform: 'uppercase'
            }}
          >
            MACROS
          </span>
          <span 
            style={{
              fontFamily: 'var(--ff-mono)',
              fontSize: size === 'sm' ? '9px' : size === 'lg' ? '14px' : '12px',
              fontWeight: 'bold',
              lineHeight: '1',
              color: 'var(--gold)',
              letterSpacing: '4.5px',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}
          >
            NUTRITION
          </span>
        </div>
      </div>
    );
  }

  // Full stack representation (e.g. for Home Hero landing page or Login page)
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        padding: '20px',
        maxWidth: '460px',
        margin: '0 auto',
        ...style 
      }}
    >
      {/* 3D Icon Monogram */}
      <div 
        style={{ 
          width: size === 'xl' ? '180px' : size === 'lg' ? '120px' : '100px', 
          height: size === 'xl' ? '146px' : size === 'lg' ? '98px' : '82px',
          marginBottom: '24px',
          filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))'
        }}
      >
        {monogram}
      </div>

      {/* Brand Name "MACROS" */}
      <h1 
        style={{
          fontFamily: 'var(--ff-display)',
          fontSize: size === 'xl' ? '72px' : size === 'lg' ? '54px' : '48px',
          lineHeight: '1',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #E5E8EB 40%, #A8B4C0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '5px',
          margin: '0 0 6px 0',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
        }}
      >
        MACROS
      </h1>

      {/* Sub-brand text "NUTRITION" flanked by horizontal gold bars */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '100%', 
          gap: '16px',
          marginBottom: showTagline ? '20px' : '0'
        }}
      >
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }}></div>
        <span 
          style={{
            fontFamily: 'var(--ff-body)',
            fontSize: size === 'xl' ? '20px' : size === 'lg' ? '16px' : '14px',
            fontWeight: '700',
            color: 'var(--gold)',
            letterSpacing: '7px',
            textTransform: 'uppercase',
            display: 'inline-block'
          }}
        >
          NUTRITION
        </span>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(270deg, transparent, var(--gold))' }}></div>
      </div>

      {/* Tagline */}
      {showTagline && (
        <p 
          style={{
            fontFamily: 'var(--ff-mono)',
            fontSize: size === 'xl' ? '12px' : size === 'lg' ? '10px' : '9px',
            letterSpacing: '3px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            margin: '0'
          }}
        >
          FUEL EVERY <span style={{ color: 'var(--gold)' }}>MACRO</span> OF YOUR LIFE.
        </p>
      )}
    </div>
  );
}

export default Logo;
