import React, { useState } from 'react';
import { capabilities } from '../../data/portfolio';

export default function Capabilities() {
  const [activeCap, setActiveCap] = useState(capabilities[0]);

  return (
    <div className="min-h-screen w-full flex items-center p-8 md:p-24 relative z-10 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto pointer-events-auto flex flex-col md:flex-row gap-16">
        
        {/* Left Side: Network List */}
        <div className="flex-1 flex flex-col gap-8">
          <h2 className="text-sm tracking-widest text-[#8B94A5] mb-4">02 / CAPABILITIES</h2>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
            
            {capabilities.map((cap) => (
              <button
                key={cap.id}
                onMouseEnter={() => setActiveCap(cap)}
                className={`text-left pl-8 py-2 relative transition-all ${activeCap.id === cap.id ? 'text-[#F4F7FB] translate-x-2' : 'text-[#8B94A5] hover:text-[#F4F7FB]'}`}
                data-cursor="VIEW"
              >
                {activeCap.id === cap.id && (
                  <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1.25 h-1.25 rounded-full bg-[#5C6CFF] shadow-[0_0_10px_#5C6CFF]" />
                )}
                <span className="text-xl md:text-3xl font-light tracking-tight">
                  {cap.title?.includes('—') ? cap.title.split('—')[1]?.trim() : (cap.title?.includes('-') ? cap.title.split('-')[1]?.trim() : cap.title)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 flex flex-col justify-center min-h-[300px]">
          {activeCap && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex flex-wrap gap-2">
                {activeCap.technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1 border border-white/10 rounded-full text-xs tracking-widest text-[#F4F7FB]">
                    {tech}
                  </span>
                ))}
              </div>
              
              {activeCap.hoverEvidence && (
                <div className="flex flex-col gap-4 mt-8">
                  <h3 className="text-[#8B94A5] text-xs tracking-widest">EVIDENCE</h3>
                  {Object.entries(activeCap.hoverEvidence).map(([key, value], i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[#F4F7FB]">{key}</span>
                      <span className="text-[#8B94A5] text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
