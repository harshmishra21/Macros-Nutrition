import { useEffect, useState } from 'react';
import { HeroDotGrid, HeroProductShowcase } from './HeroProductShowcase.jsx';
import { HeroGlbShowcase, HERO_GLB_URL } from './HeroGlbShowcase.jsx';

export function HeroVisual() {
  const [mode, setMode] = useState('glb');

  useEffect(() => {
    let cancelled = false;

    fetch(HERO_GLB_URL, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setMode(res.ok ? 'glb' : 'image');
      })
      .catch(() => {
        if (!cancelled) setMode('glb');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <HeroDotGrid />
      {mode === 'glb' ? <HeroGlbShowcase /> : <HeroProductShowcase />}
    </>
  );
}

export default HeroVisual;
