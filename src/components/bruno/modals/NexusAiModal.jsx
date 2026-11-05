import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  User,
  Shield,
  Terminal,
  ExternalLink,
  Code2,
  Cpu,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { identityData, skillCategories, projects, certificationsList, educationList } from '../../../data/portfolio';

// Structured Portfolio RAG Knowledge Base
const PORTFOLIO_KNOWLEDGE = {
  identity: {
    name: identityData.name,
    role: identityData.role,
    location: identityData.location,
    batch: identityData.batch,
    cgpa: identityData.cgpa,
    intro: identityData.introduction,
    email: identityData.email,
    linkedin: identityData.linkedin,
    github: identityData.github,
    story: identityData.aboutStory.join(' ')
  },
  skills: skillCategories.map((c) => ({
    category: c.category,
    skills: c.skills.map((s) => `${s.name} (${s.level})`).join(', ')
  })),
  projects: projects.map((p) => ({
    title: p.title,
    type: p.type,
    description: p.description,
    tech: p.technologies.join(', '),
    metrics: p.metrics ? p.metrics.join('; ') : '',
    github: p.githubUrl
  })),
  certifications: certificationsList.map((c) => `${c.title} issued by ${c.issuer} (${c.date})`),
  education: educationList.map((e) => `${e.degree} at ${e.institution} (${e.period}), Result: ${e.result}`)
};

// Client-side RAG Intent Engine
function queryPortfolioRAG(query) {
  const q = query.toLowerCase();

  // 1. Who is Nitish Priyan / Bio
  if (q.includes('who is') || q.includes('about') || q.includes('introduce') || q.includes('background') || q.includes('profile')) {
    return `Nitish Priyan R S is a Full Stack Developer and AI/ML Engineer based in India (Batch of 2028, CGPA: ${identityData.cgpa}). He builds intelligent applications, scalable Java/Python backends, and full-stack software products. His engineering journey focuses on the intersection of AI/ML, distributed backend systems, and clean architecture.`;
  }

  // 2. Programming Languages / Tech Skills
  if (q.includes('language') || q.includes('skills') || q.includes('tech stack') || q.includes('technologies') || q.includes('framework')) {
    const list = PORTFOLIO_KNOWLEDGE.skills.map((s) => `• **${s.category}:** ${s.skills}`).join('\n\n');
    return `Here is Nitish Priyan's verified technical capability matrix:\n\n${list}\n\nHe has also solved **170+ Data Structures & Algorithms problems in Java** on LeetCode.`;
  }

  // 3. LEXORA Project
  if (q.includes('lexora') || q.includes('legal')) {
    const lex = projects.find((p) => p.id === 'proj-lexora');
    return `**LEXORA — AI-Powered Legal Research Platform:**\n\n• **Architecture:** Vector Search & Retrieval Augmented Generation (RAG) for legal statutes and judicial precedents.\n• **Tech Stack:** Python, FastAPI, React.js, ChromaDB (Vector DB), Gemini AI, and Tailwind CSS.\n• **Core Features:** Sub-second semantic retrieval across legal precedents, automated case brief summarization, and legal citation cross-referencing.\n• **GitHub Repository:** ${lex?.githubUrl || identityData.github}`;
  }

  // 4. Machine Learning & AI Projects
  if (q.includes('machine learning') || q.includes('ai project') || q.includes('models') || q.includes('ml')) {
    const aiProjects = projects.filter((p) => p.technologies.some((t) => ['NLP', 'AI', 'FastAPI', 'Gemini AI', 'Machine Learning'].includes(t)));
    const desc = aiProjects
      .map((p) => `• **${p.title}:** ${p.description}\n  *Tech Stack:* ${p.technologies.join(', ')}`)
      .join('\n\n');
    return `Nitish Priyan has developed several verified AI/ML applications:\n\n${desc}`;
  }

  // 5. Certifications & Honors
  if (q.includes('certif') || q.includes('honor') || q.includes('achievement') || q.includes('award') || q.includes('oracle')) {
    const certs = PORTFOLIO_KNOWLEDGE.certifications.map((c) => `• ${c}`).join('\n');
    return `**Verified Professional Credentials & Honors:**\n\n${certs}\n\n• **Competitive Podiums:** Top 5 Finalist at Smart India Hackathon (SIH 2024), 2nd Place at National-Level Hack-Ai-Thon, and 170+ LeetCode Java DSA problems solved.`;
  }

  // 6. Contact / Email / LinkedIn / GitHub
  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('message')) {
    return `You can establish connection with Nitish Priyan directly:\n\n• **Email:** [${identityData.email}](mailto:${identityData.email})\n• **LinkedIn:** [linkedin.com/in/nitish-priyan](${identityData.linkedin})\n• **GitHub:** [github.com/NITISH1817](${identityData.github})\n\nYou can also transmit a message directly via the 3D world's **Transmission Station** (SEC-06).`;
  }

  // 7. GitHub repositories
  if (q.includes('github') || q.includes('repo') || q.includes('code')) {
    return `Nitish Priyan's open-source repositories and code artifacts are hosted at:\n\n👉 **[github.com/NITISH1817](${identityData.github})**\n\nFeatured repos include LEXORA, AI Govt Scheme Recommender, and Project Zero.`;
  }

  // 8. Education
  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('school')) {
    const edu = PORTFOLIO_KNOWLEDGE.education.map((e) => `• ${e}`).join('\n');
    return `**Academic Foundation:**\n\n${edu}\n\n• Current Batch: 2028 | Cumulative GPA: ${identityData.cgpa}/10.0.`;
  }

  // Default context-aware answer
  return `I am **NEXUS AI**, Nitish Priyan's portfolio intelligence assistant. I can answer specific questions regarding his:\n\n1. **Technical Capabilities & Languages** (Java, Python, AI/ML, FastAPI, React)\n2. **Featured Projects** (LEXORA legal RAG, AI Govt Scheme Recommender, Project Zero)\n3. **Professional Certifications** (Oracle Java SE 17 Developer Certificate)\n4. **Academic Credentials & Hackathons** (Sri Eshwar College of Engineering, SIH 2024)\n5. **Contact & GitHub Repositories**\n\nWhat would you like to explore?`;
}

