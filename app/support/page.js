"use client";

import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Phone, Clock, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

export default function Support() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("tripmaker@tripmaker.tips");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-100 break-keep overflow-x-hidden">
      {/* 🌌 Premium Liquid Aura & Dot-Mesh Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] aspect-square bg-blue-200/25 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] aspect-square bg-sky-200/20 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '14s' }} />
        
        {/* Technical Blueprint Map Grid */}
        <div className="absolute inset-0 opacity-[0.22] mix-blend-multiply" style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between z-10 relative">
        <a href="/" className="flex items-center gap-2 group text-slate-600 hover:text-slate-900 font-bold transition-all text-sm">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>메인으로 돌아가기</span>
        </a>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-[48px] md:h-[56px] object-contain" />
          <span className="font-extrabold text-3xl md:text-4xl tracking-tight text-slate-800">AI</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 pt-10 pb-24 relative z-10">

        {/* Welcome Glass Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-slate-200/50 shadow-2xl mb-12 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
            <Sparkles size={12} fill="currentColor" /> 24h Active
          </div>
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 text-white">
            <MessageSquare size={36} fill="currentColor" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight leading-tight">
            트립메이커 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">고객센터</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            여행 계획 생성 에러, 동행 매칭 관련 건의 사항, 비즈니스 제휴 등 <br />
            트립메이커 이용 중 생기신 어떠한 의문도 친절하게 해결해 드리겠습니다.
          </p>
        </div>

        {/* Support Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* Kakao Talk Support */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
            <div>
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600 font-bold text-xl">
                💬
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">카카오톡 1:1 빠른 문의</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                카카오톡 플러스 친구 <strong>'트립메이커'</strong> 채널을 추가하시면 상담원과 1:1 대화 방식으로 오류 해결 접수 및 피드백을 실시간으로 주고받으실 수 있습니다.
              </p>
            </div>
            <a
              href="https://pf.kakao.com/_xxxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-black py-4 rounded-2xl text-center shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              카카오톡 실시간 상담 열기
            </a>
          </div>

          {/* Email Support */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                <Mail size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">이메일 온라인 문의</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                공식 기술 지원 이메일을 통해 화면 에러 덤프 파일이나 정산 내역 영수증 등의 스크린샷 캡쳐본을 첨부하여 상세하게 문의해 주시면 정밀 기술팀이 빠르게 조치해 드립니다.
              </p>
            </div>
            <button
              onClick={copyEmail}
              className={`w-full font-black py-4 rounded-2xl text-center shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border ${copied ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600' : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'}`}
            >
              {copied ? <CheckCircle size={18} /> : <Mail size={18} />}
              {copied ? '이메일 주소 복사 완료!' : 'tripmaker@tripmaker.tips 복사'}
            </button>
          </div>

        </div>

        {/* Operating Hours Info */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-6 justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900 mb-1">상담 및 업무 운영 시간</h4>
              <p className="text-slate-500 font-medium text-sm">영업일 기준 주말 및 공휴일을 제외한 평일에 운영됩니다.</p>
            </div>
          </div>
          <div className="flex flex-col items-end text-right shrink-0">
            <div className="font-black text-slate-900 text-lg">평일 오전 9:00 - 오후 6:00</div>
            <div className="text-xs font-bold text-slate-400 mt-1">점심 시간: 12:00 - 13:00 (KST)</div>
          </div>
        </div>

        {/* Quick FAQ Tip */}
        <div className="bg-slate-100 rounded-[28px] p-6 border border-slate-200/50 flex gap-4 items-start">
          <AlertCircle className="text-slate-500 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            자주 묻는 질문(FAQ)에 대한 답변은 서비스 하단의 <strong>[자주 묻는 질문]</strong> 영역에서 바로 확인하실 수 있습니다. 로그인 및 정산, 항공권 매칭 등의 기본적인 사용법은 90% 이상 즉시 해소 가능합니다.
          </p>
        </div>

      </main>
    </div>
  );
}
