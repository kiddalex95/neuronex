export function renderArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = ''; // Clear old articles

  articles.forEach(article => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.style.cssText = `
      width:300px;
      background:var(--card-bg);
      border-radius:15px;
      overflow:hidden;
      box-shadow:0 8px 20px rgba(0,0,0,0.3);
      transition:transform 0.3s, box-shadow 0.3s, background 0.5s;
      cursor:pointer;
      display:flex;
      flex-direction:column;
    `;

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
      card.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
      card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
    });

    // Image
    const img = document.createElement('img');
    img.src = article.image;
    img.alt = article.title;
    img.style.width = '100%';
    img.style.height = '180px';
    img.style.objectFit = 'cover';
    card.appendChild(img);

    // Content container
    const content = document.createElement('div');
    content.style.padding = '15px';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.flex = '1';

    // Title
    const title = document.createElement('h3');
    title.textContent = article.title;
    title.style.margin = '0 0 10px 0';
    title.style.fontSize = '1.1rem';
    title.style.color = 'var(--text-color)';
    title.style.flex = '0';
    content.appendChild(title);

    // Description
    const desc = document.createElement('p');
    desc.textContent = article.description.slice(0, 120) + '...';
    desc.style.margin = '0 0 10px 0';
    desc.style.fontSize = '0.9rem';
    desc.style.color = 'var(--secondary-color)';
    desc.style.flex = '1';
    content.appendChild(desc);

    // Source & Read more
    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.justifyContent = 'space-between';
    footer.style.alignItems = 'center';
    footer.style.marginTop = 'auto';

    const source = document.createElement('span');
    source.textContent = article.source;
    source.style.fontSize = '0.8rem';
    source.style.color = 'var(--accent-color)';
    footer.appendChild(source);

    const readMore = document.createElement('a');
    readMore.href = article.url;
    readMore.target = '_blank';
    readMore.textContent = 'Read';
    readMore.style.fontWeight = 'bold';
    readMore.style.color = 'var(--accent-color)';
    readMore.style.textDecoration = 'none';
    footer.appendChild(readMore);

    content.appendChild(footer);
    card.appendChild(content);
    container.appendChild(card);
  });
}