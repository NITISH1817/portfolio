import React from 'react';
import { identityData, certificationsList } from '../data/portfolio';
import { Award, CheckCircle2, GraduationCap, MapPin, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <section className="spatial-section min-h-screen flex items-center py-20" id="about">
      <div className="w-full flex flex-col md:flex-row gap-12 md:gap-24">
        
        {/* Left Column: Section Indicator */}
        <div className="w-full md:w-1/4 flex flex-col gap-2">
          <p className="text-metadata text-(--text-secondary) font-mono">01 // DOSSIER</p>
          <h2 className="text-3xl font-bold tracking-tight text-(--text-primary)">IDENTITY & BACKGROUND</h2>
          <p className="text-xs text-(--text-secondary) mt-2 font-mono">
            Verified credentials against official resume
          </p>
        </div>
        
        {/* Right Column: Verified Content */}
        <div className="w-full md:w-3/4 flex flex-col gap-10 max-w-3xl">
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[11px] font-mono border border-cyan-500/30">
                BATCH OF 2028
              </span>
              <span className="text-xs font-mono text-(--text-secondary)">
                CGPA 7.8
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter uppercase text-(--text-primary)">
              {identityData.name}
            </h3>
            <p className="text-base sm:text-lg font-medium text-cyan-300">
              {identityData.role}
            </p>
            <p className="text-sm text-(--text-secondary) leading-relaxed mt-2">
              {identityData.introduction}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-(--border-color)">
            
            {/* Education */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-black/20 border border-(--border-color)">
              <div className="flex items-center gap-2 text-cyan-400">
                <GraduationCap className="w-4 h-4" />
                <p className="text-xs font-mono uppercase tracking-wider text-(--text-secondary)">EDUCATION</p>
              </div>
              <div className="text-(--text-primary) text-sm font-medium flex flex-col gap-1">
                <p className="font-bold">Bannari Amman Institute of Technology</p>
                <p className="text-xs text-(--text-secondary)">B.E. Computer Science and Engineering</p>
                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-(--border-color)">
                  <span className="text-(--text-secondary)">2024 – 2028 (Expected)</span>
                  <span className="font-bold text-cyan-300">CGPA 7.8</span>
                </div>
              </div>
            </div>

            {/* Location & Quick Contact */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-black/20 border border-(--border-color)">
              <div className="flex items-center gap-2 text-cyan-400">
                <MapPin className="w-4 h-4" />
                <p className="text-xs font-mono uppercase tracking-wider text-(--text-secondary)">LOCATION & CONTACT</p>
              </div>
              <div className="text-(--text-primary) text-sm flex flex-col gap-1">
                <p className="font-bold">{identityData.location}</p>
                <p className="text-xs text-(--text-secondary) font-mono">{identityData.email}</p>
                <p className="text-xs text-(--text-secondary) font-mono">{identityData.phone}</p>
                <div className="flex items-center gap-2 text-xs mt-2 pt-2 border-t border-(--border-color)">
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Open to Opportunities
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Certifications */}
            <div className="sm:col-span-2 flex flex-col gap-3 p-5 rounded-2xl bg-black/20 border border-(--border-color)">
              <div className="flex items-center gap-2 text-amber-400">
                <Award className="w-4 h-4" />
                <p className="text-xs font-mono uppercase tracking-wider text-(--text-secondary)">VERIFIED CREDENTIALS</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                {certificationsList.map((cert) => (
                  <div key={cert.id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-100">{cert.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{cert.issuer}</p>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 mt-2">Verified Credential</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Focus Areas */}
            <div className="sm:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <p className="text-metadata text-(--text-secondary)">CORE TECHNICAL COMPETENCIES</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(identityData.interests || []).map((focus, index) => (
                  <span 
                    key={index} 
                    className="px-3.5 py-1.5 rounded-lg border border-(--border-color) bg-black/20 text-(--text-primary) text-xs font-mono uppercase tracking-tight hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
        
      </div>
    </section>
  );
}
