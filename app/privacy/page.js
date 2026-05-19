"use client";

import React from 'react';
import { ArrowLeft, Lock, ShieldCheck, Heart } from 'lucide-react';

export default function Privacy() {
  const provisions = [
    {
      title: "1. 수집하는 개인정보 항목 및 수집 방법",
      desc: "회사는 회원 가입 시 소셜 간편 로그인(카카오, 구글)을 통해 기본 식별 키값, 프로필 닉네임, 프로필 이미지 URL 정보를 수집합니다. 또한, AI 기반 정교한 여행지 추천과 주변 명소 추천을 위해 이용자가 명시적으로 허용한 위치 정보(GPS)와 여행 검색 목적지 키워드를 실시간 수집할 수 있습니다."
    },
    {
      title: "2. 개인정보의 이용 목적 및 파기 조건",
      desc: "수집한 정보는 '초개인화 맞춤형 일정 생성', '동행자 매칭을 위한 선호도 분석', 및 '1/N 자동 정산 푸시 알림 발송' 등의 목적으로만 활용됩니다. 목적 달성 후 혹은 회원이 서비스 탈퇴를 요청하는 즉시 해당 정보는 복구 불가능한 형태로 완전 파기 및 데이터베이스 서버 내에서 완전 삭제됩니다."
    },
    {
      title: "3. 거대 인공지능(AI) 프롬프트 전송 시 비식별 조치",
      desc: "트립메이커는 여행 일정 및 경로를 생성하기 위해 OpenAI 및 Google Gemini API 서버에 프롬프트를 전송합니다. 이때 유저의 실명, 전화번호, 정산 계좌번호 등의 민감한 고유 식별 정보는 완벽하게 필터링하여 마스킹(비식별화) 처리한 뒤 전송하므로 안심하고 이용하셔도 좋습니다."
    },
    {
      title: "4. 안전성 확보를 위한 기술적 대책",
      desc: "1. 회원의 자산 정보(충전 잔액 및 내 지갑) 및 비밀번호 데이터는 군사 규격에 준하는 256비트 암호화 알고리즘으로 양방향 변환 불가능하게 해시 처리되어 보관됩니다.\n2. 실시간 동기화 데이터베이스(Firestore) 및 API 서버는 SSL/TLS 보안 프로토콜을 적용하여 해킹 및 패킷 스니핑으로부터 원천 방어하고 있습니다."
    },
    {
      title: "5. 이용자의 권리 및 연락처",
      desc: "이용자는 언제든지 본인의 개인정보 열람, 오류 수정 및 동의 철회(회원 탈퇴)를 요구할 수 있습니다. 개인정보 관리 및 정보 보호에 관해 의문점이 있거나 건의 사항이 있으신 경우, 공식 개인정보 처리 책임자 대리 이메일인 tripmaker@mytrip2.pro 로 연락해 주시면 성실히 처리해 드리겠습니다."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-100 break-keep overflow-x-hidden">
      {/* 🌌 Premium Liquid Aura & Dot-Mesh Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] aspect-square bg-emerald-200/25 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] aspect-square bg-blue-200/20 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '14s' }} />
        
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
          <img src="/logo.png" alt="Logo" className="h-6 object-contain" />
          <span className="font-extrabold text-lg text-slate-800 tracking-tight">AI</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-10 pb-24 relative z-10">

        {/* Title Glass Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-slate-200/50 shadow-2xl mb-12 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Lock size={24} />
            </div>
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-wider">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight leading-tight">
            개인정보 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">처리방침</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm">시행 일자: 2026년 5월 19일</p>
        </div>

        {/* Content Info Container */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-xl space-y-12 mb-12">

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 text-slate-600 font-medium text-sm leading-relaxed flex gap-4 items-start">
            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={24} />
            <div>
              <h4 className="font-black text-slate-900 mb-1">안심하고 여행에만 집중하세요!</h4>
              트립메이커는 회원의 프라이버시 보호를 최우선으로 생각합니다. 본 방침은 귀하의 소중한 위치 데이터 및 로그인 프로필 정보가 어떤 고도의 기술로 암호화 처리되며 보호받고 있는지 투명하게 소개합니다.
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Provision Items */}
          {provisions.map((item, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-teal-400 rounded-full shrink-0" />
                {item.title}
              </h3>
              <p className="text-slate-600 font-medium leading-loose text-base whitespace-pre-line pl-5">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

        {/* Footer Love */}
        <div className="bg-slate-100 rounded-[28px] p-6 border border-slate-200/50 flex gap-4 items-center justify-between flex-col md:flex-row text-center md:text-left">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
              <Heart size={14} fill="currentColor" />
            </div>
            <p className="text-sm text-slate-600 font-black">
              안전하고 믿을 수 있는 개인정보 관리로 더 즐거운 동행을 시작하세요.
            </p>
          </div>
          <a href="/" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap">
            동의 및 홈으로 가기
          </a>
        </div>

      </main>
    </div>
  );
}
