import React from 'react';
import { useWorld } from '../../hooks/useWorld';
import { profile } from '../../data/profile';

export default function About() {
  const { activeSection } = useWorld();
  const isActive = activeSection === 'about';

  return (
    <section id="about" className={`h-screen w-full relative flex items-center justify-end px-6 md:px-24 transition-opacity duration-1000 ${
      isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="z-10 max-w-xl bg-[#08090C]/60 backdrop-blur-md p-8 border border-white/5 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6">About Architecture</h2>
        
        <div className="space-y-4 text-gray-300 leading-relaxed font-light text-sm md:text-base">
          {profile.about.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="block text-xs font-mono text-gray-500 mb-1">LOCATION</span>
            <span className="text-sm text-gray-200">{profile.location}</span>
          </div>
          <div className="text-right">
            <span className="block text-xs font-mono text-gray-500 mb-1">EDUCATION</span>
            <span className="text-sm text-gray-200">B.E. CSE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
