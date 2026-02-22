import { getTopCategories } from '../utils/storage.js';
import { renderArticles } from './renderer.js';

export function suggestArticles(allArticles) {
  const suggestionsContainer = document.getElementById('suggestions-container');
  suggestionsContainer.innerHTML = '';

  if (!allArticles?.length) return;

  const topCategories = getTopCategories();

  let suggested = allArticles.filter(a => topCategories.includes(a.category));

  if (!suggested.length) suggested = allArticles.sort(() => Math.random() - 0.5).slice(0,5);
  else suggested = suggested.sort(() => Math.random() - 0.5).slice(0,5);

  suggested.forEach(article => {
    const card = document.createElement('div');
    card.classList.add('suggestion-card');
    card.style.margin = '10px 0';
    card.style.padding = '10px';
    card.style.background = '#2a2a2a';
    card.style.color = '#fff';
    card.style.borderRadius = '10px';
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.3s, box-shadow 0.3s';

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
      card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
      card.style.boxShadow = '';
    });

    card.innerHTML = `
      <strong>${article.title}</strong>
      <p style="font-size:0.85rem; opacity:0.8;">${article.category} | ${article.source}</p>
    `;

    card.addEventListener('click', () => window.open(article.url, '_blank'));
    suggestionsContainer.appendChild(card);
  });
}