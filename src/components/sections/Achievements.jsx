import React from 'react';
import { achievementsList } from '../../data/portfolio';

export default function Achievements() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8 md:p-24 relative z-10 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto pointer-events-auto flex flex-col items-center text-center gap-16">
        <h2 className="text-sm tracking-widest text-[#8B94A5] w-full text-left">06 / ACHIEVEMENTS</h2>
        
        {achievementsList.map((ach, i) => (
          <div key={ach.id} className="flex flex-col items-center gap-4 group" data-cursor="EXPLORE">
            <h3 className="text-7xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-[#F4F7FB] to-[#F4F7FB]/20 group-hover:from-[#5C6CFF] group-hover:to-[#5C6CFF]/20 transition-all duration-700">
              {ach.title}
            </h3>
            <p className="text-lg md:text-xl tracking-[0.2em] text-[#8B94A5] uppercase">
              {ach.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
