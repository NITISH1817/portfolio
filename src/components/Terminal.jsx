import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { identityData as profile } from "../data/portfolio";

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    { type: 'system', content: 'NITISH.DEV Terminal v1.0.0' },
    { type: 'system', content: 'Type "help" to see available commands.' }
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-terminal', handleOpen);
    return () => window.removeEventListener('open-terminal', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, history]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;
    
    const newHistory = [...history, { type: 'input', content: `nitish@dev:~$ ${cmd}` }];
    
    switch (trimmed) {
      case 'help':
        newHistory.push({ type: 'output', content: 'Available commands: about, skills, projects, evidence, github, leetcode, resume, contact, whoami, clear' });
        break;
      case 'about':
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        newHistory.push({ type: 'output', content: 'Navigating to About...' });
        setIsOpen(false);
        break;
      case 'skills':
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        newHistory.push({ type: 'output', content: 'Navigating to Skills...' });
        setIsOpen(false);
        break;
      case 'projects':
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        newHistory.push({ type: 'output', content: 'Navigating to Projects...' });
        setIsOpen(false);
        break;
      case 'contact':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        newHistory.push({ type: 'output', content: 'Navigating to Contact...' });
        setIsOpen(false);
        break;
      case 'github':
        window.open(profile.links.github, '_blank');
        newHistory.push({ type: 'output', content: 'Opening GitHub...' });
        break;
      case 'leetcode':
        window.open(profile.links.leetcode, '_blank');
        newHistory.push({ type: 'output', content: 'Opening LeetCode...' });
        break;
      case 'resume':
        window.open(profile.resume, '_blank');
        newHistory.push({ type: 'output', content: 'Opening Resume...' });
        break;
      case 'evidence':
        newHistory.push({ type: 'output', content: 'Evidence Mode not yet initialized.' });
        break;
      case 'whoami':
        newHistory.push({ type: 'output', content: 'Nitish Priyan R S - Software Engineer, Java Developer, AI/ML Engineer' });
        break;
      case 'clear':
        setHistory([{ type: 'system', content: 'Terminal cleared.' }]);
        return;
      default:
        newHistory.push({ type: 'error', content: `Command not found: ${trimmed}. Type "help" for a list of commands.` });
    }
    
    setHistory(newHistory);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-3xl h-[60vh] bg-[#0A0A0A] border border-white/20 rounded-lg shadow-2xl flex flex-col font-mono text-sm overflow-hidden relative"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-gray-400 text-xs">nitish@dev:~</span>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide flex flex-col gap-2">
              {history.map((entry, i) => (
                <div key={i} className={`
                  ${entry.type === 'system' ? 'text-(--accent) opacity-80' : ''}
                  ${entry.type === 'input' ? 'text-white' : ''}
                  ${entry.type === 'output' ? 'text-gray-400' : ''}
                  ${entry.type === 'error' ? 'text-red-400' : ''}
                `}>
                  {entry.content}
                </div>
              ))}
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-400">nitish@dev:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
