import React from 'react';
import { identityData } from '../../data/portfolio';

export default function Contact() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8 md:p-24 relative z-10 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto pointer-events-auto flex flex-col items-center text-center gap-16">
        <h2 className="text-sm tracking-widest text-[#8B94A5] w-full text-left">08 / CONTACT</h2>
        
        <h1 className="text-6xl md:text-[10vw] font-bold tracking-tighter leading-none" data-cursor="CONNECT">
          LET'S <br/> CONNECT.
        </h1>
        
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 mt-12">
          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-[0.2em] text-[#8B94A5]">EMAIL</span>
            <a href={`mailto:${identityData.email}`} className="text-xl md:text-2xl hover:text-[#5C6CFF] transition-colors" data-cursor="CONNECT">
              {identityData.email}
            </a>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-[0.2em] text-[#8B94A5]">PHONE</span>
            <a href={`tel:${identityData.phone.replace(/\s+/g, '')}`} className="text-xl md:text-2xl hover:text-[#5C6CFF] transition-colors" data-cursor="CONNECT">
              {identityData.phone}
            </a>
          </div>
        </div>

        <div className="flex gap-12 mt-8">
          <a href={identityData.linkedin} target="_blank" rel="noreferrer" className="text-sm tracking-widest hover:text-[#35D7FF] transition-colors" data-cursor="OPEN">
            LINKEDIN
          </a>
          <a href={identityData.github} target="_blank" rel="noreferrer" className="text-sm tracking-widest hover:text-[#35D7FF] transition-colors" data-cursor="OPEN">
            GITHUB
          </a>
        </div>
      </div>
    </div>
  );
}
