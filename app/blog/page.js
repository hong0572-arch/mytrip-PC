import Link from 'next/link';
import { getAllPosts } from '../../lib/markdown';

export const metadata = {
  title: '트립메이커 블로그 | TripMaker Blog',
  description: '혼자 떠나는 여성 여행자를 위한 트립메이커 실전 활용법과 유용한 여행 팁을 만나보세요.',
};

export default function BlogIndex() {
  const posts = getAllPosts(['title', 'date', 'slug', 'description', 'coverImage', 'tags']);

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-slate-50 selection:bg-rose-100 overflow-x-hidden">
      {/* 🌌 Premium Liquid Auras Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-15%] w-[60%] aspect-square bg-rose-200/30 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] right-[-15%] w-[60%] aspect-square bg-indigo-200/30 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '14s' }} />
      </div>

      <header className="w-full p-4 md:px-8 flex justify-between items-center z-[100] relative bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-[28px] md:h-8 object-contain" />
          <span className="font-extrabold text-2xl tracking-tight text-slate-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)]">AI</span>
        </Link>
        <nav className="flex items-center gap-6 text-slate-800 font-bold text-sm">
          <Link href="/" className="hover:text-rose-500 transition">홈으로</Link>
          <Link href="/blog" className="text-rose-500 border-b-2 border-rose-500 pb-1">블로그</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20 z-10 relative flex-1 w-full">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            트립메이커 <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">블로그</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">여성 여행자를 위한 실전 활용법과 꿀팁 모음집</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
              <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="w-full h-48 bg-slate-200 relative overflow-hidden">
                  <img 
                    src={post.coverImage || '/hero_background.png'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                    {post.tags?.slice(0, 4).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs font-bold text-rose-500 mb-2">{post.date}</p>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-rose-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {post.description}
                  </p>
                  <span className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    글 읽기 &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-slate-50/70 backdrop-blur-md border-t border-slate-200 pt-16 pb-8 w-full relative z-10">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm font-bold text-slate-400">
          © 2026 TripMaker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
