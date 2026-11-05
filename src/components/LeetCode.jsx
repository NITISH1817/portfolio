import React from 'react';
import { motion } from 'framer-motion';

export default function LeetCode() {
  const topics = ["Arrays", "Linked Lists", "Bit Manipulation", "Recursion", "Algorithms"];

  return (
    <section className="py-24 bg-black border-y border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-white">LEETCODE</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-lg">
            Consistent algorithmic problem solving focused on optimizing time and space complexities.
          </p>
          <div className="flex gap-8 mb-8 border-l-2 border-accent-primary pl-6 py-2">
            <div>
              <div className="text-4xl font-bold text-white mb-1">250+</div>
              <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">Problems Solved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">Java</div>
              <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">Primary Language</div>
            </div>
          </div>
          <a href="https://leetcode.com/u/NITISH1817/" target="_blank" rel="noreferrer" className="text-sm font-mono text-accent-primary hover:text-white transition-colors">
            VIEW LEETCODE PROFILE &rarr;
          </a>
        </div>

        <div className="w-full md:w-1/2 flex flex-wrap gap-3">
          {topics.map(topic => (
            <span key={topic} className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-mono text-sm hover:bg-white/10 transition-colors">
              {topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
