import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const { category, q } = req.query;

    // Your environment variables
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY;   // NewsAPI.org
    const GNEWS_KEY = process.env.GNEWS_KEY;       // GNews
    const WORLDNEWS_KEY = process.env.WORLDNEWS_KEY; // World News API

    // Helper to build URL with category and query
    const buildUrl = (base, key) => {
      let url = base;
      if (category) url += `&category=${category}`;
      if (q) url += `&q=${encodeURIComponent(q)}`;
      url += `&apikey=${key}`; // for GNews & WorldNews
      return url;
    };

    // NewsAPI.org
    const newsapiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWSAPI_KEY}`;
    // GNews
    const gnewsUrl = `https://gnews.io/api/v4/top-headlines?country=us`;
    // World News API
    const worldUrl = `https://worldnewsapi.com/api/news?country=us`;

    const urls = [
      { url: newsapiUrl, key: NEWSAPI_KEY, type: 'newsapi' },
      { url: gnewsUrl, key: GNEWS_KEY, type: 'gnews' },
      { url: worldUrl, key: WORLDNEWS_KEY, type: 'world' },
    ];

    // Fetch all APIs in parallel
    const responses = await Promise.all(
      urls.map(u => fetch(buildUrl(u.url, u.key)))
    );
    const data = await Promise.all(responses.map(r => r.json()));

    // Merge and normalize articles
    let articles = [];
    data.forEach(d => {
      if (d.articles) {
        d.articles.forEach(a => {
          articles.push({
            title: a.title || a.heading || 'No title',
            description: a.description || a.content || 'No description',
            url: a.url,
            source: a.source?.name || a.source || 'Unknown',
            image: a.urlToImage || a.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'
          });
        });
      }
    });

    // Shuffle for God Mode randomness
    articles = articles.sort(() => Math.random() - 0.5);

    res.status(200).json({ articles });
  } catch (err) {
    console.error('News API fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}