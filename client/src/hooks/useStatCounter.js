import { useState, useEffect, useRef } from 'react';

export function useStatCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      const numeric = parseInt(target.replace(/[^0-9]/g, ''));
      if (isNaN(numeric) || numeric === 0) {
        setCount(target);
        return;
      }

      const suffix = target.replace(/[0-9]/g, ''); // get %, +, K+, etc.
      const prefix = target.startsWith('#') ? '#' : '';
      const actualNumeric = target.startsWith('#') ? parseInt(target.substring(1)) : numeric;

      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        
        const currentVal = Math.round(eased * actualNumeric);
        setCount(`${prefix}${currentVal}${suffix}`);
        
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
      observer.disconnect(); // Fire only once
    }, { threshold: 0.2 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export default useStatCounter;
