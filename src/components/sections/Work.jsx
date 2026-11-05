import React, { useState } from 'react';
import { projects } from '../../data/portfolio';
import { motion, AnimatePresence } from 'framer-motion';

export default function Work() {
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    <div className="min-h-[150vh] w-full flex items-center p-8 md:p-24 relative z-10 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto pointer-events-auto">
        <h2 className="text-sm tracking-widest text-[#8B94A5] mb-16">03 / WORK</h2>
        
        <div className="flex flex-col border-t border-white/10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="py-12 border-b border-white/10 flex flex-col md:flex-row gap-8 hover:bg-white/[0.02] transition-colors relative group cursor-none"
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
              data-cursor="OPEN"
            >
              <div className="text-[#8B94A5] font-light text-xl md:w-32">
                {project.number}
              </div>
              
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-3xl md:text-5xl font-bold tracking-tighter group-hover:text-[#5C6CFF] transition-colors duration-500">
                  {project.title}
                </h3>
                
                {project.type === "TEAM PROJECT" && (
                  <span className="text-[10px] tracking-[0.2em] px-2 py-1 bg-[#141823] text-[#35D7FF] w-fit rounded">
                    TEAM PROJECT
                  </span>
                )}
                
                <p className="text-[#8B94A5] max-w-xl text-lg">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="text-xs text-[#F4F7FB]/50 uppercase tracking-widest">
                      {tech}{i < project.technologies.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
