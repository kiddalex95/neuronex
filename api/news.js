const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const GNEWS_KEY = process.env.GNEWS_KEY;
const WORLDNEWS_KEY = process.env.WORLDNEWS_KEY;

export async function fetchAllNews() {
  const endpoints = [
    `https://newsapi.org/v2/top-headlines?language=en&pageSize=50&apiKey=${NEWSAPI_KEY}`,
    `https://gnews.io/api/v4/top-headlines?lang=en&max=50&token=${GNEWS_KEY}`,
    `https://worldnewsapi.com/api/v1/news?language=en&country=US&apiKey=${WORLDNEWS_KEY}`,
  ];

  let allArticles = [];

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) allArticles = allArticles.concat(data.articles);
      else if (data.news) allArticles = allArticles.concat(data.news);
    } catch (e) {
      console.error('API fetch error:', e);
    }
  }

  // Normalize articles
  allArticles = allArticles.map(article => {
    const content = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();

    let category = 'Misc';

    if (/sport|football|soccer|cricket|basketball|tennis|rugby|olympics/.test(content)) category = 'Sports';
    else if (/movie|film|hollywood|celebrity|actor|actress|blockbuster|series/.test(content)) category = 'Movies';
    else if (/economy|market|finance|stock|business|trade|currency|investment/.test(content)) category = 'Economy';
    else if (/government|president|parliament|minister|policy|law|politics|election/.test(content)) category = 'Government';
    else if (/gossip|rumor|scandal|celebrity|buzz|trending/.test(content)) category = 'Gossip';
    else category = 'Misc';

    return {
      title: article.title || article.headline || 'Untitled',
      description: article.description || article.content || '',
      url: article.url || article.link || '#',
      image: article.urlToImage || article.image || 'https://via.placeholder.com/800x400?text=No+Image',
      source: (article.source && article.source.name) || article.source || 'Unknown',
      category,
    };
  });

  return allArticles;
}