"use client";

import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Check } from 'lucide-react';

export default function Terms() {
  const sections = [
    {
      title: "제 1 조 (목적)",
      content: "본 약관은 트립메이커(이하 '회사' 또는 '서비스')가 제공하는 웹 사이트(mytrip2.pro) 및 안드로이드 모바일 어플리케이션(이하 '서비스')을 통해 제공하는 여행 AI 최적화 동선 계획, 동행 매칭, 1/N 정산 요청 모임통장, 및 기타 부가 서비스의 이용 조건 및 절차에 관한 기본적인 사항을 규정함을 목적으로 합니다."
    },
    {
      title: "제 2 조 (용어의 정의)",
      content: "1. '회원'이라 함은 본 약관에 동의하고 카카오톡 간편 로그인을 통해 서비스를 이용하는 모든 이용자를 말합니다.\n2. '동행자 그룹'이라 함은 생성된 고유 여행 링크를 카카오톡 혹은 클립보드 복사를 통해 공유하여 실시간으로 일정을 편집하고 소통하는 가상의 팀 아지트를 뜻합니다.\n3. '트립포인트 및 트립머니'라 함은 마이페이지 충전 탭을 통해 적립, 충전 및 실시간 환전 결제용으로 연동되는 인앱 데이터를 의미합니다."
    },
    {
      title: "제 3 조 (약관의 효력 및 변경)",
      content: "1. 본 약관은 회원이 회원가입 혹은 서비스 이용을 시작함으로써 효력이 발생하며 서비스 내에 공지됩니다.\n2. 회사는 관계 법령에 위배되지 않는 범위 내에서 본 약관을 개정할 수 있으며, 개정된 약관은 적용일자 7일 전부터 서비스 내에 공지사항을 통해 고지합니다."
    },
    {
      title: "제 4 조 (AI 제공 정보에 대한 면책사항)",
      content: "1. 본 서비스에서 제공하는 여행 경로, 관광지 추천, 예상 이동 시간, 및 항공권/호텔 매칭 최저가 정보는 거대언어모델(LLM - Gemini 및 GPT) 및 제휴 파트너(Klook, Trip.com) API 데이터를 기반으로 한 참고용 정보입니다.\n2. 회사는 AI가 생성한 경로의 완전한 무결성, 도로 상황에 따른 실제 소요 시간의 절대적인 정확성을 보증하지 않으며, 현지 기상 이변이나 관광지 임시 휴업 등으로 발생한 일정 차질에 대해 법적인 책임을 지지 않습니다. 여행자는 출발 전 현지 정보를 별도로 확인해야 합니다."
    },
    {
      title: "제 5 조 (동행 매칭 및 소셜 네트워킹)",
      content: "1. 동행 매칭 센터 및 소셜 피드 등록 시 유저는 개인의 프로필 및 매칭 정보를 솔직하게 기록해야 합니다.\n2. 동행 그룹 내에서 발생하는 유저 간의 자발적 송금, 합의되지 않은 비용 체납, 폭언 및 비신사적인 행동에 대해 서비스는 일절 개입하지 않으며, 당사자 간의 해결을 원칙으로 합니다. 불건전한 유저는 서비스 모니터링을 통해 사전 통보 없이 계정 정지 조치될 수 있습니다."
    },
    {
      title: "제 6 조 (PWA 및 로컬 뱅크/Vault 오프라인 캐싱)",
      content: "1. 본 서비스는 오프라인 환경(기내, 네트워크 불통 지역 등)에서도 부드러운 구동을 지원하기 위해 Service Worker 기술을 통한 디바이스 내 오프라인 저장소(IndexedDB 및 LocalStorage, 이하 '보관함(Vault)')를 적극적으로 이용합니다.\n2. 디바이스의 쿠키나 오프라인 캐시 초기화 작업을 실행할 경우, 로컬에 단독 저장된 탑승권 바코드 스크린샷이나 백업되지 않은 오프라인 메모 정보가 삭제될 수 있으며 회사는 이를 복구할 책임이 없습니다."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-100 break-keep overflow-x-hidden">
      {/* 🌌 Premium Liquid Aura & Dot-Mesh Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] aspect-square bg-indigo-200/25 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square bg-pink-200/20 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '14s' }} />
        
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
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <FileText size={24} />
            </div>
            <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-wider">Terms of Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight leading-tight">
            서비스 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">이용약관</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm">최종 개정일: 2026년 5월 19일</p>
        </div>

        {/* Legal Sections */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-xl space-y-12 mb-12">
          
          {/* Preface */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 text-slate-600 font-medium text-sm leading-relaxed">
            트립메이커 AI 서비스를 이용해 주셔서 진심으로 감사드립니다. 본 이용약관은 서비스를 이용하는 과정에서 발생하는 권리와 책임, 그리고 서비스 이용을 위한 기본적인 규범들을 아주 투명하게 공개하고 설명하고 있습니다. 서비스를 계속 이용하시는 경우, 본 약관 전체에 동의하시는 것으로 간주됩니다.
          </div>

          <hr className="border-slate-100" />

          {/* Section Items */}
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-rose-500 rounded-full shrink-0" />
                {section.title}
              </h3>
              <p className="text-slate-600 font-medium leading-loose text-base whitespace-pre-line pl-5">
                {section.content}
              </p>
            </div>
          ))}

        </div>

        {/* Accept notice */}
        <div className="bg-slate-100 rounded-[28px] p-6 border border-slate-200/50 flex gap-4 items-center justify-between flex-col md:flex-row text-center md:text-left">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check size={18} />
            </div>
            <p className="text-sm text-slate-600 font-black">
              트립메이커는 회원의 안전하고 신뢰할 수 있는 스마트 여행 환경을 책임집니다.
            </p>
          </div>
          <a href="/" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap">
            약관 동의하고 시작하기
          </a>
        </div>

      </main>
    </div>
  );
}
