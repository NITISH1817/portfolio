import React, { useState } from 'react';
import ResumeViewer from './ResumeViewer';
import MagneticButton from './MagneticButton';

export default function Resume() {
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <>
      <section className="spatial-section min-h-screen flex items-center" id="resume">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row gap-12 md:gap-32 relative z-10">
          
          <div className="w-full md:w-1/3 flex flex-col gap-2">
            <p className="text-metadata text-(--text-secondary)">07</p>
            <h2 className="text-3xl font-bold tracking-tight text-(--text-primary)">RESUME</h2>
          </div>
          
          <div className="w-full md:w-2/3 flex flex-col gap-12 max-w-xl">
            <p className="text-body text-(--text-secondary) leading-relaxed">
              A comprehensive overview of my academic background, technical skills, and project experience in the digital space.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 mt-4">
              <MagneticButton 
                onClick={() => setViewerOpen(true)}
                className="group flex items-center gap-4 text-(--text-primary) pb-2 border-b border-(--text-primary) w-fit"
                cursorData="resume"
              >
                <span className="text-sm font-bold uppercase tracking-widest">VIEW RESUME</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </MagneticButton>

              <MagneticButton 
                href="/resume/Nitish_Priyan_Resume_Blue.pdf" 
                className="group flex items-center gap-4 text-(--text-secondary) hover:text-(--text-primary) pb-2 border-b border-(--border-color) hover:border-(--text-primary) transition-colors w-fit"
                cursorData="download"
              >
                <span className="text-sm font-bold uppercase tracking-widest">DOWNLOAD PDF</span>
                <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
              </MagneticButton>
            </div>
          </div>
          
        </div>
      </section>

      {viewerOpen && (
        <ResumeViewer onClose={() => setViewerOpen(false)} />
      )}
    </>
  );
}
