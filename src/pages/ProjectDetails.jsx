import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Cursor from '../components/Cursor';

export default function ProjectDetails() {
  const { id } = useParams();
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);
  const project = {}; // Placeholder to avoid ReferenceError

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch README from GitHub
    fetch(`https://api.github.com/repos/NITISH1817/${id}/readme`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          // Decode base64 content
          const decoded = atob(data.content);
          setReadme(decoded);
        } else {
          setReadme('No detailed README available for this project.');
        }
        setLoading(false);
      })
      .catch(() => {
        setReadme('Failed to load project details.');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="dark bg-black text-white min-h-screen selection:bg-white/20">
      <Cursor />
      
      {/* Simple Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference bg-black/50 backdrop-blur-md border-b border-white/10">
        <Link to="/" className="text-xl font-bold tracking-tighter text-white hover:text-accent-primary transition-colors">
          &larr; BACK TO PORTFOLIO
        </Link>
        <a 
          href={`https://github.com/NITISH1817/${id}`} 
          target="_blank" 
          rel="noreferrer"
          className="px-5 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors duration-300 text-sm font-bold"
        >
          VIEW ON GITHUB
        </a>
      </nav>

      {/* Hero */}
      <motion.section 
        layoutId={`project-${id}`}
        className="pt-40 pb-20 px-6 border-b border-white/10 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">{id.replace(/-/g, ' ')}</h1>
          <div className="flex gap-4">
            <span className="px-4 py-1.5 bg-accent-primary/20 text-accent-primary text-sm font-mono rounded-full border border-accent-primary/30">
              REPOSITORY DETAILS
            </span>
          </div>
        </div>
        
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-accent-primary/10 blur-[100px] pointer-events-none"></div>
      </motion.section>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto prose prose-invert prose-lg prose-a:text-accent-primary hover:prose-a:text-white prose-headings:tracking-tight">
          {/* Metrics (if any) */}
          {project.metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
              {project.metrics.map((metric, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                  <div className="text-3xl font-bold text-accent-primary mb-2">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* What I Learned */}
          {project.whatILearned && project.whatILearned.length > 0 && (
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
                What This Project Taught Me
              </h2>
              <ul className="space-y-4">
                {project.whatILearned.map((lesson, idx) => (
                  <li key={idx} className="flex gap-4 items-start text-gray-300">
                    <span className="text-accent-primary mt-1">▹</span>
                    <span className="leading-relaxed">{lesson}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {loading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
            </div>
          ) : (
            <ReactMarkdown>{readme}</ReactMarkdown>
          )}
        </div>
      </section>
    </div>
  );
}
