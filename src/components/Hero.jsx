import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SplitReveal from './SplitReveal';

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const xOffset = useTransform(smoothX, [0, window.innerWidth || 1000], [-15, 15]);
  const yOffset = useTransform(smoothY, [0, window.innerHeight || 1000], [-10, 10]);
  const xOffsetSmall = useTransform(smoothX, [0, window.innerWidth || 1000], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="min-h-screen relative flex flex-col justify-center px-6 md:px-12 pt-24 spatial-section" id="hero">
      
      <div className="w-full flex flex-col md:flex-row items-center justify-between h-full relative">
        
        {/* Left Side: Massive Typography with Spatial Parallax */}
        <motion.div 
          className="w-full md:w-1/2 flex flex-col items-start z-10 relative"
          style={{ x: xOffset, y: yOffset }}
        >
          
          <h1 className="text-hero m-0 font-bold tracking-tighter leading-none mb-8">
            <SplitReveal delay={0.1}>NITISH</SplitReveal>
            <br />
            <SplitReveal delay={0.2}>PRIYAN</SplitReveal>
          </h1>
          
          <motion.div className="flex flex-col gap-6 max-w-lg mt-4" style={{ x: xOffsetSmall }}>
            <p className="text-metadata text-[var(--text-secondary)]">
              Computer Science & Engineering Student
            </p>
            
            <div className="text-body font-bold uppercase tracking-tight flex flex-col gap-1 text-[var(--text-secondary)]">
              <p className="text-[var(--text-primary)]">Software Engineer</p>
              <p>Java Developer</p>
              <p>AI / ML Engineer</p>
            </div>
          </motion.div>

          <div className="mt-16 flex flex-col gap-2 border-l border-[var(--border-color)] pl-4">
            <p className="text-metadata text-[var(--text-secondary)]">
              Bannari Amman Institute of Technology
            </p>
            <p className="text-metadata text-[var(--text-secondary)]">
              Batch 2028
            </p>
          </div>
        </motion.div>

        {/* Right Side: Empty for Global 3D Object */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-full relative pointer-events-none" />

      </div>
      
    </section>
  );
}
