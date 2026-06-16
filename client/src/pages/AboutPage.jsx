import React from 'react';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldLine from '../components/ui/GoldLine.jsx';

export function AboutPage() {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 60px' }}>

        <div style={{ marginBottom: '80px', textAlign: 'center' }}>
          <SectionTag text="BHARAT KI SPORTS NUTRITION" />
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '20px' }}>
            NOT A SUPPLEMENT STORE. <br />
            <span className="text-gold-gradient">A METABOLIC ECOSYSTEM.</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '16px', color: 'var(--white-muted)' }}>
            India's first AI-native sports nutrition brand — engineered in India, for Indian athletes.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'center', marginBottom: '80px' }}>
          <div>
            <h3 style={{ fontSize: '28px', color: '#FFF', marginBottom: '20px' }}>THE AI-NATIVE INDIAN BRAND</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
              Macros Nutrition was born from a simple realization: Indian athletes deserve better. Too many brands sell generic formulas, hide ingredients behind proprietary blends, and load products with unnecessary sugars.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              We've built a direct synergy between premium domestic manufacturing and fitness-tech diagnostics. By taking biometrics, activity rates, and Indian dietary patterns into account, our AI engines compute exact amino ratios and calorie limits tailored for you.
            </p>
          </div>
          <div style={{ background: 'var(--black3)', border: '1px solid rgba(201,168,76,0.15)', padding: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--gold)', fontSize: '18px', marginBottom: '6px' }}>🇮🇳 Made in India</h4>
                <p style={{ fontSize: '13px', margin: 0 }}>Proudly manufactured in India with globally sourced premium raw materials, supporting local athletes and the Make in India initiative.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--gold)', fontSize: '18px', marginBottom: '6px' }}>🔬 FSSAI & Triple Certified</h4>
                <p style={{ fontSize: '13px', margin: 0 }}>Every batch is FSSAI approved, GMP certified, and tested by third-party ISO labs to ensure zero heavy metals and full label transparency.</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--gold)', fontSize: '18px', marginBottom: '6px' }}>🌿 Zero Added Sugar</h4>
                <p style={{ fontSize: '13px', margin: 0 }}>Zero glycemic botanical compounds sweeten our blends — keeping insulin spikes at bay for clean, sustained energy.</p>
              </div>
            </div>
          </div>
        </div>

        <GoldLine />

        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>OUR VISION</h3>
          <p style={{ fontSize: '18px', color: 'var(--white)', fontStyle: 'italic', lineHeight: '1.6' }}>
            "To build India's most transparent sports nutrition ecosystem — empowering every athlete from gym floors to national arenas with precision macros, zero filler ingredients, and AI-driven fitness technology."
          </p>
        </div>

      </div>
    </div>
  );
}

export default AboutPage;
