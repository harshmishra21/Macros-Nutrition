import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useCartStore } from '../../store/cartStore.js';
import { useThemeStore } from '../../store/themeStore.js';
import Switch from '../ui/Switch.jsx';
import Logo from '../ui/Logo.jsx';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const cartCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 60px',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'var(--nav-bg-scrolled)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201, 168, 76, 0.2)' : '1px solid transparent'
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }} className="interactive-element">
        <Logo variant="horizontal" size="md" />
      </Link>

      {/* Nav Links - Desktop */}
      <div 
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center'
        }}
        className="desktop-only"
      >
        <NavLink to="/products" className={({ isActive }) => `nav-link interactive-element ${isActive ? 'active' : ''}`}>Shop</NavLink>
        <NavLink to="/ai-coach" className={({ isActive }) => `nav-link interactive-element ${isActive ? 'active' : ''}`}>AI Coach</NavLink>
        <NavLink to="/stack-builder" className={({ isActive }) => `nav-link interactive-element ${isActive ? 'active' : ''}`}>Stack Builder</NavLink>
        {user && <NavLink to="/dashboard" className={({ isActive }) => `nav-link interactive-element ${isActive ? 'active' : ''}`}>Dashboard</NavLink>}
        <NavLink to="/transformations" className={({ isActive }) => `nav-link interactive-element ${isActive ? 'active' : ''}`}>Athletes</NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-link interactive-element ${isActive ? 'active' : ''}`}>About</NavLink>
        <NavLink to="/blog" className={({ isActive }) => `nav-link interactive-element ${isActive ? 'active' : ''}`}>Education</NavLink>
      </div>

      {/* Action Buttons */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        {/* Cart */}
        <Link 
          to="/cart" 
          style={{ position: 'relative', color: 'var(--white)', display: 'flex', alignItems: 'center' }} 
          className="interactive-element"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span 
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--gold)',
                color: 'var(--black)',
                fontSize: '10px',
                fontWeight: 'bold',
                fontFamily: 'var(--ff-mono)',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>

        {/* User / Auth Info */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-only">
            {user.role === 'admin' && (
              <Link to="/admin" title="Admin Dashboard" style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center' }} className="interactive-element">
                <ShieldAlert size={20} />
              </Link>
            )}
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px' }}>
              {user.name.toUpperCase()}
            </span>
            <button 
              onClick={handleLogout} 
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              className="interactive-element"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-gold desktop-only interactive-element" style={{ padding: '10px 24px' }}>
            GET STARTED
          </Link>
        )}

        {/* Theme Toggle */}
        <div className="interactive-element" id="theme-toggle-btn">
          <Switch
            checked={!isDark}
            onChange={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          />
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setMobileMenuOpen(true)} 
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          className="mobile-hamburger interactive-element"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--mobile-menu-bg)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 30px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
            <span style={{ fontFamily: 'var(--ff-display)', fontSize: '24px', color: 'var(--gold)' }}>MENU</span>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <X size={28} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: 1 }}>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '2px' }}>SHOP</Link>
            <Link to="/ai-coach" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '2px' }}>AI COACH</Link>
            <Link to="/stack-builder" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '2px' }}>STACK BUILDER</Link>
            {user && <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '2px' }}>DASHBOARD</Link>}
            <Link to="/transformations" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '2px' }}>REAL ATHLETES</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '2px' }}>ABOUT US</Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '2px' }}>BLOG</Link>
            
            {user && user.role === 'admin' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '2px' }}>ADMIN CONSOLE</Link>
            )}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
            {user ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '14px', color: 'var(--gold)' }}>{user.name.toUpperCase()}</span>
                <button 
                  onClick={handleLogout} 
                  style={{ background: 'none', border: 'none', color: 'var(--terminal-red)', fontFamily: 'var(--ff-mono)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  LOGOUT <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)} 
                className="btn-gold" 
                style={{ width: '100%', display: 'block', textAlign: 'center' }}
              >
                GET STARTED
              </Link>
            )}
          </div>
        </div>
      )}

      {/* CSS overrides for desktop-only and mobile drawer responsiveness */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-only {
            display: none !important;
          }
        }
        @media (min-width: 1025px) {
          .mobile-hamburger {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
