const STORAGE_KEY = 'neuronex_reading_patterns';

export function trackReading(articles) {
  if (!articles?.length) return;

  const patterns = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  articles.forEach(article => {
    const category = article.category || 'Misc';
    patterns[category] = (patterns[category] || 0) + 1;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
}

export function getTopCategories(limit = 3) {
  const patterns = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const sorted = Object.entries(patterns).sort((a,b) => b[1]-a[1]);
  return sorted.slice(0, limit).map(([category]) => category);
}