export default function NexusAiModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Greetings, Commander. I am **NEXUS AI**, Nitish Priyan's portfolio intelligence assistant. What would you like to know about his projects, Java/Python architecture, AI systems, or credentials?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSend = async (queryText) => {
    const query = (queryText || input).trim();
    if (!query || isTyping) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated RAG processing delay
    setTimeout(() => {
      const response = queryPortfolioRAG(query);
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  if (!isOpen) return null;

  const quickPrompts = [
    'Who is Nitish Priyan?',
    'What programming languages does he know?',
    'Explain his LEXORA project',
    'What certifications does he hold?',
    'Where can I find his GitHub?'
  ];

  return (
    <div
      data-modal-active="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(7, 4, 13, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      className="p-3 sm:p-6 select-none font-inter animate-in fade-in duration-200"
    >
      <div
        style={{
          width: 'min(900px, 94vw)',
          height: 'min(720px, 85vh)',
          borderRadius: '20px'
        }}
        className="relative bg-[#120B22] text-slate-100 shadow-[0_0_60px_rgba(56,189,248,0.25),0_25px_60px_rgba(0,0,0,0.9)] border border-cyan-400/50 overflow-hidden flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/25 bg-[#0C0717] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-space text-lg sm:text-xl font-bold text-white tracking-tight">
                  NEXUS AI // PORTFOLIO INTELLIGENCE
                </h1>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  RAG ENGINE ACTIVE
                </span>
              </div>
              <p className="text-xs text-purple-300/80 font-inter">
                Verified portfolio retrieval augmented generation assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 hover:text-white border border-purple-500/30 shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">ESC</span>
          </button>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 p-5 overflow-y-auto game-modal-scroll space-y-4 bg-[#0F0820]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${
                m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-xs font-mono font-bold ${
                  m.role === 'user'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-inter ${
                  m.role === 'user'
                    ? 'bg-linear-to-r from-purple-800 to-indigo-900 text-white border border-purple-400/30'
                    : 'bg-[#170E2D] text-slate-100 border border-purple-500/30 shadow-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#170E2D] border border-purple-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Querying verified knowledge base...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Suggestions */}
        <div className="p-3 border-t border-purple-500/20 bg-[#0C0717] flex gap-2 overflow-x-auto shrink-0">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 hover:border-cyan-400/50 text-[11px] font-mono text-purple-200 hover:text-white transition-all whitespace-nowrap active:scale-95 shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-purple-500/25 bg-[#0C0717] flex items-center gap-3 shrink-0">
          <input
            type="text"
            placeholder="Ask NEXUS AI anything about Nitish Priyan's engineering work..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 h-12 px-4 rounded-xl bg-[#0B0616] border border-purple-500/30 text-sm text-white placeholder-purple-400/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-inter"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="h-12 px-5 rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-space font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">TRANSMIT</span>
          </button>
        </div>
      </div>
    </div>
  );
}

