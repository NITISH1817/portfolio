import React from 'react';
import { identityData } from '../../data/portfolio';

export default function Identity() {
  return (
    <div className="min-h-screen w-full flex items-center p-8 md:p-24 relative z-10 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 pointer-events-auto">
        
        {/* Left Side */}
        <div className="flex flex-col gap-6" data-cursor="VIEW">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
            01 / IDENTITY
          </h2>
          <div className="text-xl md:text-3xl font-light text-[#8B94A5]">
            {identityData.name}
          </div>
          <div className="text-lg md:text-xl text-[#F4F7FB] leading-relaxed">
            {identityData.summary.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center gap-4 text-sm md:text-base text-[#8B94A5]" data-cursor="EXPLORE">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[#F4F7FB] block">Bannari Amman Institute of Technology</span>
            B.E. Computer Science and Engineering
          </div>
          <div className="border-b border-white/10 pb-4">
            <span className="text-[#F4F7FB] block">Expected 2028</span>
            CGPA {identityData.cgpa}
          </div>
          <div className="border-b border-white/10 pb-4">
            <span className="text-[#F4F7FB] block">Location</span>
            {identityData.location}
          </div>
        </div>

      </div>
    </div>
  );
}
