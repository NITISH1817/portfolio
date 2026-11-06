import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  FileDown, 
  ExternalLink, 
  Check, 
  Copy, 
  Terminal,
  Send,
  Box
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { identityData } from '../../data/portfolio';

interface EditorialContactProps {
  onReturn3D?: () => void;
}

export default function EditorialContact({ onReturn3D }: EditorialContactProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <section id="contact" className="py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
              <span>06</span>
              <span className="w-8 h-px bg-cyan-500/40" />
              <span>Transmission</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
              INITIATE CONTACT & <br />
              RECRUITER DOSSIER
            </h2>
          </div>
          <p className="text-sm font-mono text-slate-400 max-w-md">
            Available for software engineering opportunities, enterprise Java development, and AI/ML systems engineering.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels & Copy Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Card */}
              <div className="p-6 rounded-2xl bg-[#090E1A] border border-white/10 hover:border-amber-500/30 transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono uppercase tracking-wider">DIRECT EMAIL</span>
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <a 
                    href={`mailto:${identityData.email}`} 
                    className="text-sm sm:text-base font-bold text-white hover:text-amber-300 transition-colors block break-all font-mono"
                  >
                    {identityData.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleCopy(identityData.email, 'email')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono transition-all cursor-pointer"
                  >
                    {copiedType === 'email' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>COPY EMAIL</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${identityData.email}`}
                    className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs transition-all"
                    title="Send Email"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-6 rounded-2xl bg-[#090E1A] border border-white/10 hover:border-cyan-500/30 transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-mono uppercase tracking-wider">TELEPHONE / WHATSAPP</span>
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a 
                    href={`tel:${identityData.phone}`} 
                    className="text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors block font-mono"
                  >
                    {identityData.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleCopy(identityData.phone, 'phone')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono transition-all cursor-pointer"
                  >
                    {copiedType === 'phone' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>COPY PHONE</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`tel:${identityData.phone}`}
                    className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs transition-all"
                    title="Call Phone"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Profiles Strip */}
            <div className="p-6 rounded-2xl bg-[#090E1A] border border-white/10 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                VERIFIED PROFILES & REPOSITORIES
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={identityData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all text-xs font-mono group"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-slate-300 group-hover:text-white" />
                    <span className="text-slate-200">GitHub</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </a>

                <a
                  href={identityData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 transition-all text-xs font-mono group"
                >
                  <div className="flex items-center gap-2">
                    <LinkedinIcon className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-200">LinkedIn</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </a>

                <a
                  href={identityData.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-amber-500/30 transition-all text-xs font-mono group"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-200">LeetCode</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Official Resume Download & 3D Jump */}
          <div className="lg:col-span-5 space-y-6">
            {/* Resume Container */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-[#0F1424] to-[#0A0D18] border border-amber-500/40 shadow-2xl space-y-5 relative overflow-hidden">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                  OFFICIAL RESUME • VERIFIED PDF
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight pt-2">
                  Nitish_Priyan_Resume_Blue.pdf
                </h3>
                <p className="text-xs text-slate-300 font-mono">
                  Official CV with full academic history, flagship projects, patent credentials, and contact details.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="/Nitish_Priyan_Resume_Blue.pdf"
                  download="Nitish_Priyan_Resume.pdf"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs sm:text-sm transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  <FileDown className="w-4 h-4" />
                  <span>DOWNLOAD OFFICIAL RESUME (PDF)</span>
                </a>

                <a
                  href="/Nitish_Priyan_Resume_Blue.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-mono transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>OPEN RESUME IN NEW TAB</span>
                </a>
              </div>
            </div>

            {/* 3D World Portal Callout */}
            {onReturn3D && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Box className="w-4 h-4 text-amber-400" />
                    <span>PREFER 3D VEHICLE EXPLORATION?</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Drive through interactive 3D installations, tech labs, and physics playgrounds.
                  </p>
                </div>
                <button
                  onClick={onReturn3D}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-amber-300 font-mono text-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  ENTER 3D
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
