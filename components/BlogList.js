"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogList({ posts }) {
  // 기본 선택 언어는 로컬스토리지에 저장된 사용자의 사이트 언어 설정을 따르거나 기본값 'ko'로 설정
  const [selectedLang, setSelectedLang] = useState('ko');

  useEffect(() => {
    // 클라이언트 사이드에서 사용자의 언어 세팅 상태 감지
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang') || 'ko';
      setSelectedLang(savedLang);
    }
  }, []);

  // posts에 language 속성이 정의되어 있지 않으면 하위 호환성을 위해 'ko'로 처리
  const filteredPosts = posts.filter(post => {
    const postLang = post.language || 'ko';
    return postLang === selectedLang;
  });

  return (
    <div>
      {/* 🔮 Premium Tab Control */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 border border-slate-200/50 relative shadow-inner">
          <button
            onClick={() => setSelectedLang('ko')}
            className={`px-6 py-2.5 rounded-xl font-black text-sm tracking-tight transition-all duration-300 relative z-10 ${
              selectedLang === 'ko' ? 'text-rose-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {selectedLang === 'ko' && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-white rounded-xl shadow-md border border-slate-200/30 z-[-1]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            🇰🇷 한국어 포스팅
          </button>
          
          <button
            onClick={() => setSelectedLang('en')}
            className={`px-6 py-2.5 rounded-xl font-black text-sm tracking-tight transition-all duration-300 relative z-10 ${
              selectedLang === 'en' ? 'text-rose-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {selectedLang === 'en' && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-white rounded-xl shadow-md border border-slate-200/30 z-[-1]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            🇺🇸 English Posts
          </button>
        </div>
      </div>

      {/* 🗂 Grid with Interactive Motion */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
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
                        {selectedLang === 'ko' ? '글 읽기' : 'Read Post'} &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center text-slate-400 font-semibold"
            >
              {selectedLang === 'ko' ? '등록된 포스팅이 없습니다.' : 'No posts found in this language.'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
