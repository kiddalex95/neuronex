// utils/storage.js
export function trackReading(articles) {
  const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
  articles.slice(0, 3).forEach(a => {
    if (!history.includes(a.source.name)) history.push(a.source.name);
  });
  localStorage.setItem('readingHistory', JSON.stringify(history));
}

export function getReadingHistory() {
  return JSON.parse(localStorage.getItem('readingHistory') || '[]');
}