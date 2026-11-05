import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, X } from 'lucide-react';
import { identityData as profile } from "../data/portfolio";

const commands = [
  { id: 'home', title: 'Home', section: 'Navigation', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { id: 'about', title: 'About', section: 'Navigation', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'skills', title: 'Skills', section: 'Navigation', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'projects', title: 'Projects', section: 'Navigation', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'evidence', title: 'Evidence Mode', section: 'Modes', action: () => alert('Evidence Mode coming soon!') },
  { id: 'algorithms', title: 'Algorithm Lab', section: 'Modes', action: () => alert('Algorithm Lab coming soon!') },
  { id: 'github', title: 'GitHub', section: 'Links', action: () => window.open(profile.links.github, '_blank') },
  { id: 'leetcode', title: 'LeetCode', section: 'Links', action: () => window.open(profile.links.leetcode, '_blank') },
  { id: 'resume', title: 'Resume', section: 'Links', action: () => window.open(profile.resume, '_blank') },
  { id: 'contact', title: 'Contact', section: 'Navigation', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'recruiter', title: 'Recruiter Mode', section: 'Modes', action: () => alert('Recruiter Mode activated!') },
  { id: 'terminal', title: 'Terminal', section: 'Modes', action: () => window.dispatchEvent(new Event('open-terminal')) }
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filteredCommands = query === '' 
    ? commands 
    : commands.filter(cmd => cmd.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands.length > 0) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-xl bg-[var(--bg-primary)] border border-white/20 shadow-2xl rounded-xl overflow-hidden relative z-10 flex flex-col"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search commands... (e.g., 'projects', 'resume')"
                className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-gray-600"
              />
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-gray-500 font-mono text-sm">
                  No results found for "{query}"
                </div>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <div 
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer font-mono text-sm transition-colors ${
                      index === selectedIndex 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Command className="w-4 h-4 opacity-50" />
                      <span>{cmd.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{cmd.section}</span>
                      {index === selectedIndex && <ArrowRight className="w-4 h-4 text-[var(--accent)]" />}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="px-4 py-3 border-t border-white/10 bg-black/20 flex items-center gap-4 text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded">↑</kbd> <kbd className="bg-white/10 px-1.5 py-0.5 rounded">↓</kbd> to navigate</span>
              <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded">↵</kbd> to select</span>
              <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1.5 py-0.5 rounded">ESC</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
