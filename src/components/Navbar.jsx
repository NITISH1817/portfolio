import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { identityData } from '../data/portfolio';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    { name: 'HOME', id: 'hero' },
    { name: 'IDENTITY', id: 'about' },
    { name: 'CAPABILITIES', id: 'capabilities' },
    { name: 'WORK', id: 'projects' },
    { name: 'EDUCATION', id: 'education' },
    { name: 'CERTIFICATIONS', id: 'certifications' },
    { name: 'ACHIEVEMENTS', id: 'achievements' },
    { name: 'RESUME', id: 'resume' },
    { name: 'CONTACT', id: 'contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full px-6 py-6 md:px-12 flex justify-between items-center pointer-events-auto transition-all duration-300 ${
          scrolled ? 'bg-(--bg-primary)/80 backdrop-blur-md border-b border-(--border-color)' : 'bg-transparent'
        }`} 
        style={{ zIndex: 150 }}
      >
        <div 
          className="font-bold text-lg md:text-xl tracking-tight uppercase cursor-pointer text-(--text-primary)" 
          onClick={() => scrollToSection('hero')}
        >
          {identityData.shortName}
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-(--text-primary) text-sm font-medium tracking-tight">
          <button onClick={() => scrollToSection('projects')} className="hover:text-(--text-secondary) transition-colors">WORK</button>
          <button onClick={() => scrollToSection('capabilities')} className="hover:text-(--text-secondary) transition-colors">CAPABILITIES</button>
          <button onClick={() => scrollToSection('resume')} className="hover:text-(--text-secondary) transition-colors">RESUME</button>
        </div>

        <div className="flex items-center gap-6">
          <button 
            className="text-sm font-bold text-(--text-primary) hover:text-(--accent) transition-colors cursor-pointer border-b border-transparent hover:border-(--accent) pb-1"
            onClick={() => scrollToSection('contact')}
          >
            CONTACT
          </button>
          <button 
            className="text-sm font-medium text-(--text-primary) hover:text-(--text-secondary) transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-(--bg-primary) z-[100] flex flex-col justify-center items-center pointer-events-auto"
          >
            <div className="flex flex-col gap-6 items-center">
              {menuItems.map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-(--text-primary) hover:text-(--accent) transition-colors"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
