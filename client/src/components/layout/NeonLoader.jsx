import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function NeonLoader() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(15);

    // Simulate stepping increments
    const t1 = setTimeout(() => setProgress(45), 80);
    const t2 = setTimeout(() => setProgress(75), 200);
    const t3 = setTimeout(() => setProgress(92), 350);
    
    // Complete
    const t4 = setTimeout(() => {
      setProgress(100);
    }, 450);

    // Fade out
    const t5 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '4px',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, var(--gold-dark) 0%, var(--gold) 50%, var(--gold-bright) 100%)',
        boxShadow: '0 0 12px var(--gold-bright), 0 0 6px var(--gold)',
        zIndex: 99999,
        transition: 'width 0.2s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.15s ease-out',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none'
      }}
    />
  );
}

export default NeonLoader;
