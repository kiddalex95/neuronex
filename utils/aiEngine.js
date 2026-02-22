export function getSuggestions(articles) {
  const history = JSON.parse(localStorage.getItem("history")) || [];

  return articles.filter(article =>
    history.some(h => article.title.includes(h.split(" ")[0]))
  ).slice(0,3);
}