"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin, Search, User, Globe, ChevronRight,
  Calendar, Wallet, Users, MessageSquare, Sparkles,
  Star, Clock, Plane, Phone, Mail, Map, X, Mic, Crown, LogIn, Trash2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';

// 🌟 컴포넌트 임포트 (경로를 대표님 프로젝트에 맞게 확인해주세요)
import CatMascot from '../components/CatMascot';
import AIResult from '../components/AIResult';

// 🌟 Firebase 임포트
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";

// --- 상수 및 데이터 ---
const packageTours = [
  { id: 1, title: "오사카/교토/고베 3박 4일 풀패키지", desc: "시내 중심 4성급 호텔 숙박 + 벚꽃 명소 야간 라이트업 투어 포함", price: "499,000", originalPrice: "650,000", img: "https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=600&auto=format&fit=crop", tags: ["🔥마감임박", "출발확정"], rating: 4.8, reviews: 124 },
  { id: 2, title: "다낭/호이안 4박 5일 럭셔리 힐링", desc: "전 일정 5성급 리조트 (조식 포함) + 1일 1마사지 + 바나힐 케이블카", price: "649,000", originalPrice: "800,000", img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600&auto=format&fit=crop", tags: ["가족추천", "노팁/노옵션"], rating: 4.9, reviews: 312 },
  { id: 3, title: "서유럽 3국 8박 10일 (프/스/이)", desc: "에펠탑 뷰 레스토랑 디너 + 바티칸 하이패스 + 융프라우 산악열차", price: "2,890,000", originalPrice: "", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop", tags: ["프리미엄", "국적기직항"], rating: 4.7, reviews: 89 },
  { id: 4, title: "제주도 2박 3일 감성 버스투어", desc: "운전 걱정 없는 핫플 투어! 오름 트래킹 + 흑돼지 무제한 파티", price: "199,000", originalPrice: "250,000", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop", tags: ["국내여행", "2030전용"], rating: 4.9, reviews: 450 }
];

const companionOptions = [
  { id: '혼자', label: '나홀로' }, { id: '연인', label: '연인' },
  { id: '친구', label: '친구' }, { id: '가족', label: '가족' }, { id: '비즈니스', label: '출장' }
];

const themeTags = ["#힐링🌿", "#먹방🍖", "#호캉스🏨", "#액티비티🏄", "#커플여행💑", "#가성비💰"];

// 공항 주소록 & 안전한 검색기 (AI 환각 방지)
const CITY_TO_IATA = {
  "인천": "ICN", "서울": "ICN", "부산": "PUS", "제주": "CJU", "대구": "TAE", "청주": "CJJ",
  "오사카": "KIX", "도쿄": "NRT", "후쿠오카": "FUK", "삿포로": "CTS", "오키나와": "OKA",
  "다낭": "DAD", "나트랑": "CXR", "방콕": "BKK", "세부": "CEB", "발리": "DPS", "싱가포르": "SIN", "롬복": "LOP", "길리": "LOP",
  "파리": "CDG", "로마": "FCO", "런던": "LHR", "뉴욕": "JFK"
};

const findIataCode = (text) => {
  if (!text) return null;
  const lowerText = text.toLowerCase();
  for (const [city, code] of Object.entries(CITY_TO_IATA)) {
    const isKorean = /[가-힣]/.test(city);
    if (isKorean) { if (lowerText.includes(city)) return code; }
    else { const regex = new RegExp(`\\b${city.toLowerCase()}\\b`); if (regex.test(lowerText)) return code; }
  }
  return null;
};

const extractIataFromItinerary = (tripResult) => {
  let inCode = null; let outCode = null;
  if (!tripResult || !tripResult.itinerary) return { inCode, outCode };
  const days = tripResult.itinerary;
  if (days[0]) inCode = findIataCode(`${days[0].day} ${tripResult.tripTitle} ${days[0].places?.map(p => p.name).join(' ')}`);
  if (days[days.length - 1]) outCode = findIataCode(`${days[days.length - 1].day} ${tripResult.tripTitle} ${days[days.length - 1].places?.map(p => p.name).join(' ')}`);
  if (!inCode) { inCode = findIataCode(tripResult.tripTitle || tripResult.destination || ""); if (!outCode) outCode = inCode; }
  return { inCode, outCode };
};

export default function PCHome() {
  const router = useRouter();

  // 🌟 AI 플래너 모달 상태
  const [showAIPlanner, setShowAIPlanner] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('ko');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("AI가 완벽한 일정을 짜고 있어요...");
  const [mySchedules, setMySchedules] = useState([]);

  // 폼 데이터
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isLuxury, setIsLuxury] = useState(false);
  const [formData, setFormData] = useState({ destination: "", startDate: "", endDate: "", companion: "연인", people: 2, budget: 100, hotelType: "호텔", tourType: "자유여행", themes: [], request: "" });

  // 로딩 텍스트 변경
  useEffect(() => {
    if (!loading) return;
    const messages = ["한국관광공사 데이터를 뒤지는 중... 🧐", "동선을 최적화하고 있어요... 🗺️", "가성비 좋은 식당을 찾고 있습니다... 🍜", "거의 다 됐습니다! 냥냥! 🐾"];
    let index = 0; setLoadingText(messages[0]);
    const interval = setInterval(() => { index = (index + 1) % messages.length; setLoadingText(messages[index]); }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  // 로그인 및 DB 연동
  useEffect(() => {
    let unsubscribeTrips = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (unsubscribeTrips) { unsubscribeTrips(); unsubscribeTrips = null; }
      if (currentUser) {
        const tripsRef = collection(db, "users", currentUser.uid, "itineraries");
        unsubscribeTrips = onSnapshot(query(tripsRef, orderBy("createdAt", "desc")), (snapshot) => {
          setMySchedules(snapshot.docs.map(doc => ({ id: doc.id, iata: findIataCode(doc.data().destination || ""), ...doc.data() })));
        });
      } else { setMySchedules([]); }
    });
    return () => { unsubscribeAuth(); if (unsubscribeTrips) unsubscribeTrips(); };
  }, []);

  const handleLogin = async () => { try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (error) { alert("로그인 에러"); } };
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDateChange = (update) => { setDateRange(update); if (update[0] && update[1]) setFormData(prev => ({ ...prev, startDate: update[0].toISOString().split('T')[0], endDate: update[1].toISOString().split('T')[0] })); };
  const addThemeTag = (tag) => { if (!formData.destination.includes(tag)) setFormData(prev => ({ ...prev, destination: prev.destination ? `${prev.destination} ${tag}` : tag })); };
  const toggleLuxuryMode = () => { setIsLuxury(!isLuxury); setFormData(prev => ({ ...prev, hotelType: !isLuxury ? "5성급 스위트룸/풀빌라" : "호텔" })); };
  const updatePeople = (delta) => setFormData(prev => ({ ...prev, people: Math.max(1, Math.min(20, prev.people + delta)) }));

  // ✨ 통합된 AI 생성 로직 (TourAPI 지원)
  const generatePlan = async () => {
    if (!formData.destination) { alert("여행지를 입력해주세요!"); return; }
    if (!formData.startDate || !formData.endDate) { alert("날짜를 선택해주세요!"); return; }

    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isLuxury, language })
      });
      const data = await response.json();

      if (data.result) {
        const { inCode, outCode } = extractIataFromItinerary(data.result);
        data.result.arrivalIata = inCode || data.result.arrivalIata;
        data.result.departureIata = outCode || data.result.departureIata;
        setAiResult(data.result); // 결과 화면으로 데이터 전달
      } else { alert("오류: 생성 실패"); }
    } catch (error) { alert("서버 오류 발생"); }
    finally { setLoading(false); }
  };

  const handleDeleteTrip = async (e, tripId) => {
    e.stopPropagation();
    if (!confirm(`일정을 삭제하시겠습니까?`)) return;
    try { if (user) { await deleteDoc(doc(db, "users", user.uid, "itineraries", tripId)); } } catch (error) { alert("삭제 실패"); }
  };

  // 결과 화면이 렌더링될 때 (AIResult 컴포넌트로 이동)
  if (aiResult) return <AIResult data={aiResult} userInfo={formData} language={language} onReset={() => { setAiResult(null); setShowAIPlanner(false); }} />;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-x-hidden">

      {/* 🌟 1. 네비게이션 바 (유지) */}
      <header className="h-20 bg-white flex items-center justify-between px-10 max-w-[1400px] w-full mx-auto">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowAIPlanner(false)}>
            <img src="/logo.png" alt="Trip Maker Logo" className="h-10 w-auto object-contain" />
          </div>
          <nav className="hidden md:flex gap-8 text-lg font-bold text-gray-700">
            <button className="hover:text-[#4A7DFF] transition-colors">해외 패키지</button>
            <button onClick={() => setShowAIPlanner(true)} className="hover:text-[#4A7DFF] text-[#4A7DFF] transition-colors">AI 냥프로 플래너</button>
            <button className="hover:text-[#4A7DFF] transition-colors">국내/제주</button>
            <button className="hover:text-[#4A7DFF] transition-colors">맞춤견적 문의</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLanguage(l => l === 'ko' ? 'en' : 'ko')} className="flex items-center gap-1 text-gray-600 font-bold hover:text-gray-900 transition">
            <Globe size={20} /> {language === 'ko' ? '한국어' : 'English'} ∨
          </button>
          <div className="w-[1px] h-5 bg-gray-200 mx-2"></div>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4A7DFF] to-blue-500 overflow-hidden shadow-sm flex items-center justify-center text-white font-bold">
                {user.photoURL ? <img src={user.photoURL} alt="profile" /> : user.displayName?.[0]}
              </div>
              <button onClick={() => router.push('/mypage')} className="text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-100">MY</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="px-5 py-2 rounded-full bg-slate-900 text-white font-bold text-sm shadow-md flex items-center gap-2 hover:bg-slate-800"><LogIn size={16} />로그인</button>
          )}
        </div>
      </header>

      {/* 🌟 2. 메인 히어로 배너 (유지) */}
      <section className="w-full bg-[#4A7DFF] relative overflow-hidden py-24 shadow-inner">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>

        <div className="max-w-[1200px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="text-white space-y-6">
            <h1 className="text-5xl lg:text-7xl font-black leading-tight drop-shadow-md tracking-tight">
              <span className="text-teal-300">AI 냥프로</span> 플래너<br />
              <span className="font-light italic font-serif text-4xl lg:text-5xl opacity-90">Planner</span>
            </h1>
            <p className="text-lg lg:text-xl text-blue-50 font-medium leading-relaxed drop-shadow-sm">당신이 원하는 여행의 시작<br />1분이면 끝! 나만을 위한 완벽한 여행 코스 추천</p>
            <button onClick={() => setShowAIPlanner(true)} className="mt-6 px-8 py-4 bg-blue-800/60 hover:bg-blue-900 backdrop-blur-md rounded-full text-white font-bold text-lg flex items-center gap-2 transition shadow-lg border border-blue-400/50 group">
              무료 코스 만들기 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative mt-16 md:mt-0 w-full max-w-[500px] h-[400px]">
            <div className="absolute inset-0 bg-green-50 rounded-xl shadow-2xl transform rotate-3 overflow-hidden border-[6px] border-white flex">
              <div className="w-1/2 bg-emerald-100 h-full relative"><div className="absolute top-0 left-1/4 w-12 h-full bg-blue-200 transform -skew-x-12"></div></div>
              <div className="w-1/2 bg-blue-50 h-full relative"><div className="absolute bottom-10 right-10 w-20 h-20 bg-emerald-200 rounded-full opacity-50"></div></div>
              <div className="absolute top-1/3 left-1/4 w-10 h-10 bg-[#4A7DFF] rounded-full text-white flex items-center justify-center font-bold border-4 border-white shadow-lg z-10">1</div>
              <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-[#4A7DFF] rounded-full text-white flex items-center justify-center font-bold border-4 border-white shadow-lg z-10">2</div>
              <svg className="absolute top-0 left-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}><path d="M 140 140 Q 250 250 350 200" stroke="#4A7DFF" strokeWidth="4" strokeDasharray="8 8" fill="transparent" /></svg>
            </div>
            <div className="absolute -top-6 -right-4 lg:-right-12 bg-blue-900/90 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl border border-blue-500/50 backdrop-blur-sm transform hover:scale-105 transition">#무료 맞춤 코스</div>
            <div className="absolute top-12 -right-2 lg:-right-8 bg-blue-900/90 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl border border-blue-500/50 backdrop-blur-sm transform hover:scale-105 transition">#견적도 한 번에!</div>
            <div onClick={() => setShowAIPlanner(true)} className="absolute -bottom-8 right-8 w-28 h-28 bg-white rounded-full shadow-2xl flex items-center justify-center border-[5px] border-[#4A7DFF] text-5xl z-20 hover:animate-bounce cursor-pointer">🐱</div>
          </div>
        </div>
      </section>

      {/* 🌟 3. 검색 폼 (유지) */}
      <section className="bg-gray-50 pt-16 pb-10 px-10 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 flex flex-col md:flex-row gap-4 items-center -mt-28 relative z-30">
            <div className="flex-1 w-full p-2 border-b md:border-b-0 md:border-r border-gray-100">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2"><MapPin size={16} /> 여행지</label>
              <input type="text" placeholder="어디로 떠나시나요?" value={formData.destination} onChange={handleInputChange} name="destination" className="w-full text-xl font-bold text-gray-800 outline-none placeholder-gray-300" />
            </div>
            <div className="flex-1 w-full p-2 border-b md:border-b-0 md:border-r border-gray-100 relative z-40">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-2"><Calendar size={16} /> 일정</label>
              <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={handleDateChange} minDate={new Date()} locale={ko} dateFormat="yyyy.MM.dd" placeholderText="날짜 선택" className="w-full text-xl font-bold text-gray-800 outline-none placeholder-gray-300" wrapperClassName="w-full" />
            </div>
            <button onClick={() => { if (formData.destination && startDate) setShowAIPlanner(true); else alert('여행지와 날짜를 입력해주세요.'); }} className="w-full md:w-auto mt-4 md:mt-0 px-10 py-5 bg-slate-900 text-white font-bold text-xl rounded-2xl shadow-md hover:bg-slate-800 transition flex items-center justify-center gap-2 whitespace-nowrap">
              <Sparkles size={24} /> AI 추천받기
            </button>
          </div>
        </div>
      </section>

      {/* 🌟 4. 여행사 상품 진열 영역 (유지) */}
      <section className="bg-white py-20 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">🔥 트립메이커 단독 특가 패키지</h2>
              <p className="text-gray-500 font-medium">전문 가이드와 함께하는 안전하고 편안한 여행을 만나보세요.</p>
            </div>
            <button className="text-[#4A7DFF] font-bold hover:underline flex items-center gap-1">전체 상품 보기 <ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packageTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <img src={tour.img} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-1.5">{tour.tags.map((tag, idx) => <span key={idx} className={`px-2.5 py-1 text-xs font-bold rounded-sm text-white shadow-sm ${idx === 0 ? 'bg-rose-500' : 'bg-slate-900/80 backdrop-blur-sm'}`}>{tag}</span>)}</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mb-2"><Star size={14} fill="currentColor" /> {tour.rating} <span className="text-gray-400 font-normal">({tour.reviews})</span></div>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2 line-clamp-2">{tour.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{tour.desc}</p>
                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>{tour.originalPrice && <span className="text-xs text-gray-400 line-through block mb-0.5">{tour.originalPrice}원</span>}<span className="text-xl font-black text-rose-500">{tour.price}<span className="text-sm font-bold text-gray-800 ml-0.5">원~</span></span></div>
                    <button className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-bold rounded-lg hover:bg-[#4A7DFF] hover:text-white transition-colors">자세히</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 영역 생략 (기존과 동일하게 유지) */}

      {/* 🔥 [핵심] AI 플래너 모달 (PC 화면에 띄워지는 2단 레이아웃) */}
      <AnimatePresence>
        {showAIPlanner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 md:p-10">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-gray-100 w-full max-w-[1200px] h-[90vh] rounded-[30px] shadow-2xl overflow-hidden flex flex-col relative border border-gray-300">

              {/* 모달 헤더 */}
              <div className="bg-white px-8 py-5 flex justify-between items-center border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-3">
                  <CatMascot width={45} />
                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">AI 냥프로 맞춤 플래너</h2>
                </div>
                <button onClick={() => setShowAIPlanner(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition"><X size={24} /></button>
              </div>

              {/* 2단 스플릿 뷰 컨테이너 */}
              <div className="flex flex-1 overflow-hidden">

                {/* 좌측 폼 영역 (입력) */}
                <div className="flex-1 overflow-y-auto bg-white p-10 custom-scrollbar pb-32 relative">
                  <div className="space-y-8 max-w-[550px] mx-auto">

                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:border-indigo-200 transition">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3"><MapPin size={18} className="text-[#FF5A5F]" /> 어디로 떠나시나요?</label>
                      <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} placeholder="국가 또는 도시명 입력" className="w-full text-2xl font-black text-gray-800 outline-none placeholder-gray-300 bg-transparent mb-4" />
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">{themeTags.map(tag => (<button key={tag} onClick={() => addThemeTag(tag)} className="px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition-colors">{tag}</button>))}</div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:border-indigo-200 transition relative z-50">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3"><Calendar size={18} className="text-[#FF5A5F]" /> 일정 선택</label>
                      <DatePicker selectsRange={true} startDate={startDate} endDate={endDate} onChange={handleDateChange} minDate={new Date()} locale={ko} dateFormat="yyyy.MM.dd" placeholderText="출발일과 도착일을 선택하세요" className="w-full text-xl font-bold text-gray-800 outline-none placeholder-gray-300 cursor-pointer" wrapperClassName="w-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                        <label className="text-sm font-bold text-gray-500 mb-4 block">누구와 함께?</label>
                        <div className="grid grid-cols-2 gap-2">{companionOptions.map((opt) => (<button key={opt.id} onClick={() => setFormData({ ...formData, companion: opt.id })} className={`py-3 rounded-xl transition-all text-sm font-bold ${formData.companion === opt.id ? 'bg-[#FF5A5F] text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>{opt.label}</button>))}</div>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-center items-center">
                        <label className="text-sm font-bold text-gray-500 mb-6">총 인원 수</label>
                        <div className="flex items-center gap-5"><button onClick={() => updatePeople(-1)} className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 font-bold text-xl hover:bg-gray-200 transition">-</button><span className="font-black text-3xl w-8 text-center text-gray-800">{formData.people}</span><button onClick={() => updatePeople(1)} className="w-12 h-12 rounded-full bg-[#FF5A5F] text-white font-bold text-xl hover:bg-rose-600 shadow-md transition">+</button></div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold text-gray-500">1인당 여행 예산</label>
                        <span className="text-2xl font-black text-[#FF5A5F]">{formData.budget}만원</span>
                      </div>
                      <input type="range" name="budget" min="50" max="1000" step="10" value={formData.budget} onChange={handleInputChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]" />
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                      <label className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2"><MessageSquare size={16} /> 상세 요청사항</label>
                      <textarea name="request" value={formData.request} onChange={handleInputChange} placeholder="예: 니스 IN, 마르세유 OUT으로 짜줘. 부모님을 모시고 가니 많이 걷지 않게 해줘." className="w-full text-base font-medium outline-none text-gray-800 resize-none h-24 bg-transparent custom-scrollbar leading-relaxed" />
                    </div>

                  </div>
                </div>

                {/* 우측 사이드바 (내 기록) */}
                <div className="w-[400px] bg-slate-50 border-l border-gray-200 p-8 overflow-y-auto custom-scrollbar flex flex-col">
                  <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                    <Map className="text-indigo-600" /> 내 지난 여행 기록
                  </h3>
                  {mySchedules.length > 0 ? (
                    <div className="space-y-4 flex-1">
                      {mySchedules.map(trip => (
                        <div key={trip.id} onClick={() => { setAiResult(trip); setShowAIPlanner(false); }} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition group relative overflow-hidden">
                          <button onClick={(e) => handleDeleteTrip(e, trip.id)} className="absolute top-4 right-4 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition">✈️</div>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1 text-base">{trip.tripTitle || trip.destination}</h4>
                              <p className="text-xs text-gray-500">{trip.startDate} 출발</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center space-y-3 opacity-60">
                      <Plane size={48} strokeWidth={1} />
                      <p className="text-sm">저장된 일정이 없습니다.<br />나만의 첫 번째 여행을 만들어보세요!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 생성 버튼 (모달 하단에 고정) */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center pointer-events-none">
                <button onClick={generatePlan} disabled={loading} className="pointer-events-auto w-full max-w-[600px] py-5 bg-gradient-to-r from-[#4A7DFF] to-blue-600 text-white font-black text-xl rounded-2xl shadow-[0_10px_20px_rgba(74,125,255,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(74,125,255,0.4)] transition-all flex justify-center items-center gap-3">
                  {loading ? <><Loader2 className="animate-spin" size={24} /> {loadingText}</> : <><Sparkles size={24} /> AI 맞춤 일정 생성하기</>}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>
    </div>
  );
}