import React, { useState, useEffect } from 'react';
import { 
  FileDown, 
  ExternalLink, 
  Menu, 
  X, 
  Box, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { identityData } from '../../data/portfolio';

interface EditorialNavbarProps {
  onReturn3D?: () => void;
  activeSection?: string;
}

export default function EditorialNavbar({ onReturn3D, activeSection = 'home' }: EditorialNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080C14]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-sm text-amber-300 group-hover:scale-105 group-hover:border-amber-400 transition-all shadow-md shadow-amber-500/10">
              NP
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-amber-300 transition-colors">
                NITISH PRIYAN R S
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                B.E. CSE • Batch 2028
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-sm shadow-amber-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Return to 3D World Button */}
            {onReturn3D && (
              <button
                onClick={onReturn3D}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-mono font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95 transition-all cursor-pointer"
                title="Enter Interactive 3D World"
              >
                <Box className="w-4 h-4 animate-spin-slow" />
                <span>3D WORLD</span>
              </button>
            )}

            {/* Resume Download */}
            <a
              href="/Nitish_Priyan_Resume_Blue.pdf"
              download="Nitish_Priyan_Resume.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-mono transition-all active:scale-95 cursor-pointer"
              title="Download Nitish Priyan Resume (PDF)"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>RESUME</span>
            </a>

            {/* Socials */}
            <div className="flex items-center gap-1 pl-1 border-l border-white/10">
              <a
                href={identityData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                title="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={identityData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-all"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            {onReturn3D && (
              <button
                onClick={onReturn3D}
                className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono"
              >
                <Box className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl pt-20 px-6 pb-8 flex flex-col justify-between sm:hidden animate-in fade-in duration-200">
          <nav className="flex flex-col gap-2 pt-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl text-left font-mono text-sm border transition-all ${
                  activeSection === link.id
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                    : 'bg-white/[0.03] border-white/5 text-slate-300'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            {onReturn3D && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReturn3D();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold font-mono text-sm shadow-lg shadow-orange-500/20"
              >
                <Box className="w-4 h-4" />
                <span>ENTER 3D WORLD</span>
              </button>
            )}

            <a
              href="/Nitish_Priyan_Resume_Blue.pdf"
              download="Nitish_Priyan_Resume.pdf"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-mono text-sm"
            >
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>DOWNLOAD RESUME (PDF)</span>
            </a>

            <div className="flex items-center justify-center gap-4 pt-2 text-slate-400">
              <a href={identityData.github} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-white">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href={identityData.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-cyan-400">
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
