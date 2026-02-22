// components/renderer.js
export function renderArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  articles.forEach(article => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <img src="${article.urlToImage || 'textures/default.jpg'}" alt="image" class="news-img">
      <h3 class="news-title">${article.title}</h3>
      <p class="news-desc">${article.description || ''}</p>
      <a href="${article.url}" target="_blank" class="read-more">Read More</a>
    `;
    container.appendChild(card);
  });
}