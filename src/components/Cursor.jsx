import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';

export default function Cursor() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [label, setLabel] = useState('');
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring configurations for different parts
  const dotSpringConfig = { damping: 25, stiffness: 400, mass: 0.2 };
  const ringSpringConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  
  const smoothX = useSpring(cursorX, dotSpringConfig);
  const smoothY = useSpring(cursorY, dotSpringConfig);
  
  const ringX = useSpring(cursorX, ringSpringConfig);
  const ringY = useSpring(cursorY, ringSpringConfig);
  
  const size = useMotionValue(8);
  const ringSize = useMotionValue(40);
  const opacity = useMotionValue(0);
  
  // Velocity calculation for deformation
  const velocityScaleX = useMotionValue(1);
  const velocityScaleY = useMotionValue(1);
  const rotation = useMotionValue(0);
  
  const lastPos = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const checkMobile = () => setIsDesktop(window.innerWidth > 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    
    // Direct DOM manipulation for light gradient to avoid react re-renders
    const lightEl = document.getElementById('cursor-light');

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      cursorX.set(x);
      cursorY.set(y);
      opacity.set(1);
      
      if (lightEl) {
        lightEl.style.background = `radial-gradient(circle 400px at ${x}px ${y}px, rgba(91, 108, 255, 0.08), transparent 80%)`;
      }

      // Velocity calculation
      const now = performance.now();
      const dt = now - lastPos.current.time;
      if (dt > 0) {
        const dx = x - lastPos.current.x;
        const dy = y - lastPos.current.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const vel = dist / dt;
        
        // Stretch based on velocity
        const stretch = Math.min(Math.max(1 + vel * 0.2, 1), 2);
        velocityScaleX.set(stretch);
        velocityScaleY.set(1 / Math.sqrt(stretch)); // Maintain volume area roughly
        
        // Rotation points towards movement
        if (dist > 1) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          rotation.set(angle);
        }
      }
      
      lastPos.current = { x, y, time: now };
    };

    const handleMouseLeave = () => opacity.set(0);

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const type = target.getAttribute('data-cursor');
        
        animate(size, 0, { duration: 0.2 });
        animate(ringSize, 80, { duration: 0.3, type: 'spring', damping: 20 });
        
        if (type === 'view') setLabel('VIEW');
        else if (type === 'github') setLabel('GITHUB');
        else if (type === 'resume') setLabel('VIEW RESUME');
        else if (type === 'download') setLabel('DOWNLOAD');
        else if (type === 'connect') setLabel('CONNECT');
        else if (type === 'menu') setLabel('MENU');
        else if (type === 'explore') setLabel('EXPLORE');
        else setLabel('');
      } else {
        animate(size, 8, { duration: 0.2 });
        animate(ringSize, 40, { duration: 0.3 });
        setLabel('');
      }
    };

    const handleMouseDown = () => {
      animate(ringSize, 60, { duration: 0.1 });
    };
    
    const handleMouseUp = () => {
      animate(ringSize, label ? 80 : 40, { type: 'spring', damping: 15 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Velocity decay loop
    let rafId;
    const decayVelocity = () => {
      const currentSx = velocityScaleX.get();
      if (currentSx > 1.01) {
        velocityScaleX.set(currentSx + (1 - currentSx) * 0.1);
        const currentSy = velocityScaleY.get();
        velocityScaleY.set(currentSy + (1 - currentSy) * 0.1);
      }
      rafId = requestAnimationFrame(decayVelocity);
    };
    decayVelocity();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, [isDesktop, cursorX, cursorY, opacity, size, ringSize, velocityScaleX, velocityScaleY, rotation, label]);

  if (!isDesktop) return null;

  return (
    <>
      <div id="cursor-light" className="cursor-light-overlay" />
      
      {/* Outer Ring with Label */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full flex items-center justify-center border border-[var(--text-secondary)] mix-blend-difference"
        style={{
          zIndex: 100,
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          translateX: '-50%',
          translateY: '-50%',
          opacity
        }}
      >
        {label && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-bold tracking-widest text-[var(--text-primary)] absolute whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Inner Dot with Velocity Deformation */}
      <motion.div
        className="fixed top-0 left-0 bg-[var(--text-primary)] rounded-full pointer-events-none mix-blend-difference"
        style={{
          zIndex: 101,
          x: smoothX,
          y: smoothY,
          width: size,
          height: size,
          scaleX: velocityScaleX,
          scaleY: velocityScaleY,
          rotate: rotation,
          translateX: '-50%',
          translateY: '-50%',
          opacity
        }}
      />
    </>
  );
}
