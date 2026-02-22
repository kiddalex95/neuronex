import { initThemeToggle } from './components/theme.js';
initThemeToggle();

// Select DOM elements
const breakingNewsEl = document.getElementById('breaking-news');
const articlesContainer = document.getElementById('articles-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryBtns = document.querySelectorAll('.cat-btn');
const suggestionsContainer = document.getElementById('suggestions-container');

// User reading history for suggestions
let readHistory = JSON.parse(localStorage.getItem('neuronex_read_history')) || [];

// -------------------
// Fetch from serverless API
// -------------------
async function fetchArticles(category = '', query = '') {
  try {
    const url = `/api/news?category=${category}&q=${query}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.articles || [];
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
}

// -------------------
// Render articles
// -------------------
function renderArticles(articles) {
  articlesContainer.innerHTML = '';
  if (!articles.length) {
    articlesContainer.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">No articles found.</p>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement('div');
    card.classList.add('news-card');

    card.innerHTML = `
      <img class="news-img" src="${article.image}" alt="Article Image">
      <h3 class="news-title">${article.title}</h3>
      <p class="news-desc">${article.description}</p>
      <a class="read-more" href="${article.url}" target="_blank">Read More</a>
    `;

    // Add click to track reading
    card.querySelector('.read-more').addEventListener('click', () => {
      addToHistory(article);
    });

    articlesContainer.appendChild(card);
  });
}

// -------------------
// Breaking news
// -------------------
async function loadBreakingNews() {
  breakingNewsEl.textContent = 'Loading...';
  const articles = await fetchArticles();
  if (articles.length) {
    breakingNewsEl.textContent = articles[0].title;
  } else {
    breakingNewsEl.textContent = 'No breaking news found.';
  }
}

// -------------------
// Search
// -------------------
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) return;
  articlesContainer.innerHTML = `<p style="text-align:center;">Searching...</p>`;
  const articles = await fetchArticles('', query);
  renderArticles(articles);
});

// -------------------
// Categories
// -------------------
categoryBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    const category = btn.dataset.category;
    articlesContainer.innerHTML = `<p style="text-align:center;">Loading ${category}...</p>`;
    const articles = await fetchArticles(category);
    renderArticles(articles);
  });
});

// -------------------
// Reading history / suggestions
// -------------------
function addToHistory(article) {
  readHistory.push(article);
  if (readHistory.length > 50) readHistory.shift(); // keep latest 50
  localStorage.setItem('neuronex_read_history', JSON.stringify(readHistory));
  renderSuggestions();
}

function renderSuggestions() {
  suggestionsContainer.innerHTML = '';
  if (!readHistory.length) return;

  // Pick 5 random articles from history
  const shuffled = readHistory.sort(() => Math.random() - 0.5).slice(0, 5);
  shuffled.forEach(article => {
    const div = document.createElement('div');
    div.classList.add('suggestion-card');
    div.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
    suggestionsContainer.appendChild(div);
  });
}

// -------------------
// Init
// -------------------
async function init() {
  await loadBreakingNews();
  const initialArticles = await fetchArticles();
  renderArticles(initialArticles);
  renderSuggestions();
}

init();