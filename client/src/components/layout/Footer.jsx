import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Linkedin, Send } from 'lucide-react';
import Logo from '../ui/Logo.jsx';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer 
      style={{
        background: 'var(--black3)',
        borderTop: '1px solid rgba(201, 168, 76, 0.15)',
        padding: '80px 60px 40px',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        {/* 4-Column Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '64px',
            marginBottom: '60px'
          }}
          className="footer-grid"
        >
          {/* Col 1 - Brand Info */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
              <Logo variant="horizontal" size="md" />
            </Link>
            <p style={{ marginBottom: '24px', fontSize: '15px', maxWidth: '320px' }}>
              India's first AI-native premium sports nutrition brand. Fueling peak human athletic performance with lab-certified ingredients and precision AI-powered dosing.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social interactive-element">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social interactive-element">
                <Youtube size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social interactive-element">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social interactive-element">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Col 2 - Shop */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '16px', marginBottom: '24px', fontFamily: 'var(--ff-mono)', letterSpacing: '2px' }}>SHOP</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/products?category=protein" className="footer-link interactive-element">Whey Protein</Link>
              <Link to="/products?category=pre-workout" className="footer-link interactive-element">Pre-Workout</Link>
              <Link to="/products?category=creatine" className="footer-link interactive-element">Creatine Monohydrate</Link>
              <Link to="/products?category=vitamins" className="footer-link interactive-element">Daily Vitamins</Link>
              <Link to="/products?category=functional-foods" className="footer-link interactive-element">Functional Oats</Link>
            </div>
          </div>

          {/* Col 3 - Company */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '16px', marginBottom: '24px', fontFamily: 'var(--ff-mono)', letterSpacing: '2px' }}>COMPANY</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/about" className="footer-link interactive-element">Why Macros</Link>
              <Link to="/ai-coach" className="footer-link interactive-element">AI Nutrition Coach</Link>
              <Link to="/blog" className="footer-link interactive-element">Education Hub</Link>
              <Link to="/transformations" className="footer-link interactive-element">Athlete Testimonials</Link>
              <Link to="/coa" className="footer-link interactive-element">Lab Reports (COA)</Link>
            </div>
          </div>

          {/* Col 4 - Support */}
          <div>
            <h4 style={{ color: 'var(--white)', fontSize: '16px', marginBottom: '24px', fontFamily: 'var(--ff-mono)', letterSpacing: '2px' }}>SUPPORT</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" className="footer-link interactive-element">Help & FAQ</a>
              <a href="#" className="footer-link interactive-element">Returns & Refunds</a>
              <a href="#" className="footer-link interactive-element">Shipping & Delivery</a>
              <a href="#" className="footer-link interactive-element">Corporate Wholesale</a>
              <a href="#" className="footer-link interactive-element">Contact Support</a>
            </div>
          </div>
        </div>

        {/* Newsletter Signup Row */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '40px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '40px'
          }}
          className="newsletter-row"
        >
          <div>
            <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '24px', color: 'var(--white)', marginBottom: '8px' }}>JOIN 50,000+ ELITE ATHLETES</h3>
            <p style={{ fontSize: '14px', margin: 0 }}>Subscribe to receive early releases, training guides, and macro tips.</p>
          </div>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', width: '100%', maxWidth: '460px' }}>
            <input 
              type="email" 
              placeholder="ENTER ATHLETE EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: 'var(--black4)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--white)',
                fontFamily: 'var(--ff-body)',
                fontSize: '13px',
                padding: '14px 20px',
                flex: 1,
                outline: 'none',
                letterSpacing: '2px'
              }}
              required
            />
            <button 
              type="submit" 
              className="btn-gold interactive-element" 
              style={{ 
                padding: '14px 30px', 
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {subscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'} <Send size={14} />
            </button>
          </form>
        </div>
        {/* Mobile Creative CTA */}
        <div className="mobile-cta">
          <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '22px', color: 'var(--white)', marginBottom: '12px', textAlign: 'center' }}>Stay Connected On The Go</h3>
          <p style={{ fontSize: '14px', color: 'var(--white-muted)', marginBottom: '16px', textAlign: 'center' }}>Download our app for exclusive offers and personalized nutrition plans.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Apple App Store Badge */}
            <a href="#" className="store-badge-link interactive-element" aria-label="Download on the App Store">
              <svg xmlns="http://www.w3.org/2000/svg" width="135" height="40" viewBox="0 0 135 40" role="img" aria-label="Download on the App Store">
                <rect width="135" height="40" rx="6" fill="#000"/>
                <rect x="0.5" y="0.5" width="134" height="39" rx="5.5" fill="none" stroke="#A6A6A6" strokeWidth="1"/>
                {/* Apple Logo */}
                <path d="M19.5 8.3c1.1-1.3 1.8-3.1 1.6-4.9-1.6.1-3.5 1.1-4.6 2.4-1 1.1-1.9 2.9-1.7 4.7 1.8.1 3.6-.9 4.7-2.2z" fill="#fff"/>
                <path d="M21.1 11c-2.6-.1-4.8 1.5-6 1.5-1.3 0-3.2-1.4-5.3-1.4-2.7.1-5.3 1.6-6.6 4.1-2.8 4.9-.7 12.1 2 16.1 1.3 2 2.9 4.1 5 4 2-.1 2.8-1.3 5.2-1.3 2.4 0 3.1 1.3 5.2 1.2 2.2 0 3.5-2 4.8-3.9 1.5-2.2 2.1-4.4 2.1-4.5-.1 0-4-1.5-4.1-6.1-.1-3.8 3.1-5.6 3.2-5.7-1.7-2.6-4.4-2.9-5.5-3z" fill="#fff"/>
                {/* "Download on the" text */}
                <text x="32" y="14" fontFamily="-apple-system, 'Helvetica Neue', Arial, sans-serif" fontSize="9" fill="#fff" letterSpacing="0.2">Download on the</text>
                {/* "App Store" text */}
                <text x="31" y="28" fontFamily="-apple-system, 'Helvetica Neue', Arial, sans-serif" fontSize="17" fontWeight="600" fill="#fff" letterSpacing="-0.3">App Store</text>
              </svg>
            </a>

            {/* Google Play Badge */}
            <a href="#" className="store-badge-link interactive-element" aria-label="Get it on Google Play">
              <svg xmlns="http://www.w3.org/2000/svg" width="135" height="40" viewBox="0 0 135 40" role="img" aria-label="Get it on Google Play">
                <rect width="135" height="40" rx="6" fill="#000"/>
                <rect x="0.5" y="0.5" width="134" height="39" rx="5.5" fill="none" stroke="#A6A6A6" strokeWidth="1"/>
                {/* Google Play triangle icon with 4-color segments */}
                <path d="M9.7 8.2c-.4.4-.6 1-.6 1.8v20c0 .8.2 1.4.6 1.8l.1.1 11.2-11.2v-.3L9.8 8.1l-.1.1z" fill="url(#gp-blue)"/>
                <path d="M24.7 23.1l-3.7-3.7v-.3l3.7-3.7.1.1 4.4 2.5c1.3.7 1.3 1.9 0 2.6l-4.4 2.5h-.1z" fill="url(#gp-yellow)"/>
                <path d="M24.8 23l-3.8-3.8L9.7 30.5c.4.5 1.1.5 2 .1l13.1-7.6z" fill="url(#gp-red)"/>
                <path d="M24.8 17l-13.1-7.6c-.9-.5-1.6-.4-2 .1l11.3 11.3L24.8 17z" fill="url(#gp-green)"/>
                <defs>
                  <linearGradient id="gp-blue" x1="18.5" y1="9.1" x2="4.7" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00A0FF"/>
                    <stop offset="1" stopColor="#0068B5"/>
                  </linearGradient>
                  <linearGradient id="gp-yellow" x1="29.7" y1="19.2" x2="9.3" y2="19.2" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFD000"/>
                    <stop offset="1" stopColor="#FFBC00"/>
                  </linearGradient>
                  <linearGradient id="gp-red" x1="22.8" y1="21.5" x2="7.4" y2="37.4" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF3A44"/>
                    <stop offset="1" stopColor="#C31162"/>
                  </linearGradient>
                  <linearGradient id="gp-green" x1="7.9" y1="1.5" x2="15.2" y2="9.2" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#32A071"/>
                    <stop offset="1" stopColor="#2DA771"/>
                  </linearGradient>
                </defs>
                {/* "GET IT ON" text */}
                <text x="36" y="14" fontFamily="'Roboto', Arial, sans-serif" fontSize="8.5" fill="#fff" letterSpacing="0.5">GET IT ON</text>
                {/* "Google Play" text */}
                <text x="35" y="28" fontFamily="'Roboto', Arial, sans-serif" fontSize="16" fontWeight="500" fill="#fff" letterSpacing="-0.2">Google Play</text>
              </svg>
            </a>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontFamily: 'var(--ff-mono)',
            fontSize: '10px',
            color: 'var(--white-muted)',
            letterSpacing: '1px'
          }}
        >
          <div>
            © 2026 MACROS NUTRITION. ALL RIGHTS RESERVED. FSSAI LIC NO. 10024022000451
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" className="footer-link interactive-element">PRIVACY POLICY</a>
            <a href="#" className="footer-link interactive-element">TERMS & CONDITIONS</a>
            <a href="#" className="footer-link interactive-element">SHIPPING POLICY</a>
          </div>
        </div>
      </div>

      {/* Embedded CSS for hover translations and responsiveness */}
      <style>{`
        .footer-social {
          color: var(--silver);
          background: var(--black4);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .mobile-cta {
          background: rgba(20,20,30,0.85);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 24px 20px;
          text-align: center;
          margin-bottom: 32px;
          animation: fadeInUp 0.6s ease-out;
        }
        .store-badge-link {
          display: inline-block;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.25s ease, filter 0.25s ease;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
        }
        .store-badge-link:hover {
          transform: scale(1.06) translateY(-2px);
          filter: drop-shadow(0 6px 16px rgba(0,0,0,0.6));
        }
        .store-badge-link svg {
          display: block;
        }
        .footer-link {
          font-family: var(--ff-body);
          font-size: 15px;
          color: var(--white-muted);
          text-decoration: none;
          display: inline-block;
          position: relative;
          transition: color 180ms ease, transform 180ms ease;
          letter-spacing: 0.6px;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          height: 2px;
          width: 0;
          background: linear-gradient(90deg, var(--gold-bright), var(--gold));
          transition: width 220ms ease;
          border-radius: 2px;
        }
        .footer-link:hover {
          color: var(--gold);
          transform: translateX(6px);
        }
        .footer-link:hover::after { width: 100%; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
          .newsletter-row {
            flex-direction: column;
            align-items: flex-start !important;
          }
          .newsletter-row form {
            max-width: 100% !important;
          }
        }
        @media (max-width: 500px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
