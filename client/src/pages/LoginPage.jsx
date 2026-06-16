import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import Logo from '../components/ui/Logo.jsx';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login, error, clearError, loading, user } = useAuthStore();

  useEffect(() => {
    clearError();
    if (user) {
      navigate('/dashboard');
    }
  }, [clearError, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

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
          <h2 style={{ fontSize: '36px', color: '#FFF' }}>SIGN IN</h2>
        </div>

        {error && (
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
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="macros-label">EMAIL ADDRESS</label>
            <input 
              type="email" 
              placeholder="ENTER REGISTERED EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="macros-input"
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label className="macros-label">PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="ENTER SECURE PASSWORD"
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

          <GoldButton type="submit" disabled={loading} style={{ width: '100%', height: '52px', marginBottom: '24px' }}>
            {loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
          </GoldButton>
        </form>

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--white-muted)' }}>NEW TO MACROS?</span>{' '}
          <Link to="/signup" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 'bold' }} className="interactive-element">
            CREATE ACCOUNT
          </Link>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
