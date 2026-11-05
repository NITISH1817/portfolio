import React from 'react';
import { certificationsList } from '../../data/portfolio';

export default function Certifications() {
  return (
    <div className="min-h-[100vh] w-full flex items-center p-8 md:p-24 relative z-10 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto pointer-events-auto">
        <h2 className="text-sm tracking-widest text-[#8B94A5] mb-16 text-right">05 / CERTIFICATIONS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certificationsList.map((cert) => (
            <div 
              key={cert.id} 
              className="border border-white/10 p-8 hover:border-[#5C6CFF]/50 hover:bg-[#5C6CFF]/5 transition-all duration-500 backdrop-blur-sm group"
              data-cursor="VIEW"
            >
              <h3 className="text-xl md:text-2xl font-light text-[#F4F7FB] mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                {cert.title}
              </h3>
              <p className="text-sm tracking-[0.1em] text-[#8B94A5] uppercase">
                {cert.issuer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
