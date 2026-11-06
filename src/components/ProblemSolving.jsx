import React from 'react';

export default function ProblemSolving() {
  return (
    <section className="immersive-section text-(--text-primary) pointer-events-none relative py-32">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <h2 className="text-section-title">ALGORITHMS</h2>
        <p className="text-metadata mt-4 text-(--accent) mb-16">08 — PROBLEM SOLVING</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xl text-gray-400">
          <div className="p-4 border border-white/10 hover:border-(--accent) hover:text-white transition-all">ARRAYS</div>
          <div className="p-4 border border-white/10 hover:border-(--accent) hover:text-white transition-all">LINKED LISTS</div>
          <div className="p-4 border border-white/10 hover:border-(--accent) hover:text-white transition-all">TREES</div>
          <div className="p-4 border border-white/10 hover:border-(--accent) hover:text-white transition-all">GRAPHS</div>
          <div className="p-4 border border-white/10 hover:border-(--accent) hover:text-white transition-all">RECURSION</div>
          <div className="p-4 border border-white/10 hover:border-(--accent) hover:text-white transition-all">DYNAMIC PROG.</div>
        </div>
      </div>
    </section>
  );
}
