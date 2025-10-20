// src/components/AnimatedCounter.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';

export const AnimatedCounter = ({ end }: { end: number }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Se o elemento estiver visível, atualiza o estado
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Anima apenas uma vez
        }
      },
      {
        threshold: 0.1, // Ativa quando 10% do elemento está visível
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <span ref={ref}>
      {inView ? <CountUp end={end} duration={2.5} separator="." /> : '0'}
    </span>
  );
};