import React from 'react';
import { useWorld } from '../../hooks/useWorld';
import { projects } from '../../data/projects';

export default function Projects() {
  const { activeSection, activeProject, setActiveProject } = useWorld();
  const isActive = activeSection === 'projects';

  if (!activeProject) {
    return (
      <section id="projects" className={`h-screen w-full relative flex flex-col items-center justify-start pt-32 px-6 transition-opacity duration-1000 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Project City</h2>
        <p className="text-gray-400 font-mono text-sm max-w-md text-center">
          Interactive modules in the 3D space below represent my core engineering work. 
          Hover and click on a building to explore the system architecture and case study.
        </p>
      </section>
    );
  }

  // Active Project Detail View
  return (
    <section className="fixed inset-0 z-40 bg-[#08090C]/80 backdrop-blur-xl flex justify-end">
      <div className="w-full md:w-1/2 h-full bg-[#111318] border-l border-white/10 p-8 md:p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
        
        <button onClick={() => setActiveProject(null)}
          className="mb-8 text-gray-500 hover:text-white font-mono text-xs tracking-widest uppercase flex items-center gap-2">
          <span>←</span> Back to City
        </button>

        {activeProject.type === 'TEAM PROJECT' && (
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-mono rounded border border-blue-500/30 mb-4">
            TEAM PROJECT
          </span>
        )}

        <h2 className="text-4xl font-bold text-white mb-2">{activeProject.title}</h2>
        <p className="text-xl text-gray-400 mb-8">{activeProject.subtitle}</p>

        <div className="flex flex-wrap gap-2 mb-10">
          {activeProject.technologies.map(tech => (
            <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-full">
              {tech}
            </span>
          ))}
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-sm font-mono text-gray-500 mb-3 uppercase tracking-widest">Problem</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{activeProject.description.problem}</p>
          </div>
          <div>
            <h3 className="text-sm font-mono text-gray-500 mb-3 uppercase tracking-widest">Solution</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{activeProject.description.solution}</p>
          </div>
          {activeProject.description.contribution && (
            <div>
              <h3 className="text-sm font-mono text-gray-500 mb-3 uppercase tracking-widest">My Contribution</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{activeProject.description.contribution}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
            {activeProject.links.github && (
              <a href={activeProject.links.github} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors">
                GitHub Repository ↗
              </a>
            )}
            {activeProject.links.live && (
              <a href={activeProject.links.live} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
                Live System ↗
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
