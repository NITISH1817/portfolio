import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function AdvancedCursor() {
  const [hoveredLabel, setHoveredLabel] = useState(null);
  
  const cursorX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const cursorY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  
  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, smoothOptions);
  const smoothY = useSpring(cursorY, smoothOptions);
  
  // Velocity calculation for elongation
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);
  
  const scale = useSpring(1, { damping: 15, stiffness: 200 });
  
  useEffect(() => {
    let lastTime = performance.now();
    let lastX = cursorX.get();
    let lastY = cursorY.get();
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      
      const vx = (clientX - lastX) / dt;
      const vy = (clientY - lastY) / dt;
      
      velocityX.set(vx);
      velocityY.set(vy);
      
      cursorX.set(clientX);
      cursorY.set(clientY);
      
      lastX = clientX;
      lastY = clientY;
      lastTime = now;

      // Handle custom labels
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setHoveredLabel(target.getAttribute('data-cursor'));
        scale.set(1.5);
      } else {
        setHoveredLabel(null);
        scale.set(1);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY, scale, velocityX, velocityY]);

  // Transform velocity into rotation and stretch
  const rotation = useTransform([velocityX, velocityY], ([vx, vy]) => {
    return Math.atan2(vy, vx) * (180 / Math.PI);
  });
  
  const stretch = useTransform([velocityX, velocityY], ([vx, vy]) => {
    const magnitude = Math.sqrt(vx * vx + vy * vy);
    return 1 + Math.min(magnitude * 0.1, 1);
  });

  if (typeof window !== "undefined" && window.innerWidth < 768) return null; // Disable on mobile

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[9999]"
        style={{
          x: useTransform(smoothX, x => x - 16),
          y: useTransform(smoothY, y => y - 16),
          scale: scale,
          rotate: rotation,
          scaleX: stretch
        }}
      />
      
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999]"
        style={{
          x: useTransform(cursorX, x => x - 4),
          y: useTransform(cursorY, y => y - 4),
        }}
      />

      {/* Label */}
      <motion.div
        className="fixed top-0 left-0 text-[10px] font-bold tracking-widest text-[#F4F7FB] pointer-events-none z-[9999] whitespace-nowrap drop-shadow-md"
        style={{
          x: useTransform(smoothX, x => x + 20),
          y: useTransform(smoothY, y => y - 5),
          opacity: hoveredLabel ? 1 : 0
        }}
      >
        {hoveredLabel}
      </motion.div>
    </>
  );
}
