import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const capabilities = [
  {
    title: 'SOFTWARE ENGINEERING',
    description: 'System design, architecture, and scalable application development.',
    tech: ['System Design', 'Architecture', 'DSA', 'OOP'],
    evidence: 'SETU, Project Zero'
  },
  {
    title: 'JAVA DEVELOPMENT',
    description: 'Enterprise backend systems and performance-critical algorithms.',
    tech: ['Java SE 17', 'REST APIs', 'OOP', 'Backend Architecture'],
    evidence: 'SETU, 170+ DSA'
  },
  {
    title: 'AI / MACHINE LEARNING',
    description: 'Deep learning models, computer vision, and predictive analytics.',
    tech: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn'],
    evidence: 'Diabetic Retinopathy Classification'
  },
  {
    title: 'BACKEND / API ENGINEERING',
    description: 'RESTful services, database modeling, and secure authentications.',
    tech: ['Node.js', 'FastAPI', 'MySQL', 'MongoDB'],
    evidence: 'Student Performance MLOps'
  },
  {
    title: 'MLOPS / SYSTEM ENGINEERING',
    description: 'Model deployment, tracking, containerization, and lifecycle management.',
    tech: ['MLflow', 'Docker', 'Git', 'Linux', 'CI/CD'],
    evidence: 'Student Performance MLOps'
  },
  {
    title: 'FULL STACK DEVELOPMENT',
    description: 'End-to-end web applications with interactive frontends and robust backends.',
    tech: ['React', 'Next.js', 'Tailwind', 'Three.js'],
    evidence: 'Portfolio, Project Zero'
  }
];

export default function Capabilities() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="product-section min-h-screen flex items-center" id="capabilities">
      <div className="w-full flex flex-col items-start gap-16 max-w-[1440px] mx-auto relative z-10">
        
        <div className="w-full flex flex-col gap-2">
          <p className="text-metadata text-[var(--text-secondary)]">02</p>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">CAPABILITIES</h2>
        </div>
        
        <div className="w-full flex flex-col border-t border-[var(--border-color)]">
          {capabilities.map((cap, i) => (
            <div 
              key={i}
              className="interactive-row py-8 md:py-12 group cursor-pointer relative"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-center gap-8 md:gap-16">
                  <span className="text-metadata text-[var(--text-secondary)] w-6 group-hover:text-[var(--accent)] transition-colors">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-bold tracking-tighter text-[var(--text-primary)] uppercase transition-transform duration-500 ease-out group-hover:translate-x-4">
                    {cap.title}
                  </h3>
                </div>

                <div className="hidden md:flex items-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors duration-500 group-hover:translate-x-2">
                  <span className="text-lg font-light">→</span>
                </div>

              </div>

              <AnimatePresence>
                {hoveredIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden ml-0 md:ml-28 mt-8"
                  >
                    <div className="flex flex-col md:flex-row gap-12 pb-4">
                      
                      <div className="w-full md:w-1/2 flex flex-col gap-6">
                        <p className="text-body text-[var(--text-secondary)]">
                          {cap.description}
                        </p>
                        <div className="flex flex-col gap-2">
                          <p className="text-metadata text-[var(--text-primary)]">EVIDENCE</p>
                          <p className="text-sm font-bold text-[var(--accent)] uppercase">{cap.evidence}</p>
                        </div>
                      </div>

                      <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <p className="text-metadata text-[var(--text-primary)]">TECHNOLOGY</p>
                        <div className="flex flex-col gap-2">
                          {cap.tech.map((t, idx) => (
                            <span 
                              key={idx} 
                              className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-1 w-fit"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Animated Accent Line */}
              <div className="absolute bottom-0 left-0 h-[1px] bg-[var(--accent)] w-0 group-hover:w-full transition-all duration-700 ease-out" />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
