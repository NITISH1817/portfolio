import React from 'react';
import { identityData } from '../data/portfolio';

export default function Footer() {
  return (
    <footer className="w-full px-6 md:px-12 py-8 border-t border-[var(--border-color)]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">
        <p>{identityData.name}</p>
        <p>CSE • SOFTWARE • AI/ML</p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
