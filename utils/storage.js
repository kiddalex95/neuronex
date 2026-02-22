// storage.js
// Save user reading patterns in localStorage
const STORAGE_KEY = 'neuronex_reading_patterns';

export function trackReading(articles) {
  if (!articles?.length) return;

  // Load existing patterns
  const patterns = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  articles.forEach(article => {
    // For simplicity, track by category
    const category = article.category || 'Misc';
    patterns[category] = (patterns[category] || 0) + 1;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
}

// Get top read categories
export function getTopCategories(limit = 3) {
  const patterns = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const sorted = Object.entries(patterns).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, limit).map(([category]) => category);
}