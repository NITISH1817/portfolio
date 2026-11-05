import React from 'react';

export default function Resume() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8 md:p-24 relative z-10 pointer-events-none">
      <div className="flex flex-col items-center gap-12 pointer-events-auto text-center">
        <h2 className="text-sm tracking-widest text-[#8B94A5]">07 / RESUME</h2>
        
        <div className="w-[300px] h-[400px] border border-white/20 bg-white/5 backdrop-blur-md rounded flex items-center justify-center group relative overflow-hidden" data-cursor="VIEW">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#5C6CFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="text-white/50 group-hover:text-white tracking-widest transition-colors duration-500">RESUME.PDF</span>
        </div>
        
        <div className="flex gap-8">
          <button className="text-sm tracking-widest hover:text-[#5C6CFF] transition-colors" data-cursor="OPEN">
            VIEW RESUME
          </button>
          <a href="/resume/Nitish_Priyan_RS_Resume.pdf" download className="text-sm tracking-widest hover:text-[#35D7FF] transition-colors" data-cursor="DOWNLOAD">
            DOWNLOAD PDF
          </a>
        </div>
      </div>
    </div>
  );
}
