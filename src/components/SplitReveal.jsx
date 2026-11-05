import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SplitReveal({
  children,
  className = '',
  wordClassName = '',
  charClassName = '',
  delay = 0,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    // If user prefers reduced motion, do not animate.
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const chars = containerRef.current.querySelectorAll('.split-char');
    
    // Initial state
    gsap.set(chars, { 
      opacity: 0, 
      y: 40,
      visibility: 'hidden' 
    });

    // Animate in
    const tl = gsap.to(chars, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
      },
      opacity: 1,
      y: 0,
      visibility: 'visible',
      duration: 0.6,
      stagger: 0.015,
      ease: 'power3.out',
      delay: delay,
      onComplete: () => {
        // Enforce final state explicitly to prevent opacity/transform bugs
        gsap.set(chars, { clearProps: 'all' });
      }
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [delay]);

  if (typeof children !== 'string') {
    return <div className={className}>{children}</div>;
  }

  const words = children.split(' ');

  return (
    <>
      <noscript>
        {/* Failsafe for disabled JavaScript */}
        <div className={`inline-flex flex-wrap ${className}`}>
          {children}
        </div>
      </noscript>
      <div
        ref={containerRef}
        className={`inline-flex flex-wrap ${className}`}
        aria-label={children} // For screen readers
      >
        {words.map((word, wordIndex) => (
          <span
            key={`${word}-${wordIndex}`}
            className={`inline-flex whitespace-nowrap mr-2 lg:mr-3 ${wordClassName}`}
            aria-hidden="true" // Hide split text from screen readers
          >
            {word.split('').map((char, charIndex) => (
              <span
                key={`${char}-${charIndex}`}
                className={`split-char inline-block ${charClassName}`}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </div>
    </>
  );
}
