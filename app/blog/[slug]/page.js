import { getPostBySlug, getAllPosts, markdownToHtml } from '../../../lib/markdown';
import Link from 'next/link';

export async function generateMetadata(props) {
  const params = await props.params;
  const post = getPostBySlug(params.slug, ['title', 'description', 'seoKeywords', 'coverImage']);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | 트립메이커 블로그`,
    description: post.description,
    keywords: post.seoKeywords,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.coverImage || '/hero_background.png' }],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts(['slug']);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost(props) {
  const params = await props.params;
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'content',
    'coverImage',
    'tags',
    'description',
    'language'
  ]);

  if (!post) {
    return <div>Post not found</div>;
  }

  const contentHtml = await markdownToHtml(post.content || '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage || 'https://tripmaker.tips/hero_background.png',
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'TripMaker',
    },
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-rose-100 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <header className="w-full p-4 md:px-8 flex justify-between items-center z-[100] relative bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-[28px] md:h-8 object-contain" />
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">AI</span>
        </Link>
        <nav className="flex items-center gap-6 text-slate-800 font-bold text-sm">
          <Link href="/blog" className="hover:text-rose-500 transition">
            {post.language === 'en' ? '← Back to List' : '← 목록으로'}
          </Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 w-full flex-1">
        <div className="mb-8">
          <div className="flex gap-2 mb-6 flex-wrap">
            {post.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-rose-50 text-rose-500 text-xs font-black rounded-full tracking-wide">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center text-slate-500 font-medium text-sm">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.language === 'en' ? 'TripMaker Editor' : '트립메이커 에디터'}</span>
          </div>
        </div>

        {post.coverImage && (
          <div className="w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-12 shadow-xl">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Custom Styled Markdown Content */}
        <article 
          className="max-w-none text-slate-700 leading-loose text-lg font-medium space-y-6
          [&>h2]:text-2xl [&>h2]:font-black [&>h2]:text-slate-900 [&>h2]:mt-12 [&>h2]:mb-4
          [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-8 [&>h3]:mb-3
          [&>p]:mb-6
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-6
          [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:mb-6
          [&>blockquote]:border-l-4 [&>blockquote]:border-rose-400 [&>blockquote]:bg-rose-50 [&>blockquote]:py-3 [&>blockquote]:px-6 [&>blockquote]:rounded-r-xl [&>blockquote]:text-slate-800 [&>blockquote]:mb-6 [&>blockquote]:font-bold
          [&>a]:text-rose-500 [&>a]:underline hover:[&>a]:text-rose-600
          [&>strong]:text-slate-900 [&>strong]:font-black"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8 w-full mt-auto">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm font-bold text-slate-400">
          © 2026 TripMaker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
