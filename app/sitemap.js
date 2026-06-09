import { getAllPosts } from '../lib/markdown';

export default function sitemap() {
  const baseUrl = 'https://tripmaker.tips';

  // 로컬 마크다운 포스트들을 모두 불러옵니다.
  const posts = getAllPosts(['slug', 'date']);
  
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 정적 기본 페이지 (메인 랜딩, 블로그 목록, 약관 등)
  const routes = ['', '/blog', '/support', '/terms', '/privacy'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/blog' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.9,
  }));

  return [...routes, ...blogUrls];
}
