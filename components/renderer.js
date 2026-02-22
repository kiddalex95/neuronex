export function renderArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  if (!articles.length) {
    container.innerHTML = `<p style="text-align:center;">No articles to display.</p>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement('div');
    card.classList.add('article-card');
    card.style.transition = 'transform 0.3s, box-shadow 0.3s';
    card.style.borderRadius = '15px';
    card.style.overflow = 'hidden';
    card.style.cursor = 'pointer';
    card.style.background = '#1e1e1e';
    card.style.color = '#fff';
    card.style.margin = '20px auto';
    card.style.maxWidth = '800px';
    card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.02)';
      card.style.boxShadow = '0 15px 40px rgba(0,0,0,0.5)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
      card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    });

    const img = document.createElement('img');
    img.src = article.image;
    img.style.width = '100%';
    img.style.height = 'auto';
    card.appendChild(img);

    const content = document.createElement('div');
    content.style.padding = '15px 20px';

    const title = document.createElement('h2');
    title.innerText = article.title;
    title.style.fontFamily = "'Orbitron', sans-serif";
    title.style.fontSize = '1.6rem';
    title.style.marginBottom = '10px';
    content.appendChild(title);

    const desc = document.createElement('p');
    desc.innerText = article.description;
    desc.style.fontFamily = "'Roboto', sans-serif";
    desc.style.fontSize = '1rem';
    desc.style.opacity = '0.85';
    content.appendChild(desc);

    const meta = document.createElement('div');
    meta.style.display = 'flex';
    meta.style.justifyContent = 'space-between';
    meta.style.marginTop = '10px';
    meta.style.fontSize = '0.85rem';
    meta.style.opacity = '0.7';

    const source = document.createElement('span');
    source.innerText = article.source;
    meta.appendChild(source);

    const category = document.createElement('span');
    category.innerText = article.category;
    category.style.fontWeight = 'bold';
    meta.appendChild(category);

    content.appendChild(meta);

    card.addEventListener('click', () => window.open(article.url, '_blank'));

    card.appendChild(content);
    container.appendChild(card);

    // Fade-in animation
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease-out';
      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';
    }, 100);
  });
}