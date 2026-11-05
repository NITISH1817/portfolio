import React from 'react';
import { useWorld } from '../../hooks/useWorld';

export default function Skills() {
  const { activeSection, activeSkill, setActiveSkill } = useWorld();
  const isActive = activeSection === 'skills';

  return (
    <section id="skills" className={`h-screen w-full relative flex items-center px-6 md:px-24 transition-opacity duration-1000 ${
      isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="z-10 max-w-sm">
        <h2 className="text-4xl font-bold text-white mb-2">Skill Constellation</h2>
        <p className="text-gray-400 text-sm mb-6">
          Explore my technical stack. Hover over nodes to highlight them in the 3D space.
        </p>

        {activeSkill ? (
          <div className="bg-[#111318]/90 backdrop-blur-md p-6 border border-white/10 rounded-xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-blue-400">{activeSkill}</h3>
              <button onClick={() => setActiveSkill(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <p className="text-sm text-gray-300">Selected node in the technology constellation.</p>
          </div>
        ) : (
          <div className="text-xs font-mono text-gray-500 animate-pulse">
            Select a skill node in the 3D space...
          </div>
        )}
      </div>
    </section>
  );
}
