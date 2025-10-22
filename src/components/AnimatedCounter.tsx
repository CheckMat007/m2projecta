// src/components/AnimatedCounter.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';

export const AnimatedCounter = ({ end }: { end: number }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // 1. Copy ref.current to a local variable
    const node = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      // 2. Use the local variable in the cleanup function
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  return (
    <span ref={ref}>
      {inView ? <CountUp end={end} duration={2.5} separator="." /> : '0'}
    </span>
  );
};