import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

export default function Loading({ onComplete }) {
  const [step, setStep] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const messages = [
    "INITIALIZING",
    "LOADING 3D ENGINE",
    "FETCHING PROJECT DATA",
    "COMPILING INTERACTION"
  ];

  useEffect(() => {
    if (skipped) return;

    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [skipped]);

  const handleEnter = () => {
    setSkipped(true);
    gsap.to('.loading-overlay', {
      opacity: 0,
      duration: 1,
      onComplete: onComplete
    });
  };

  return (
    <div className="loading-overlay fixed inset-0 z-[10000] bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center pointer-events-auto">
      <div className="text-center">
        <h1 className="text-section-title mb-8 tracking-tighter">NITISH.DEV</h1>
        
        <div className="h-24 mb-12 font-mono text-sm tracking-widest text-[var(--text-secondary)]">
          {step < messages.length ? (
            <p className="animate-pulse">{messages[step]}...</p>
          ) : (
            <p className="text-[var(--accent)]">SYSTEM READY</p>
          )}
        </div>

        {step >= messages.length || skipped ? (
          <button 
            onClick={handleEnter}
            className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono text-sm tracking-widest hover:bg-[var(--accent)] transition-colors"
          >
            ENTER EXPERIENCE
          </button>
        ) : (
          <button 
            onClick={handleEnter}
            className="px-8 py-3 border border-[var(--text-primary)] font-mono text-sm tracking-widest hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors"
          >
            SKIP
          </button>
        )}
      </div>
    </div>
  );
}
