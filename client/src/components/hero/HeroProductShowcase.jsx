import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { DEFAULT_HERO_WHEY_IMAGE } from '../three/wheyTubMesh.js';
import { getProductImageUrl } from '../../utils/products.js';

const HERO_IMAGE_URL = getProductImageUrl(DEFAULT_HERO_WHEY_IMAGE);

export function HeroDotGrid() {
  useEffect(() => {
    const isTouch = window.matchMedia('(max-width: 1024px)').matches;
    if (isTouch) return;

    const grid = document.querySelector('.hero-dot-grid');
    if (!grid) return;

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      grid.style.setProperty('--grid-shift-x', `${nx * 28}px`);
      grid.style.setProperty('--grid-shift-y', `${ny * 18}px`);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return <div className="hero-dot-grid" aria-hidden="true" />;
}

export function HeroProductShowcase() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const parallaxX = useTransform(springX, [-1, 1], [-18, 18]);
  const parallaxY = useTransform(springY, [-1, 1], [-12, 12]);

  useEffect(() => {
    const isTouch = window.matchMedia('(max-width: 1024px)').matches;
    if (isTouch) return;

    const onMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <div className="hero-product-showcase" aria-hidden="true">
      <div className="hero-product-glow" />
      <div className="hero-product-ring" />
      <motion.div
        className="hero-product-float"
        style={{ x: parallaxX, y: parallaxY }}
      >
        <motion.img
          src={HERO_IMAGE_URL}
          alt="Macros Nutrition Whey Protein Isolate"
          className="hero-product-image"
          animate={{ y: [0, -14, 0] }}
          transition={{
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          draggable={false}
        />
      </motion.div>
    </div>
  );
}

export default HeroProductShowcase;
