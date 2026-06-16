import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on mobile/tablet based on matchMedia
    const isTouchDevice = window.matchMedia('(max-width: 1024px)').matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const grid = gridRef.current;

    if (!cursor || !ring || !grid) return;

    // Set initial off-screen
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    gsap.set(ring, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    gsap.set(grid, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const onMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      // Instant movement for the dot
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.02,
        overwrite: 'auto'
      });

      // Smooth lag for the ring
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        overwrite: 'auto'
      });

      // Dotted grid halo follows cursor with parallax drift
      gsap.to(grid, {
        x: e.clientX + nx * 18,
        y: e.clientY + ny * 14,
        rotation: nx * 4,
        duration: 0.35,
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Dynamic hover effects
    const setupHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, select, textarea, [role="button"], .interactive-element');
      
      interactives.forEach(el => {
        const handleMouseEnter = () => {
          gsap.to(cursor, { scale: 2.5, backgroundColor: '#F0C040', duration: 0.3 });
          gsap.to(ring, { scale: 1.5, borderColor: '#F0C040', opacity: 0.5, duration: 0.3 });
          gsap.to(grid, { scale: 1.25, opacity: 0.7, duration: 0.3 });
        };
        const handleMouseLeave = () => {
          gsap.to(cursor, { scale: 1, backgroundColor: '#C9A84C', duration: 0.3 });
          gsap.to(ring, { scale: 1, borderColor: '#C9A84C', opacity: 1, duration: 0.3 });
          gsap.to(grid, { scale: 1, opacity: 0.45, duration: 0.3 });
        };

        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Delay slightly to ensure elements are in DOM
    const timer = setTimeout(setupHoverListeners, 1000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(timer);
    };
  }, []);

  return { cursorRef, ringRef, gridRef };
}
export default useCursor;
