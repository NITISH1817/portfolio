import React from 'react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

export default function NavigationHUD() {
  const toggleMenu = useStore((state) => state.toggleMenu);
  const scrollProgress = useStore((state) => state.scrollProgress);
  
  const currentSection = Math.min(8, Math.max(1, Math.floor(scrollProgress * 8) + 1));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 p-8 md:p-12 flex flex-col justify-between mix-blend-difference text-white">
      <div className="flex justify-between items-start">
        <div className="text-xs font-medium tracking-[0.2em] pointer-events-auto cursor-none">
          NITISH PRIYAN
        </div>
        <button 
          onClick={toggleMenu}
          className="text-xs font-medium tracking-[0.2em] pointer-events-auto cursor-none hover:text-[#5C6CFF] transition-colors"
          data-cursor="MENU"
        >
          MENU
        </button>
      </div>

      <div className="flex justify-between items-end">
        <div className="text-[10px] tracking-widest text-white/50">
          0{currentSection} / 08
        </div>
      </div>
    </div>
  );
}
