import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Download,
  Mail,
  Copy,
  Check,
  Radio,
  Sparkles,
  CheckCircle2,
  Send,
  Shield,
  Award,
  BookOpen,
  Code2,
  Cpu,
  Globe,
  Terminal,
  AlertCircle,
  Layers
} from 'lucide-react';
import {
  identityData,
  skillCategories,
  projects,
  educationList,
  certificationsList,
  achievementsList
} from '../../../data/portfolio';

function GithubIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function LandmarkOverlay({ landmarkId, initialProject = null, onClose }) {
  const [selectedProject, setSelectedProject] = useState(
    initialProject || (landmarkId === 'projects' ? projects[0] : null)
  );
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formError, setFormError] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!landmarkId) return null;

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(identityData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume/Nitish_Priyan_RS_Resume.pdf';
    link.download = 'Nitish_Priyan_RS_Resume.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setFormError('');

    // Form validation
    if (!formData.name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormError('Please enter a valid return email address.');
      return;
    }
    if (formData.message.trim().length < 10) {
      setFormError('Message must be at least 10 characters long.');
      return;
    }

    setFormStatus('sending');

    // Simulate sending, copy details to clipboard and open email client fallback
    setTimeout(() => {
      setFormStatus('sent');
      const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      
      // Copy to clipboard
      navigator.clipboard?.writeText(`From: ${formData.name} <${formData.email}>\n\n${formData.message}`);
      
      // Open email client
      window.location.href = `mailto:${identityData.email}?subject=${subject}&body=${body}`;
    }, 900);
  };

  // Section meta styling
  const sectionMeta = {
    about: {
      title: 'IDENTITY ARCHIVE',
      subtitle: 'BIOGRAPHICAL DOSSIER & ENGINEERING JOURNEY',
      badge: 'ARCHIVE ACTIVE'
    },
    skills: {
      title: 'TECH LABORATORY',
      subtitle: 'TECHNICAL CAPABILITY MATRIX & SYSTEM ARCHITECTURES',
      badge: 'SYSTEMS ONLINE'
    },
    projects: {
      title: 'PROJECTS EXHIBITION',
      subtitle: 'INTERACTIVE ARTIFACT ARCHIVE & ARCHITECTURE SPECS',
      badge: 'EXHIBITION ACTIVE'
    },
    experience: {
      title: 'HONORS VAULT',
      subtitle: 'ACADEMIC FOUNDATION & VERIFIED CREDENTIALS',
      badge: 'HONORS VERIFIED'
    },
    resume: {
      title: 'DOSSIER ARCHIVE',
      subtitle: 'OFFICIAL CURRICULUM VITAE & SUMMARY',
      badge: 'DOCUMENT READY'
    },
    contact: {
      title: 'TRANSMISSION STATION',
      subtitle: 'ESTABLISH CONNECTION WITH NITISH PRIYAN',
      badge: 'ONLINE'
    }
  }[landmarkId] || {
    title: 'STATION DATA',
    subtitle: 'INTERACTIVE PORTFOLIO CONSOLE',
    badge: 'ONLINE'
  };

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
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(7, 4, 13, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      className="p-4 sm:p-6 md:p-8 select-none font-inter animate-in fade-in duration-200"
    >
      {/* Centered Modal Container: min(1100px, 92vw), max-h-[85vh], rounded-[20px] */}
      <div
        style={{
          width: 'min(1100px, 92vw)',
          maxHeight: '85vh',
          borderRadius: '20px'
        }}
        className="relative bg-[#120B22] text-slate-100 shadow-[0_0_50px_rgba(56,189,248,0.25),0_25px_60px_rgba(0,0,0,0.85)] border border-cyan-400/40 overflow-hidden flex flex-col"
      >
        
        {/* ============================================================== */}
        {/* CLEAN UNIFIED HEADER BAR                                       */}
        {/* ============================================================== */}
        <div className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-4 border-b border-purple-500/25 bg-[#0C0717] shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_#10B981]" />
            </div>
            <div>
              <h1 className="font-space text-xl sm:text-2xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
                {sectionMeta.title}
              </h1>
              <p className="text-xs text-purple-300/80 font-medium tracking-wide hidden sm:block">
                {sectionMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-[11px] font-mono text-emerald-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {sectionMeta.badge}
            </div>

            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 hover:text-white border border-purple-500/30 shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">ESC</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN TERMINAL BODY                                             */}
        {/* ============================================================== */}
        <div className="relative z-10 p-6 sm:p-8 md:p-9 overflow-y-auto game-modal-scroll bg-[#120B22]">
          
          {/* ============================================================== */}
          {/* 1. CONTACT STATION (REDESIGNED PREMIUM GAME INTERFACE)         */}
          {/* ============================================================== */}
          {landmarkId === 'contact' && (
            <div className="flex flex-col md:flex-row gap-7 md:gap-9">
              {/* LEFT COLUMN (40%): Identity, Holographic Radar, 3 Channels */}
              <div className="w-full md:w-[42%] lg:w-[40%] flex flex-col justify-between space-y-6">
                
                {/* Station Identity & Radar Card */}
                <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                        DIRECT COMMS
                      </div>
                      <h2 className="font-space text-lg font-bold text-white mt-0.5">
                        Transmission Node
                      </h2>
                    </div>

                    {/* Restrained Holographic Radar */}
                    <div className="relative w-12 h-12 rounded-full border border-cyan-400/40 flex items-center justify-center overflow-hidden bg-[#0A0514]/90 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                      {/* Rotating subtle sweep */}
                      <div
                        className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 via-transparent to-transparent rounded-full animate-spin"
                        style={{ animationDuration: '4s' }}
                      />
                      {/* Concentric rings */}
                      <div className="absolute inset-1.5 rounded-full border border-cyan-400/25" />
                      <div className="absolute inset-3 rounded-full border border-purple-500/25" />
                      {/* Blip */}
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping z-10" />
                    </div>
                  </div>

                  <p className="text-xs text-purple-200/90 leading-relaxed">
                    Have a project inquiry, software engineering opportunity, or technical proposal? Select a channel below or transmit a message directly.
                  </p>
                </div>

                {/* 3 Dedicated Communication Channels */}
                <div className="space-y-3">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-300/80 px-1">
                    COMMUNICATION CHANNELS
                  </div>

                  {/* Channel 1: Email */}
                  <div className="group relative p-4 rounded-2xl bg-[#170E2D] hover:bg-[#1E123B] border border-purple-500/30 hover:border-cyan-400/60 shadow-md hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all duration-300 flex items-center justify-between">
                    <a
                      href={`mailto:${identityData.email}`}
                      className="flex items-center gap-3.5 min-w-0 flex-1 text-inherit no-underline"
                    >
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-mono font-semibold uppercase text-purple-300">
                          EMAIL TRANSMISSION
                        </div>
                        <div className="text-sm font-medium text-white group-hover:text-cyan-200 transition-colors truncate">
                          {identityData.email}
                        </div>
                      </div>
                    </a>

                    <button
                      onClick={handleCopyEmail}
                      className="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white transition-all ml-2 shrink-0 active:scale-95"
                      title="Copy Email Address"
                    >
                      {copiedEmail ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Channel 2: LinkedIn */}
                  <a
                    href={identityData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="group p-4 rounded-2xl bg-[#170E2D] hover:bg-[#1E123B] border border-purple-500/30 hover:border-blue-400/60 shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 flex items-center justify-between text-inherit no-underline"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <LinkedInIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-mono font-semibold uppercase text-purple-300">
                          LINKEDIN NETWORK
                        </div>
                        <div className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors truncate">
                          linkedin.com/in/nitish-priyan
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all ml-2 shrink-0" />
                  </a>

                  {/* Channel 3: GitHub */}
                  <a
                    href={identityData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group p-4 rounded-2xl bg-[#170E2D] hover:bg-[#1E123B] border border-purple-500/30 hover:border-purple-400/60 shadow-md hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 flex items-center justify-between text-inherit no-underline"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <GithubIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-mono font-semibold uppercase text-purple-300">
                          GITHUB REPOSITORY
                        </div>
                        <div className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors truncate">
                          github.com/NITISH1817
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-200 group-hover:translate-x-0.5 transition-all ml-2 shrink-0" />
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN (60%): Message Transmission Console */}
              <div className="w-full md:w-[58%] lg:w-[60%] flex flex-col justify-between">
                <form
                  onSubmit={handleSendMessage}
                  className="p-6 sm:p-7 rounded-2xl bg-[#170E2D] border border-purple-500/30 shadow-xl space-y-4 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-purple-500/25">
                      <h2 className="font-space text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Send className="w-4 h-4 text-orange-400" /> SEND A TRANSMISSION
                      </h2>
                      <span className="text-[10px] font-mono font-semibold text-purple-400/80">
                        RESPONSE IN &lt;24H
                      </span>
                    </div>

                    {formError && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="mt-4 space-y-3.5">
                      {/* Name Field */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                          NAME *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name or organization..."
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (formError) setFormError('');
                          }}
                          className="w-full h-11 px-4 rounded-xl bg-[#0B0616] border border-purple-500/30 text-sm text-white placeholder-purple-400/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-inter"
                        />
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                          EMAIL *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="your.email@domain.com..."
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (formError) setFormError('');
                          }}
                          className="w-full h-11 px-4 rounded-xl bg-[#0B0616] border border-purple-500/30 text-sm text-white placeholder-purple-400/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-inter"
                        />
                      </div>

                      {/* Message Field */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                          MESSAGE *
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Describe your inquiry, project scope, or opportunity..."
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (formError) setFormError('');
                          }}
                          className="w-full p-4 rounded-xl bg-[#0B0616] border border-purple-500/30 text-sm text-white placeholder-purple-400/30 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-inter resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formStatus === 'sending' || formStatus === 'sent'}
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] via-[#A855F7] to-[#6366F1] hover:from-[#FF7A1A] hover:via-[#B568F8] hover:to-[#7376F8] text-white font-space font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(255,107,0,0.35)] hover:shadow-[0_0_35px_rgba(255,107,0,0.5)] border border-white/20 transition-all active:scale-[0.98] disabled:opacity-80"
                    >
                      {formStatus === 'sending' ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          TRANSMITTING PACKET...
                        </span>
                      ) : formStatus === 'sent' ? (
                        <span className="flex items-center gap-2 text-emerald-200">
                          <CheckCircle2 className="w-5 h-5 text-emerald-300" /> TRANSMISSION PREPARED & DISPATCHED
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-cyan-200" /> INITIATE TRANSMISSION
                        </>
                      )}
                    </button>

                    {formStatus === 'sent' && (
                      <p className="text-xs font-mono text-emerald-400 text-center mt-2 animate-in fade-in">
                        ✓ Transmission packet copied to clipboard & email client invoked.
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. ABOUT ME — HOLOGRAPHIC IDENTITY ARCHIVE                     */}
          {/* ============================================================== */}
          {landmarkId === 'about' && (
            <div className="space-y-6">
              {/* Identity Header Pod */}
              <div className="p-6 rounded-2xl bg-[#170E2D] border border-purple-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
                    <Shield className="w-3.5 h-3.5 text-orange-400" /> BIOGRAPHICAL DOSSIER
                  </div>
                  <h1 className="font-space text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {identityData.name}
                  </h1>
                  <p className="text-sm md:text-base text-purple-300 font-medium mt-0.5 font-inter">
                    {identityData.role}
                  </p>
                  <p className="text-xs font-mono text-slate-300 mt-2 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">LOCATION:</span> {identityData.location}
                    <span className="text-purple-500">•</span>
                    <span className="text-amber-400 font-bold">BATCH:</span> {identityData.batch}
                    <span className="text-purple-500">•</span>
                    <span className="text-cyan-400 font-bold">CGPA:</span> {identityData.cgpa}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href={identityData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-slate-200 transition-all shadow-md"
                    title="GitHub"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={identityData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-blue-600/80 hover:bg-blue-600 border border-blue-400/50 text-white transition-all shadow-md"
                    title="LinkedIn"
                  >
                    <LinkedInIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Core Philosophy Callout */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-[#1C1138] to-purple-950/50 border border-cyan-400/40 shadow-inner">
                <p className="text-base md:text-lg text-cyan-200 font-medium italic leading-relaxed font-inter">
                  "{identityData.introduction}"
                </p>
              </div>

              {/* Developer Journey */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-purple-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-pink-400" /> ENGINEERING ORIGINS & JOURNEY
                </div>
                <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-3 text-slate-200 text-sm md:text-base leading-relaxed font-inter">
                  {identityData.aboutStory.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Areas of Focus & Objectives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-3">
                  <h4 className="font-space text-xs uppercase tracking-wider text-pink-400 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" /> AREAS OF FOCUS
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-200 font-inter">
                    {identityData.interests.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#170E2D] border border-cyan-500/30 space-y-3">
                  <h4 className="font-space text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> CAREER OBJECTIVES
                  </h4>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-inter">
                    {identityData.careerObjectives}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. SKILLS — TECH LABORATORY                                    */}
          {/* ============================================================== */}
          {landmarkId === 'skills' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/25">
                <div>
                  <h2 className="font-space text-xl md:text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-pink-400" /> TECHNICAL CAPABILITY MATRIX
                  </h2>
                  <p className="text-xs font-inter text-purple-300/80 mt-0.5">
                    Verified languages, frameworks, AI architectures & system protocols.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 hover:border-cyan-400/60 transition-all space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-space text-xs font-bold tracking-wider text-pink-400 uppercase flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" /> {cat.category}
                      </h3>
                      <span className="text-[10px] font-mono text-purple-300">
                        {cat.skills.length} MODULES
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0616] border border-purple-500/30 text-xs font-mono"
                        >
                          <span className="font-medium text-white">{skill.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                              skill.level === 'Proficient'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : skill.level === 'Advanced'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            }`}
                          >
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. PROJECTS — PROJECTS EXHIBITION                              */}
          {/* ============================================================== */}
          {landmarkId === 'projects' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/25">
                <div>
                  <h2 className="font-space text-xl md:text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" /> DEPLOYED ARTIFACTS & SOFTWARE
                  </h2>
                  <p className="text-xs font-inter text-purple-300/80 mt-0.5">
                    Select an artifact to inspect system architecture, metrics & repositories.
                  </p>
                </div>
              </div>

              {/* Project Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className={`group cursor-pointer p-5 rounded-2xl bg-[#170E2D] hover:bg-[#1E123B] border transition-all space-y-3 flex flex-col justify-between shadow-lg ${
                      selectedProject?.id === proj.id
                        ? 'border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                        : 'border-purple-500/30 hover:border-cyan-400/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-cyan-400 font-bold">{`ARTIFACT ${proj.number}`}</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                          {proj.type}
                        </span>
                      </div>
                      <h3 className="font-space text-base md:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mt-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed font-inter">
                        {proj.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {proj.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-[#0A0514] border border-cyan-500/30 text-[10px] text-cyan-200 font-mono font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-purple-500/25 text-xs font-mono font-bold text-cyan-400">
                        <span>INSPECT ARCHITECTURE</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Spec Inspection Drawer */}
              {selectedProject && (
                <div className="p-6 rounded-2xl bg-[#0B0616] border border-cyan-400/60 shadow-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        {`ARTIFACT ${selectedProject.number} • ${selectedProject.type}`}
                      </div>
                      <h3 className="font-space text-xl font-bold text-white mt-1">
                        {selectedProject.title}
                      </h3>
                      <p className="text-xs text-purple-300 font-medium font-inter">{selectedProject.subtitle}</p>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-xs font-mono px-3 py-1 rounded-xl bg-purple-950/80 text-cyan-300 hover:text-white border border-purple-500/40"
                    >
                      CLOSE SPEC
                    </button>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-inter">
                    {selectedProject.description}
                  </p>

                  {/* Problem Statement & Architectural Solution Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.problemStatement && (
                      <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1.5">
                        <div className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> PROBLEM STATEMENT
                        </div>
                        <p className="text-xs text-rose-200/90 leading-relaxed font-inter">
                          {selectedProject.problemStatement}
                        </p>
                      </div>
                    )}
                    {selectedProject.solution && (
                      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                        <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> ARCHITECTURAL SOLUTION
                        </div>
                        <p className="text-xs text-cyan-200/90 leading-relaxed font-inter">
                          {selectedProject.solution}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dynamic System Architecture & Data Pipeline Flow */}
                  {selectedProject.architectureSteps && selectedProject.architectureSteps.length > 0 && (
                    <div className="p-4 rounded-xl bg-[#080410] border border-purple-500/30 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-pink-400" /> SYSTEM ARCHITECTURE & DATA PIPELINE
                        </span>
                        <span className="text-[10px] text-purple-400 font-semibold">VERIFIED SPEC</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-mono">
                        {selectedProject.architectureSteps.map((step, idx) => (
                          <React.Fragment key={idx}>
                            <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-200">
                              {step}
                            </span>
                            {idx < selectedProject.architectureSteps.length - 1 && (
                              <span className="text-cyan-400 font-bold">&rarr;</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Technical Decisions & Engineering Trade-Offs */}
                  {selectedProject.technicalDecisions && selectedProject.technicalDecisions.length > 0 && (
                    <div className="p-4 rounded-xl bg-[#120B24] border border-purple-500/30 space-y-2.5">
                      <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" /> KEY TECHNICAL DECISIONS & TRADE-OFFS
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {selectedProject.technicalDecisions.map((decision, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#080410] border border-purple-500/20 space-y-1">
                            <div className="text-[11px] font-space font-bold text-cyan-300">
                              {decision.title}
                            </div>
                            <div className="text-[11px] text-slate-300 font-inter leading-relaxed">
                              {decision.rationale}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantifiable Performance Benchmarks */}
                  {selectedProject.metrics && (
                    <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-1.5">
                      <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                        <Sparkles className="w-3.5 h-3.5" /> QUANTIFIABLE PERFORMANCE METRICS
                      </div>
                      <ul className="text-xs text-emerald-200 space-y-1 font-mono">
                        {selectedProject.metrics.map((m, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-space font-bold text-xs shadow-lg transition-all"
                    >
                      <GithubIcon className="w-4 h-4" /> REPOSITORY CODE & SPEC &rarr;
                    </a>
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white font-space font-bold text-xs shadow-lg transition-all"
                      >
                        <ExternalLink className="w-4 h-4 text-cyan-400" /> LIVE APPLICATION ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 5. ACHIEVEMENTS — HONORS VAULT                                 */}
          {/* ============================================================== */}
          {landmarkId === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/25">
                <div>
                  <h2 className="font-space text-xl md:text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" /> HONORS VAULT & CREDENTIALS
                  </h2>
                  <p className="text-xs font-inter text-purple-300/80 mt-0.5">
                    Oracle Java SE 17 certification, competitive hackathons, academic degrees.
                  </p>
                </div>
              </div>

              {/* Education Pods */}
              <div className="space-y-3">
                <h3 className="font-space text-xs font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> ACADEMIC FOUNDATION
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {educationList.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-1 font-inter"
                    >
                      <div className="font-space font-bold text-white text-sm">{edu.institution}</div>
                      <div className="text-xs text-cyan-300 font-semibold">{edu.degree}</div>
                      <div className="text-xs text-slate-300 font-mono">
                        {edu.period} • <span className="text-amber-400 font-bold">{edu.result}</span>
                      </div>
                      {edu.description && (
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Certifications */}
              <div className="space-y-3 pt-2">
                <h3 className="font-space text-xs font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> PROFESSIONAL CERTIFICATIONS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {certificationsList.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-2xl bg-[#170E2D] border border-amber-500/30 flex flex-col justify-between shadow-md"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-lg mb-2">
                          🏆
                        </div>
                        <div className="font-space font-bold text-white text-xs leading-snug">
                          {cert.title}
                        </div>
                      </div>
                      <div className="text-[11px] text-purple-300 mt-2 font-mono font-medium">
                        {cert.issuer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hackathon Awards */}
              <div className="space-y-3 pt-2">
                <h3 className="font-space text-xs font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> COMPETITIVE PODIUMS & PROBLEM SOLVING
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {achievementsList.map((ach) => (
                    <div
                      key={ach.id}
                      className="p-4 rounded-2xl bg-[#170E2D] border border-emerald-500/30 space-y-1.5"
                    >
                      <div className="font-space text-xs font-bold text-white">{ach.title}</div>
                      <div className="text-xs font-mono text-emerald-400 font-semibold">{ach.subtitle}</div>
                      <p className="text-xs text-slate-300 leading-relaxed font-inter">
                        {ach.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 6. RESUME — DOSSIER ARCHIVE                                    */}
          {/* ============================================================== */}
          {landmarkId === 'resume' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-purple-500/25">
                <div>
                  <h2 className="font-space text-xl md:text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Download className="w-5 h-5 text-cyan-400" /> DOSSIER ARCHIVE // CURRICULUM VITAE
                  </h2>
                  <p className="text-xs font-inter text-purple-300/80 mt-0.5">
                    Official developer curriculum vitae document.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="/resume/Nitish_Priyan_RS_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white font-space font-bold text-xs shadow-lg transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> VIEW PDF ↗
                  </a>
                  <button
                    onClick={handleDownloadResume}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-space font-bold text-xs shadow-xl active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" /> DOWNLOAD CV (.PDF)
                  </button>
                </div>
              </div>

              {/* Document Console Preview */}
              <div className="p-6 md:p-8 rounded-2xl bg-[#090412] border border-cyan-400/40 space-y-6 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
                  <div>
                    <h3 className="font-space text-lg font-bold text-white">{identityData.name}</h3>
                    <div className="text-cyan-400 font-semibold font-inter">{identityData.role}</div>
                  </div>
                  <div className="text-right text-[11px] text-purple-300">
                    <div>{identityData.email}</div>
                    <div>{identityData.location}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-pink-400 font-bold uppercase tracking-wider text-[11px]">
                    // SUMMARY OF QUALIFICATIONS
                  </div>
                  <p className="text-slate-200 font-inter text-xs leading-relaxed pt-1">
                    {identityData.introduction}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                    // ACADEMIC EDUCATION
                  </div>
                  {educationList.map((e) => (
                    <div key={e.id} className="pt-1 text-slate-200">
                      <div className="text-white font-bold">{e.degree} — {e.institution}</div>
                      <div className="text-purple-300 text-[11px]">{e.period} | Result: {e.result}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                    // VERIFIED CERTIFICATIONS & ALGORITHMS
                  </div>
                  {certificationsList.map((c) => (
                    <div key={c.id} className="text-slate-300">
                      • {c.title} — <span className="text-cyan-300">{c.issuer}</span>
                    </div>
                  ))}
                  <div className="text-slate-300">
                    • 170+ Data Structures & Algorithms Problems Solved in Java (LeetCode)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
