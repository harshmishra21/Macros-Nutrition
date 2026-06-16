import React from 'react';
import SectionTag from '../components/ui/SectionTag.jsx';

export function BlogPage() {
  const articles = [
    {
      title: 'THE SCIENCE OF PROTEIN ISOLATE ABSORPTION',
      category: 'RECOVERY',
      date: 'MAY 28, 2026',
      desc: 'Understand how cross-flow microfiltration retains key immunoglobulins and accelerates recovery windows compared to concentrate blends.',
      readTime: '6 MIN READ'
    },
    {
      title: 'CREATINE LOADING VS CONSISTENT DOSING',
      category: 'STRENGTH',
      date: 'MAY 15, 2026',
      desc: 'A clinical breakdown of ATP cellular saturation timelines. Why a consistent 5g daily dose beats high-volume loading phases.',
      readTime: '8 MIN READ'
    },
    {
      title: 'OPTIMIZING HYDRATION FOR ULTRA ENDURANCE',
      category: 'HYDRATION',
      date: 'APRIL 29, 2026',
      desc: 'How Sodium-to-Magnesium trace mineral ratios sustain blood plasma volumes and prevent muscle cramping during long training sessions.',
      readTime: '5 MIN READ'
    }
  ];

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 60px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <SectionTag text="MACROS EDUCATION HUB" />
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '20px' }}>
            SPORTS SCIENCE <span className="text-gold-gradient">JOURNALS</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            No marketing hype. Just peer-reviewed sports science, diet breakdowns, and performance training protocols written by coaches.
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid-3">
          {articles.map((art, idx) => (
            <div 
              key={idx}
              style={{
                background: 'var(--black3)',
                border: '1px solid rgba(255,255,255,0.03)',
                padding: '40px 30px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
              className="article-card interactive-element"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontFamily: 'var(--ff-mono)', fontSize: '9px', letterSpacing: '1px' }}>
                  <span style={{ color: 'var(--gold)' }}>{art.category}</span>
                  <span style={{ color: 'var(--white-muted)' }}>{art.date}</span>
                </div>
                <h3 style={{ fontSize: '24px', color: '#FFF', marginBottom: '14px', lineHeight: '1.1' }} className="article-title">
                  {art.title}
                </h3>
                <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>
                  {art.desc}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', fontFamily: 'var(--ff-mono)', fontSize: '10px' }}>
                <span style={{ color: 'var(--gold)' }} className="read-link">READ JOURNAL &rarr;</span>
                <span style={{ color: 'var(--white-muted)' }}>{art.readTime}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .article-card:hover {
          border-color: rgba(201, 168, 76, 0.3) !important;
          transform: translateY(-4px);
        }
        .article-card:hover .article-title {
          color: var(--gold-bright) !important;
        }
        .article-card:hover .read-link {
          color: var(--gold-bright) !important;
        }
      `}</style>
    </div>
  );
}

export default BlogPage;
