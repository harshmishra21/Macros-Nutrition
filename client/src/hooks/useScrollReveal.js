import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const {
    direction = 'up',
    delay = 0,
    duration = 0.8,
    distance = 40,
    stagger = 0,
    threshold = 0.1
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial state
    let x = 0;
    let y = 0;
    if (direction === 'up') y = distance;
    if (direction === 'down') y = -distance;
    if (direction === 'left') x = distance;
    if (direction === 'right') x = -distance;

    gsap.set(el, {
      opacity: 0,
      x: x,
      y: y
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: duration,
          delay: delay,
          stagger: stagger,
          ease: 'power3.out',
          overwrite: 'auto'
        });
        observer.disconnect(); // Animate only once
      }
    }, { threshold });

    observer.observe(el);

    return () => observer.disconnect();
  }, [direction, delay, duration, distance, stagger, threshold]);

  return ref;
}

export default useScrollReveal;
