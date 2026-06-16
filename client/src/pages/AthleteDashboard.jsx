import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import GhostButton from '../components/ui/GhostButton.jsx';
import api from '../services/api.js';
import { 
  TrendingUp, Dumbbell, Calendar, Flame, Activity, Sparkles, Plus, 
  Trash2, ShieldCheck, Heart, User, ChevronRight, HelpCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, CartesianGrid, ReferenceLine, AreaChart, Area 
} from 'recharts';

export function AthleteDashboard() {
  const { user, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();

  // Core state
  const [plan, setPlan] = useState(null);
  const [weightLogs, setWeightLogs] = useState([]);
  const [macroLogs, setMacroLogs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Active section tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'weight', 'macros', 'dosing'

  // Input form states
  const [newWeight, setNewWeight] = useState('');
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [logProtein, setLogProtein] = useState('');
  const [logCarbs, setLogCarbs] = useState('');
  const [logFat, setLogFat] = useState('');
  const [logCalories, setLogCalories] = useState('');
  const [macroDate, setMacroDate] = useState(new Date().toISOString().split('T')[0]);

  // Messages
  const [weightSuccess, setWeightSuccess] = useState('');
  const [macroSuccess, setMacroSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      // 1. Fetch Plan
      try {
        const planRes = await api.get('/dashboard/plan');
        setPlan(planRes.data);
        if (planRes.data && planRes.data.macros) {
          // Pre-populate macro tracker inputs with target values
          setLogProtein(planRes.data.macros.protein || 150);
          setLogCarbs(planRes.data.macros.carbs || 200);
          setLogFat(planRes.data.macros.fat || 60);
          setLogCalories(planRes.data.macros.calories || 2000);
        }
      } catch (err) {
        console.warn('No active plan found, or plan retrieval failed.');
      }

      // 2. Fetch Weight logs
      const weightRes = await api.get('/dashboard/weight');
      setWeightLogs(weightRes.data);

      // 3. Fetch Macro logs
      const macroRes = await api.get('/dashboard/macros');
      setMacroLogs(macroRes.data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setErrorMsg('Failed to load metric histories.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Log weight handler
  const handleLogWeight = async (e) => {
    e.preventDefault();
    if (!newWeight) return;

    setWeightSuccess('');
    setErrorMsg('');

    try {
      const res = await api.post('/dashboard/weight', {
        weightKg: Number(newWeight),
        date: weightDate
      });
      setWeightLogs(prev => [...prev, res.data].sort((a,b) => new Date(a.date) - new Date(b.date)));
      setWeightSuccess('Weight logged successfully!');
      setNewWeight('');
      setTimeout(() => setWeightSuccess(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to log weight');
    }
  };

  // Log macros handler
  const handleLogMacros = async (e) => {
    e.preventDefault();
    if (!logProtein || !logCarbs || !logFat || !logCalories) return;

    setMacroSuccess('');
    setErrorMsg('');

    try {
      const res = await api.post('/dashboard/macros', {
        protein: Number(logProtein),
        carbs: Number(logCarbs),
        fat: Number(logFat),
        calories: Number(logCalories),
        date: macroDate
      });
      setMacroLogs(prev => [...prev, res.data].sort((a,b) => new Date(a.date) - new Date(b.date)));
      setMacroSuccess('Macros logged successfully!');
      setTimeout(() => setMacroSuccess(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to log macros');
    }
  };

  // Auto seed demo data if logs are empty (frontend helper)
  const handleSeedDemoData = async () => {
    setLoadingData(true);
    try {
      // Seed 6 days of weights
      const dates = Array.from({length: 6}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (5 - i));
        return d.toISOString().split('T')[0];
      });

      const startWeight = plan?.biometrics?.weightKg || 78;
      const weightVariance = [0, -0.3, -0.6, -0.4, -0.8, -1.1];

      for (let i = 0; i < dates.length; i++) {
        await api.post('/dashboard/weight', {
          weightKg: startWeight + weightVariance[i],
          date: dates[i]
        });
      }

      // Seed 6 days of macros
      const targetKcal = plan?.macros?.calories || 2500;
      const targetProtein = plan?.macros?.protein || 160;
      const targetCarbs = plan?.macros?.carbs || 300;
      const targetFat = plan?.macros?.fat || 70;

      const variance = [0.9, 0.95, 1.02, 0.88, 1.0, 1.05];

      for (let i = 0; i < dates.length; i++) {
        await api.post('/dashboard/macros', {
          protein: Math.round(targetProtein * variance[i]),
          carbs: Math.round(targetCarbs * variance[i]),
          fat: Math.round(targetFat * variance[i]),
          calories: Math.round(targetKcal * variance[i]),
          date: dates[i]
        });
      }

      // Refresh
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to seed demo history.');
    } finally {
      setLoadingData(false);
    }
  };

  // Get custom AI dosing routines based on products and goal
  const getProductDosing = (slug, goalKey = 'muscle') => {
    const defaultDosing = {
      timing: 'Daily (Morning)',
      dosage: '1 serving',
      instructions: 'Take with cold water or as recommended by your physician.',
      rationale: 'Supports general energy levels and micronutrient sufficiency.'
    };

    const dosingMap = {
      'whey-isolate': {
        timing: 'Post-Workout (Within 30-45 mins)',
        dosage: '1 scoop (33g)',
        instructions: 'Mix with 200-250ml of ice-cold water in a shaker. Shake vigorously for 15 seconds.',
        rationale: 'Delivers 27g of pure, fast-absorbing microfiltered isolate to trigger muscle recovery and stop protein breakdown.'
      },
      'whey-concentrate': {
        timing: 'Post-Workout or Mid-Day Snack',
        dosage: '1 scoop (36g)',
        instructions: 'Mix with 250ml of cold water or low-fat milk for a rich, creamy recovery shake.',
        rationale: 'Provides a sustained release of amino acids along with natural immunoglobulins to maintain muscular gains.'
      },
      'creatine': {
        timing: 'Daily (Post-Workout or Morning)',
        dosage: '1 scoop (3g)',
        instructions: 'Mix with water, your protein shake, or a high-carb beverage (e.g., fruit juice) to enhance absorption.',
        rationale: 'Saturates muscle creatine phosphate reserves, boosting short-burst power output and ATP regeneration.'
      },
      'pre-workout': {
        timing: 'Pre-Workout (20-30 mins before)',
        dosage: '1 scoop (12g)',
        instructions: 'Mix with 200-300ml of cold water. Start with 1/2 scoop to assess stimulant tolerance.',
        rationale: 'Clinical doses of Citrulline Malate pump nitric oxide for cellular vascularity while caffeine spikes central focus.'
      },
      'bcaa-matrix': {
        timing: 'Intra-Workout (During Training)',
        dosage: '1 scoop (8g)',
        instructions: 'Mix in 500ml of cold water and sip slowly throughout your strength or HIIT training session.',
        rationale: 'Leucine-rich 2:1:1 ratio acts as a buffer, preventing muscle breakdown (catabolism) during high fatigue thresholds.'
      },
      'eaa-complex': {
        timing: 'Intra-Workout or Daily Hydration',
        dosage: '1 scoop (10g)',
        instructions: 'Mix in 500ml of ice water. Enjoy during intensive workouts or between meals.',
        rationale: 'Supplies all 9 essential amino acids to accelerate tissue synthesis paired with trace recovery electrolytes.'
      },
      'electrolytes': {
        timing: 'During Training or Hot Mornings',
        dosage: '1 scoop (6g)',
        instructions: 'Mix with 350ml of cold water. Sip to replenish sodium, potassium, and magnesium salts.',
        rationale: 'Rehydrates extracellular matrix to prevent painful cramping and buffer lactic acid accumulation.'
      },
      'omega-3-epa-dha': {
        timing: 'Daily (With Breakfast or Dinner)',
        dosage: '1 softgel',
        instructions: 'Swallow with cold water immediately after consuming a meal containing healthy fats.',
        rationale: 'High concentrations of EPA and DHA combat systemic joint inflammation and aid cardiovascular integrity.'
      },
      'multivitamin': {
        timing: 'Daily (With Breakfast)',
        dosage: '1 tablet',
        instructions: 'Swallow with water. Take consistently every morning to fill micronutrient gaps.',
        rationale: 'Furnishes active co-enzymes and botanical extracts to streamline energy production and hormone synthesis.'
      },
      'protein-oats': {
        timing: 'Breakfast or Pre-Workout (1.5h before)',
        dosage: '1 serving (60g)',
        instructions: 'Add 150ml of hot milk or water. Let stand for 3 minutes. Top with fruits or honey.',
        rationale: 'Binds slow-burning organic complex carbohydrates with whey protein isolate to build a stable energy reservoir.'
      }
    };

    return dosingMap[slug] || defaultDosing;
  };

  if (authLoading || (loadingData && weightLogs.length === 0 && !user)) {
    return (
      <div className="issue-loader-shell">
        <div className="issue-loader-copy">
          <p className="terminal-blink">AUTHENTICATING SECURE PROTOCOL...</p>
        </div>
      </div>
    );
  }

  // Format Recharts data safely
  const weightChartData = weightLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Weight: log.weightKg
  }));

  const macroChartData = macroLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Protein: log.protein,
    Carbs: log.carbs,
    Fat: log.fat,
    Calories: log.calories
  }));

  return (
    <div 
      style={{ 
        background: 'var(--black)', 
        minHeight: '100vh', 
        paddingTop: '120px', 
        paddingBottom: '80px',
        backgroundImage: 'radial-gradient(circle at center, rgba(201, 168, 76, 0.015) 0%, transparent 65%)'
      }}
    >
      <div className="container" style={{ padding: '0 60px' }}>
        
        {/* Profile Header */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '40px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingBottom: '24px',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <SectionTag text="ATHLETE PORTAL · ACTIVE STATUS" />
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              WELCOME, <span className="text-gold-gradient">{user?.name.toUpperCase()}</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/ai-coach" className="btn-gold" style={{ padding: '12px 24px', fontSize: '11px' }}>
              RUN AI COACH
            </Link>
            {weightLogs.length === 0 && macroLogs.length === 0 && (
              <button 
                onClick={handleSeedDemoData} 
                className="btn-ghost interactive-element" 
                style={{ padding: '12px 24px', fontSize: '11px' }}
              >
                LOAD DEMO HISTORY
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <div style={{ padding: '12px', background: 'rgba(255,95,87,0.1)', color: 'var(--terminal-red)', border: '1px solid var(--terminal-red)', fontSize: '14px', fontFamily: 'var(--ff-mono)', marginBottom: '30px' }}>
            {errorMsg}
          </div>
        )}

        {/* Outer Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' }} className="dashboard-grid">
          
          {/* LEFT COLUMN: Biometrics Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Biometrics Summary Box */}
            <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '30px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} style={{ color: 'var(--gold)' }} />
                ATHLETE MATRIX
              </h3>

              {plan ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--white-muted)' }}>Goal Protocol</span>
                    <strong style={{ color: 'var(--gold)', textTransform: 'uppercase' }}>{plan.biometrics.goal}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--white-muted)' }}>Age</span>
                    <span>{plan.biometrics.age} Years</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--white-muted)' }}>Weight Baseline</span>
                    <span>{plan.biometrics.weightKg} kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--white-muted)' }}>Height</span>
                    <span>{plan.biometrics.heightCm} cm</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--white-muted)' }}>Activity</span>
                    <span style={{ textTransform: 'capitalize' }}>{plan.biometrics.activityLevel} Active</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <p style={{ fontSize: '14px', marginBottom: '16px' }}>No biometrics plan saved yet.</p>
                  <Link to="/ai-coach" style={{ fontSize: '11px', display: 'inline-block' }} className="btn-ghost">
                    CREATE PROTOCOL
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Log Weight Form */}
            <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '30px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: 'var(--gold)' }} />
                LOG WEIGHT
              </h3>
              <form onSubmit={handleLogWeight}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="macros-label">Weight (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="E.G. 78.5"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="macros-input"
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="macros-label">Log Date</label>
                  <input
                    type="date"
                    value={weightDate}
                    onChange={(e) => setWeightDate(e.target.value)}
                    className="macros-input"
                    required
                  />
                </div>
                <GoldButton type="submit" style={{ width: '100%', padding: '12px' }}>
                  SUBMIT LOG
                </GoldButton>
              </form>
              {weightSuccess && (
                <div style={{ marginTop: '12px', color: 'var(--terminal-green)', fontSize: '12px', fontFamily: 'var(--ff-mono)', textAlign: 'center' }}>
                  {weightSuccess}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Tab Panel & Charts */}
          <div>
            {/* Tabs Navigation Header */}
            <div 
              style={{ 
                display: 'flex', 
                gap: '8px', 
                borderBottom: '1px solid rgba(255,255,255,0.05)', 
                marginBottom: '30px',
                overflowX: 'auto'
              }}
              className="tabs-nav"
            >
              {[
                { id: 'overview', label: 'OVERVIEW' },
                { id: 'weight', label: 'WEIGHT TREND' },
                { id: 'macros', label: 'MACRO TIMELINE' },
                { id: 'dosing', label: 'AI DOSING ROUTINE' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="interactive-element"
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
                    color: activeTab === tab.id ? 'var(--gold)' : 'var(--white-muted)',
                    fontFamily: 'var(--ff-mono)',
                    fontSize: '12px',
                    letterSpacing: '1px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Headline Info */}
                {plan ? (
                  <div 
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08) 0%, rgba(10,10,10,0.95) 100%)', 
                      border: '1px solid rgba(201, 168, 76, 0.2)', 
                      padding: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '24px'
                    }}
                  >
                    <div>
                      <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                        ACTIVE TARGET PARAMETERS
                      </span>
                      <h2 style={{ fontSize: '32px', color: 'var(--white)', margin: 0 }}>
                        {plan.macros.calories} KCAL / DAY
                      </h2>
                      <p style={{ margin: '8px 0 0 0', fontSize: '14px', maxWidth: '400px' }}>
                        Calculated split: {plan.macros.protein}g Protein | {plan.macros.carbs}g Carbs | {plan.macros.fat}g Fat.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--gold)', fontFamily: 'var(--ff-display)', fontSize: '28px' }}>{plan.macros.protein}g</div>
                        <div style={{ fontSize: '9px', fontFamily: 'var(--ff-mono)', color: 'var(--white-muted)' }}>PROTEIN</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--gold)', fontFamily: 'var(--ff-display)', fontSize: '28px' }}>{plan.macros.carbs}g</div>
                        <div style={{ fontSize: '9px', fontFamily: 'var(--ff-mono)', color: 'var(--white-muted)' }}>CARBS</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--gold)', fontFamily: 'var(--ff-display)', fontSize: '28px' }}>{plan.macros.fat}g</div>
                        <div style={{ fontSize: '9px', fontFamily: 'var(--ff-mono)', color: 'var(--white-muted)' }}>FAT</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    style={{ 
                      background: 'var(--black3)', 
                      border: '1px solid var(--border-subtle)', 
                      padding: '40px',
                      textAlign: 'center'
                    }}
                  >
                    <Sparkles size={32} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>NO ACTIVE NUTRITION PROTOCOL</h3>
                    <p style={{ maxWidth: '500px', margin: '0 auto 24px', fontSize: '15px' }}>
                      Generate custom macronutrient profiles and personalized supplement stacks built by our AI Coach algorithm.
                    </p>
                    <Link to="/ai-coach" className="btn-gold">
                      START NUTRITION ASSESSMENT
                    </Link>
                  </div>
                )}

                {/* Dashboard Previews */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="coa-charts-grid">
                  
                  {/* Weight Preview */}
                  <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '18px', margin: 0 }}>WEIGHT SNAPSHOT</h4>
                      <button onClick={() => setActiveTab('weight')} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '11px', fontFamily: 'var(--ff-mono)', cursor: 'pointer' }} className="interactive-element">
                        VIEW HISTORY ➔
                      </button>
                    </div>

                    {weightLogs.length > 0 ? (
                      <div style={{ width: '100%', height: '160px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={weightChartData.slice(-5)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                            <XAxis dataKey="date" stroke="var(--white-muted)" style={{ fontSize: '9px', fontFamily: 'var(--ff-mono)' }} />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="var(--white-muted)" style={{ fontSize: '9px', fontFamily: 'var(--ff-mono)' }} />
                            <Tooltip contentStyle={{ background: 'var(--black4)', border: '1px solid var(--gold)', fontSize: '11px' }} />
                            <Line type="monotone" dataKey="Weight" stroke="var(--gold)" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--white-muted)', fontSize: '13px' }}>
                        No weight logs recorded. Add a weight log on the left sidebar.
                      </div>
                    )}
                  </div>

                  {/* Macros Preview */}
                  <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '18px', margin: 0 }}>CALORIE INTAKE TRACKER</h4>
                      <button onClick={() => setActiveTab('macros')} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '11px', fontFamily: 'var(--ff-mono)', cursor: 'pointer' }} className="interactive-element">
                        VIEW TIMELINE ➔
                      </button>
                    </div>

                    {macroLogs.length > 0 ? (
                      <div style={{ width: '100%', height: '160px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={macroChartData.slice(-5)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                            <XAxis dataKey="date" stroke="var(--white-muted)" style={{ fontSize: '9px', fontFamily: 'var(--ff-mono)' }} />
                            <YAxis stroke="var(--white-muted)" style={{ fontSize: '9px', fontFamily: 'var(--ff-mono)' }} />
                            <Tooltip contentStyle={{ background: 'var(--black4)', border: '1px solid var(--gold)', fontSize: '11px' }} />
                            <Bar dataKey="Calories" name="Consumed (kcal)" fill="var(--gold)" radius={[2, 2, 0, 0]} />
                            {plan && <ReferenceLine y={plan.macros.calories} label={{ value: 'Target', fill: 'var(--terminal-green)', fontSize: 9, position: 'top' }} stroke="var(--terminal-green)" strokeDasharray="3 3" />}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--white-muted)', fontSize: '13px' }}>
                        No macro intakes logged. Open the Macro Timeline tab to track.
                      </div>
                    )}
                  </div>

                </div>

                {/* AI Stack Recommendations Box */}
                {plan && plan.stack && plan.stack.length > 0 && (
                  <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Dumbbell size={16} style={{ color: 'var(--gold)' }} />
                        YOUR NUTRITION RECOVERY STACK
                      </h3>
                      <button onClick={() => setActiveTab('dosing')} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '11px', fontFamily: 'var(--ff-mono)', cursor: 'pointer' }} className="interactive-element">
                        AI DOSING PROTOCOLS ➔
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                      {plan.stack.map((product) => (
                        <div 
                          key={product._id}
                          style={{
                            background: 'var(--black4)',
                            border: '1px solid rgba(255,255,255,0.03)',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%'
                          }}
                        >
                          <div>
                            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                              {product.category}
                            </span>
                            <strong style={{ display: 'block', fontSize: '16px', color: 'var(--white)', fontFamily: 'var(--ff-display)', marginBottom: '8px' }}>
                              {product.name}
                            </strong>
                            <p style={{ fontSize: '12px', color: 'var(--white-muted)', margin: 0, lineHeight: '1.4' }}>
                              {product.shortDesc || product.description?.slice(0, 70) + '...'}
                            </p>
                          </div>

                          <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)', color: 'var(--white-muted)', display: 'block' }}>DOSING SCHEDULE</span>
                            <strong style={{ fontSize: '12px', color: 'var(--gold)', fontFamily: 'var(--ff-mono)' }}>
                              {getProductDosing(product.slug, plan.biometrics.goal).timing}
                            </strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: Weight Trend Details */}
            {activeTab === 'weight' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '40px' }}>
                  <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>ATHLETIC WEIGHT TRAJECTORY</h3>
                  <p style={{ fontSize: '15px', marginBottom: '30px' }}>
                    Track structural weight trends over time. Maintaining weight metrics is critical to calculating accurate caloric adaptations.
                  </p>

                  {weightLogs.length > 0 ? (
                    <div style={{ width: '100%', height: '320px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="date" stroke="var(--white-muted)" style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)' }} />
                          <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--white-muted)" style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)' }} />
                          <Tooltip contentStyle={{ background: 'var(--black4)', border: '1px solid var(--gold)' }} />
                          <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--ff-mono)' }} />
                          <Line type="monotone" dataKey="Weight" name="Weight (kg)" stroke="var(--gold)" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--white-muted)' }}>
                      No historical weight records found. Log your current weight using the left sidebar to start tracking.
                    </div>
                  )}
                </div>

                {/* Log list table */}
                {weightLogs.length > 0 && (
                  <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '30px' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '20px' }}>WEIGHT LOG HISTORY</h4>
                    <div style={{ maxHeight: '250px', overflowY: 'auto' }} data-lenis-prevent>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--ff-mono)', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--white-muted)' }}>
                            <th style={{ padding: '12px 10px' }}>LOG DATE</th>
                            <th style={{ padding: '12px 10px' }}>WEIGHT</th>
                            <th style={{ padding: '12px 10px' }}>VARIANCE FROM START</th>
                          </tr>
                        </thead>
                        <tbody>
                          {weightLogs.map((log, idx) => {
                            const variance = idx === 0 ? 0 : log.weightKg - weightLogs[0].weightKg;
                            return (
                              <tr key={log._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '12px 10px' }}>{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                <td style={{ padding: '12px 10px', color: 'var(--gold)', fontWeight: 'bold' }}>{log.weightKg} kg</td>
                                <td style={{ padding: '12px 10px', color: variance === 0 ? 'var(--white-muted)' : variance < 0 ? 'var(--terminal-green)' : 'var(--terminal-red)' }}>
                                  {variance === 0 ? '--' : `${variance > 0 ? '+' : ''}${variance.toFixed(1)} kg`}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Macro Timeline Logging */}
            {activeTab === 'macros' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Intake Form & Chart container */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }} className="coa-charts-grid">
                  
                  {/* Intake Line/Bar Chart */}
                  <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '30px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>MACRONUTRIENT TIMELINE TRACKER</h3>
                    <p style={{ fontSize: '13px', marginBottom: '24px' }}>
                      Daily nutritional records showing intake loads. The dotted lines represent targets locked in your biometrics plan.
                    </p>

                    {macroLogs.length > 0 ? (
                      <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={macroChartData}>
                            <defs>
                              <linearGradient id="kcalColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="var(--gold)" stopOpacity={0.01}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                            <XAxis dataKey="date" stroke="var(--white-muted)" style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)' }} />
                            <YAxis stroke="var(--white-muted)" style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)' }} />
                            <Tooltip contentStyle={{ background: 'var(--black4)', border: '1px solid var(--gold)' }} />
                            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--ff-mono)' }} />
                            <Area type="monotone" dataKey="Calories" name="Intake (kcal)" stroke="var(--gold)" fillOpacity={1} fill="url(#kcalColor)" strokeWidth={2.5} />
                            {plan && <ReferenceLine y={plan.macros.calories} stroke="var(--terminal-green)" strokeWidth={1.5} strokeDasharray="4 4" label={{ value: 'Target', fill: 'var(--terminal-green)', fontSize: 10, position: 'insideTopLeft' }} />}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--white-muted)' }}>
                        No macro intake logs saved yet. Submit a log entry in the right panel.
                      </div>
                    )}
                  </div>

                  {/* Log Macros Intake Form */}
                  <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '30px' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>LOG DAILY INTAKE</h4>
                    <form onSubmit={handleLogMacros}>
                      <div style={{ marginBottom: '12px' }}>
                        <label className="macros-label">Protein (g)</label>
                        <input
                          type="number"
                          placeholder="Protein grams"
                          value={logProtein}
                          onChange={(e) => setLogProtein(e.target.value)}
                          className="macros-input"
                          style={{ padding: '10px 14px', fontSize: '14px' }}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <label className="macros-label">Carbohydrates (g)</label>
                        <input
                          type="number"
                          placeholder="Carbs grams"
                          value={logCarbs}
                          onChange={(e) => setLogCarbs(e.target.value)}
                          className="macros-input"
                          style={{ padding: '10px 14px', fontSize: '14px' }}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <label className="macros-label">Dietary Fat (g)</label>
                        <input
                          type="number"
                          placeholder="Fat grams"
                          value={logFat}
                          onChange={(e) => setLogFat(e.target.value)}
                          className="macros-input"
                          style={{ padding: '10px 14px', fontSize: '14px' }}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label className="macros-label">Calories (kcal)</label>
                        <input
                          type="number"
                          placeholder="Total kcal"
                          value={logCalories}
                          onChange={(e) => setLogCalories(e.target.value)}
                          className="macros-input"
                          style={{ padding: '10px 14px', fontSize: '14px' }}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <label className="macros-label">Intake Date</label>
                        <input
                          type="date"
                          value={macroDate}
                          onChange={(e) => setMacroDate(e.target.value)}
                          className="macros-input"
                          style={{ padding: '10px 14px', fontSize: '14px' }}
                          required
                        />
                      </div>
                      <GoldButton type="submit" style={{ width: '100%', padding: '12px', fontSize: '11px' }}>
                        SAVE DIETARY LOG
                      </GoldButton>
                    </form>
                    {macroSuccess && (
                      <div style={{ marginTop: '12px', color: 'var(--terminal-green)', fontSize: '12px', fontFamily: 'var(--ff-mono)', textAlign: 'center' }}>
                        {macroSuccess}
                      </div>
                    )}
                  </div>

                </div>

                {/* Sub-breakdown details */}
                {macroLogs.length > 0 && (
                  <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '30px' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '20px' }}>MACRONUTRIENT HISTORY SPLITS</h4>
                    <div style={{ maxHeight: '250px', overflowY: 'auto' }} data-lenis-prevent>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--ff-mono)', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--white-muted)' }}>
                            <th style={{ padding: '12px 10px' }}>DATE</th>
                            <th style={{ padding: '12px 10px' }}>CALORIES</th>
                            <th style={{ padding: '12px 10px' }}>PROTEIN</th>
                            <th style={{ padding: '12px 10px' }}>CARBS</th>
                            <th style={{ padding: '12px 10px' }}>FAT</th>
                            <th style={{ padding: '12px 10px' }}>CALORIC DELTA</th>
                          </tr>
                        </thead>
                        <tbody>
                          {macroLogs.map(log => {
                            const delta = plan ? log.calories - plan.macros.calories : null;
                            return (
                              <tr key={log._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '12px 10px' }}>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                <td style={{ padding: '12px 10px', color: 'var(--gold)', fontWeight: 'bold' }}>{log.calories} kcal</td>
                                <td style={{ padding: '12px 10px' }}>{log.protein}g</td>
                                <td style={{ padding: '12px 10px' }}>{log.carbs}g</td>
                                <td style={{ padding: '12px 10px' }}>{log.fat}g</td>
                                <td style={{ padding: '12px 10px', color: delta === null || delta === 0 ? 'var(--white-muted)' : delta > 0 ? 'var(--terminal-red)' : 'var(--terminal-green)' }}>
                                  {delta === null || delta === 0 ? 'Optimal' : `${delta > 0 ? '+' : ''}${delta} kcal`}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: AI Dosing Routine */}
            {activeTab === 'dosing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '40px' }}>
                  <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>AI-DRIVEN DOSING ROUTINES</h3>
                  <p style={{ fontSize: '15px', marginBottom: '30px' }}>
                    Maximize the chemical efficacy of your supplement stack. Your personalized routine is structured based on your fitness goals and biometrics activity load.
                  </p>

                  {plan && plan.stack && plan.stack.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {plan.stack.map((product) => {
                        const dosing = getProductDosing(product.slug, plan.biometrics.goal);
                        return (
                          <div 
                            key={product._id} 
                            style={{ 
                              background: 'var(--black4)', 
                              border: '1px solid rgba(201,168,76,0.15)', 
                              padding: '30px',
                              display: 'grid',
                              gridTemplateColumns: '250px 1fr',
                              gap: '30px'
                            }}
                            className="coa-topsheet"
                          >
                            {/* Product card block */}
                            <div>
                              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                {product.category}
                              </span>
                              <strong style={{ display: 'block', fontSize: '22px', color: 'var(--white)', fontFamily: 'var(--ff-display)', marginBottom: '8px' }}>
                                {product.name}
                              </strong>
                              <div style={{ display: 'inline-block', border: '1px solid var(--terminal-green)', color: 'var(--terminal-green)', fontFamily: 'var(--ff-mono)', fontSize: '9px', padding: '3px 8px', letterSpacing: '1px' }}>
                                ACTIVE PROTOCOL LOCK
                              </div>
                            </div>

                            {/* Detailed Dosing guidelines */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '30px' }} className="dosing-details-pane">
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--white-muted)', display: 'block', marginBottom: '4px' }}>RECOMMENDED TIMING</span>
                                  <strong style={{ color: 'var(--gold)', fontSize: '15px' }}>{dosing.timing}</strong>
                                </div>
                                <div>
                                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--white-muted)', display: 'block', marginBottom: '4px' }}>DETERMINED DOSAGE</span>
                                  <strong style={{ color: 'var(--white)', fontSize: '15px' }}>{dosing.dosage}</strong>
                                </div>
                              </div>

                              <div>
                                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--white-muted)', display: 'block', marginBottom: '4px' }}>PREPARATION & INSTRUCTIONS</span>
                                <p style={{ color: 'var(--white)', fontSize: '14px', margin: 0 }}>{dosing.instructions}</p>
                              </div>

                              <div style={{ background: 'rgba(255,255,255,0.01)', borderLeft: '2px solid var(--gold)', padding: '12px 16px', margin: 0 }}>
                                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--gold)', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>AI PHYSIOLOGICAL RATIONALE</span>
                                <p style={{ fontSize: '13px', color: 'var(--white-muted)', margin: 0, lineHeight: '1.5' }}>{dosing.rationale}</p>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--white-muted)' }}>
                      Please create an active nutrition plan first.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      <style>{`
        .dashboard-grid {
          grid-template-columns: 320px 1fr;
        }
        @media (max-width: 991px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 768px) {
          .coa-topsheet {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .dosing-details-pane {
            border-left: none !important;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AthleteDashboard;
