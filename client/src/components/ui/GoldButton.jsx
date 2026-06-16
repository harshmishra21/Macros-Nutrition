import React from 'react';

export function GoldButton({ children, onClick, type = 'button', style = {}, className = '', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-gold interactive-element ${className}`}
      style={{
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        ...style
      }}
    >
      {children}
    </button>
  );
}

export default GoldButton;
