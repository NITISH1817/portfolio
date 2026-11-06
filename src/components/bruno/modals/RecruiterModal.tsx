import React, { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Award,
  BookOpen,
  Briefcase,
  Terminal,
  Zap,
  CheckCircle2,
  Phone
} from 'lucide-react';
import {
  identityData,
  certificationsList,
  achievementsList,
  projects
} from '../../../data/portfolio';

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );
}

interface RecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProject?: (project: any) => void;
  onSwitchClassic?: () => void;
}

export default function RecruiterModal({
  isOpen,
  onClose,
  onOpenProject,
  onSwitchClassic
}: RecruiterModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(identityData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(identityData.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const featuredProjects = [
    projects.find((p) => p.id === 'proj-govscheme') || projects[0],
    projects.find((p) => p.id === 'proj-nexora') || projects[1],
    projects.find((p) => p.id === 'proj-mlops') || projects[2]
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F0A1C] border border-cyan-500/40 shadow-[0_0_60px_rgba(97,165,255,0.25)] text-white p-5 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-purple-500/25 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase border border-cyan-500/40">
                RECRUITER FAST-TRACK BRIEF
              </span>
              <span className="text-[10px] font-mono text-purple-300">
                BATCH 2028 // SOFTWARE & AI/ML
              </span>
            </div>
            <h2 className="font-space text-2xl sm:text-3xl font-extrabold text-white mt-1">
              NITISH PRIYAN R S
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200 font-inter font-medium">
              Software Engineer | Java Developer | AI/ML Engineer
            </p>
          </div>

          <button
            id="close-recruiter-modal"
            aria-label="Close"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Close Dossier (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Quick Action Strip (1-Click Recruiter Deliverables) */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 p-3.5 rounded-2xl bg-[#17102A] border border-purple-500/30">
          <a
            href="/resume/Nitish_Priyan_Resume_Blue.pdf"
            download="Nitish_Priyan_Resume_Blue.pdf"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-space font-bold text-xs shadow-lg active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" /> DOWNLOAD CV (.PDF)
          </a>

          <a
            href="/resume/Nitish_Priyan_Resume_Blue.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white font-space font-bold text-xs border border-purple-500/40 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> VIEW PDF
          </a>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs border border-slate-700 transition-all"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> EMAIL COPIED
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-purple-400" /> COPY EMAIL
              </>
            )}
          </button>

          <a
            href={identityData.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs border border-slate-700 transition-all"
          >
            <GithubIcon className="w-3.5 h-3.5 text-cyan-400" /> GITHUB
          </a>

          <a
            href={identityData.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0A66C2]/20 hover:bg-[#0A66C2]/35 text-blue-200 font-mono text-xs border border-blue-500/40 transition-all"
          >
            <LinkedInIcon className="w-3.5 h-3.5 text-blue-400" /> LINKEDIN
          </a>
        </div>

        {/* 2. Key Metrics & Academic Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-1">
            <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">INSTITUTION</span>
            <div className="font-space font-bold text-xs text-white leading-tight">
              Bannari Amman Institute of Technology
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-1">
            <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">DEGREE & CGPA</span>
            <div className="font-space font-bold text-sm text-cyan-400">
              B.E. CSE • {identityData.cgpa} CGPA
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-1">
            <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase">PROBLEM SOLVING</span>
            <div className="font-space font-bold text-sm text-emerald-400">
              250+ LeetCode DSA
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-1">
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">CORE ARCHITECTURE</span>
            <div className="font-space font-bold text-xs text-amber-300">
              Java SE 17, Python, MLOps
            </div>
          </div>
        </div>

        {/* 3. Verified Certifications & Hackathons */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" /> VERIFIED PROFESSIONAL CREDENTIALS & PODIUMS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {certificationsList.map((cert) => (
              <div
                key={cert.id}
                className="p-3 rounded-xl bg-[#130B26] border border-amber-500/30 flex items-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 text-sm">
                  🏆
                </div>
                <div>
                  <div className="font-space font-bold text-xs text-white leading-snug">
                    {cert.title}
                  </div>
                  <div className="text-[10px] font-mono text-purple-300 mt-0.5">
                    {cert.issuer} ({cert.date})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Top 3 Production Architectural Projects */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" /> FEATURED PRODUCTION ARCHITECTURES
            </h3>
            <span className="text-[10px] font-mono text-purple-300">
              CLICK FOR ARCHITECTURE SPECS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featuredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  if (onOpenProject) {
                    onClose();
                    onOpenProject(proj);
                  }
                }}
                className="group cursor-pointer p-4 rounded-2xl bg-[#140C28] hover:bg-[#1C1236] border border-purple-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                      ARTIFACT {proj.number} • {proj.type}
                    </span>
                    {proj.repoStatus && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
                        {proj.repoStatus}
                      </span>
                    )}
                  </div>
                  <h4 className="font-space font-bold text-sm text-white group-hover:text-cyan-300 transition-colors mt-1">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed font-inter">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                  <span>INSPECT SPEC</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Footer Quick Navigation Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-purple-500/25">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onSwitchClassic) onSwitchClassic();
              }}
              className="text-xs font-mono px-3 py-1.5 rounded-xl bg-purple-950/80 text-purple-200 hover:text-white border border-purple-500/30 transition-all"
            >
              📖 SWITCH TO 2D ACCESSIBLE READER
            </button>
          </div>

          <div className="text-xs font-mono text-purple-300/80">
            Direct Contact: <a href={`mailto:${identityData.email}`} className="text-cyan-400 hover:underline">{identityData.email}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
