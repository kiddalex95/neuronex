import { initThemeToggle } from './components/theme.js';
initThemeToggle();

const breakingNewsEl = document.getElementById('breaking-news');
const articlesContainer = document.getElementById('articles-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryBtns = document.querySelectorAll('.cat-btn');
const suggestionsContainer = document.getElementById('suggestions-container');

// YOUR API KEYS (directly used)
const NEWSAPI_KEY = 'a29a4b120e864fa9830f0c74ee9f77b9';
const GNEWS_KEY = '3e44763ba8bf06cb0b515acda04fac0a';
const WORLDNEWS_KEY = '583edae9863343e994cbbd56e72147cb';

let readHistory = JSON.parse(localStorage.getItem('neuronex_read_history')) || [];

// -------------------
// Helper: fetch from a single API
// -------------------
async function fetchFromAPI(url, mapper) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data) return [];
    return (data.articles || []).map(mapper).filter(a => a.title && a.url);
  } catch (err) {
    console.error('API fetch error:', err);
    return [];
  }
}

// -------------------
// Fetch all articles
// -------------------
async function fetchArticles(category = '', query = '') {
  const newsapiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWSAPI_KEY}${category ? `&category=${category}` : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
  const gnewsUrl = `https://gnews.io/api/v4/top-headlines?country=us&apikey=${GNEWS_KEY}${category ? `&topic=${category}` : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
  const worldUrl = `https://worldnewsapi.com/api/news?country=us&apikey=${WORLDNEWS_KEY}${category ? `&category=${category}` : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`;

  // Map all APIs to unified format
  const newsapiMapper = a => ({
    title: a.title,
    description: a.description,
    url: a.url,
    image: a.urlToImage || 'https://via.placeholder.com/300x180?text=No+Image'
  });

  const gnewsMapper = a => ({
    title: a.title,
    description: a.description || a.content,
    url: a.url,
    image: a.image || 'https://via.placeholder.com/300x180?text=No+Image'
  });

  const worldMapper = a => ({
    title: a.heading || a.title,
    description: a.content || a.description,
    url: a.url,
    image: a.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'
  });

  const [newsapiArticles, gnewsArticles, worldArticles] = await Promise.all([
    fetchFromAPI(newsapiUrl, newsapiMapper),
    fetchFromAPI(gnewsUrl, gnewsMapper),
    fetchFromAPI(worldUrl, worldMapper)
  ]);

  let articles = [...newsapiArticles, ...gnewsArticles, ...worldArticles];

  // Shuffle
  articles = articles.sort(() => Math.random() - 0.5);

  // Fallback placeholders if empty
  if (!articles.length) {
    articles = Array.from({ length: 6 }, (_, i) => ({
      title: `Placeholder Article ${i + 1}`,
      description: 'This is a placeholder article while real news loads.',
      url: '#',
      image: 'https://via.placeholder.com/300x180?text=News+Placeholder'
    }));
  }

  return articles;
}

// -------------------
// Render articles
// -------------------
function renderArticles(articles) {
  articlesContainer.innerHTML = '';
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
// Suggestions engine
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