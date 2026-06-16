import React from 'react';

export function SectionTag({ text, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        fontFamily: 'var(--ff-mono)',
        fontSize: '10px',
        fontWeight: 'bold',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ...style
      }}
    >
      <span style={{ width: '12px', height: '1px', backgroundColor: 'var(--gold)', display: 'inline-block' }}></span>
      {text}
    </div>
  );
}

export default SectionTag;
