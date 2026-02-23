export default async function handler(req, res) {
  try {
    const { category, q } = req.query;

    const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
    const GNEWS_KEY = process.env.GNEWS_KEY;
    const WORLDNEWS_KEY = process.env.WORLDNEWS_KEY;

    const urls = [
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${NEWSAPI_KEY}${category ? `&category=${category}` : ''}${q ? `&q=${q}` : ''}`,
      `https://gnews.io/api/v4/top-headlines?country=us&max=10&apikey=${GNEWS_KEY}${category ? `&topic=${category}` : ''}${q ? `&q=${q}` : ''}`,
      `https://worldnewsapi.com/api/news?country=us&number=10&apikey=${WORLDNEWS_KEY}${category ? `&category=${category}` : ''}${q ? `&q=${q}` : ''}`
    ];

    const responses = await Promise.all(
      urls.map(url =>
        fetch(url).then(r => r.json()).catch(() => null)
      )
    );

    let articles = [];

    responses.forEach(data => {
      if (!data) return;

      const items = data.articles || data.news || [];

      items.forEach(a => {
        articles.push({
          title: a.title || a.heading || "No title",
          description: a.description || a.content || "",
          url: a.url || "#",
          image:
            a.urlToImage ||
            a.image ||
            a.imageUrl ||
            "https://via.placeholder.com/300x180?text=News"
        });
      });
    });

    res.status(200).json({ articles });

  } catch (err) {
    res.status(500).json({ articles: [] });
  }
}