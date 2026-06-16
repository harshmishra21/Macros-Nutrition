import React from 'react';

export function TerminalLine({ prefix, text, type = 'default' }) {
  const getColors = () => {
    switch (type) {
      case 'success':
      case 'computing':
      case 'result':
        return { color: 'var(--terminal-green)' };
      case 'error':
        return { color: 'var(--terminal-red)' };
      case 'input':
        return { color: 'var(--silver)' };
      case 'highlight':
        return { color: 'var(--gold-bright)' };
      default:
        return { color: 'var(--white)' };
    }
  };

  const style = getColors();

  return (
    <div 
      style={{
        fontFamily: 'var(--ff-mono)',
        fontSize: '12px',
        lineHeight: '2',
        marginBottom: '6px',
        wordBreak: 'break-word',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px'
      }}
    >
      {prefix && (
        <span 
          style={{
            color: type === 'error' ? 'var(--terminal-red)' : 'var(--gold)',
            flexShrink: 0,
            fontWeight: 'bold'
          }}
        >
          {prefix}
        </span>
      )}
      <span style={style}>{text}</span>
    </div>
  );
}

export default TerminalLine;
