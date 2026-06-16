import React from 'react';

export function GoldLine({ style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        height: '1px',
        width: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 20%, var(--gold) 50%, rgba(201,168,76,0.3) 80%, transparent)',
        margin: '40px 0',
        ...style
      }}
    />
  );
}

export default GoldLine;
