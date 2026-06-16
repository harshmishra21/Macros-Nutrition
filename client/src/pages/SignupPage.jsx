import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import Logo from '../components/ui/Logo.jsx';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const navigate = useNavigate();
  const { register, error, clearError, loading, user } = useAuthStore();

  useEffect(() => {
    clearError();
    if (user) {
      navigate('/dashboard');
    }
  }, [clearError, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    const res = await register(name, email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const activeError = localError || error;

  return (
    <div 
      style={{ 
        background: 'var(--black)', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingTop: '120px',
        paddingBottom: '80px',
        backgroundImage: 'radial-gradient(circle at center, rgba(201, 168, 76, 0.02) 0%, transparent 70%)'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--black3)',
          border: '1px solid rgba(201, 168, 76, 0.15)',
          padding: '40px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Logo variant="vertical" size="lg" showTagline={false} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <SectionTag text="SECURE ATHLETE PORTAL" />
          <h2 style={{ fontSize: '36px', color: '#FFF' }}>SIGN UP</h2>
        </div>

        {activeError && (
          <div 
            style={{ 
              padding: '12px 16px', 
              background: 'rgba(255, 95, 87, 0.1)', 
              color: 'var(--terminal-red)', 
              border: '1px solid var(--terminal-red)',
              fontSize: '13px',
              fontFamily: 'var(--ff-mono)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <ShieldAlert size={16} />
            <span>{activeError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="macros-label">FULL ATHLETE NAME</label>
            <input 
              type="text" 
              placeholder="ENTER FULL NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="macros-input"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="macros-label">EMAIL ADDRESS</label>
            <input 
              type="email" 
              placeholder="ENTER EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="macros-input"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="macros-label">SECURE PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="CREATE PASSWORD (MIN 8 CHARS)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="macros-input"
                style={{ paddingRight: '45px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--white-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  zIndex: 2
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label className="macros-label">CONFIRM PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="RE-ENTER PASSWORD"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="macros-input"
                style={{ paddingRight: '45px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--white-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  zIndex: 2
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <GoldButton type="submit" disabled={loading} style={{ width: '100%', height: '52px', marginBottom: '24px' }}>
            {loading ? 'CREATING PROFILE...' : 'INITIALIZE PROFILE'}
          </GoldButton>
        </form>

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--white-muted)' }}>ALREADY REGISTERED?</span>{' '}
          <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 'bold' }} className="interactive-element">
            SIGN IN
          </Link>
        </div>

      </div>
    </div>
  );
}

export default SignupPage;
