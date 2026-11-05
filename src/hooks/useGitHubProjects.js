import { useState, useEffect } from 'react';

const EXCLUDED_REPOSITORIES = [
  "leetcode-solutions",
  "codefore_solution",
  "nitish1817"
];

// Helper to guess category
function categorizeProject(repo) {
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const lang = (repo.language || '').toLowerCase();

  if (name.includes('ai') || name.includes('ml') || desc.includes('machine learning') || lang === 'jupyter notebook' || name.includes('retinopathy')) {
    return 'AI / ML';
  }
  if (name.includes('mlops') || desc.includes('mlops') || desc.includes('pipeline')) {
    return 'MLOps';
  }
  if (name.includes('backend') || desc.includes('api') || name.includes('setu') || lang === 'java') {
    return 'BACKEND';
  }
  if (name.includes('frontend') || name.includes('web') || lang === 'javascript' || lang === 'typescript' || lang === 'html') {
    return 'FULL STACK';
  }
  return 'OTHER';
}

export function useGitHubProjects(username) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRepos() {
      const cacheKey = `github_repos_${username}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        setProjects(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (!response.ok) throw new Error('Failed to fetch repositories');

        const data = await response.json();
        
        // Filter and map
        const validRepos = data
          .filter(repo => !EXCLUDED_REPOSITORIES.includes(repo.name.toLowerCase()))
          .map(repo => ({
            id: repo.id.toString(),
            name: repo.name,
            description: repo.description || "No description provided.",
            language: repo.language || "Code",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: repo.updated_at,
            url: repo.html_url,
            category: categorizeProject(repo)
          }));

        sessionStorage.setItem(cacheKey, JSON.stringify(validRepos));
        setProjects(validRepos);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchRepos();
  }, [username]);

  return { projects, loading, error };
}
