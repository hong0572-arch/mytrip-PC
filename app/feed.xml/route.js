import { getAllPosts } from '../../lib/markdown';

export async function GET() {
  const baseUrl = 'https://tripmaker.tips';
  
  // 마크다운 포스트들을 모두 불러옵니다.
  const posts = getAllPosts(['title', 'date', 'slug', 'description', 'language']);
  
  // 최근 20개 포스팅만 RSS에 노출
  const recentPosts = posts.slice(0, 20);

  const rssItemsXml = recentPosts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date || new Date()).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      <language>${post.language || 'ko'}</language>
    </item>`;
    })
    .join('');

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TripMaker Blog Feed</title>
    <link>${baseUrl}/blog</link>
    <description>AI secure travel itineraries & solo female travel tips</description>
    <language>ko-kr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItemsXml}
  </channel>
</rss>`;

  return new Response(rssFeedXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
