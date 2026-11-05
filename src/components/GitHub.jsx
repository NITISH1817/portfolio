import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function GitHub() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple fetch for public repos (fallback if rate limited)
    fetch('https://api.github.com/users/NITISH1817/repos?sort=updated&per_page=3')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-24 bg-black border-y border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter flex items-center gap-4">
            <span className="text-white/50">#</span>
            GITHUB
          </h2>
          <a href="https://github.com/NITISH1817" target="_blank" rel="noreferrer" className="text-sm font-mono text-accent-primary hover:text-white transition-colors">
            VIEW PROFILE &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center text-gray-500 font-mono">Loading repositories...</div>
          ) : repos.length > 0 ? (
            repos.map(repo => (
              <a 
                key={repo.id} 
                href={repo.html_url} 
                target="_blank" 
                rel="noreferrer"
                className="block p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-primary transition-colors">{repo.name}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{repo.description || 'No description provided.'}</p>
                
                <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>{repo.language || 'Code'}</span>
                  <span className="flex items-center gap-1">★ {repo.stargazers_count}</span>
                  <span className="flex items-center gap-1">⑂ {repo.forks_count}</span>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 font-mono">
              Repositories unavailable at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
