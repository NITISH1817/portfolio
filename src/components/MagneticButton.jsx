import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function MagneticButton({ children, className = '', onClick, href, cursorData }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Spring configurations for magnetic pull
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isHovered || !ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Max displacement 18px
      const strength = 0.3;
      x.set(Math.max(-18, Math.min(18, distanceX * strength)));
      y.set(Math.max(-18, Math.min(18, distanceY * strength)));
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      x.set(0);
      y.set(0);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, x, y]);

  const props = {
    ref,
    className: `relative inline-block ${className}`,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onClick,
    "data-cursor": cursorData,
    style: { x, y }
  };

  if (href) {
    return (
      <motion.a href={href} {...props}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button {...props}>
      {children}
    </motion.button>
  );
}
