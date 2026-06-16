import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Check, ChevronRight, Send, Star, Zap, Dumbbell, Sparkles, Heart } from 'lucide-react';
import HeroVisual from '../components/hero/HeroVisual.jsx';
import MacroMoleculeCanvas from '../components/three/MacroMoleculeCanvas.jsx';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import GhostButton from '../components/ui/GhostButton.jsx';
import SuppCard from '../components/ui/SuppCard.jsx';
import TestimonialCard from '../components/ui/TestimonialCard.jsx';
import TerminalLine from '../components/ui/TerminalLine.jsx';
import GoldLine from '../components/ui/GoldLine.jsx';
import Logo from '../components/ui/Logo.jsx';
import { useStatCounter } from '../hooks/useStatCounter.js';
import { useCartStore } from '../store/cartStore.js';
import api from '../services/api.js';

// Configuration maps
import { flavorConfig } from '../utils/flavorConfig.js';
import { stackConfig } from '../utils/stackConfig.js';
import { featuredUniverseProducts, ecosystemProducts, flavorProductMap } from '../utils/homeProducts.js';
import { getProductImageUrl } from '../utils/products.js';

export function HomePage() {
  const navigate = useNavigate();
  const { addStack } = useCartStore();
  // Active state hooks
  const [activeGoal, setActiveGoal] = useState('muscle');
  const [activeFlavor, setActiveFlavor] = useState('darkChocolate');
  const [flavorAnim, setFlavorAnim] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([
    { prefix: 'MACROS_AI >', text: 'Initializing Nutrition Intelligence...', type: 'success' },
    { prefix: 'INPUT >', text: 'Male | 26y | 80kg | 178cm', type: 'input' },
    { prefix: 'INPUT >', text: 'Goal: Lean Muscle Gain', type: 'input' },
    { prefix: 'INPUT >', text: 'Activity: High (5x/week training)', type: 'input' },
    { prefix: 'COMPUTING >', text: 'Calculating TDEE and target macros...', type: 'computing' },
    { prefix: 'RESULT >', text: 'TDEE: 3,120 kcal/day | Target Target: 3,370 kcal (hypertrophy surplus)', type: 'result' },
    { prefix: 'MACROS >', text: 'Protein: 176g | Carbs: 420g | Fat: 95g', type: 'highlight' },
    { prefix: 'STACK >', text: 'Recommended: Whey Isolate + Creatine + BCAA Matrix', type: 'highlight' },
    { prefix: 'STATUS >', text: 'Plan generated. 97.3% optimization match score.', type: 'success' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLoading, setTerminalLoading] = useState(false);

  // Why Macros Section Stats Counter Hook
  const sugarStat = useStatCounter('0G');
  const testedStat = useStatCounter('100%');
  const athletesStat = useStatCounter('12K+');
  const purityStat = useStatCounter('100%');
  const labelStat = useStatCounter('100%');
  const aiMatchStat = useStatCounter('#1');

  // Handle flavor switcher click
  const selectFlavor = (flavorKey) => {
    setActiveFlavor(flavorKey);
    setFlavorAnim(true);
    setTimeout(() => setFlavorAnim(false), 450);
  };

  // Add goal stack to cart
  const handleAddStackToCart = () => {
    const products = stackConfig[activeGoal];
    const itemsToAdd = products.map(p => ({
      product: p.id,
      name: p.name,
      flavor: p.flavor || 'Standard',
      size: p.size,
      price: p.price,
      image: p.image,
      quantity: 1,
    }));
    addStack(itemsToAdd);
    navigate('/cart');
  };

  // Handle Terminal Send
  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const userMessage = terminalInput;
    setTerminalHistory(prev => [...prev, { prefix: 'INPUT >', text: userMessage, type: 'input' }]);
    setTerminalInput('');
    setTerminalLoading(true);

    try {
      // Feed simulated chat history formatting
      const history = terminalHistory.map(h => ({
        role: h.prefix.includes('INPUT') ? 'user' : 'assistant',
        text: h.text
      }));

      const res = await api.post('/ai/chat', { history, message: userMessage });
      setTerminalHistory(prev => [...prev, { prefix: 'MACROS_AI >', text: res.data.text, type: 'highlight' }]);
    } catch (err) {
      setTerminalHistory(prev => [...prev, { prefix: 'ERROR >', text: 'Signal lost. Reconnecting nutrition satellite...', type: 'error' }]);
    } finally {
      setTerminalLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--black)', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section 
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '0 60px',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 65% 40%, rgba(201, 168, 76, 0.06) 0%, transparent 55%), var(--black)'
        }}
        className="hero-section"
      >
        <HeroVisual />

        {/* Text Overlay */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '800px', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <SectionTag text="PREMIUM SPORTS NUTRITION · EST. 2026" />
            
            <h1 
              style={{
                fontSize: 'clamp(60px, 9vw, 130px)',
                lineHeight: '0.9',
                fontFamily: 'var(--ff-display)',
                letterSpacing: '2px',
                color: 'var(--white)',
                marginBottom: '20px'
              }}
            >
              FUEL EVERY <br />
              <span className="text-gold-gradient">MACRO</span> <br />
              OF YOUR LIFE.
            </h1>

            <p style={{ fontSize: '18px', color: 'var(--white-muted)', marginBottom: '40px', maxWidth: '500px' }}>
              India's first AI-native sports nutrition brand. Engineered for high performance, backed by science, and dosed by intelligence.
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn-gold">SHOP PRODUCTS</Link>
              <Link to="/ai-coach" className="btn-ghost">GET AI PLAN</Link>
            </div>
          </div>
        </div>

        {/* Hero Stats (Bottom Right) */}
        <div 
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            display: 'flex',
            gap: '40px',
            zIndex: 10,
            pointerEvents: 'none'
          }}
          className="hero-stats-container"
        >
          <div style={{ textAlign: 'right' }}>
            <div className="text-gold-gradient" style={{ fontFamily: 'var(--ff-display)', fontSize: '38px' }}>500K+</div>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--white-muted)', letterSpacing: '2px' }}>ATHLETES</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-gold-gradient" style={{ fontFamily: 'var(--ff-display)', fontSize: '38px' }}>27G</div>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--white-muted)', letterSpacing: '2px' }}>PROTEIN / SERVING</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-gold-gradient" style={{ fontFamily: 'var(--ff-display)', fontSize: '38px' }}>0G</div>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--white-muted)', letterSpacing: '2px' }}>ADDED SUGAR</div>
          </div>
        </div>

        {/* Custom scroll indicator */}
        <div 
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 10,
            fontFamily: 'var(--ff-mono)',
            fontSize: '10px',
            letterSpacing: '2px',
            color: 'var(--white-muted)'
          }}
          className="scroll-indicator"
        >
          <span style={{ width: '40px', height: '1px', backgroundColor: 'var(--gold)', display: 'inline-block' }}></span>
          SCROLL
        </div>
      </section>

      {/* 2. TICKER BAR */}
      <div className="ticker-wrap">
        <div className="ticker-content">
          {[...Array(2)].map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="ticker-item">PREMIUM SPORTS NUTRITION <span className="ticker-dot"></span></span>
              <span className="ticker-item">ZERO ADDED SUGAR <span className="ticker-dot"></span></span>
              <span className="ticker-item">100% THIRD-PARTY LAB CERTIFIED <span className="ticker-dot"></span></span>
              <span className="ticker-item">AI PERSONALIZED NUTRITION <span className="ticker-dot"></span></span>
              <span className="ticker-item">ATHLETE APPROVED <span className="ticker-dot"></span></span>
              <span className="ticker-item">MADE IN INDIA <span className="ticker-dot"></span></span>
              <span className="ticker-item">FSSAI APPROVED <span className="ticker-dot"></span></span>
              <span className="ticker-item">GMP CERTIFIED <span className="ticker-dot"></span></span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. PRODUCT UNIVERSE (3x2 Grid) */}
      <section style={{ backgroundColor: 'var(--black2)' }}>
        <div className="container">
          <div style={{ marginBottom: '60px' }}>
            <SectionTag text="PRODUCT UNIVERSE" />
            <h2 style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}>
              EVERY PRODUCT. <span className="text-gold-gradient">ENGINEERED.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2px', background: 'rgba(255, 255, 255, 0.05)', padding: '2px' }}>
            {featuredUniverseProducts.map((product) => (
              <div
                key={product.id}
                className="universe-card"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <div className="universe-card-photo">
                  <img
                    src={getProductImageUrl(product.image)}
                    alt={`${product.name} - ${product.flavor}`}
                  />
                </div>
                <div className="universe-card-info">
                  {product.tags?.[0] && <div className="card-badge">{product.tags[0]}</div>}
                  <span className="tag">{product.category.toUpperCase()}</span>
                  <h3>{product.name.replace('Macros Nutrition ', '').toUpperCase()}</h3>
                  <p className="universe-flavor">{product.flavor}</p>
                  <p>{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SUPPLEMENT ECOSYSTEM (4x2 Grid) */}
      <section>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <SectionTag text="FULL ECOSYSTEM" />
              <h2 style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>EVERY GOAL. EVERY STACK.</h2>
            </div>
            <p style={{ maxWidth: '450px', fontSize: '15px' }}>
              We've created a comprehensive recovery ecosystem to support joint flexibility, cognitive focus, muscle recovery, and hydration balance.
            </p>
          </div>

          <div className="grid-4">
            {ecosystemProducts.map((product) => (
              <SuppCard
                key={product.id}
                name={product.name.replace('Macros Nutrition ', '')}
                category={product.category}
                desc={product.description}
                macros={product.macros}
                image={product.image}
                slug={product.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. BUILD YOUR STACK */}
      <section style={{ backgroundColor: 'var(--black2)' }} id="stack-builder">
        <div className="container">
          <div className="grid-2">
            
            {/* Goal selector */}
            <div>
              <SectionTag text="SMART RECOMMENDATIONS" />
              <h2 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '20px' }}>
                BUILD YOUR <br />
                <span className="text-gold-gradient">PERFECT STACK</span>
              </h2>
              <p style={{ marginBottom: '40px', fontSize: '16px' }}>
                Select your primary fitness objective. Our AI matching system will compile the ideal synergistic stack of formulas to accelerate your goals.
              </p>

              {/* Goal list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.keys(stackConfig).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveGoal(key)}
                    className="interactive-element"
                    style={{
                      width: '100%',
                      padding: '24px 30px',
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
                      <div 
                        style={{ 
                          fontFamily: 'var(--ff-display)', 
                          fontSize: '22px', 
                          color: activeGoal === key ? 'var(--gold)' : 'var(--white)',
                          letterSpacing: '1px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <span>{stackConfig[key].title}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--white-muted)' }}>{stackConfig[key].sub}</span>
                    </div>
                    <ChevronRight size={20} style={{ color: activeGoal === key ? 'var(--gold)' : 'var(--white-muted)' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky stack result */}
            <div style={{ position: 'relative' }}>
              <div 
                className="glass-panel"
                style={{
                  position: 'sticky',
                  top: '120px',
                  padding: '40px',
                  border: '1px solid rgba(201, 168, 76, 0.2)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px' }}>YOUR RECOMMENDED STACK</span>
                  <span style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--gold)' }}>03 PRODUCTS</span>
                </div>

                {/* Stack Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>
                  {stackConfig[activeGoal].products.map((prod, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '20px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.03)'
                      }}
                    >
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          background: 'var(--black4)',
                          border: '1px solid rgba(201,168,76,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        {prod.image ? (
                          <img
                            src={getProductImageUrl(prod.image)}
                            alt={prod.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                          />
                        ) : (
                          <span style={{ fontSize: '22px' }}>📦</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '20px', color: 'var(--white)', margin: 0 }}>{prod.name}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--white-muted)', margin: 0 }}>{prod.size}</p>
                      </div>
                      <div style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', color: 'var(--gold)' }}>
                        ₹{prod.price}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer calculations */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px' }}>Bundle Total</span>
                    <span style={{ fontFamily: 'var(--ff-mono)', textDecoration: 'line-through', color: 'var(--white-muted)' }}>
                      ₹{stackConfig[activeGoal].products.reduce((acc, curr) => acc + (curr.price * 1.3), 0).toFixed(0)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Stack Price</span>
                    <span style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--gold)' }}>
                      ₹{stackConfig[activeGoal].products.reduce((acc, curr) => acc + curr.price, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span></span>
                    <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--terminal-green)' }}>
                      SAVE ₹{Math.round(stackConfig[activeGoal].products.reduce((acc, curr) => acc + (curr.price * 0.3), 0))} (30% BUNDLE OFF)
                    </span>
                  </div>
                </div>

                <GoldButton onClick={handleAddStackToCart} style={{ width: '100%' }}>
                  ADD STACK TO CART
                </GoldButton>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. AI NUTRITION COACH + Particle macro molecule */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <MacroMoleculeCanvas />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid-2" style={{ alignItems: 'center' }}>
            
            {/* Left Copy */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <SectionTag text="AI-POWERED COACHING" />
              <h2 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '20px' }}>
                MEET YOUR <br />
                <span className="text-gold-gradient">NUTRITION AI</span>
              </h2>
              <p style={{ marginBottom: '40px', fontSize: '16px' }}>
                No generic programs. No static diets. Talk to Macros AI, trained on sports science, to compute metabolic stats and coordinate exact formulas in seconds.
              </p>

              {/* 2x2 Feature matrix */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px'
                }}
              >
                <div className="ai-feat">
                  <h4 style={{ fontSize: '18px', color: 'var(--white)', marginBottom: '8px' }}>🎯 MACRO CALCULATIONS</h4>
                  <p style={{ fontSize: '12px' }}>Biometric-specific split metrics matching exact TDEE targets.</p>
                </div>
                <div className="ai-feat">
                  <h4 style={{ fontSize: '18px', color: 'var(--white)', marginBottom: '8px' }}>📊 SEAMLESS TIMELINES</h4>
                  <p style={{ fontSize: '12px' }}>Continuous program adjustments as your performance metrics alter.</p>
                </div>
                <div className="ai-feat">
                  <h4 style={{ fontSize: '18px', color: 'var(--white)', marginBottom: '8px' }}>🔬 SUPPLEMENT INTEL</h4>
                  <p style={{ fontSize: '12px' }}>Ingredients data, dosages, and dosing time frames explained.</p>
                </div>
                <div className="ai-feat">
                  <h4 style={{ fontSize: '18px', color: 'var(--white)', marginBottom: '8px' }}>📈 PERFORMANCE PROGRESS</h4>
                  <p style={{ fontSize: '12px' }}>Correlate nutrition stacks to strength targets and sleep quality logs.</p>
                </div>
              </div>
            </div>

            {/* Right Terminal UI */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div 
                style={{
                  background: 'var(--black3)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Traffic dot header */}
                <div 
                  style={{
                    background: 'var(--black4)',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--terminal-red)' }}></span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--terminal-yellow)' }}></span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--terminal-green)' }}></span>
                  </div>
                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--white-muted)', letterSpacing: '1px' }}>
                    MACROS AI — NUTRITION ENGINE v2.4
                  </span>
                </div>

                {/* Terminal Body */}
                <div 
                  style={{
                    padding: '24px',
                    height: '350px',
                    overflowY: 'auto',
                    background: 'var(--black3)'
                  }}
                  className="terminal-body-scroll"
                  data-lenis-prevent
                >
                  {terminalHistory.map((line, idx) => (
                    <TerminalLine 
                      key={idx}
                      prefix={line.prefix}
                      text={line.text}
                      type={line.type}
                    />
                  ))}
                  {terminalLoading && (
                    <TerminalLine prefix="COMPUTING >" text="CALCULATING METABOLIC METRICS..." type="computing" />
                  )}
                </div>

                {/* Input row */}
                <form 
                  onSubmit={handleTerminalSubmit}
                  style={{
                    display: 'flex',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <input 
                    type="text"
                    placeholder="Ask Macros AI (e.g. 'How much creatine should I take daily?')"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--white)',
                      fontFamily: 'var(--ff-mono)',
                      fontSize: '12px',
                      padding: '16px 20px',
                      outline: 'none'
                    }}
                  />
                  <button 
                    type="submit" 
                    className="btn-gold interactive-element"
                    style={{
                      padding: '0 30px',
                      borderRadius: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    SEND <Send size={12} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FLAVOR SELECTOR */}
      <section style={{ backgroundColor: 'var(--black2)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            
            {/* Real product image — switches per flavor */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '280px',
                  height: '380px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle at center, rgba(201,168,76,0.08) 0%, transparent 70%)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: flavorAnim ? 'scale(0.95) rotateY(8deg)' : 'scale(1) rotateY(0deg)',
                }}
              >
                {flavorProductMap[activeFlavor] && (
                  <img
                    src={getProductImageUrl(flavorProductMap[activeFlavor].image)}
                    alt={flavorProductMap[activeFlavor].name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '360px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                    }}
                  />
                )}
              </div>

              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '32px', letterSpacing: '2px', color: flavorConfig[activeFlavor].gold }}>
                  {flavorConfig[activeFlavor].name}
                </h3>
                <div style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--white-muted)', marginTop: '8px' }}>
                  1 KG · 30 SERVINGS · {flavorConfig[activeFlavor].kcal} KCAL/SERVE
                </div>
              </div>
            </div>

            {/* Flavor Swapping List */}
            <div>
              <SectionTag text="SELECT FLAVOR" />
              <h2 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '40px' }}>
                FLAVOR RE-IMAGINED
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.keys(flavorConfig).map((key) => (
                  <button
                    key={key}
                    onClick={() => selectFlavor(key)}
                    className="interactive-element"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '20px 24px',
                      background: activeFlavor === key ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                      border: activeFlavor === key ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      {/* Dual color dot */}
                      <div 
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${flavorConfig[key].dot[0]} 0%, ${flavorConfig[key].dot[1]} 100%)`,
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      ></div>
                      <span 
                        style={{ 
                          fontFamily: 'var(--ff-display)', 
                          fontSize: '22px', 
                          color: activeFlavor === key ? 'var(--gold)' : 'var(--white)',
                          letterSpacing: '1px'
                        }}
                      >
                        {flavorConfig[key].name}
                      </span>
                    </div>

                    <span 
                      style={{ 
                        fontFamily: 'var(--ff-mono)', 
                        fontSize: '11px', 
                        color: 'var(--white-muted)' 
                      }}
                    >
                      {flavorConfig[key].kcal} kcal
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '40px' }}>
                <Link
                  to={flavorProductMap[activeFlavor] ? `/products/${flavorProductMap[activeFlavor].slug}` : '/products'}
                  className="btn-gold"
                >
                  BUY {flavorConfig[activeFlavor].name.toUpperCase()}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. WHY MACROS NUTRITION (Scroll enter countup) */}
      <section style={{ position: 'relative' }}>
        {/* Central glow */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle at center, rgba(201, 168, 76, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        ></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <Logo variant="icon" size="lg" />
            </div>
            <SectionTag text="OUR PROMISE" />
            <h2 style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}>
              WHY MACROS <span className="text-gold-gradient">NUTRITION</span>
            </h2>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px'
            }}
          >
            {/* Stat 1 */}
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div ref={sugarStat.ref} style={{ fontFamily: 'var(--ff-display)', fontSize: '72px', color: 'var(--gold)' }}>
                {sugarStat.count}
              </div>
              <h4 style={{ fontSize: '20px', letterSpacing: '1px', marginBottom: '10px' }}>GRAMS ADDED SUGAR</h4>
              <p style={{ fontSize: '13px' }}>Pure proteins and recovery salts sweetened with zero glycemic botanical compounds.</p>
            </div>

            {/* Stat 2 */}
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div ref={testedStat.ref} style={{ fontFamily: 'var(--ff-display)', fontSize: '72px', color: 'var(--gold)' }}>
                {testedStat.count}
              </div>
              <h4 style={{ fontSize: '20px', letterSpacing: '1px', marginBottom: '10px' }}>THIRD-PARTY LAB TESTED</h4>
              <p style={{ fontSize: '13px' }}>Every batch certified by ISO accreditors. QR codes link to direct heavy metals reports.</p>
            </div>

            {/* Stat 3 */}
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div ref={athletesStat.ref} style={{ fontFamily: 'var(--ff-display)', fontSize: '72px', color: 'var(--gold)' }}>
                {athletesStat.count}
              </div>
              <h4 style={{ fontSize: '20px', letterSpacing: '1px', marginBottom: '10px' }}>ELITE ATHLETES</h4>
              <p style={{ fontSize: '13px' }}>National weightlifters, triathletes, and cricketers trust Macros for fuel.</p>
            </div>

            {/* Stat 4 */}
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div ref={purityStat.ref} style={{ fontFamily: 'var(--ff-display)', fontSize: '72px', color: 'var(--gold)' }}>
                {purityStat.count}
              </div>
              <h4 style={{ fontSize: '20px', letterSpacing: '1px', marginBottom: '10px' }}>PREMIUM INGREDIENTS</h4>
              <p style={{ fontSize: '13px' }}>Cold-filtered, non-denatured whey proteins manufactured in India with globally sourced premium ingredients.</p>
            </div>

            {/* Stat 5 */}
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div ref={labelStat.ref} style={{ fontFamily: 'var(--ff-display)', fontSize: '72px', color: 'var(--gold)' }}>
                {labelStat.count}
              </div>
              <h4 style={{ fontSize: '20px', letterSpacing: '1px', marginBottom: '10px' }}>TRANSPARENT LABELING</h4>
              <p style={{ fontSize: '13px' }}>No proprietary blends. We publish exact percentages of every active dose.</p>
            </div>

            {/* Stat 6 */}
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div ref={aiMatchStat.ref} style={{ fontFamily: 'var(--ff-display)', fontSize: '72px', color: 'var(--gold)' }}>
                {aiMatchStat.count}
              </div>
              <h4 style={{ fontSize: '20px', letterSpacing: '1px', marginBottom: '10px' }}>AI PERSONALIZATION</h4>
              <p style={{ fontSize: '13px' }}>Algorithms align supplement configurations to your biomarkers and training load.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TRANSFORMATIONS */}
      <section style={{ backgroundColor: 'var(--black2)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <SectionTag text="SOCIAL PROOF" />
              <h2 style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>REAL RESULTS.</h2>
            </div>
            <p style={{ maxWidth: '450px', fontSize: '15px' }}>
              Over 12,000 athletes have transformed their physiques and athletic conditioning using our nutrition guidelines and premium formulas.
            </p>
          </div>

          <div className="grid-3">
            <TestimonialCard 
              text="Using Macros AI changed everything. I gained 12kg of clean muscle while maintaining structural speed for powerlifting. The isolate chocolate mixes like water." 
              author="ARJUN KAPOOR" 
              role="National Powerlifter" 
              result="+12KG" 
              initials="AK"
            />
            <TestimonialCard 
              text="Targeted deficit targets and clean Plant Protein helped me cut 8kg of fat before the stage trials. Zero digestion issues and bloating." 
              author="PRIYA SHARMA" 
              role="Fitness Competitor" 
              result="-8KG" 
              initials="PS"
            />
            <TestimonialCard 
              text="As an ultramarathoner, continuous hydration salts and BCAA matrices kept my glycogen stores full. My endurance markers increased by 30%." 
              author="ROHIT VERMA" 
              role="Ultramarathon Athlete" 
              result="+30% ENDUR" 
              initials="RV"
            />
          </div>
        </div>
      </section>

      {/* 10. APP PREVIEW */}
      <section>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            
            {/* Left Phone Mockup */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div 
                style={{
                  width: '280px',
                  height: '580px',
                  borderRadius: '44px',
                  border: '2px solid rgba(201, 168, 76, 0.3)',
                  boxShadow: '0 0 80px rgba(201, 168, 76, 0.1)',
                  position: 'relative',
                  background: 'var(--black2)',
                  padding: '12px',
                  overflow: 'hidden'
                }}
              >
                <div className="phone-glow" />
                {/* Notch */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100px',
                    height: '28px',
                    backgroundColor: 'var(--black)',
                    borderRadius: '0 0 16px 16px',
                    zIndex: 20
                  }}
                ></div>

                {/* Inner Screen */}
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '36px',
                    background: 'var(--black)',
                    overflow: 'hidden',
                    padding: '30px 16px 16px',
                    position: 'relative'
                  }}
                >
                  <div className="phone-scroller">
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                      <span style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', color: 'var(--gold)', letterSpacing: '1px' }}>MACROS AI</span>
                      <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--terminal-green)' }}>SYNCED</span>
                    </div>

                    {/* Widget 1 */}
                    <div style={{ background: 'var(--black4)', padding: '16px', marginBottom: '16px', borderLeft: '2px solid var(--gold)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--white-muted)', marginBottom: '8px' }}>
                        <span>TODAY'S CALORIES</span>
                        <span>2,847 / 3,200</span>
                      </div>
                      <div className="progress" aria-hidden>
                        <div className="progress-bar gold" style={{ width: '89%' }} />
                      </div>
                    </div>

                    {/* Widget 2 */}
                    <div style={{ background: 'var(--black4)', padding: '16px', marginBottom: '16px', borderLeft: '2px solid var(--gold)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--white-muted)', marginBottom: '8px' }}>
                        <span>PROTEIN</span>
                        <span>142G / 160G</span>
                      </div>
                      <div className="progress" aria-hidden>
                        <div className="progress-bar gold" style={{ width: '88%' }} />
                      </div>
                    </div>

                    {/* Widget 3 */}
                    <div style={{ background: 'var(--black4)', padding: '16px', marginBottom: '16px', borderLeft: '2px solid #3498db' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--white-muted)', marginBottom: '8px' }}>
                        <span>HYDRATION</span>
                        <span>2.1L / 3.0L</span>
                      </div>
                      <div className="progress" aria-hidden>
                        <div className="progress-bar aqua" style={{ width: '70%' }} />
                      </div>
                    </div>

                    {/* Widget 4 */}
                    <div style={{ background: 'var(--black3)', padding: '12px', border: '1px solid rgba(201,168,76,0.1)' }}>
                      <div style={{ fontSize: '9px', color: 'var(--gold)', fontFamily: 'var(--ff-mono)' }}>UPCOMING DOSE</div>
                      <div style={{ fontSize: '12px', color: '#FFF', fontWeight: 'bold', marginTop: '4px' }}>Pre-Workout · 30m before training</div>
                    </div>

                    {/* Mini metrics row */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <div className="metric-mini">
                        <div className="metric-label">STEPS</div>
                        <div className="metric-value">6,320</div>
                      </div>
                      <div className="metric-mini">
                        <div className="metric-label">SLEEP</div>
                        <div className="metric-value">7.2h</div>
                      </div>
                      <div className="metric-mini">
                        <div className="metric-label">HR</div>
                        <div className="metric-value">68</div>
                      </div>
                    </div>
                    
                    {/* Floating action (demo) */}
                    <div className="fab" aria-hidden>•</div>
                    
                    {/* Bottom nav */}
                    <div className="phone-nav" aria-hidden>
                      <div className="nav-dot" />
                      <div className="nav-dot active" />
                      <div className="nav-dot" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Feature List */}
            <div>
              <SectionTag text="MACROS COMPANION APP" />
              <h2 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '40px' }}>
                FITNESS IN YOUR POCKET
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '45px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <span style={{ fontSize: '42px', fontFamily: 'var(--ff-display)', color: 'var(--gold)', opacity: 0.2, width: '50px' }}>01</span>
                  <div>
                    <h3 style={{ fontSize: '22px', color: 'var(--white)', marginBottom: '6px' }}>REAL-TIME MACRO TRACKING</h3>
                    <p style={{ fontSize: '14px' }}>Input meals, take snaps, and sync calorie intake metrics directly to target profiles.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <span style={{ fontSize: '42px', fontFamily: 'var(--ff-display)', color: 'var(--gold)', opacity: 0.2, width: '50px' }}>02</span>
                  <div>
                    <h3 style={{ fontSize: '22px', color: 'var(--white)', marginBottom: '6px' }}>24/7 AI COACH ACCESS</h3>
                    <p style={{ fontSize: '14px' }}>Get rapid diet alterations, recipe macros, and training suggestions instantly.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <span style={{ fontSize: '42px', fontFamily: 'var(--ff-display)', color: 'var(--gold)', opacity: 0.2, width: '50px' }}>03</span>
                  <div>
                    <h3 style={{ fontSize: '22px', color: 'var(--white)', marginBottom: '6px' }}>SMART FORMULA RECS</h3>
                    <p style={{ fontSize: '14px' }}>App analyzes wear-logs to coordinate electrolyte and protein serving reminders.</p>
                  </div>
                </div>
              </div>

              {/* Waitlist inline */}
              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <input 
                  type="email" 
                  placeholder="ATHLETE EMAIL"
                  style={{
                    background: 'var(--black3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--white)',
                    padding: '16px 20px',
                    fontFamily: 'var(--ff-body)',
                    letterSpacing: '1px',
                    outline: 'none',
                    width: '240px'
                  }}
                />
                <button className="btn-gold interactive-element">JOIN WAITLIST</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Embedded page styles */}
      <style>{`
        .universe-card {
          padding: 24px;
          background: var(--black3);
          cursor: pointer;
          min-height: 200px;
          display: flex;
          align-items: center;
          gap: 24px;
          transition: background 0.3s ease;
        }
        .universe-card:hover {
          background: rgba(201, 168, 76, 0.04);
        }
        .universe-card-photo {
          flex-shrink: 0;
          width: 130px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .universe-card-photo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 8px;
          transition: transform 0.35s ease;
        }
        .universe-card:hover .universe-card-photo img {
          transform: scale(1.06);
        }
        .universe-card-info {
          flex: 1;
          min-width: 0;
        }
        .universe-card .card-badge {
          display: inline-block;
          font-family: var(--ff-mono);
          font-size: 8px;
          font-weight: bold;
          letter-spacing: 2px;
          background: rgba(201, 168, 76, 0.15);
          color: var(--gold);
          border: 1px solid rgba(201, 168, 76, 0.3);
          padding: 3px 8px;
          margin-bottom: 8px;
        }
        .universe-card .tag {
          font-family: var(--ff-mono);
          font-size: 9px;
          color: var(--gold);
          letter-spacing: 2px;
          display: block;
          margin-bottom: 6px;
        }
        .universe-card h3 {
          font-size: 22px;
          color: var(--white);
          margin-bottom: 4px;
          line-height: 1.1;
          transition: color 0.3s;
        }
        .universe-card:hover h3 {
          color: var(--gold-bright);
        }
        .universe-card .universe-flavor {
          font-family: var(--ff-mono);
          font-size: 10px;
          color: var(--gold);
          letter-spacing: 1px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .universe-card-info > p:last-child {
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
          color: var(--white-muted);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 991px) {
          .hero-section {
            padding: 0 24px !important;
            padding-bottom: 42vh !important;
          }
          .hero-stats-container {
            display: none !important;
          }
          .macro-molecule-canvas {
            max-width: 320px !important;
            height: 280px !important;
            opacity: 0.45 !important;
          }
        }
        @media (max-width: 480px) {
          .universe-card {
            flex-direction: column;
            text-align: center;
          }
          .universe-card-photo {
            width: 110px;
            height: 140px;
          }
        }
        
        .phone-scroller {
          animation: phoneScroll 12s linear infinite alternate;
        }
        @keyframes phoneScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-70px); }
        }
        
        .terminal-body-scroll::-webkit-scrollbar {
          width: 2px;
        }

        /* Phone mockup extras */
        .phone-glow {
          position: absolute;
          top: -12px;
          left: -12px;
          right: -12px;
          bottom: -12px;
          border-radius: 52px;
          box-shadow: 0 30px 90px rgba(201,168,76,0.12) inset, 0 0 120px rgba(201,168,76,0.06);
          pointer-events: none;
        }
        .progress { background: rgba(255,255,255,0.06); height:8px; border-radius:6px; overflow:hidden; }
        .progress-bar { height:100%; border-radius:6px 0 0 6px; transform: translateX(-6%); animation: fillEase 1.4s ease forwards; }
        .progress-bar.gold { background: linear-gradient(90deg,#e0b44a,#c98f1f); }
        .progress-bar.aqua { background: linear-gradient(90deg,#3fb3ff,#1f7bd6); }
        @keyframes fillEase { from { transform: translateX(-20%); opacity:0.6 } to { transform: translateX(0); opacity:1 } }

        .metric-mini { flex:1; background: rgba(255,255,255,0.02); padding:8px; border-radius:6px; text-align:center; }
        .metric-label { font-size:9px; color:var(--white-muted); font-family:var(--ff-mono); }
        .metric-value { font-size:12px; color:var(--white); font-weight:700; margin-top:4px; }

        .fab { position:absolute; right:18px; bottom:90px; width:36px; height:36px; border-radius:50%; background:transparent; border:2px solid rgba(201,168,76,0.9); color:var(--gold); display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 8px 24px rgba(201,168,76,0.12); }

        .phone-nav { position:absolute; left:0; right:0; bottom:18px; display:flex; justify-content:center; gap:8px; }
        .nav-dot { width:8px; height:8px; background:rgba(255,255,255,0.06); border-radius:50%; }
        .nav-dot.active { background:var(--gold); box-shadow:0 4px 12px rgba(201,168,76,0.12); }
      `}</style>

    </div>
  );
}

export default HomePage;
