import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.js';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import { stackConfig } from '../utils/stackConfig.js';
import { getProductImageUrl } from '../utils/products.js';
import { ChevronRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function StackBuilderPage() {
  const navigate = useNavigate();
  const { addStack } = useCartStore();
  const [activeGoal, setActiveGoal] = useState('muscle');

  const handleAddStackToCart = () => {
    const products = stackConfig[activeGoal].products;
    const itemsToAdd = products.map(p => ({
      product: p.id,
      name: p.name,
      flavor: 'Chocolate',
      size: p.size,
      price: p.price,
      quantity: 1
    }));
    addStack(itemsToAdd);
    navigate('/cart');
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 60px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <SectionTag text="STACK COMPILER ENGINE" />
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '20px' }}>
            BUILD YOUR <span className="text-gold-gradient">PERFECT STACK</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Choose your target. Our compiler selects synergistically active sports supplements, saving you 30% off the standard price.
          </p>
        </div>

        {/* Stack builder grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px' }} className="builder-layout">
          
          {/* Left - Goal choices */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.keys(stackConfig).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveGoal(key)}
                  className="interactive-element"
                  style={{
                    width: '100%',
                    padding: '30px',
                    background: activeGoal === key ? 'rgba(201, 168, 76, 0.08)' : 'var(--black3)',
                    border: activeGoal === key ? '1px solid var(--gold)' : '1px solid rgba(255, 255, 255, 0.03)',
                    color: 'var(--white)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div>
                    <h3 
                      style={{ 
                        fontFamily: 'var(--ff-display)', 
                        fontSize: '24px', 
                        color: activeGoal === key ? 'var(--gold)' : 'var(--white)',
                        letterSpacing: '1px',
                        marginBottom: '4px'
                      }}
                    >
                      {stackConfig[key].title}
                    </h3>
                    <span style={{ fontSize: '14px', color: 'var(--white-muted)' }}>{stackConfig[key].sub}</span>
                  </div>
                  <ChevronRight size={22} style={{ color: activeGoal === key ? 'var(--gold)' : 'var(--white-muted)' }} />
                </button>
              ))}
            </div>

            {/* Quality seal info */}
            <div style={{ background: 'var(--black3)', border: '1px solid rgba(255,255,255,0.02)', padding: '30px', marginTop: '40px', display: 'flex', gap: '20px', alignItems: 'center' }}>
              <ShieldCheck size={36} style={{ color: 'var(--gold)' }} />
              <div>
                <h4 style={{ fontSize: '18px', color: 'var(--white)', marginBottom: '4px' }}>SYNERGISTIC EFFICIENCY TESTED</h4>
                <p style={{ fontSize: '13px', margin: 0 }}>Formulas are combined so that amino acids, creatine uptake agents, and rehydrating ions complement each other perfectly during loading phases.</p>
              </div>
            </div>
          </div>

          {/* Right - Compiled stack display */}
          <div>
            <div 
              className="glass-panel"
              style={{
                padding: '40px',
                border: '1px solid rgba(201, 168, 76, 0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px' }}>COMPILED STACK BUNDLE</span>
                <span style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--gold)' }}>03 FORMULAS</span>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                {stackConfig[activeGoal].products.map((prod, idx) => (
                  <Link 
                    key={idx} 
                    to={`/products/${prod.slug}`}
                    className="interactive-element stack-product-row"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '20px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.03)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                  >
                    <div 
                      style={{
                        width: '64px',
                        height: '64px',
                        flexShrink: 0,
                        borderRadius: '6px',
                        overflow: 'hidden',
                        background: 'rgba(201,168,76,0.08)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.25s ease'
                      }}
                      className="stack-image-container"
                    >
                      <img
                        src={getProductImageUrl(prod.image)}
                        alt={prod.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.style.background = 'var(--gold)';
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '20px', color: 'var(--white)', margin: 0, transition: 'color 0.25s ease' }} className="stack-product-name">{prod.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--white-muted)', margin: 0 }}>{prod.size}</p>
                    </div>
                    <div style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', color: 'var(--gold)' }}>
                      ₹{prod.price}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Price Details */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px' }}>Original MRP Total</span>
                  <span style={{ fontFamily: 'var(--ff-mono)', textDecoration: 'line-through', color: 'var(--white-muted)' }}>
                    ₹{stackConfig[activeGoal].products.reduce((acc, curr) => acc + (curr.price * 1.3), 0).toFixed(0)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Bundle Stack Price</span>
                  <span style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--gold)' }}>
                    ₹{stackConfig[activeGoal].products.reduce((acc, curr) => acc + curr.price, 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span></span>
                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--terminal-green)' }}>
                    SAVE ₹{Math.round(stackConfig[activeGoal].products.reduce((acc, curr) => acc + (curr.price * 0.3), 0))} (30% DISCOUNT)
                  </span>
                </div>
              </div>

              <GoldButton onClick={handleAddStackToCart} style={{ width: '100%', height: '52px', fontSize: '14px' }}>
                ADD BUNDLE TO CART
              </GoldButton>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .stack-product-row:hover {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(201, 168, 76, 0.35) !important;
          transform: translateX(6px);
        }
        .stack-product-row:hover .stack-product-name {
          color: var(--gold) !important;
        }
        .stack-product-row:hover .stack-image-container {
          transform: scale(1.04);
          border-color: var(--gold) !important;
        }
        @media (max-width: 991px) {
          .builder-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default StackBuilderPage;
