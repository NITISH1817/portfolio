import React, { useEffect, useRef, useState } from 'react';

function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    
    const match = String(value).match(/\d+/);
    if (!match) {
      setCount(value);
      return;
    }
    
    const target = parseInt(match[0], 10);
    const hasPlus = String(value).includes('+');
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeProgress * target);
      setCount(`${currentCount}${hasPlus ? '+' : ''}`);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count || 0}</span>;
}

export default function Achievements() {
  return (
    <section className="spatial-section min-h-screen flex items-center" id="achievements">
      <div className="w-full flex flex-col md:flex-row gap-12 md:gap-32 relative z-10">
        
        <div className="w-full flex flex-col gap-2">
          <p className="text-metadata text-[var(--text-secondary)]">06</p>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">ACHIEVEMENTS</h2>
        </div>
        
        <div className="w-full flex flex-col gap-24">
          
          <div className="flex flex-col md:flex-row items-baseline gap-4 md:gap-12">
            <div className="text-[clamp(6rem,15vw,12rem)] font-bold tracking-tighter leading-none text-[var(--text-primary)]">
              <AnimatedCounter value="250+" />
            </div>
            <div className="flex flex-col gap-2 max-w-sm">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
                DSA PROBLEMS
              </h3>
              <p className="text-body text-[var(--text-secondary)] uppercase">
                Solved in Java on LeetCode
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[var(--border-color)]" />

          <div className="flex flex-col md:flex-row items-baseline gap-4 md:gap-12">
            <div className="text-[clamp(3.5rem,8vw,6rem)] font-bold tracking-tighter leading-none text-[var(--text-primary)] uppercase">
              PATENT FILED
            </div>
            <div className="flex flex-col gap-2 max-w-md pt-4 md:pt-0">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400 px-3 py-1 rounded-full w-fit">
                Intellectual Property
              </span>
              <p className="text-body text-[var(--text-secondary)]">
                GovScheme Hybrid Eligibility Decision Engine & Multilingual E-Governance Platform
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-[var(--border-color)]" />

          <div className="flex flex-col md:flex-row items-baseline gap-4 md:gap-12">
            <div className="text-[clamp(3.5rem,8vw,6rem)] font-bold tracking-tighter leading-none text-[var(--text-primary)] uppercase">
              SMART INDIA<br />HACKATHON<br />2025
            </div>
            <div className="flex flex-col gap-2 max-w-sm pt-4 md:pt-0">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] border border-[var(--accent)] px-3 py-1 rounded-full w-fit">
                Selected Participant
              </span>
            </div>
          </div>

        </div>
        
      </div>
    </section>
  );
}
