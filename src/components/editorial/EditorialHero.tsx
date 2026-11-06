import React from 'react';
import { 
  ArrowRight, 
  FileDown, 
  Box, 
  Code2, 
  Sparkles, 
  MapPin, 
  Award,
  Terminal
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { identityData } from '../../data/portfolio';
import EditorialHero3D from './EditorialHero3D';

interface EditorialHeroProps {
  onReturn3D?: () => void;
  onExploreProjects?: () => void;
}

export default function EditorialHero({ onReturn3D, onExploreProjects }: EditorialHeroProps) {
  const scrollToProjects = () => {
    if (onExploreProjects) {
      onExploreProjects();
      return;
    }
    const elem = document.getElementById('projects');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Metadata Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-300">
                B.E. CSE • Batch of 2028 • CGPA 7.8
              </span>
            </div>

            {/* Giant Name */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] font-sans">
                NITISH PRIYAN <br />
                <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                  R S
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-mono text-cyan-300 font-medium tracking-tight">
                Computer Science & Engineering Student | Software Engineer | Java Developer | AI/ML Engineer
              </p>
            </div>

            {/* Tagline & Intro */}
            <div className="space-y-3 max-w-2xl">
              <p className="text-lg sm:text-xl font-serif italic text-slate-200 leading-relaxed">
                "{identityData.tagline}"
              </p>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                Computer Science undergraduate at Bannari Amman Institute of Technology with an Oracle Certified Associate Java SE 17 Developer credential and AWS Cloud Practitioner certification. Built 10+ software engineering systems including a patent-filed AI e-governance platform, campus digital twin, and MLOps prediction pipelines. Solved 250+ DSA problems in Java on LeetCode.
              </p>
            </div>

            {/* Action Group */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={scrollToProjects}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-bold font-mono text-xs sm:text-sm shadow-xl hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
              >
                <span>VIEW PROJECTS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="/Nitish_Priyan_Resume_Blue.pdf"
                download="Nitish_Priyan_Resume.pdf"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-white font-mono text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-cyan-400" />
                <span>DOWNLOAD RESUME</span>
              </a>

              {onReturn3D && (
                <button
                  onClick={onReturn3D}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-mono text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  <Box className="w-4 h-4 text-amber-400" />
                  <span>LAUNCH 3D WORLD</span>
                </button>
              )}
            </div>

            {/* Social & Verification Bar */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 border-t border-white/10">
              <a
                href={identityData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
                <span>github/NITISH1817</span>
              </a>
              <span className="text-slate-600">•</span>
              <a
                href={identityData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>linkedin/nitish-priyan</span>
              </a>
              <span className="text-slate-600">•</span>
              <a
                href={identityData.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>leetcode/NITISH1817 (250+)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Original 3D Developer Emblem */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-[420px] rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 p-2 shadow-2xl backdrop-blur-md overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
              
              {/* Corner Metadata */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>3D GYROSCOPIC CORE</span>
              </div>
              <div className="absolute top-4 right-4 z-20 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                INTERACTIVE
              </div>

              {/* Three.js Canvas */}
              <EditorialHero3D />

              {/* Bottom Credential Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-2xl bg-[#090E1A]/85 border border-white/10 backdrop-blur-md flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200">OCA Java SE 17 Certified</span>
                </div>
                <span className="text-cyan-400">AWS Cloud</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
