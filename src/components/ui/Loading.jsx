import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loading({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("INITIALIZING 3D ENGINE");

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 5) + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => onComplete(), 350);
      }
      setProgress(current);

      if (current > 25 && current < 60) setPhase("BUILDING PHYSICS PLAYGROUND");
      if (current >= 60 && current < 90) setPhase("TUNING RC VEHICLE SUSPENSION");
      if (current >= 90) setPhase("READY TO DRIVE");
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[1000] bg-[#0B0F19] flex flex-col items-center justify-center text-[#F8FAFC]"
        exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6, ease: "easeInOut" } }}
      >
        <div className="w-full max-w-sm flex flex-col items-center gap-6 px-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,87,34,0.3)] animate-pulse">
            🚗
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-widest text-white uppercase">
              NITISH PRIYAN
            </h1>
            <p className="text-xs font-mono tracking-wider text-orange-400 mt-1">
              3D INTERACTIVE PLAYGROUND
            </p>
          </div>
          <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase h-4">
            {phase}
          </div>
          <div className="text-5xl font-black font-mono tracking-tighter text-white">
            {progress.toString().padStart(2, '0')}%
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <motion.div 
              className="h-full bg-linear-to-r from-orange-500 to-amber-400 rounded-full" 
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
