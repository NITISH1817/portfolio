import React, { useState, useRef, useEffect } from 'react';
import { profile } from '../../data/profile';
import { skills } from '../../data/skills';
import { projects } from '../../data/projects';

const COMMANDS = {
  help: () => ({
    output: `Available commands:
  help        — show this list
  whoami      — identity
  about       — about me
  skills      — tech stack
  projects    — featured projects
  stack       — full stack
  github      — open GitHub
  resume      — view resume link
  contact     — contact details
  clear       — clear terminal`
  }),
  whoami: () => ({
    output: `${profile.name}
${profile.headline[0]}
${profile.headline.slice(1).join(' | ')}`
  }),
  about: () => ({ output: profile.about.join('\n') }),
  skills: () => ({
    output: Object.entries(skills).map(([cat, list]) => `[${cat}]\n  ${list.join(', ')}`).join('\n')
  }),
  projects: () => ({
    output: projects.map(p => `• ${p.title}\n  ${p.type} — ${p.technologies.slice(0,3).join(', ')}`).join('\n')
  }),
  stack: () => ({ output: Object.values(skills).flat().join(' · ') }),
  github: () => { window.open(profile.contact.github, '_blank'); return { output: `Opening ${profile.contact.github}` }; },
  resume: () => ({ output: `Resume: ${profile.resume}\nUse the "View Resume" button in the Hero section.` }),
  contact: () => ({
    output: `Email:    ${profile.contact.email}
Phone:    ${profile.contact.phone}
LinkedIn: ${profile.contact.linkedin}
GitHub:   ${profile.contact.github}`
  }),
  clear: () => ({ clear: true }),
};

export default function Terminal({ onClose }) {
  const [history, setHistory] = useState([{ type: 'output', text: 'nitish@dev:~$ Welcome. Type "help" for commands.' }]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  const run = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', text: `nitish@dev:~$ ${cmd}` }];
    if (!trimmed) { setHistory(newHistory); setInput(''); return; }

    const fn = COMMANDS[trimmed];
    if (!fn) {
      setHistory([...newHistory, { type: 'error', text: `command not found: ${trimmed}. Type "help".` }]);
    } else {
      const result = fn();
      if (result.clear) { setHistory([]); } 
      else { setHistory([...newHistory, { type: 'output', text: result.output }]); }
    }
    setCmdHistory(h => [cmd, ...h]);
    setHistIdx(-1);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') { run(input); return; }
    if (e.key === 'ArrowUp') { const idx = Math.min(histIdx + 1, cmdHistory.length - 1); setHistIdx(idx); setInput(cmdHistory[idx] || ''); }
    if (e.key === 'ArrowDown') { const idx = Math.max(histIdx - 1, -1); setHistIdx(idx); setInput(cmdHistory[idx] || ''); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] w-[480px] max-h-[380px] bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden font-mono text-sm">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-gray-500 text-xs">nitish@dev — terminal</span>
      </div>
      {/* Output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {history.map((h, i) => (
          <pre key={i} className={`whitespace-pre-wrap text-xs leading-relaxed ${
            h.type === 'input' ? 'text-blue-400' : h.type === 'error' ? 'text-red-400' : 'text-gray-300'
          }`}>{h.text}</pre>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-white/5">
        <span className="text-blue-400 shrink-0">nitish@dev:~$</span>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey} autoFocus
          className="flex-1 bg-transparent text-gray-200 outline-none text-xs" placeholder="type a command..." />
      </div>
    </div>
  );
}
