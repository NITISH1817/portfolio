import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useWorld } from '../../hooks/useWorld';

const COMMANDS = [
  { id: 'home',          label: 'Go to Home',           section: 'hero',          icon: '⌂' },
  { id: 'about',         label: 'Go to About',          section: 'about',         icon: '◉' },
  { id: 'skills',        label: 'Go to Skills',         section: 'skills',        icon: '◈' },
  { id: 'projects',      label: 'Go to Projects',       section: 'projects',      icon: '◆' },
  { id: 'journey',       label: 'Go to Journey',        section: 'journey',       icon: '→' },
  { id: 'certifications',label: 'Certifications',       section: 'certifications',icon: '✦' },
  { id: 'dsa',           label: 'DSA Algorithm Lab',    section: 'dsa',           icon: '⬡' },
  { id: 'github',        label: 'GitHub Universe',      section: 'github',        icon: '⊕' },
  { id: 'contact',       label: 'Contact Station',      section: 'contact',       icon: '◎' },
  { id: 'resume',        label: 'View Resume',          action: 'resume',         icon: '↗' },
];

export default function CommandPalette({ onResumeOpen }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { setActiveSection } = useWorld();

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => { if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) || c.id.includes(query.toLowerCase())
  );

  const execute = (cmd) => {
    setOpen(false);
    if (cmd.action === 'resume') { onResumeOpen?.(); return; }
    if (cmd.section) {
      const totalSections = 10;
      const sectionMap = { hero:0, about:1, skills:2, projects:3, architecture:4, journey:5, certifications:6, dsa:7, github:8, contact:9 };
      const idx = sectionMap[cmd.section] ?? 0;
      const targetScroll = (idx / 9) * (document.body.scrollHeight - window.innerHeight);
      gsap.to(window, { scrollTo: targetScroll, duration: 1.2, ease: 'power3.inOut' });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4" onClick={() => setOpen(false)}>
      <div className="bg-[#111318] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <span className="text-gray-500 text-sm">⌘</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search commands..." onKeyDown={e => { if (e.key === 'Enter' && filtered[0]) execute(filtered[0]); }}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600 font-mono" />
          <kbd className="text-xs text-gray-600 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <ul className="py-2 max-h-72 overflow-y-auto">
          {filtered.map(cmd => (
            <li key={cmd.id}>
              <button onClick={() => execute(cmd)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors group">
                <span className="text-blue-400 w-5 text-center">{cmd.icon}</span>
                <span className="text-sm text-gray-300 group-hover:text-white font-mono">{cmd.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2 border-t border-white/5 flex gap-4 text-xs text-gray-600 font-mono">
          <span>↵ select</span><span>⌘K toggle</span><span>ESC close</span>
        </div>
      </div>
    </div>
  );
}
