import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SplitReveal from './SplitReveal';
import DeveloperAvatarCanvas from './avatar/DeveloperAvatarCanvas';
import { identityData } from '../data/portfolio';
import { FileText, Github, Linkedin, Mail, Code2, ExternalLink } from 'lucide-react';

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const xOffset = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-12, 12]);
  const yOffset = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-8, 8]);
  const xOffsetSmall = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-4, 4]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="min-h-screen relative flex flex-col justify-center px-6 md:px-12 pt-24 pb-12 spatial-section" id="hero">
      
      <div className="w-full flex flex-col lg:flex-row items-center justify-between h-full relative gap-10 lg:gap-8">
        
        {/* Left Side: Massive Typography & Verified Profile */}
        <motion.div 
          className="w-full lg:w-7/12 flex flex-col items-start z-10 relative"
          style={{ x: xOffset, y: yOffset }}
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>AVAILABLE FOR SOFTWARE & AI/ML ROLES</span>
          </div>
          
          <h1 className="text-hero m-0 font-bold tracking-tighter leading-none mb-6">
            <SplitReveal delay={0.1}>NITISH</SplitReveal>
            <br />
            <SplitReveal delay={0.2}>PRIYAN</SplitReveal>
          </h1>
          
          <motion.div className="flex flex-col gap-4 max-w-xl" style={{ x: xOffsetSmall }}>
            {/* Professional Title */}
            <p className="text-lg sm:text-xl font-bold tracking-tight text-(--text-primary)">
              {identityData.role}
            </p>

            {/* Hero Tagline */}
            <p className="text-base sm:text-lg text-(--text-secondary) font-normal leading-relaxed">
              {identityData.tagline}
            </p>
          </motion.div>

          {/* Quick Action Badges / Contact Strips */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/resume/Nitish_Priyan_Resume_Blue.pdf"
              download="Nitish_Priyan_Resume_Blue.pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--accent) text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-md transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              Download Resume
            </a>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-recruiter-modal'))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-(--border-color) bg-black/30 hover:border-cyan-400 text-(--text-primary) text-xs font-mono font-medium transition-all cursor-pointer"
            >
              <span>Recruiter Dossier</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Verified Social & Technical Profiles */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-(--text-secondary)">
            <a 
              href={identityData.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>NITISH1817</span>
            </a>

            <span className="text-(--border-color)">|</span>

            <a 
              href={identityData.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>nitish-priyan</span>
            </a>

            <span className="text-(--border-color)">|</span>

            <a 
              href={identityData.leetcode} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Code2 className="w-4 h-4" />
              <span>250+ LeetCode DSA</span>
            </a>

            <span className="text-(--border-color)">|</span>

            <a 
              href={`mailto:${identityData.email}`} 
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>

          {/* Academic Info */}
          <div className="mt-10 flex flex-col gap-1 border-l-2 border-(--border-color) pl-4">
            <p className="text-metadata text-(--text-secondary)">
              Bannari Amman Institute of Technology • B.E. Computer Science & Engineering
            </p>
            <p className="text-metadata text-(--text-secondary)">
              Batch 2024 – 2028 • CGPA: {identityData.cgpa} • Tamil Nadu, India
            </p>
          </div>
        </motion.div>

        {/* Right Side: Interactive 3D Developer Avatar */}
        <div className="w-full lg:w-5/12 h-[420px] sm:h-[480px] lg:h-[540px] relative flex items-center justify-center">
          <DeveloperAvatarCanvas className="w-full h-full" showBadge={true} />
        </div>

      </div>
      
    </section>
  );
}
