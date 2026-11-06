import React, { useEffect, useState } from 'react';

export default function CodeProfile() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/users/NITISH1817/repos?sort=updated&per_page=10')
      .then(res => {
        if (!res.ok) throw new Error('API Rate Limit or Error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const excluded = ['leetcode-solutions', 'codefore_solution', 'nitish1817'];
          const filtered = data.filter(repo => !excluded.includes(repo.name.toLowerCase())).slice(0, 4);
          setRepos(filtered);
        } else {
          throw new Error('Invalid data');
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <section className="immersive-section text-(--text-primary) pointer-events-none relative py-32">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <h2 className="text-section-title">GITHUB</h2>
        <p className="text-metadata mt-4 text-(--accent) mb-16">08 — CODE</p>
        
        {loading ? (
          <div className="font-mono text-gray-500 mb-12">CONNECTING TO GITHUB...</div>
        ) : error || repos.length === 0 ? (
          <div className="mb-12">
            <div className="font-mono text-gray-500 mb-4">GITHUB DATA TEMPORARILY UNAVAILABLE</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {repos.map(repo => (
              <a 
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-t border-white/20 pt-4 hover:border-(--accent) group transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold group-hover:text-(--accent) transition-colors">{repo.name}</h3>
                  <span className="font-mono text-xs text-gray-500">{repo.language || 'Code'}</span>
                </div>
                <p className="text-gray-400 font-mono text-sm line-clamp-2">{repo.description || 'No description provided.'}</p>
              </a>
            ))}
          </div>
        )}

        <a 
          href="https://github.com/NITISH1817" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 text-2xl font-mono border-b border-white hover:text-(--accent) hover:border-(--accent) transition-all pb-2"
        >
          VIEW GITHUB ↗
        </a>
      </div>
    </section>
  );
}
