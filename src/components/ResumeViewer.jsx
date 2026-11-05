import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ResumeViewer({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-[var(--bg-primary)]/95 backdrop-blur-xl flex flex-col pointer-events-auto"
      style={{ zIndex: 200 }}
    >
      
      {/* Top Bar */}
      <div className="w-full h-20 border-b border-[var(--border-color)] flex justify-between items-center px-6 md:px-12 shrink-0 bg-[var(--bg-primary)]">
        <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)] uppercase">
          RESUME PREVIEW
        </h3>
        
        <div className="flex items-center gap-6">
          <a 
            href="/resume/Nitish_Priyan_Resume_Blue.pdf" 
            download
            className="hidden md:block text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors border-b border-transparent hover:border-[var(--accent)] pb-1"
          >
            DOWNLOAD PDF
          </a>
          <button 
            onClick={onClose}
            className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-1"
          >
            CLOSE (ESC)
          </button>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="w-full flex-grow flex justify-center p-4 md:p-12 overflow-auto relative">
        {/* We use an iframe to natively support browser's built-in PDF features (zoom, print, etc) */}
        <iframe 
          src="/resume/Nitish_Priyan_Resume_Blue.pdf#toolbar=0&navpanes=0" 
          title="Resume PDF"
          className="w-full h-full max-w-5xl bg-white shadow-2xl border border-[var(--border-color)]"
        />
        
        {/* Mobile Fallback Overlay if iframe fails to render well on small screens */}
        <div className="md:hidden absolute inset-0 bg-[var(--bg-primary)] flex flex-col items-center justify-center p-8 text-center z-10 pointer-events-none opacity-0">
           {/* Usually mobile browsers handle PDF iframes poorly. The user can just click download. */}
        </div>
      </div>

    </motion.div>
  );
}
