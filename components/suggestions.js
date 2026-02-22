// components/suggestions.js
import { getReadingHistory } from '../utils/storage.js';

export function suggestArticles(articles) {
  const suggestionsContainer = document.getElementById('suggestions-container');
  suggestionsContainer.innerHTML = '';

  const history = getReadingHistory(); // Get most-read categories/topics

  const suggested = articles.filter(a => history.includes(a.source.name)).slice(0, 5);

  suggested.forEach(article => {
    const el = document.createElement('div');
    el.className = 'suggestion-card';
    el.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
    suggestionsContainer.appendChild(el);
  });
}