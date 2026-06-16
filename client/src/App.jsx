import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/authStore.js';
import { useThemeStore } from './store/themeStore.js';

// Layout
import Cursor from './components/layout/Cursor.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import SmoothScroll from './components/layout/SmoothScroll.jsx';
import PageWrapper from './components/layout/PageWrapper.jsx';
import NeonLoader from './components/layout/NeonLoader.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AiCoachPage from './pages/AiCoachPage.jsx';
import StackBuilderPage from './pages/StackBuilderPage.jsx';
import TransformationsPage from './pages/TransformationsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AthleteDashboard from './pages/AthleteDashboard.jsx';
import CoaVerifier from './pages/CoaVerifier.jsx';

export function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Global neon transition loader */}
      <NeonLoader />

      {/* Global Cursor follower */}
      <Cursor />

      {/* Global Navbar */}
      <Navbar />

      {/* Page Content routes with slide-fade transition */}
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/products" element={<PageWrapper><ProductsPage /></PageWrapper>} />
            <Route path="/products/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
            <Route path="/ai-coach" element={<PageWrapper><AiCoachPage /></PageWrapper>} />
            <Route path="/stack-builder" element={<PageWrapper><StackBuilderPage /></PageWrapper>} />
            <Route path="/transformations" element={<PageWrapper><TransformationsPage /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
            <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper><CartPage /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><AthleteDashboard /></PageWrapper>} />
            <Route path="/coa" element={<PageWrapper><CoaVerifier /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Global Footer */}
      <Footer />
    </>
  );
}

export function App() {
  const { init } = useAuthStore();
  const { isDark } = useThemeStore();

  // Apply theme class to <html> so CSS variables switch globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Initialize auth session on app mount
  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <SmoothScroll />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
