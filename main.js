import { renderArticles } from './components/renderer.js';
import { trackReading } from './utils/storage.js';
import { suggestArticles } from './components/suggestions.js';
import { initThemeToggle } from './components/theme.js';

let allArticles = [];
const breakingNewsContainer = document.getElementById('breaking-news');

async function init() {
  try {
    const res = await fetch('/api/fetch-news'); // serverless endpoint
    allArticles = await res.json();
  } catch (e) {
    console.error('Failed to fetch articles', e);
    allArticles = []; // fallback empty array
  }

  // Dynamic breaking news
  if (allArticles.length) {
    const randomArticle = allArticles[Math.floor(Math.random() * allArticles.length)];
    breakingNewsContainer.innerHTML = randomArticle.title;
  }

  // Render shuffled articles
  renderArticles(allArticles.sort(() => Math.random() - 0.5));

  // Track reading
  trackReading(allArticles);

  // AI suggestions
  suggestArticles(allArticles);

  // Category buttons
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      let filtered = allArticles.filter(a => a.category === category);
      if (!filtered.length) filtered = allArticles.sort(() => Math.random() - 0.5).slice(0,5);
      renderArticles(filtered);
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const results = allArticles.filter(a => (a.title + ' ' + a.description).toLowerCase().includes(query));
    renderArticles(results.length ? results : allArticles.sort(() => Math.random() - 0.5).slice(0,5));
  });

  // Theme toggle
  initThemeToggle();
}

init();