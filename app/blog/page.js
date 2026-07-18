import Link from 'next/link';
import { getAllPosts } from '../../lib/markdown';
import BlogList from '../../components/BlogList';

export const metadata = {
  title: '트립메이커 블로그 | TripMaker Blog',
  description: '혼자 떠나는 여성 여행자를 위한 트립메이커 실전 활용법과 유용한 여행 팁을 만나보세요.',
};

export default function BlogIndex() {
  const posts = getAllPosts(['title', 'date', 'slug', 'description', 'coverImage', 'tags', 'language']);

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-slate-50 selection:bg-blue-100 overflow-x-hidden">
      {/* 🌌 Premium Liquid Auras Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-15%] w-[60%] aspect-square bg-sky-200/30 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] right-[-15%] w-[60%] aspect-square bg-indigo-200/30 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '14s' }} />
      </div>

      <header className="w-full p-4 md:px-8 flex justify-between items-center z-[100] relative bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logotm.png" alt="Logo" className="h-[48px] md:h-[56px] object-contain" />

        </Link>
        <nav className="flex items-center gap-6 text-slate-800 font-bold text-sm">
          <Link href="/" className="hover:text-blue-600 transition">홈으로</Link>
          <Link href="/blog" className="text-blue-600 border-b-2 border-blue-600 pb-1">블로그</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20 z-10 relative flex-1 w-full">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            트립메이커 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">블로그</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">여성 여행자를 위한 실전 활용법과 꿀팁 모음집 (AI Editor Hub)</p>
        </div>

        {/* Dynamic Interactive Blog List with Language Filter */}
        <BlogList posts={posts} />
      </main>

      <footer className="bg-slate-50/70 backdrop-blur-md border-t border-slate-200 pt-16 pb-8 w-full relative z-10">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm font-bold text-slate-400">
          © 2026 TripMaker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
