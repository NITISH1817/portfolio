import React, { useState, useEffect } from 'react';
import { gsap } from '../../lib/gsap';
import { WORLD_POSITIONS } from '../../lib/worldPositions';
import { useWorld } from '../../hooks/useWorld';
import { profile } from '../../data/profile';

const NAV_ITEMS = [
  { label: 'Home',     section: 'hero' },
  { label: 'About',    section: 'about' },
  { label: 'Skills',   section: 'skills' },
  { label: 'Projects', section: 'projects' },
  { label: 'Journey',  section: 'journey' },
  { label: 'DSA',      section: 'dsa' },
  { label: 'GitHub',   section: 'github' },
  { label: 'Contact',  section: 'contact' },
];

export default function Navbar({ cameraRef }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeSection } = useWorld();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (section) => {
    setMenuOpen(false);
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    // Desktop: scroll to the correct page position
    const sectionIndex = NAV_ITEMS.findIndex(n => n.section === section);
    const totalSections = NAV_ITEMS.length;
    const targetScroll = (sectionIndex / (totalSections - 1)) * (document.body.scrollHeight - window.innerHeight);
    gsap.to(window, { scrollTo: targetScroll, duration: 1.2, ease: 'power3.inOut' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#08090C]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigateTo('hero')} className="text-lg font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
          NITISH<span className="text-blue-500 font-mono">.DEV</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <button key={item.section} onClick={() => navigateTo(item.section)}
              className={`text-xs font-mono tracking-widest uppercase transition-colors ${
                activeSection === item.section ? 'text-blue-400' : 'text-gray-500 hover:text-gray-200'
              }`}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111318] border-t border-white/5 px-6 py-4 space-y-3">
          {NAV_ITEMS.map(item => (
            <button key={item.section} onClick={() => navigateTo(item.section)}
              className="block text-sm font-mono text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
