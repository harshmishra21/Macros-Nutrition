import React from 'react';
import { Link } from 'react-router-dom';
import { getProductImageUrl } from '../../utils/products.js';

export function SuppCard({ name, category, emoji, desc, macros = [], image, slug }) {
  const content = (
  <div className="supp-card" style={{ height: '100%' }}>
      {image ? (
        <div
          style={{
            height: '120px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <img
            src={getProductImageUrl(image)}
            alt={name}
            style={{ maxHeight: '100px', maxWidth: '90%', objectFit: 'contain' }}
          />
        </div>
      ) : (
        <div
          style={{
            fontSize: '36px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 0 10px rgba(201, 168, 76, 0.15))',
          }}
        >
          {emoji}
        </div>
      )}

      <span
        style={{
          fontFamily: 'var(--ff-mono)',
          fontSize: '9px',
          color: 'var(--gold)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '8px',
        }}
      >
        {category}
      </span>

      <h3
        style={{
          fontFamily: 'var(--ff-display)',
          fontSize: '24px',
          color: 'var(--white)',
          marginBottom: '12px',
          letterSpacing: '1px',
        }}
      >
        {name}
      </h3>

      <p
        style={{
          fontSize: '13px',
          lineHeight: '1.6',
          marginBottom: '20px',
          color: 'var(--white-muted)',
        }}
      >
        {desc}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {macros.map((macro, idx) => (
          <span
            key={idx}
            style={{
              fontFamily: 'var(--ff-mono)',
              fontSize: '8px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              color: 'var(--gold)',
              padding: '4px 8px',
              background: 'rgba(201, 168, 76, 0.05)',
              textTransform: 'uppercase',
            }}
          >
            {macro}
          </span>
        ))}
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link to={`/products/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }} className="interactive-element">
        {content}
      </Link>
    );
  }

  return content;
}

export default SuppCard;
