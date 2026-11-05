import React, { useRef } from 'react';
import { useWorld } from '../../hooks/useWorld';
import { profile } from '../../data/profile';
import MagneticButton from '../MagneticButton';

export default function Hero({ onResumeOpen }) {
  const { activeSection } = useWorld();
  const isActive = activeSection === 'hero';

  return (
    <section id="hero" className={`h-screen w-full relative flex items-center px-6 md:px-24 transition-opacity duration-1000 ${
      isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="z-10 mt-20 md:mt-0">
        <h2 className="text-gray-400 font-mono tracking-[0.2em] text-xs md:text-sm mb-4">
          SOFTWARE ENGINEER
        </h2>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          NITISH
          <span className="block text-blue-500">PRIYAN</span>
        </h1>
        
        <div className="space-y-1 mb-10 max-w-xl">
          <p className="text-xl text-gray-300">
            {profile.headline[0]}
          </p>
          <p className="text-md text-gray-500 font-mono">
            {profile.headline.slice(1).join(' · ')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <MagneticButton>
            <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-colors border border-blue-400/30">
              View Projects
            </button>
          </MagneticButton>
          
          <MagneticButton>
            <button onClick={onResumeOpen}
              className="px-8 py-3.5 bg-transparent border border-gray-600 hover:border-gray-300 text-gray-300 hover:text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-colors">
              View Resume
            </button>
          </MagneticButton>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-linear-to-b from-gray-500 to-transparent" />
      </div>
    </section>
  );
}
