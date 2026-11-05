import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { projects } from '../data/portfolio';

// Abstract Project Visuals (Spatial Dark Theme)
function ProjectVisual({ id }) {
  if (id === 'setu') {
    return (
      <div className="w-full h-full bg-[var(--bg-surface)] flex items-center justify-center p-4 overflow-hidden relative">
        <div className="flex gap-4 items-center">
          <div className="w-8 h-8 rounded-full border border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-primary)]">
             <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
          <div className="w-12 h-[1px] bg-[var(--border-color)]" />
          <div className="w-16 h-16 rounded-md border border-[var(--accent)] flex items-center justify-center bg-indigo-900/20">
             <div className="w-4 h-4 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
          </div>
        </div>
      </div>
    );
  }
  
  if (id === 'diabetic-retinopathy') {
    return (
      <div className="w-full h-full bg-[var(--bg-surface)] flex items-center justify-center p-4 overflow-hidden relative">
        <div className="w-24 h-24 rounded-full border border-[var(--border-color)] relative overflow-hidden flex items-center justify-center">
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/20 to-transparent" />
           <div className="w-full h-[1px] bg-red-500/50 absolute" />
           <div className="w-[1px] h-full bg-red-500/50 absolute" />
           <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)]" />
        </div>
      </div>
    );
  }

  if (id === 'student-performance') {
    return (
      <div className="w-full h-full bg-[var(--bg-surface)] flex flex-col justify-center p-6 gap-4">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-blue-500 rounded-full" />
           <div className="flex-grow h-[1px] bg-blue-500/30" />
        </div>
        <div className="flex items-center gap-2 ml-4">
           <div className="w-2 h-2 bg-indigo-500 rounded-full" />
           <div className="flex-grow h-[1px] bg-indigo-500/30" />
        </div>
        <div className="flex items-center gap-2 ml-8">
           <div className="w-2 h-2 bg-purple-500 rounded-full" />
           <div className="flex-grow h-[1px] bg-purple-500/30" />
        </div>
      </div>
    );
  }

  if (id === 'project-zero') {
    return (
      <div className="w-full h-full bg-[var(--bg-surface)] flex items-center justify-center p-4 overflow-hidden relative">
        <div className="grid grid-cols-4 gap-2 opacity-50">
          {[...Array(16)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-[var(--accent)]' : 'bg-gray-700'}`} />
          ))}
        </div>
      </div>
    );
  }

  return <div className="w-full h-full bg-[var(--bg-surface)]" />;
}

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);

  // Mouse tracking for floating preview
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsDesktop(window.innerWidth > 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    
    const handleMouseMove = (e) => {
      // Calculate preview position (offset to bottom right, checking bounds)
      const previewWidth = 300;
      const previewHeight = 400;
      const offset = 80;
      
      let targetX = e.clientX + offset;
      let targetY = e.clientY + offset;
      
      if (targetX + previewWidth > window.innerWidth) {
        targetX = e.clientX - previewWidth - offset;
      }
      
      if (targetY + previewHeight > window.innerHeight) {
        targetY = e.clientY - previewHeight - offset;
      }
      
      mouseX.set(targetX);
      mouseY.set(targetY);
    };

    if (hoveredProject !== null) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredProject, isDesktop, mouseX, mouseY]);

  return (
    <section className="spatial-section min-h-screen" id="projects">
      <div className="w-full flex flex-col gap-32 relative z-10">
        
        <div className="w-full flex flex-col gap-2">
          <p className="text-metadata text-[var(--text-secondary)]">03</p>
          <h2 className="text-3xl font-bold tracking-tight uppercase">SELECTED WORK</h2>
        </div>
        
        <div className="w-full flex flex-col">
          {projects.map((proj, i) => (
            <div 
              key={proj.id} 
              className="py-16 md:py-24 border-t border-[var(--border-color)] flex flex-col group cursor-pointer relative"
              onMouseEnter={() => setHoveredProject(i)}
              onMouseLeave={() => setHoveredProject(null)}
              data-cursor="view"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                
                {/* Title */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-metadata text-[var(--text-secondary)]">0{i + 1}</span>
                    {proj.teamProject && (
                      <span className="text-[9px] font-bold tracking-widest text-[var(--accent)] border border-[var(--accent)] px-2 py-1 rounded-full uppercase">
                        TEAM PROJECT
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase transition-transform duration-500 group-hover:translate-x-4">
                    {proj.title}
                  </h3>
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 flex flex-col gap-6 opacity-80 group-hover:opacity-100 transition-opacity">
                  <p className="text-body text-[var(--text-secondary)]">
                    {proj.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-secondary)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Animated Accent Line */}
              <div className="absolute bottom-0 left-0 h-[1px] bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-700 ease-out" />
            </div>
          ))}
        </div>
        
      </div>

      {/* Floating Project Preview */}
      {isDesktop && (
        <AnimatePresence>
          {hoveredProject !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-[300px] pointer-events-none flex flex-col bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden shadow-2xl z-[60]"
              style={{ x: smoothX, y: smoothY }}
            >
              <div className="h-[200px] w-full border-b border-[var(--border-color)] relative">
                <ProjectVisual id={projects[hoveredProject].id} />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <p className="text-metadata text-[var(--accent)]">0{hoveredProject + 1}</p>
                <p className="text-xs font-bold uppercase tracking-widest truncate">
                  {projects[hoveredProject].title}
                </p>
                <p className="text-[10px] font-medium text-[var(--text-secondary)] truncate">
                  {projects[hoveredProject].technologies[0]} / {projects[hoveredProject].technologies[1]}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

    </section>
  );
}
