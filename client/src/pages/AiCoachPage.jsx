import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useCartStore } from '../store/cartStore.js';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import GhostButton from '../components/ui/GhostButton.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import TerminalLine from '../components/ui/TerminalLine.jsx';
import { Activity, Target, Compass, ChevronLeft, Send, ArrowRight, Save, MessageSquare, RefreshCw } from 'lucide-react';
import api from '../services/api.js';

export function AiCoachPage() {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Intake Form State
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [goal, setGoal] = useState('muscle');
  const [activityLevel, setActivityLevel] = useState('moderately');

  // Results State
  const [results, setResults] = useState(null);
  const [stackProducts, setStackProducts] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Chat Drawer States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { prefix: 'MACROS_AI >', text: 'Athlete intake analysis locked. Initializing coaching protocol. Ask me anything about your plan.', type: 'success' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Fetch stack product documents matching the recommended slugs
  const fetchStackProducts = async (slugs) => {
    try {
      const prods = [];
      for (const slug of slugs) {
        const res = await api.get(`/products/${slug}`);
        if (res.data) prods.push(res.data);
      }
      setStackProducts(prods);
    } catch (e) {
      console.error('Failed to fetch stack products: ', e);
    }
  };

  // Submit Intake Form
  const handleSubmitIntake = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/nutrition', {
        age,
        gender,
        heightCm,
        weightKg,
        goal,
        activityLevel
      });
      setResults(response.data);
      setStep(5);
      
      // Load stack details from backend
      if (response.data.stack) {
        await fetchStackProducts(response.data.stack);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Save Plan to profile
  const handleSavePlan = async () => {
    if (!user) {
      setSaveError('You must sign in to save your nutrition plan.');
      return;
    }

    setSaveSuccess('');
    setSaveError('');

    try {
      await api.post('/ai/save-plan', {
        biometrics: { age, gender, heightCm, weightKg, goal, activityLevel },
        macros: {
          protein: results.protein,
          carbs: results.carbs,
          fat: results.fat,
          calories: results.target
        },
        stackSlugs: results.stack
      });
      setSaveSuccess('Nutrition plan successfully saved to profile!');
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save plan');
    }
  };

  // Chat Send Handler
  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatHistory(prev => [...prev, { prefix: 'INPUT >', text: userMessage, type: 'input' }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const history = chatHistory.map(h => ({
        role: h.prefix.includes('INPUT') ? 'user' : 'assistant',
        text: h.text
      }));

      const res = await api.post('/ai/chat', { history, message: userMessage });
      setChatHistory(prev => [...prev, { prefix: 'MACROS_AI >', text: res.data.text, type: 'highlight' }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { prefix: 'ERROR >', text: 'Connection timed out.', type: 'error' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Scroll chat drawer to bottom on new message (only inside the chat panel)
  useEffect(() => {
    if (!chatOpen || !chatContainerRef.current) return;
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatHistory, chatLoading, chatOpen]);

  // Suggested Prompts trigger
  const handleSuggestedPrompt = (promptText) => {
    setChatInput(promptText);
  };

  return (
    <div 
      style={{ 
        background: 'var(--black)', 
        minHeight: '100vh', 
        paddingTop: '120px', 
        paddingBottom: '80px',
        position: 'relative',
        backgroundImage: 'radial-gradient(circle at center, rgba(201, 168, 76, 0.01) 0%, transparent 70%)'
      }}
    >
      <div className="container" style={{ padding: '0 60px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <SectionTag text="AI-POWERED · INDEPENDENT · PERSONALIZED" />
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
            YOUR MACROS. <span className="text-gold-gradient">YOUR PLAN.</span>
          </h1>
        </div>

        {/* Stepper Progress bar (only for questionnaire) */}
        {step <= 4 && (
          <div style={{ maxWidth: '600px', margin: '0 auto 50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--white-muted)', marginBottom: '12px' }}>
              <span>PROGRESS</span>
              <span>STEP {step} OF 4</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'var(--black4)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div 
                style={{ 
                  width: `${(step / 4) * 100}%`, 
                  height: '100%', 
                  background: 'var(--gold)',
                  transition: 'width 0.4s ease'
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Question Panel */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>BIOMETRIC IDENTITY</h3>
              
              <div style={{ marginBottom: '30px' }}>
                <label className="macros-label">AGE (YEARS)</label>
                <input 
                  type="number" 
                  min="18" 
                  max="70"
                  value={age}
                  onChange={(e) => setAge(Math.min(70, Math.max(18, Number(e.target.value))))}
                  className="macros-input"
                  style={{ textAlign: 'center', fontSize: '24px', fontFamily: 'var(--ff-display)' }}
                />
              </div>

              <div style={{ marginBottom: '40px' }}>
                <label className="macros-label">GENDER IDENTIFIER</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className="interactive-element"
                      style={{
                        padding: '20px 0',
                        background: gender === g ? 'rgba(201, 168, 76, 0.08)' : 'var(--black3)',
                        border: gender === g ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                        color: gender === g ? 'var(--gold)' : 'var(--white)',
                        fontFamily: 'var(--ff-display)',
                        fontSize: '18px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <GoldButton onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  CONTINUE <ArrowRight size={14} />
                </GoldButton>
              </div>
            </div>
          )}

          {/* STEP 2: BODY STATS */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>BODY MATRIX</h3>
              
              <div style={{ marginBottom: '35px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label className="macros-label">HEIGHT (CM)</label>
                  <span style={{ fontFamily: 'var(--ff-display)', fontSize: '28px', color: 'var(--gold)' }}>{heightCm} cm</span>
                </div>
                <input 
                  type="range"
                  min="140"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label className="macros-label">WEIGHT (KG)</label>
                  <span style={{ fontFamily: 'var(--ff-display)', fontSize: '28px', color: 'var(--gold)' }}>{weightKg} kg</span>
                </div>
                <input 
                  type="range"
                  min="40"
                  max="150"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <GhostButton onClick={() => setStep(1)}>BACK</GhostButton>
                <GoldButton onClick={() => setStep(3)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  CONTINUE <ArrowRight size={14} />
                </GoldButton>
              </div>
            </div>
          )}

          {/* STEP 3: FITNESS GOALS */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>FITNESS TARGET PROTOCOL</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
                {[
                  { key: 'muscle', label: 'Lean Muscle Gain', desc: 'Sustained hypertrophy with calculated surplus.' },
                  { key: 'fatloss', label: 'Fat Loss & Shred', desc: 'Caloric deficit preserving power and muscle tissues.' },
                  { key: 'performance', label: 'Athletic Performance', desc: 'High intensity recovery and metabolic output fuel.' },
                  { key: 'recovery', label: 'System Restoration', desc: 'Fast repair of joints, tissues, and fatigue reduction.' },
                  { key: 'wellness', label: 'Longevity & Focus', desc: 'Micro and macronutrient balance for wellness parameters.' }
                ].map((gObj) => (
                  <button
                    key={gObj.key}
                    onClick={() => setGoal(gObj.key)}
                    className="interactive-element"
                    style={{
                      padding: '16px 20px',
                      background: goal === gObj.key ? 'rgba(201, 168, 76, 0.08)' : 'var(--black3)',
                      border: goal === gObj.key ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                      color: goal === gObj.key ? 'var(--gold)' : 'var(--white)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', letterSpacing: '1px' }}>{gObj.label}</div>
                      <span style={{ fontSize: '12px', color: 'var(--white-muted)' }}>{gObj.desc}</span>
                    </div>
                    {goal === gObj.key && <Target size={18} style={{ color: 'var(--gold)' }} />}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <GhostButton onClick={() => setStep(2)}>BACK</GhostButton>
                <GoldButton onClick={() => setStep(4)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  CONTINUE <ArrowRight size={14} />
                </GoldButton>
              </div>
            </div>
          )}

          {/* STEP 4: ACTIVITY LEVEL */}
          {step === 4 && (
            <div>
              <h3 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>METABOLIC ACTIVITY LOAD</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
                {[
                  { key: 'sedentary', label: 'Sedentary', desc: 'Minimal activity, office job, 0-1 workouts/week.' },
                  { key: 'lightly', label: 'Light Activity', desc: 'Walking, light training, 1-3 workouts/week.' },
                  { key: 'moderately', label: 'Moderate Activity', desc: 'Consistent training, 3-5 workouts/week.' },
                  { key: 'very', label: 'Heavy Activity', desc: 'Rigorous routine, athlete level, 5-7 workouts/week.' },
                  { key: 'elite', label: 'Elite Pro Load', desc: 'Double daily sessions, extreme metabolic burn daily.' }
                ].map((actObj) => (
                  <button
                    key={actObj.key}
                    onClick={() => setActivityLevel(actObj.key)}
                    className="interactive-element"
                    style={{
                      padding: '16px 20px',
                      background: activityLevel === actObj.key ? 'rgba(201, 168, 76, 0.08)' : 'var(--black3)',
                      border: activityLevel === actObj.key ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                      color: activityLevel === actObj.key ? 'var(--gold)' : 'var(--white)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', letterSpacing: '1px' }}>{actObj.label}</div>
                      <span style={{ fontSize: '12px', color: 'var(--white-muted)' }}>{actObj.desc}</span>
                    </div>
                    {activityLevel === actObj.key && <Activity size={18} style={{ color: 'var(--gold)' }} />}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <GhostButton onClick={() => setStep(3)}>BACK</GhostButton>
                <GoldButton 
                  onClick={handleSubmitIntake} 
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {loading ? 'COMPUTING...' : 'GENERATE PLAN'} <Compass size={14} />
                </GoldButton>
              </div>
            </div>
          )}

        </div>

        {/* STEP 5: RESULTS DASHBOARD */}
        {step === 5 && results && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '60px' }} className="coach-result-layout">
              
              {/* Left Column - SVG Macro Ring & Breakdown */}
              <div 
                style={{ 
                  background: 'var(--black3)', 
                  border: '1px solid rgba(201, 168, 76, 0.15)', 
                  padding: '40px',
                  height: 'fit-content',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', display: 'block', marginBottom: '24px' }}>
                  METABOLIC PROFILE
                </span>

                {/* Calorie Ring SVG */}
                <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 30px' }}>
                  <svg width="220" height="220" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r="95" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                    <circle 
                      cx="110" 
                      cy="110" 
                      r="95" 
                      fill="none" 
                      stroke="url(#goldGradient)" 
                      strokeWidth="10" 
                      strokeDasharray="596.9"
                      strokeDashoffset="120" // simulated offset to fill ~80%
                      strokeLinecap="round"
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'center',
                        transition: 'stroke-dashoffset 1s ease'
                      }}
                    />
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--gold-bright)" />
                        <stop offset="100%" stopColor="var(--gold-dark)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontFamily: 'var(--ff-display)', fontSize: '48px', color: 'var(--white)' }}>{results.target}</span>
                    <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--white-muted)', letterSpacing: '2px' }}>KCAL/DAY</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  <span>TDEE Maintenance</span>
                  <span style={{ fontFamily: 'var(--ff-mono)' }}>{results.tdee} kcal</span>
                </div>

                {/* Macro breakdown bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--ff-mono)', color: 'var(--gold)' }}>PROTEIN</span>
                      <span>{results.protein}g</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '30%', height: '100%', background: 'var(--gold)' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--ff-mono)', color: 'var(--gold)' }}>CARBOHYDRATES</span>
                      <span>{results.carbs}g</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '50%', height: '100%', background: 'var(--gold)' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--ff-mono)', color: 'var(--gold)' }}>DIETARY FAT</span>
                      <span>{results.fat}g</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '20%', height: '100%', background: 'var(--gold)' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Explanation + Stack */}
              <div>
                <div style={{ background: 'var(--black3)', border: '1px solid rgba(255, 255, 255, 0.03)', padding: '40px', marginBottom: '40px' }}>
                  <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>AI COACH DECODE</h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '30px' }}>
                    {results.summary}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <GoldButton onClick={handleSavePlan} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Save size={14} /> SAVE METABOLIC PLAN
                    </GoldButton>
                    <GhostButton onClick={() => setChatOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageSquare size={14} /> DEBATE WITH AI COACH
                    </GhostButton>
                  </div>

                  {saveSuccess && (
                    <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(74, 247, 163, 0.1)', color: 'var(--terminal-green)', border: '1px solid var(--terminal-green)', fontSize: '14px' }}>
                      {saveSuccess}
                    </div>
                  )}

                  {saveError && (
                    <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255, 95, 87, 0.1)', color: 'var(--terminal-red)', border: '1px solid var(--terminal-red)', fontSize: '14px' }}>
                      {saveError}
                    </div>
                  )}
                </div>

                {/* Recommended Stack cards */}
                <div>
                  <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>RECOMMENDED COMBINATION</h3>
                  
                  {stackProducts.length === 0 ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--white-muted)' }}>
                      <RefreshCw className="animate-spin" size={16} /> Fetching stack configurations...
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                      {stackProducts.map((p) => (
                        <ProductCard key={p._id} product={p} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Back button */}
                <div style={{ marginTop: '40px' }}>
                  <button 
                    onClick={() => { setStep(1); setResults(null); setStackProducts([]); }} 
                    style={{ background: 'none', border: 'none', color: 'var(--gold)', fontFamily: 'var(--ff-mono)', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    className="interactive-element"
                  >
                    <ChevronLeft size={16} /> ADJUST INTENSE METABOLIC INPUTS
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* 11. BOTTOM DRAWER CHAT PANEL */}
      {chatOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '1200px',
            height: '60vh',
            zIndex: 1500,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 -20px 50px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            borderRadius: '12px 12px 0 0'
          }}
        >
          {/* Header */}
          <div 
            style={{
              padding: '16px 30px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--black3)',
              borderRadius: '12px 12px 0 0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--terminal-green)', display: 'inline-block' }}></span>
              <span style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', letterSpacing: '1px' }}>MACROS AI — REALTIME COACH</span>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer', fontFamily: 'var(--ff-mono)', fontSize: '12px' }}
              className="interactive-element"
            >
              CLOSE CONSOLE [X]
            </button>
          </div>

          {/* Conversation history */}
          <div
            ref={chatContainerRef}
            data-lenis-prevent
            style={{
              flex: 1,
              padding: '30px',
              overflowY: 'auto',
              background: 'var(--black)',
            }}
          >
            {chatHistory.map((h, idx) => (
              <TerminalLine key={idx} prefix={h.prefix} text={h.text} type={h.type} />
            ))}
            {chatLoading && (
              <TerminalLine prefix="COMPUTING >" text="AI COACH THREAD IN PROCESSING..." type="computing" />
            )}
          </div>

          {/* Quick prompt templates */}
          <div 
            style={{ 
              padding: '12px 30px', 
              background: 'var(--black3)', 
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
            className="quick-prompts-bar"
          >
            {[
              "What should I eat pre-workout?",
              "Adjust macro ratios for vegetarian diet",
              "How much creatine should I take?",
              "Explain the benefit of Whey Isolate"
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedPrompt(p)}
                className="interactive-element"
                style={{
                  background: 'var(--black4)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--white-muted)',
                  fontFamily: 'var(--ff-mono)',
                  fontSize: '10px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  flexShrink: 0
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Form Input */}
          <form 
            onSubmit={handleChatSend}
            style={{
              display: 'flex',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              background: 'var(--black3)'
            }}
          >
            <input 
              type="text"
              placeholder="ASK COACH (E.G. 'HOW DO I SPLIT MY CARBOHYDRATES FOR RUNNING?')"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--white)',
                fontFamily: 'var(--ff-mono)',
                fontSize: '13px',
                padding: '20px 30px',
                outline: 'none',
                letterSpacing: '1px'
              }}
            />
            <button 
              type="submit" 
              className="btn-gold interactive-element"
              style={{
                padding: '0 40px',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              SEND MESSAGE <Send size={14} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        .quick-prompts-bar::-webkit-scrollbar {
          height: 2px;
        }
        @media (max-width: 768px) {
          .coach-result-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AiCoachPage;
