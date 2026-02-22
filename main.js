import { initThemeToggle } from './components/theme.js';
initThemeToggle();

const breakingNewsEl = document.getElementById('breaking-news');
const articlesContainer = document.getElementById('articles-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryBtns = document.querySelectorAll('.cat-btn');
const suggestionsContainer = document.getElementById('suggestions-container');

// Hard-coded API keys
const NEWSAPI_KEY = 'a29a4b120e864fa9830f0c74ee9f77b9';
const GNEWS_KEY = '3e44763ba8bf06cb0b515acda04fac0a';
const WORLDNEWS_KEY = '583edae9863343e994cbbd56e72147cb';

let readHistory = JSON.parse(localStorage.getItem('neuronex_read_history')) || [];

// -------------------
// Fetch articles from all 3 APIs
// -------------------
async function fetchArticles(category = '', query = '') {
  try {
    const urls = [
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWSAPI_KEY}${category ? `&category=${category}` : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`,
      `https://gnews.io/api/v4/top-headlines?country=us&apiKey=${GNEWS_KEY}${category ? `&topic=${category}` : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`,
      `https://worldnewsapi.com/api/news?country=us&apikey=${WORLDNEWS_KEY}${category ? `&category=${category}` : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`
    ];

    const responses = await Promise.all(urls.map(u => fetch(u)));
    const data = await Promise.all(responses.map(r => r.json()));

    let articles = [];

    data.forEach(d => {
      if (d.articles) {
        d.articles.forEach(a => {
          articles.push({
            title: a.title || a.heading || 'No title',
            description: a.description || a.content || 'No description',
            url: a.url,
            source: a.source?.name || a.source || 'Unknown',
            image: a.urlToImage || a.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'
          });
        });
      }
    });

    // Shuffle articles
    articles = articles.sort(() => Math.random() - 0.5);
    return articles;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// -------------------
// Render articles
// -------------------
function renderArticles(articles) {
  articlesContainer.innerHTML = '';
  if (!articles.length) {
    articlesContainer.innerHTML = `<p style="text-align:center; grid-column:1/-1;">No articles found.</p>`;
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
    card.querySelector('.read-more').addEventListener('click', () => addToHistory(article));
    articlesContainer.appendChild(card);
  });
}

// -------------------
// Breaking news
// -------------------
async function loadBreakingNews() {
  breakingNewsEl.textContent = 'Loading...';
  const articles = await fetchArticles();
  breakingNewsEl.textContent = articles[0]?.title || 'No breaking news found';
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
  if (readHistory.length > 50) readHistory.shift();
  localStorage.setItem('neuronex_read_history', JSON.stringify(readHistory));
  renderSuggestions();
}

function renderSuggestions() {
  suggestionsContainer.innerHTML = '';
  if (!readHistory.length) return;
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
  const articles = await fetchArticles();
  renderArticles(articles);
  renderSuggestions();
}

init();