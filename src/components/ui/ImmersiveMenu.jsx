import React from 'react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { id: 'genesis', label: 'HOME' },
  { id: 'identity', label: 'IDENTITY' },
  { id: 'capabilities', label: 'CAPABILITIES' },
  { id: 'work', label: 'WORK' },
  { id: 'education', label: 'EDUCATION' },
  { id: 'certifications', label: 'CERTIFICATIONS' },
  { id: 'achievements', label: 'ACHIEVEMENTS' },
  { id: 'resume', label: 'RESUME' },
  { id: 'contact', label: 'CONTACT' },
];

export default function ImmersiveMenu() {
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const toggleMenu = useStore((state) => state.toggleMenu);

  const handleNav = (id) => {
    toggleMenu();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] bg-[#050609]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute top-8 right-8 md:top-12 md:right-12">
             <button 
                onClick={toggleMenu}
                className="text-xs font-medium tracking-[0.2em] text-[#F4F7FB] hover:text-[#5C6CFF] transition-colors"
                data-cursor="CLOSE"
             >
                CLOSE
             </button>
          </div>
          
          <div className="flex flex-col items-center gap-6 md:gap-8">
            {menuItems.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="text-4xl md:text-7xl font-bold tracking-tighter text-[#F4F7FB] opacity-50 hover:opacity-100 hover:text-[#5C6CFF] transition-all"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0.5, transition: { delay: i * 0.05 } }}
                whileHover={{ scale: 1.05, opacity: 1, x: 10 }}
                data-cursor="OPEN"
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
