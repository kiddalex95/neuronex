// main.js
import { renderArticles } from './components/renderer.js';
import { trackReading } from './utils/storage.js';
import { suggestArticles } from './components/suggestions.js';
import { applyTheme } from './components/theme.js';

let allArticles = [];
let filteredArticles = [];
let breakingIndex = 0;
let breakingInterval;

// ---------------------
// FETCH ARTICLES
// ---------------------
async function loadNews() {
  try {
    const res = await fetch('/api/news');
    const data = await res.json();

    if (!data.articles || !data.articles.length) {
      document.getElementById('breaking-news').innerText = 'No breaking news found.';
      return;
    }

    allArticles = data.articles;
    filteredArticles = [...allArticles];

    breakingIndex = Math.floor(Math.random() * allArticles.length);
    document.getElementById('breaking-news').innerText = allArticles[breakingIndex].title;

    renderArticles(filteredArticles);
    trackReading(allArticles);
    suggestArticles(allArticles);
  } catch (err) {
    console.error(err);
    document.getElementById('breaking-news').innerText = 'Failed to load news.';
  }
}

// ---------------------
// SEARCH
// ---------------------
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  const performSearch = (query) => {
    query = query.trim().toLowerCase();
    if (!query) {
      filteredArticles = [...allArticles];
      renderArticles(filteredArticles);
      return;
    }

    filteredArticles = allArticles.filter(article =>
      (article.title + ' ' + article.description).toLowerCase().includes(query)
    );

    if (!filteredArticles.length) {
      document.getElementById('articles-container').innerHTML =
        `<p style="text-align:center;">No articles found for "${query}".</p>`;
      return;
    }

    renderArticles(filteredArticles);
  };

  searchBtn.addEventListener('click', () => performSearch(searchInput.value));
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch(searchInput.value);
  });
}

// ---------------------
// CATEGORY FILTERING
// ---------------------
function setupCategories() {
  const catButtons = document.querySelectorAll('.cat-btn');

  const highlightCategory = (selectedCategory) => {
    catButtons.forEach(btn => {
      btn.style.boxShadow = btn.dataset.category === selectedCategory
        ? '0 0 25px #ff0080, 0 0 40px #7928ca'
        : '';
      btn.style.transform = btn.dataset.category === selectedCategory ? 'scale(1.1) rotate(-2deg)' : '';
    });
  };

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      highlightCategory(category);

      filteredArticles = allArticles.filter(article => article.category === category);

      if (!filteredArticles.length) {
        document.getElementById('articles-container').innerHTML =
          `<p style="text-align:center;">No articles found for category "${category}".</p>`;
        return;
      }

      renderArticles(filteredArticles);
    });
  });
}

// ---------------------
// BREAKING NEWS ROTATION
// ---------------------
function startBreakingNewsRotation() {
  const breakingEl = document.getElementById('breaking-news');
  if (!allArticles.length) return;

  breakingInterval = setInterval(() => {
    breakingIndex = (breakingIndex + 1) % allArticles.length;
    breakingEl.style.opacity = 0;
    setTimeout(() => {
      breakingEl.innerText = allArticles[breakingIndex].title;
      breakingEl.style.opacity = 1;
    }, 500);
  }, 30000);
}

// ---------------------
// INITIALIZE
// ---------------------
window.addEventListener('DOMContentLoaded', () => {
  loadNews();
  setupSearch();
  setupCategories();
  applyTheme();
  startBreakingNewsRotation();
});