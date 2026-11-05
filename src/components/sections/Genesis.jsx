import React from 'react';
import { motion } from 'framer-motion';

export default function Genesis() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center relative z-10 pointer-events-none">
      <div className="text-center pointer-events-auto">
        <motion.h1 
          className="text-[12vw] font-bold tracking-tighter leading-none"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          NITISH <br /> PRIYAN
        </motion.h1>
        <motion.div 
          className="mt-8 text-sm tracking-[0.2em] text-[#8B94A5] uppercase max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Computer Science & Engineering Student <br/>
          Software Engineer <br/>
          Java Developer <br/>
          AI / ML Engineer
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-12 text-[10px] tracking-widest text-[#8B94A5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        SCROLL TO ENTER ↓
      </motion.div>
    </div>
  );
}
