// api/news.js
export default async function handler(req, res) {
  try {
    const [newsAPI, worldNews, gNews] = await Promise.all([
      fetch(`https://newsapi.org/v2/top-headlines?language=en&apiKey=${process.env.NEWSAPI_KEY}`)
        .then(r => r.json()),
      fetch(`https://world-news1.p.rapidapi.com/news?rapidapi-key=${process.env.WORLDNEWS_KEY}`)
        .then(r => r.json()),
      fetch(`https://gnews.io/api/v4/top-headlines?lang=en&token=${process.env.GNEWS_KEY}`)
        .then(r => r.json()),
    ]);

    // Merge all articles
    let articles = [
      ...(newsAPI.articles || []),
      ...(worldNews.articles || []),
      ...(gNews.articles || []),
    ];

    // Shuffle for randomness
    articles.sort(() => Math.random() - 0.5);

    // Return top 50 articles (or all if less)
    res.status(200).json({ articles: articles.slice(0, 50) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news', details: err.message });
  }
}