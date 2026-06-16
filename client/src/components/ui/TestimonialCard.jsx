import React from 'react';

export function TestimonialCard({ text, author, role, result, initials }) {
  return (
    <div className="testimonial">
      {/* Quote Mark */}
      <span 
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '60px',
          color: 'var(--gold)',
          opacity: 0.25,
          position: 'absolute',
          top: '20px',
          left: '20px',
          lineHeight: '1',
          pointerEvents: 'none'
        }}
      >
        “
      </span>

      {/* Quote Content */}
      <p 
        style={{
          fontStyle: 'italic',
          fontSize: '15px',
          lineHeight: '1.6',
          color: 'var(--white-muted)',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {text}
      </p>

      {/* Author & Stat details */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar Initials */}
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
              color: 'var(--black)',
              fontFamily: 'var(--ff-display)',
              fontSize: '18px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {initials}
          </div>
          <div>
            <h5 
              style={{
                fontFamily: 'var(--ff-display)',
                fontSize: '18px',
                color: 'var(--white)',
                letterSpacing: '1px',
                marginBottom: '2px'
              }}
            >
              {author}
            </h5>
            <span 
              style={{
                fontFamily: 'var(--ff-mono)',
                fontSize: '9px',
                color: 'var(--white-muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Result Stat Badge */}
        <div 
          style={{
            fontFamily: 'var(--ff-display)',
            fontSize: '22px',
            color: 'var(--gold)',
            letterSpacing: '1px',
            textAlign: 'right'
          }}
        >
          {result}
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
