import { fetchAllNews } from './api/news.js';
import { renderArticles } from './components/renderer.js';
import { trackReading } from './utils/storage.js';
import { suggestArticles } from './components/suggestions.js';
import { initThemeToggle } from './components/theme.js';

let allArticles = [];
const breakingNewsContainer = document.getElementById('breaking-news');

async function init() {
  allArticles = await fetchAllNews();

  // Show random breaking news headline
  if (allArticles.length) {
    const randomArticle = allArticles[Math.floor(Math.random() * allArticles.length)];
    breakingNewsContainer.innerHTML = randomArticle.title;
  }

  // Render all articles initially (shuffled)
  const shuffled = allArticles.sort(() => Math.random() - 0.5);
  renderArticles(shuffled);

  // Track reading patterns for suggestions
  trackReading(shuffled);

  // Render AI suggestions
  suggestArticles(shuffled);

  // Setup category filtering
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      let filtered = allArticles.filter(a => a.category === category);

      if (!filtered.length) filtered = allArticles.sort(() => Math.random() - 0.5).slice(0,5);
      renderArticles(filtered);
    });
  });

  // Setup search
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const results = allArticles.filter(a =>
      (a.title + ' ' + a.description).toLowerCase().includes(query)
    );
    renderArticles(results.length ? results : allArticles.sort(() => Math.random() - 0.5).slice(0,5));
  });

  // Initialize theme toggle
  initThemeToggle();
}

init();