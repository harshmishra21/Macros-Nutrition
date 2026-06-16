import React, { useState } from 'react';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import { Search, ShieldCheck, FileText, CheckCircle2, AlertTriangle, HelpCircle, Activity, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const batchData = {
  'MN-WPI-992': {
    batchNumber: 'MN-WPI-992',
    product: 'WHEY ISOLATE - ULTRA PURE (DARK CHOCOLATE)',
    manufactureDate: '2026-04-12',
    expiryDate: '2027-10-12',
    labName: 'Equinox Analytical Laboratories (ISO 17025 Accredited)',
    reportId: 'EQ-2026-99281',
    purity: {
      label: 'Protein Content (Dry Basis)',
      target: 81.8,
      actual: 82.4,
      unit: '%'
    },
    heavyMetals: [
      { name: 'Lead (Pb)', limit: 10.0, actual: 0.04 },
      { name: 'Cadmium (Cd)', limit: 4.1, actual: 0.01 },
      { name: 'Mercury (Hg)', limit: 1.0, actual: 0.005 },
      { name: 'Arsenic (As)', limit: 10.0, actual: 0.02 }
    ],
    microbiological: [
      { test: 'Salmonella', limit: 'Absent / 25g', actual: 'Absent / 25g', status: 'PASS' },
      { test: 'E. Coli', limit: 'Absent / 10g', actual: 'Absent / 10g', status: 'PASS' },
      { test: 'Yeast & Mold', limit: '< 100 CFU/g', actual: '< 10 CFU/g', status: 'PASS' }
    ]
  },
  'MN-CRE-401': {
    batchNumber: 'MN-CRE-401',
    product: 'CREATINE MONOHYDRATE - MICRONIZED',
    manufactureDate: '2026-05-02',
    expiryDate: '2028-05-02',
    labName: 'Intertek Food Chemical Lab (FSSAI Recognized)',
    reportId: 'IT-2026-40192',
    purity: {
      label: 'Creatine Purity',
      target: 99.9,
      actual: 99.98,
      unit: '%'
    },
    heavyMetals: [
      { name: 'Lead (Pb)', limit: 10.0, actual: 0.02 },
      { name: 'Cadmium (Cd)', limit: 4.1, actual: 0.005 },
      { name: 'Mercury (Hg)', limit: 1.0, actual: 0.001 },
      { name: 'Arsenic (As)', limit: 10.0, actual: 0.01 }
    ],
    microbiological: [
      { test: 'Salmonella', limit: 'Absent / 25g', actual: 'Absent / 25g', status: 'PASS' },
      { test: 'E. Coli', limit: 'Absent / 10g', actual: 'Absent / 10g', status: 'PASS' },
      { test: 'Yeast & Mold', limit: '< 100 CFU/g', actual: '< 10 CFU/g', status: 'PASS' }
    ]
  },
  'MN-PRE-772': {
    batchNumber: 'MN-PRE-772',
    product: 'AMPLIFIED PRE-WORKOUT (BLUE RASPBERRY)',
    manufactureDate: '2026-03-20',
    expiryDate: '2027-09-20',
    labName: 'SGS India Testing Center (ISO/IEC 17025)',
    reportId: 'SGS-2026-77203',
    purity: {
      label: 'Active L-Citrulline Dosage',
      target: 6.0,
      actual: 6.12,
      unit: 'g'
    },
    heavyMetals: [
      { name: 'Lead (Pb)', limit: 10.0, actual: 0.05 },
      { name: 'Cadmium (Cd)', limit: 4.1, actual: 0.015 },
      { name: 'Mercury (Hg)', limit: 1.0, actual: 0.008 },
      { name: 'Arsenic (As)', limit: 10.0, actual: 0.03 }
    ],
    microbiological: [
      { test: 'Salmonella', limit: 'Absent / 25g', actual: 'Absent / 25g', status: 'PASS' },
      { test: 'E. Coli', limit: 'Absent / 10g', actual: 'Absent / 10g', status: 'PASS' },
      { test: 'Yeast & Mold', limit: '< 100 CFU/g', actual: '< 15 CFU/g', status: 'PASS' }
    ]
  }
};

export function CoaVerifier() {
  const [searchInput, setSearchInput] = useState('');
  const [activeBatch, setActiveBatch] = useState(batchData['MN-WPI-992']);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setNotFound(false);
    const cleaned = searchInput.trim().toUpperCase();
    if (batchData[cleaned]) {
      setActiveBatch(batchData[cleaned]);
    } else {
      setNotFound(true);
    }
  };

  const selectDemoBatch = (batchNum) => {
    setNotFound(false);
    setSearchInput(batchNum);
    setActiveBatch(batchData[batchNum]);
  };

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--black4)', border: '1px solid var(--gold)', padding: '12px 16px', fontFamily: 'var(--ff-mono)', fontSize: '12px' }}>
          <p style={{ color: 'var(--white)', margin: '0 0 6px 0', fontWeight: 'bold' }}>{payload[0].payload.name}</p>
          <p style={{ color: 'var(--terminal-red)', margin: '0 0 4px 0' }}>Safety Limit: {payload[0].value} ppm</p>
          <p style={{ color: 'var(--terminal-green)', margin: 0 }}>Actual Tested: {payload[1].value} ppm</p>
        </div>
      );
    }
    return null;
  };

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
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <SectionTag text="100% TRANSPARENCY · LAB-TESTED PURITY" />
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 80px)', marginBottom: '16px' }}>
            COA <span className="text-gold-gradient">VERIFIER</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: 'var(--white-muted)' }}>
            We independent-test every batch of protein, creatine, and pre-workout we blend.
            Type your batch number from the bottom of the tub to unlock the certified lab analysis.
          </p>
        </div>

        {/* Search Bar / Panel */}
        <div style={{ maxWidth: '800px', margin: '0 auto 60px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '20px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--white-muted)' 
                }} 
              />
              <input
                type="text"
                placeholder="ENTER BATCH NUMBER (E.G. MN-WPI-992)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="macros-input"
                style={{
                  paddingLeft: '52px',
                  fontFamily: 'var(--ff-mono)',
                  letterSpacing: '1px',
                  height: '56px',
                  fontSize: '15px'
                }}
              />
            </div>
            <GoldButton type="submit" style={{ height: '56px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              VERIFY BATCH
            </GoldButton>
          </form>

          {/* Quick Demo Batches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--white-muted)', letterSpacing: '1px' }}>
              DEMO BATCH NUMBERS:
            </span>
            {Object.keys(batchData).map((batchNum) => (
              <button
                key={batchNum}
                onClick={() => selectDemoBatch(batchNum)}
                className="interactive-element"
                style={{
                  background: activeBatch?.batchNumber === batchNum ? 'rgba(201, 168, 76, 0.12)' : 'var(--black3)',
                  border: activeBatch?.batchNumber === batchNum ? '1px solid var(--gold)' : '1px solid rgba(255, 255, 255, 0.05)',
                  color: activeBatch?.batchNumber === batchNum ? 'var(--gold)' : 'var(--white)',
                  fontFamily: 'var(--ff-mono)',
                  fontSize: '11px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {batchNum}
              </button>
            ))}
          </div>

          {/* Not Found Alert */}
          {notFound && (
            <div 
              style={{ 
                marginTop: '24px', 
                padding: '16px', 
                background: 'rgba(255, 95, 87, 0.1)', 
                border: '1px solid var(--terminal-red)', 
                color: 'var(--white)',
                fontFamily: 'var(--ff-body)',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <AlertTriangle size={20} style={{ color: 'var(--terminal-red)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: 'var(--terminal-red)', marginBottom: '4px', letterSpacing: '1px' }}>BATCH NOT IDENTIFIED</strong>
                <span>We couldn't locate batch <strong>{searchInput.toUpperCase()}</strong>. Check for typing errors, or click one of the demo batches above to review representative data.</span>
              </div>
            </div>
          )}
        </div>

        {/* Verification Report Output */}
        {activeBatch && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Top Sheet: General Details & Seal */}
            <div 
              className="glass-panel coa-topsheet"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 280px',
                gap: '40px',
                padding: '40px',
                border: '1px solid rgba(201, 168, 76, 0.25)'
              }}
            >
              {/* Report Summary */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <ShieldCheck size={24} style={{ color: 'var(--terminal-green)' }} />
                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px', color: 'var(--terminal-green)', letterSpacing: '2px', fontWeight: 'bold' }}>
                    VERIFIED AUTHENTIC BATCH
                  </span>
                </div>
                
                <h2 style={{ fontSize: '32px', color: 'var(--white)', marginBottom: '24px' }}>
                  {activeBatch.product}
                </h2>

                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                    gap: '20px',
                    fontFamily: 'var(--ff-mono)',
                    fontSize: '12px'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--white-muted)', display: 'block', marginBottom: '4px' }}>BATCH NUMBER</span>
                    <strong style={{ color: 'var(--gold)', fontSize: '15px' }}>{activeBatch.batchNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--white-muted)', display: 'block', marginBottom: '4px' }}>LABORATORY PARTNER</span>
                    <span style={{ color: 'var(--white)' }}>{activeBatch.labName}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--white-muted)', display: 'block', marginBottom: '4px' }}>REPORT ID</span>
                    <span style={{ color: 'var(--white)' }}>{activeBatch.reportId}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--white-muted)', display: 'block', marginBottom: '4px' }}>MANUFACTURING DATE</span>
                    <span style={{ color: 'var(--white)' }}>{activeBatch.manufactureDate}</span>
                  </div>
                </div>
              </div>

              {/* Status Seal Box */}
              <div 
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <Award size={48} style={{ color: 'var(--gold)', marginBottom: '12px' }} />
                <span style={{ fontFamily: 'var(--ff-display)', fontSize: '24px', color: 'var(--white)', letterSpacing: '1px', marginBottom: '4px' }}>
                  100% APPROVED
                </span>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--white-muted)', letterSpacing: '1px' }}>
                  FSSAI & GMP COMPLIANT
                </span>
              </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="coa-charts-grid">
              
              {/* Left Column: Purity & Compound Verification */}
              <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '40px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} style={{ color: 'var(--gold)' }} />
                  ACTIVE COMPOUND ANALYSIS
                </h3>
                <p style={{ fontSize: '14px', marginBottom: '30px' }}>
                  Comparison of the declared target label values vs actual laboratory assay testing results.
                </p>

                {/* Progress Visual */}
                <div style={{ background: 'var(--black4)', padding: '30px', border: '1px solid rgba(255,255,255,0.02)', textAlign: 'center', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--white-muted)', display: 'block', marginBottom: '12px' }}>
                    {activeBatch.purity.label.toUpperCase()}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--ff-mono)', color: 'var(--white-muted)', display: 'block' }}>TARGET</span>
                      <span style={{ fontSize: '28px', fontFamily: 'var(--ff-display)' }}>{activeBatch.purity.target}{activeBatch.purity.unit}</span>
                    </div>
                    <div style={{ fontSize: '24px', color: 'var(--gold)' }}>➔</div>
                    <div>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--ff-mono)', color: 'var(--gold)', display: 'block' }}>ACTUAL TESTED</span>
                      <span style={{ fontSize: '42px', fontFamily: 'var(--ff-display)', color: 'var(--gold)' }}>{activeBatch.purity.actual}{activeBatch.purity.unit}</span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div style={{ width: '100%', height: '8px', background: 'var(--black)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: '100%', 
                        background: 'var(--gold-dark)', 
                        position: 'absolute', 
                        top: 0, 
                        left: 0 
                      }}
                    />
                    <div 
                      style={{ 
                        height: '100%', 
                        width: '100%', 
                        background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-bright) 100%)', 
                        position: 'absolute', 
                        top: 0, 
                        left: 0,
                        boxShadow: '0 0 8px var(--gold-bright)'
                      }}
                    />
                  </div>
                  <span style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--ff-mono)', color: 'var(--terminal-green)', marginTop: '12px' }}>
                    ✔ EXCEEDS TARGET SPECIFICATION
                  </span>
                </div>
              </div>

              {/* Right Column: Heavy Metals Testing (Recharts) */}
              <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '40px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={18} style={{ color: 'var(--gold)' }} />
                  HEAVY METALS SCREENING (PPM)
                </h3>
                <p style={{ fontSize: '14px', marginBottom: '30px' }}>
                  Heavy metal contaminants measured in parts per million (ppm). Tested values are verified far below FDA & WHO safety margins.
                </p>

                <div style={{ width: '100%', height: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activeBatch.heavyMetals}
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 15, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis type="number" stroke="var(--white-muted)" style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)' }} />
                      <YAxis dataKey="name" type="category" stroke="var(--white-muted)" style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)' }} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                      <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--ff-mono)' }} />
                      <Bar dataKey="limit" name="FDA Safety Limit" fill="#3a2222" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="actual" name="Actual Tested" fill="var(--gold)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Bottom Sheet: Micro Test Outcomes & Safe Seals */}
            <div style={{ background: 'var(--black3)', border: '1px solid var(--border-subtle)', padding: '40px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>MICROBIOLOGICAL & PATHOGEN SCREEN</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {activeBatch.microbiological.map((m, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      background: 'var(--black4)', 
                      padding: '20px', 
                      border: '1px solid rgba(255,255,255,0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '16px', color: 'var(--white)', fontFamily: 'var(--ff-display)' }}>{m.test.toUpperCase()}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--white-muted)', fontFamily: 'var(--ff-mono)' }}>Limit: {m.limit}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--terminal-green)', fontFamily: 'var(--ff-mono)', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} /> {m.actual}
                      </span>
                      <span style={{ fontSize: '9px', color: 'var(--white-muted)', fontFamily: 'var(--ff-mono)' }}>({m.status})</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance Badges Row */}
              <div 
                style={{ 
                  borderTop: '1px solid rgba(255,255,255,0.05)', 
                  paddingTop: '30px', 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '24px'
                }}
              >
                {[
                  { text: 'FSSAI CERTIFIED', desc: 'Lic. 10024022000451' },
                  { text: 'ISO 9001:2015', desc: 'Quality Management' },
                  { text: 'WADA/NADA SAFE', desc: 'Banned Substance Free' },
                  { text: 'GMP COMPLIANT', desc: 'Good Manufacturing Practices' }
                ].map((badge, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--gold)', fontFamily: 'var(--ff-display)', fontSize: '18px', letterSpacing: '1px' }}>{badge.text}</div>
                    <div style={{ color: 'var(--white-muted)', fontFamily: 'var(--ff-mono)', fontSize: '10px' }}>{badge.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      <style>{`
        .coa-charts-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 900px) {
          .coa-topsheet {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .coa-charts-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CoaVerifier;
