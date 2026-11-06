import React, { useState, useEffect } from 'react';
import { ArrowUp, Box, Terminal, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { identityData } from '../../data/portfolio';

interface EditorialFooterProps {
  onReturn3D?: () => void;
}

export default function EditorialFooter({ onReturn3D }: EditorialFooterProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <footer className="border-t border-white/10 bg-[#060910] py-14 relative z-10 text-slate-400 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-white/5">
            <div className="space-y-1.5">
              <span className="font-bold text-white text-base font-sans tracking-tight block">
                NITISH PRIYAN R S
              </span>
              <p className="text-xs text-slate-400">
                B.E. Computer Science & Engineering • Bannari Amman Institute of Technology • Batch of 2028
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onReturn3D && (
                <button
                  onClick={onReturn3D}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-300 font-bold active:scale-95 transition-all cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>LAUNCH 3D PLAYGROUND</span>
                </button>
              )}

              <a
                href={identityData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href={identityData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-all"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>

              <a
                href={identityData.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition-all"
                title="LeetCode"
              >
                <Terminal className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} Nitish Priyan R S. All verified credentials sourced from official academic records.
            </div>
            <div className="flex items-center gap-4">
              <span>React 19</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>Three.js</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-slate-900/90 border border-white/20 text-slate-200 hover:text-white hover:border-amber-400 backdrop-blur-md shadow-2xl transition-all active:scale-95 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-200"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4 text-amber-400" />
        </button>
      )}
    </>
  );
}
