import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';

export default function ProjectCard({ project, index, recruiterMode, isHighlighted }) {
  const { activeTech } = usePortfolio();
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className={`relative w-full max-w-5xl h-[80vh] rounded-3xl border bg-black overflow-hidden p-8 flex flex-col justify-between cursor-pointer group shadow-2xl transition-all duration-500 ${isHighlighted ? 'border-accent-primary shadow-[0_0_50px_rgba(var(--color-accent-primary),0.3)]' : 'border-white/10'}`}
    >
      {/* Spotlight Effect */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)"
        }}
      />

      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-accent-primary font-mono text-sm tracking-widest uppercase mb-2 block">
              0{index + 1} // {project.type}
            </span>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-xl text-gray-400">{project.subtitle}</p>
          </div>
        </div>

        <p className="text-gray-300 max-w-2xl text-lg leading-relaxed mb-8">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3">
          {project.technologies.slice(0, 5).map((tech) => (
            <span key={tech} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
      </div>

      <div style={{ transform: "translateZ(30px)" }} className="relative z-10 mt-8 flex justify-between items-end border-t border-white/10 pt-6">
        <div className="flex gap-8">
          {project.metrics && project.metrics.map((metric, i) => (
            <div key={i}>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">{metric.label}</div>
            </div>
          ))}
        </div>
        <div className="text-white/50 group-hover:text-white transition-colors duration-300">
          Explore Detail &rarr;
        </div>
      </div>
    </motion.div>
  );
}
