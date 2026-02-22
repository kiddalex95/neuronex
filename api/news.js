// api/news.js
export default async function handler(req, res) {
  try {
    // API keys from environment variables (Vercel)
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
    const GNEWS_KEY = process.env.GNEWS_KEY;
    const WORLDNEWS_KEY = process.env.WORLDNEWS_KEY;

    let articles = [];

    // ---------------------
    // 1. NEWSAPI.org
    // ---------------------
    try {
      const newsApiRes = await fetch(
        `https://newsapi.org/v2/top-headlines?language=en&pageSize=50&apiKey=${NEWSAPI_KEY}`
      );
      const newsApiData = await newsApiRes.json();
      if (newsApiData.articles?.length) {
        articles.push(
          ...newsApiData.articles.map(a => ({
            title: a.title,
            description: a.description,
            url: a.url,
            image: a.urlToImage,
            source: a.source.name
          }))
        );
      }
    } catch (e) {
      console.warn('NEWSAPI failed', e);
    }

    // ---------------------
    // 2. GNews
    // ---------------------
    try {
      const gnewsRes = await fetch(
        `https://gnews.io/api/v4/top-headlines?lang=en&max=50&token=${GNEWS_KEY}`
      );
      const gnewsData = await gnewsRes.json();
      if (gnewsData.articles?.length) {
        articles.push(
          ...gnewsData.articles.map(a => ({
            title: a.title,
            description: a.description,
            url: a.url,
            image: a.image,
            source: a.source.name
          }))
        );
      }
    } catch (e) {
      console.warn('GNEWS failed', e);
    }

    // ---------------------
    // 3. World News API
    // ---------------------
    try {
      const worldRes = await fetch(
        `https://world-news-api.herokuapp.com/api/news?apiKey=${process.env.WORLDNEWS_KEY}`
      );
      const worldData = await worldRes.json();
      if (worldData.articles?.length) {
        articles.push(
          ...worldData.articles.map(a => ({
            title: a.title,
            description: a.description,
            url: a.url,
            image: a.image,
            source: a.source
          }))
        );
      }
    } catch (e) {
      console.warn('World News API failed', e);
    }

    // ---------------------
    // 4. NORMALIZE CATEGORIES
    // ---------------------
    articles = articles.map(article => {
      const title = (article.title || '').toLowerCase();
      let category = 'Misc';

      if (/sport|football|soccer|cricket|basketball/.test(title)) category = 'Sports';
      else if (/movie|film|hollywood|celebrity|celebr/.test(title)) category = 'Movies';
      else if (/economy|market|finance|stock/.test(title)) category = 'Economy';
      else if (/government|president|parliament|minister/.test(title)) category = 'Government';
      else if (/gossip|rumor|scandal|celebr/.test(title)) category = 'Gossip';

      return { ...article, category };
    });

    // ---------------------
    // 5. RANDOMIZE ARTICLES
    // ---------------------
    articles = articles.sort(() => Math.random() - 0.5);

    res.status(200).json({ articles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ articles: [] });
  }
}