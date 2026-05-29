"use client";

import React, { useState } from 'react';
import { Plane, Zap, MapPin, Calendar as CalendarIcon, Loader2, Sparkles, Navigation, Globe, Clock, ShieldCheck, ArrowRight, Star, CheckCircle, Smartphone, Users, Wallet, Mic, Share2, CreditCard, Ticket, MessageSquare, Save, Search, Bell, BarChart, Info, Home as HomeIcon, Map, Settings, Camera, LayoutDashboard, Compass, HelpCircle, BellRing, Code, Car, Bus, Train, Ship, Luggage, Bike } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko, enUS } from 'date-fns/locale';
import AIResult from '../src/components/AIResult';

const LOCALE = {
  ko: {
    titleMain: "여행의 모든 순간을 연결하다",
    titleSub: "트립메이커 AI",
    subText: "초개인화 AI 안심 일정부터 안전한 동행 매칭, 스마트한 자금 마련까지. 냥프로와 함께 설레는 여행을 시작하세요.",
    searchPlaceholder: "어디로 떠나시나요?",
    datePlaceholder: "언제 떠나시나요?",
    btnPlan: "여행 일정 만들기",
    btnLearn: "서비스 알아보기",
    navFeatures: "핵심 기능",
    navHow: "이용 방법",
    navCommunity: "커뮤니티",
    navGuide: "시작 가이드",
    mockTitle: "Service Image / Video Mockup",
    mockSub: "프로모션 비디오나 서비스 화면 목업 영역",
    featHeading: "핵심 기능 (Core Features)",
    featSub: "여행의 시작부터 끝까지, 필요한 모든 것을 스마트하게.",
    f1Title: "AI Planner",
    f1Desc: "대한민국, 전세계 어디나 1분 만에 완성되는 나만의 동선. 냥프로가 당신의 취향과 예산을 분석해 최적의 경로를 제안합니다.",
    f2Title: "Social Network",
    f2Desc: "신뢰할 수 있는 여행 메이트. 성향 데이터를 통해 나와 70% 이상 일치하는 검증된 동행을 연결해 드립니다.",
    f3Title: "Travel Fund",
    f3Desc: "자금 준비부터 정산까지 스마트하게. 여행 전용 적금으로 목돈을 마련하고 1/N 정산까지 한 번에 끝내세요.",
    f4Title: "Safe Mode",
    f4Desc: "실시간 위치 공유와 안심 귀가 스마트 타이머. 지정한 시간 내에 무사 귀가를 입증하지 않으면 보호자와 동행에게 실시간 위치와 경보가 자동으로 전송됩니다.",
    howHeading: "작동 원리 (How It Works)",
    howSub: "단 3단계로 완벽한 여행이 준비됩니다.",
    how1Title: "취향 저격 AI 일정 체험",
    how1Desc: "목적지와 취향만 선택하세요. AI가 최적의 이동 동선까지 고려한 완벽한 일정을 생성합니다.",
    how2Title: "친구 초대 및 실시간 소통",
    how2Desc: "카카오톡 1초 초대와 팀원 전용 라운지를 통해 따로 톡방을 만들 필요 없이 함께 여행을 준비하세요.",
    how3Title: "스마트 지출 및 자동 정산",
    how3Desc: "모임통장과 자동 N빵 알람 기능으로 가장 껄끄러운 정산까지 눈치 보지 않고 스마트하게 해결하세요.",
    comHeading: "커뮤니티 및 자랑하기",
    comSub: "실제 유저들이 생성한 베스트 여행 카드 및 실시간 공유 피드",
    ctaHeading: "새로운 여행을 떠날 준비가 되셨나요?",
    ctaSub: "초개인화 AI 일정부터 안전한 동행 매칭까지, 냥프로와 함께 시작하세요.",
    ctaBtn: "여행 일정 만들기",
    footerContact: "고객센터",
    footerTerms: "이용약관",
    footerPrivacy: "개인정보처리방침",
    footerCopy: "Trip Maker AI (냥프로) All rights reserved.",

    // Additional Onboarding & Guide Parity
    onboardingTitle: "트립메이커 완벽 가이드",
    onboardingSub: "나만의 여행 AI, Trip Maker AI(트립메이커 AI)에 오신 것을 환영합니다! 막막했던 계획부터 실시간 소통까지—이제 트립메이커 하나로 안심여행이 완벽해집니다.",
    why1Title: "고민은 AI에게",
    why1Desc: "취향만 말하면 동선까지 완벽한 일정을 짜줍니다.",
    why2Title: "총무의 구원자",
    why2Desc: "버튼 하나로 보내는 N빵 입금 알림.",
    why3Title: "우리만의 아지트",
    why3Desc: "일정표 안에서 바로 대화하는 동행자 라운지.",
    why4Title: "24시간 안심 귀가",
    why4Desc: "실시간 위치 공유와 안심 타이머로 지켜주는 Safe Mode.",
    iconDictTitle: "핵심 아이콘 사전 (Icon Dictionary)",
    iconDictItem1_n: "설정/지갑",
    iconDictItem1_d: "예산 세팅, 환전, 입금 관리",
    iconDictItem2_n: "동행자 추가",
    iconDictItem2_d: "친구 검색 및 초대 링크 생성",
    iconDictItem3_n: "N빵 알림",
    iconDictItem3_d: "자동 계산된 입금 요청 푸시",
    iconDictItem4_n: "상세 지출",
    iconDictItem4_d: "예상 경비 vs 실제 지출 가계부",
    iconDictItem5_n: "라운지",
    iconDictItem5_d: "팀 전용 실시간 소통 공간",
    iconDictTip: "✨ Tip: 여행 중 예상치 못한 지출이 생기면 즉시 [상세 지출 보기]에서 기록하세요. 실시간 잔액을 보여줍니다.",

    hostTitle: "👑 방장 (Host)",
    hostLi1: "✅ 여행 코스 생성 및 삭제 관리",
    hostLi2: "✅ 모임통장 예산 설정 / N빵 푸시 알림",
    hostLi3: "✅ 실시간 외화 환전 기록 실행",
    hostLi4: "✅ 일정 수정 및 동행 소통 가능",

    memberTitle: "🙋 멤버 (Member)",
    memberLi1: "✅ 일정 확인 및 함께 수정 편집",
    memberLi2: "✅ 내 몫의 여행 경비(N빵) 입금하기",
    memberLi3: "✅ 팀원 전용 라운지 실시간 참여",
    memberLi4: "❌ 여행 삭제 / 예산 설정 등 불가",

    techTitle: "트립메이커 기술 스택 및 완성도",
    techDesc: "단순한 여행 플래너를 넘어, 최신 웹 기술과 인공지능이 결합된 혁신적 플랫폼입니다.",
    pwaTitle: "아이폰에서 트립메이커 앱 설치 방법",
    pwaDesc: "모바일 브라우저(크롬, 사파리) 메뉴에서 '홈 화면에 추가(Add to Home Screen)'를 선택하면 일반 앱처럼 빠르고 쾌적하게 전체 화면으로 이용할 수 있습니다.",
    pwaNote: "빠른시일 내에 앱 스토어에 등록하겠습니다.",
    playStore: "플레이 스토어",
    faqTitle: "자주 묻는 질문",
    faqDesc: "서비스 이용에 대해 궁금한 점을 확인해보세요."
  },
  en: {
    titleMain: "Connecting every moment of travel",
    titleSub: "Trip Maker AI",
    subText: "From hyper-personalized AI secure itineraries to safe companion matching and smart funding. Start your exciting journey with NyangPro.",
    searchPlaceholder: "Where are you heading?",
    datePlaceholder: "Select your dates",
    btnPlan: "Create Itinerary for Free",
    btnLearn: "Learn More",
    navFeatures: "Core Features",
    navHow: "How it Works",
    navCommunity: "Community",
    navGuide: "Quick Guide",
    mockTitle: "Service Image / Video Mockup",
    mockSub: "Promotional video or app UI mockup area.",
    featHeading: "Core Features",
    featSub: "Everything you need from the start to the end of your trip.",
    f1Title: "AI Planner",
    f1Desc: "Korea and all over the world, Custom route in 1 minute. NyangPro analyzes your taste and budget to suggest optimal paths.",
    f2Title: "Social Network",
    f2Desc: "Reliable travel mates. We connect you with verified companions who match your profile by over 70%.",
    f3Title: "Travel Fund",
    f3Desc: "Smart funding to settlement. Save up with a travel savings account and easily split bills 1/N.",
    f4Title: "Safe Mode",
    f4Desc: "Real-time location sharing and secure return smart timer. Automatically alerts your guardian with live GPS maps if you don't check in within the limit.",
    howHeading: "How It Works",
    howSub: "Perfect travel prepared in just 3 steps.",
    how1Title: "Personalized AI Itinerary",
    how1Desc: "Just select your destination and tastes. Our AI generates the perfect route with optimized paths.",
    how2Title: "Invite Friends & Chat",
    how2Desc: "Invite with KakaoTalk in 1 second and plan together in the exclusive lounge without separate chat rooms.",
    how3Title: "Smart Spending & Settlement",
    how3Desc: "Solve tricky settlements effortlessly with the trip wallet and automated N-split deposit alerts.",
    comHeading: "Community & Showcase",
    comSub: "Best travel cards & real-time shared feeds created by real users",
    ctaHeading: "Ready to start your new journey?",
    ctaSub: "From hyper-personalized AI itineraries to companion matching, start with NyangPro.",
    ctaBtn: "Create Itinerary for Free",
    footerContact: "Customer Center",
    footerTerms: "Terms of Service",
    footerPrivacy: "Privacy Policy",
    footerCopy: "Trip Maker AI (NyangPro) All rights reserved.",

    // Additional Onboarding & Guide Parity
    onboardingTitle: "Complete Guide to TripMaker",
    onboardingSub: "Welcome to your own travel AI, TripMaker AI! From frustrating planning to live communication—TripMaker is all you need.",
    why1Title: "Leave worries to AI",
    why1Desc: "Just say your preferences and it generates a perfect route.",
    why2Title: "Savior of the Treasurer",
    why2Desc: "N-split deposit alerts sent with a single button tap.",
    why3Title: "Our Own Hideout",
    why3Desc: "A companion lounge where you can chat right inside the itinerary.",
    why4Title: "24h Safe Guard",
    why4Desc: "Safe Mode protects you with real-time location sharing & smart timers.",
    iconDictTitle: "Core Icon Dictionary",
    iconDictItem1_n: "Settings/Wallet",
    iconDictItem1_d: "Budget setting, FX, deposit control",
    iconDictItem2_n: "Add Companion",
    iconDictItem2_d: "Search friends & generate invite links",
    iconDictItem3_n: "N-Split Alert",
    iconDictItem3_d: "Push notifications for auto-calculated deposits",
    iconDictItem4_n: "Expense Details",
    iconDictItem4_d: "Estimated budget vs actual expense book",
    iconDictItem5_n: "Lounge",
    iconDictItem5_d: "Real-time chat room exclusive to the team",
    iconDictTip: "✨ Tip: If unexpected expenses occur during travel, record them instantly in [View Expense Details] to see real-time balance.",

    hostTitle: "👑 Host",
    hostLi1: "✅ Manage trip course generation & deletion",
    hostLi2: "✅ Set group budget / N-split push alerts",
    hostLi3: "✅ Perform real-time foreign FX exchange",
    hostLi4: "✅ Edit itinerary & communicate with companions",

    memberTitle: "🙋 Member",
    memberLi1: "✅ View itinerary & edit together",
    memberLi2: "✅ Deposit my own share of travel expenses",
    memberLi3: "✅ Real-time participation in team lounge",
    memberLi4: "❌ Deleting trips or setting budget is disabled",

    techTitle: "TripMaker Tech Stack & Competence",
    techDesc: "Beyond a simple travel planner, it is an innovative platform combining state-of-the-art web tech and artificial intelligence.",
    pwaTitle: "How to Install TripMaker on iPhone",
    pwaDesc: "Choose 'Add to Home Screen' in your mobile browser (Chrome, Safari) menu to use it faster and cleaner in fullscreen like a native app.",
    pwaNote: "We will publish to the App Store very soon.",
    playStore: "Play Store",
    faqTitle: "Frequently Asked Questions",
    faqDesc: "Find answers to common questions about using the service."
  }
};

const GUIDE_DATA_KO = [
  {
    id: "safemode",
    title: "0. 🛡️ 실시간 안심 귀가 (Safe Mode)",
    icon: <ShieldCheck size={20} />,
    items: [
      {
        subtitle: "0-1. 비상 안심 연락망 등록",
        details: [
          { label: "보호자 등록 및 검색", desc: "이메일이나 이름으로 서비스 가입자를 검색하여 비상 보호자로 등록하거나, 연락처 정보를 직접 입력할 수 있습니다." },
          { label: "실시간 보호 시작", desc: "보호자가 등록되면 피보호자의 안전 상태 확인을 위한 비상 연락 연동이 자동 활성화됩니다." }
        ]
      },
      {
        subtitle: "0-2. 안심 약속 귀가 시간 설정",
        details: [
          { label: "스마트 타이머", desc: "이동 예상 시간에 맞춰 10분, 30분, 60분, 120분 등의 타이머를 설정합니다." },
          { label: "타이머 만료 경보", desc: "약속 시간 내에 귀가 완료를 인증하지 않으면 고주파 사이렌과 경고가 작동하고 비상 연락망에 자동 통지됩니다." }
        ]
      },
      {
        subtitle: "0-3. 실시간 위치 공유 및 긴급 사이렌",
        details: [
          { label: "실시간 GPS 관제", desc: "15초 간격으로 최신 GPS 위치를 업데이트하여 전용 대시보드 링크와 함께 보호자에게 카카오톡/SMS로 전송합니다." },
          { label: "비상 사이렌 및 진동", desc: "위급 상황 시 사이렌 버튼을 누르면 기기 최대 볼륨으로 오디오 경보음이 재생되고 화면 진동이 시작됩니다." }
        ]
      }
    ]
  },
  {
    id: "home",
    title: "1. 🏠 메인 화면 (Home)",
    icon: <HomeIcon size={20} />,
    items: [
      {
        subtitle: "1-1. 최상단 영역 및 글로벌 인증",
        details: [
          { label: "간편 로그인", desc: "우측 상단 사람 아이콘이나 화면의 로그인 버튼을 눌러 카카오톡 연동으로 빠르게 접속합니다." },
          { label: "상단 배너 (여행 소식)", desc: "냥 프로의 귀여운 인사 멘트와 최신 여행 소식이 자동 전환되며 표시됩니다." },
          { label: "앱 설치 및 알림 권한", desc: " 플레이 스토어에서 다운받으세요. 아이폰은 mytrip2.pro에 접속하시어 홈화면에 추가하세요. 설치 완료 후 푸시 알림 권한을 허용하면 D-Day 및 각종 알림을 받습니다." }
        ]
      },
      {
        subtitle: "1-2. 🗓️ 안심 여행 탭 (AI 플래닝)",
        details: [
          { label: "목적지 검색", desc: "텍스트나 마이크(음성 인식)로 입력하며, 하단의 '국내만', '해외로' 버튼으로 빠른 설정이 가능합니다." },
          { label: "여행 설정", desc: "달력에서 여행일을 지정하고 동행자, 목표 예산, 인원수(VIP 예산 무제한 가능)를 조절합니다." },
          { label: "일정 생성", desc: "설정을 마치고 붉은 버튼을 누르면 AI가 로딩 멘트와 함께 맞춤형 일정을 즉시 제작합니다." }
        ]
      },
      {
        subtitle: "1-3. ✈️ 내 일정 항공권 탭",
        details: [
          { label: "냥프로 안심 추천!", desc: "'HOT', 'PREMIUM' 딱지가 붙은 고화질 추천 여행지 카드가 가로 슬라이드로 제공됩니다." },
          { label: "실시간 항공권 (내 일정)", desc: "내가 생성한 일정을 터치하면 항공권 검색 오버레이가 올라오며 최저가 리스트를 매칭해 줍니다." },
          { label: "즉시 예약 링크", desc: "[Trip.com 최저가] 및 [Aviasales 예약] 버튼을 통해 글로벌 항공권 예약 페이지로 즉시 연결됩니다." }
        ]
      }
    ]
  },
  {
    id: "trip",
    title: "2. 🗂 여행 일정표 화면 (Result)",
    icon: <Map size={20} />,
    items: [
      {
        subtitle: "2-1. 하단 내비게이션 툴바",
        details: [

          { label: "카카오톡 상담", desc: "카톡 아이콘을 눌러 일정에 대한 상담이 가능합니다." },
          { label: "친구 초대하기", desc: "고유 접속 URL을 카톡 및 SNS로 공유합니다." },
          { label: "PDF 저장", desc: "해당 여행일정을 PDF로 다운 받아서 사용 가능합니다." }
        ]
      },
      {
        subtitle: "2-2. 일자별 타임라인 편집",
        details: [
          { label: "동선 뷰 및 편집 ✏️", desc: "장소 간 예상 이동 시간이 표시되며, 위아래로 스크롤하면 여행일정이 표시됩니다. 연필을 누른면 일정이 편집 가능합니다." },
          { label: "장소 추가 및 편집하기", desc: "타임라인 옆 돋보기 🔎 버튼을 눌러 원하는 관광지나 맛집을 직접 검색하여 삽입 및 편집합니다." }
        ]
      },
      {
        subtitle: "2-3. 주요 기능",
        details: [
          { label: "🗺️ 지도(Map) 보기", desc: "일자별 동선을 지도 핀과 선으로 연결해 보여주어 직관적인 동선(자동차, 도보, 대중교통) 파악이 가능합니다." },
          { label: "✨ 예상 경비 및 여행 꿀팁", desc: "AI가 예상 경비 및 추천숙소, 팁 & 날씨로 보여줍니다." },
          { label: "📍 여행 장소 및 액티비티", desc: "하단 버튼을 통해 상세 설명과 투어 예약으로 바로 넘어갑니다." },
          { label: "💬 라운지", desc: "오른쪽의 말풍선을 누르면 여행 동행 멤버와 대화합니다." }
        ]
      }
    ]
  },
  {
    id: "mypage",
    title: "3. 👤 마이페이지 대시보드",
    icon: <LayoutDashboard size={20} />,
    items: [
      {
        subtitle: "3-1. 🗓️ 일정 탭",
        details: [
          { label: "일정 보기", desc: "여행 카드 하단의 일정 보기를 누르면 지도를 바탕으로 한 여행일정이 보여집니다." },
          { label: "친구 초대", desc: "➕ 버튼을 누르면 친구를 검색해서 여행일정에 초대할 수 있습니다." },
          { label: "D-Day 푸시 알림", desc: "여행 카드 왼측 상단의 🔔 종 아이콘을 눌러 매일 오전 9시 푸시 알림을 설정할 수 있습니다." }
        ]
      },
      {
        subtitle: "3-2. 👥 동행 탭",
        details: [
          { label: "프로필 설정", desc: "상단의 프로필 아이콘을 눌러 닉네임과 7가지 여행 스타일 태그(J형, P형 등)와 프로필을 설정합니다." },
          { label: "매칭 센터 및 알림함", desc: "유저를 검색해 초대장을 보내고, AI가 추천하는 여행메이트도 만날 수 있습니다." },
          { label: "트립 피드 (소셜)", desc: "내 갤러리 사진과 소감을 등록하고, 다른 유저의 피드를 보며 하트(❤️) 버튼으로 소통합니다." }
        ]
      },
      {
        subtitle: "3-3. 💰 트립 머니 탭",
        details: [
          { label: "내 지갑 자산 충전", desc: "트립 포인트를 충전하고 입출금 히스토리를 확인합니다." },
          { label: "모임 통장 정산", desc: "여행 총예산을 입력하고 '정산 요청' 버튼을 눌러 친구들에게 1/N 입금 요청서(푸시)를 보냅니다." },
          { label: "100% 우대 실시간 환전", desc: "공통 모임 통장의 원화를 현지 통화로 실시간 우대 환전하며 영수증을 자동 발급받습니다.(계좌 연결 예정)" }
        ]
      },
      {
        subtitle: "3-4. 🗃️ 보관함",
        details: [
          { label: "예약/티켓", desc: "항공권, 호텔 예약, 티켓 예약권을 보관합니다." },
          { label: "쿠폰", desc: "여행에 필요한 각종 할인 쿠폰을 보관합니다." },
          { label: "사진첩", desc: "여행중 찍었던 사진을 보관하고 공유합니다." }
        ]
      }
    ]
  },


];

const GUIDE_DATA_EN = [
  {
    id: "safemode",
    title: "0. 🛡️ Real-time Safe Return (Safe Mode)",
    icon: <ShieldCheck size={20} />,
    items: [
      {
        subtitle: "0-1. Register Emergency Contacts",
        details: [
          { label: "Guardian Lookup & Add", desc: "Search and select active users by email/name to set as your guardian, or manually enter phone details." },
          { label: "Active Guard Status", desc: "Once a guardian is registered, the emergency alert communication channel becomes ready instantly." }
        ]
      },
      {
        subtitle: "0-2. Set Safe Return Smart Timer",
        details: [
          { label: "Smart Timer Interval", desc: "Configure a custom countdown timer (10, 30, 60, or 120 minutes) based on your transit route." },
          { label: "Timer Expiry Warning", desc: "If safe check-in is not clicked within the limit, a loud siren triggers and an alert is sent to contacts." }
        ]
      },
      {
        subtitle: "0-3. Live GPS Sharing & Emergency Siren",
        details: [
          { label: "Real-time GPS Tracking", desc: "Sends live coordinates updated every 15 seconds to your guardian via SMS/KakaoTalk with a dedicated maps URL." },
          { label: "Emergency Siren & Haptics", desc: "Tapping the siren button plays high-frequency square wave audio at maximum volume with active vibration." }
        ]
      }
    ]
  },
  {
    id: "home",
    title: "1. 🏠 Home Screen (Home)",
    icon: <HomeIcon size={20} />,
    items: [
      {
        subtitle: "1-1. Header Area & Global Auth",
        details: [
          { label: "Easy Login", desc: "Click the user icon on the top right or the login button on the screen to quickly log in with KakaoTalk." },
          { label: "Top Banner (Travel News)", desc: "Cute greeting messages from NyangPro and the latest travel news are automatically displayed." },
          { label: "App Install & Notifications", desc: "Download from Play Store. For iPhone, visit mytrip2.pro and add to home screen. Allow push notifications to receive D-Day and various alerts." }
        ]
      },
      {
        subtitle: "1-2. 🗓️ Secure Travel Tab (AI Planning)",
        details: [
          { label: "Destination Search", desc: "Enter via text or voice (microphone). Domestic or International shortcuts are available." },
          { label: "Travel Settings", desc: "Select dates, companions, budget, and headcount (VIP unlimited budget supported)." },
          { label: "Generate Route", desc: "Click the red button and AI generates a customized itinerary immediately with a loading message." }
        ]
      },
      {
        subtitle: "1-3. ✈️ My Flight Tickets Tab",
        details: [
          { label: "NyangPro Recommendation", desc: "High-quality, horizontal slide recommendation cards labeled 'HOT' or 'PREMIUM' are provided." },
          { label: "Real-time Flight Tickets", desc: "Tap on your generated itinerary and a flight search overlay matches the lowest prices." },
          { label: "Instant Reservation Links", desc: "Instant redirection to global booking sites via [Trip.com Lowest Price] and [Aviasales Booking] buttons." }
        ]
      }
    ]
  },
  {
    id: "trip",
    title: "2. 🗂 Itinerary Screen (Result)",
    icon: <Map size={20} />,
    items: [
      {
        subtitle: "2-1. Bottom Navigation Toolbar",
        details: [
          { label: "KakaoTalk Consult", desc: "Get real-time trip consults by tapping the KakaoTalk icon." },
          { label: "Invite Friends", desc: "Share unique access URLs to friends via KakaoTalk and SNS." },
          { label: "Save PDF", desc: "Download your completed itinerary as a PDF." }
        ]
      },
      {
        subtitle: "2-2. Daily Timeline Editing",
        details: [
          { label: "Route View & Edit ✏️", desc: "Estimated travel times between places are shown. Scroll up and down to view the timeline. Tap the pencil to edit." },
          { label: "Search & Add Places", desc: "Tap the magnifying glass 🔎 to search and add local spots and restaurants directly." }
        ]
      },
      {
        subtitle: "2-3. Key Features",
        details: [
          { label: "🗺️ Map View", desc: "Displays daily routes via map pins and lines (driving, walking, transit) for quick, visual path finding." },
          { label: "✨ Budget & Travel Tips", desc: "AI displays estimated expenses, recommended hotels, smart tips, and local weather." },
          { label: "📍 Places & Activities", desc: "Instantly navigate to details and booking portals via bottom buttons." },
          { label: "💬 Lounge", desc: "Tap the chat bubble to chat in real-time with travel companions." }
        ]
      }
    ]
  },
  {
    id: "mypage",
    title: "3. 👤 My Page Dashboard",
    icon: <LayoutDashboard size={20} />,
    items: [
      {
        subtitle: "3-1. Itinerary Tab",
        details: [
          { label: "View Routes", desc: "Tap view routes on the card to see the map-based itinerary." },
          { label: "Invite Friends", desc: "Tap the ➕ button to search and invite friends into the itinerary." },
          { label: "D-Day Push Notifications", desc: "Tap the 🔔 bell icon to set up daily 9:00 AM push alerts." }
        ]
      },
      {
        subtitle: "3-2. 👥 Companion Tab",
        details: [
          { label: "Profile Setup", desc: "Tap the profile icon to customize your nickname, profile pic, and 7 style tags (J-type, P-type, etc.)." },
          { label: "Matching & Inbox", desc: "Send invitations to other users and meet AI-recommended travel mates." },
          { label: "Trip Feed (Social)", desc: "Upload trip photos and reviews, and interact with other users via like (❤️) buttons." }
        ]
      },
      {
        subtitle: "3-3. 💰 Trip Money Tab",
        details: [
          { label: "Top-up Wallet", desc: "Top-up trip points and check real-time transaction history." },
          { label: "Group Split Settlement", desc: "Enter total budget and tap 'Request Split' to send push alerts and deposit invoices to friends." },
          { label: "100% Prime FX Exchange", desc: "Instantly convert Korean Won to foreign currencies inside the shared account with receipt generation (bank connection coming soon)." }
        ]
      },
      {
        subtitle: "3-4. 🗃️ Vault",
        details: [
          { label: "Reservations/Tickets", desc: "Securely store flight tickets, hotel reservations, and coupons." },
          { label: "Coupons", desc: "Store various discount coupons needed during travel." },
          { label: "Photo Gallery", desc: "Store and share photos taken during your trip." }
        ]
      }
    ]
  }
];

const TECH_STACK_DATA_KO = [
  {
    id: "techstack",
    title: "🚀 혁신적인 기술 스택",
    icon: <Code size={20} />,
    items: [
      {
        subtitle: "1. 🧠 초거대 AI 엔진 통합",
        details: [
          { label: "Gemini 3.ｘ Pro", desc: "사용자의 성향(J/P형, 예산, 동반자)을 분석하여 최적화된 동선을 그려냅니다." },
          { label: "복합 데이터 처리", desc: "IATA 공항 코드 추출, 실시간 물가 반영 등 고도화된 프롬프트 엔지니어링이 적용되었습니다." }
        ]
      },
      {
        subtitle: "2. ⚡ 프론트엔드 아키텍처",
        details: [
          { label: "Next.js & React 19", desc: "SSR과 SSG를 혼합하여 초기 로딩 속도 극대화와 SEO 완벽 대응을 달성했습니다." },
          { label: "글래스모피즘 & 모션", desc: "Framer Motion을 활용해 100% 우대 환전, 슬라이딩 탭 등 60fps 마이크로 애니메이션을 구현했습니다." }
        ]
      },
      {
        subtitle: "3. 🔄 실시간 동기화 (Serverless)",
        details: [
          { label: "Firestore 실시간 동기화", desc: "친구 초대 시 아바타 표시, 일정 수정(Drag & Drop) 등 모든 화면이 0.1초 만에 동기화됩니다." },
          { label: "Cloud Functions", desc: "무거운 백그라운드 작업과 매일 오전 9시에 발송되는 D-Day 푸시 알림 배치를 안전하게 분산 처리합니다." }
        ]
      },
      {
        subtitle: "4. 📱 네이티브 앱 및 PWA",
        details: [
          { label: "TWA 공식 배포", desc: "Android 환경에서 구글 플레이스토어를 통한 공식 배포용 앱을 제작하고 세로 모드(Portrait Lock)를 지원합니다." },
          { label: "PWA 오프라인 캐싱", desc: "Service Worker를 적용하여 인터넷이 불안정한 비행기나 해외 환경에서도 앱이 부드럽게 작동합니다." },
          { label: "FCM 푸시 알림", desc: "앱 설치 시 네이티브 단에서 푸시 알림 권한을 요청하고 백그라운드에서도 수신합니다." }
        ]
      },
      {
        subtitle: "5. 🌍 글로벌 API 파트너십",
        details: [
          { label: "항공권 및 액티비티 연동", desc: "실시간 최저가 항공권 정보를 파싱하고, Klook 현지 투어 및 티켓 정보를 다이렉트로 연결합니다." },
          { label: "다중 인증 시스템", desc: "NextAuth와 Firebase Auth를 이용해 카카오 간편 로그인과 구글 로그인을 결합했습니다." }
        ]
      }
    ]
  }
];

const TECH_STACK_DATA_EN = [
  {
    id: "techstack",
    title: "🚀 Innovative Tech Stack",
    icon: <Code size={20} />,
    items: [
      {
        subtitle: "1. 🧠 Giant AI Engine Integration",
        details: [
          { label: "Gemini 3.x Pro", desc: "Analyzes user preferences (J/P type, budget, companions) to render optimized route vectors." },
          { label: "Complex Data Parsing", desc: "Advanced prompt engineering applies IATA airport codes, live currency mapping, and smart budgeting." }
        ]
      },
      {
        subtitle: "2. ⚡ Frontend Architecture",
        details: [
          { label: "Next.js & React 19", desc: "Hybrid SSR and SSG architecture maximizes performance while scoring 100 on SEO." },
          { label: "Glassmorphism & Motion", desc: "Framer Motion powers 60fps micro-animations like sliding tabs and currency wallets." }
        ]
      },
      {
        subtitle: "3. 🔄 Real-time Sync (Serverless)",
        details: [
          { label: "Firestore Real-time Sync", desc: "Drag & drop updates and live lounges sync across devices in under 120ms." },
          { label: "Cloud Functions", desc: "Scales daily 9:00 AM push notifications and heavy background image processing." }
        ]
      },
      {
        subtitle: "4. 📱 Native App & PWA",
        details: [
          { label: "Official TWA Deployment", desc: "Google Play Store deployment with full portrait-lock mode and standalone layout." },
          { label: "PWA Offline Caching", desc: "Service Worker handles unstable flight environments, caching offline trip maps." },
          { label: "FCM Push Notifications", desc: "Handles native browser permission prompts and background notifications." }
        ]
      },
      {
        subtitle: "5. 🌍 Global API Partnerships",
        details: [
          { label: "Flights & Tours Integration", desc: "Parses real-time lowest price airlines, directly matching Klook tour activities." },
          { label: "Multi-Auth Systems", desc: "NextAuth and Firebase Auth combine Kakao Easy Login and Google Single Sign-On." }
        ]
      }
    ]
  }
];

const FAQ_DATA_KO = [
  {
    q: "트립메이커(Trip Maker)는 무엇인가요?",
    a: "트립메이커는 AI가 사용자의 취향, 예산, 여행 인원에 맞춰 최적화된 맞춤형 여행 일정을 1분 만에 생성해주는 AI 기반 여행 플래너입니다. 일정 생성부터 동행자 매칭, 실시간 소통, 1/N 지출 정산까지 한 번에 해결할 수 있습니다."
  },
  {
    q: "친구들과 함께 여행 일정을 짤 수 있나요?",
    a: "네! 카카오톡 1초 초대 기능을 통해 친구에게 링크를 공유하면, 실시간으로 동행자 그룹이 생성됩니다. 팀원 전용 라운지에서 대화하며 모두의 기기에서 실시간으로 일정을 확인하고 함께 준비할 수 있습니다."
  },
  {
    q: "여행 경비 정산(N빵)은 어떻게 하나요?",
    a: "모임 통장 기능을 통해 총예산을 설정할 수 있으며, 일정이 끝난 후 터치 한 번으로 동행자들에게 자동으로 1/N 정산 요청 알림(푸시)을 보냅니다. 눈치 보지 않고 깔끔하게 비용을 정산하세요."
  },
  {
    q: "어떤 기기에서 사용할 수 있나요?",
    a: "트립메이커는 웹(mytrip2.pro)에서 바로 접속할 수 있을 뿐만 아니라, 안드로이드 구글 플레이 스토어(pro.mytrip2.twa)에서 정식 앱을 다운받아 사용할 수도 있습니다. 모바일에 완벽하게 최적화된 세로 모드 UI를 제공합니다."
  }
];

const FAQ_DATA_EN = [
  {
    q: "What is Trip Maker?",
    a: "Trip Maker is an AI-powered travel planner that generates personalized travel itineraries based on your preferences, budget, and companions in just 1 minute. It handles planning, companion matching, live chatting, and shared bill settlements in one app."
  },
  {
    q: "Can I plan trips with my friends?",
    a: "Yes! Share a unique link to invite friends in 1 second via KakaoTalk. Everyone joins a shared group with sync'd real-time routes and a built-in companion lounge."
  },
  {
    q: "How do group split settlements work?",
    a: "Set up the total budget via the group wallet. Once the trip ends, tap a button to send automated N-split deposit invoices and push notifications to all companions."
  },
  {
    q: "What devices are supported?",
    a: "Trip Maker is available on mobile web (mytrip2.pro) and can be downloaded from the Google Play Store (pro.mytrip2.twa) with a fully responsive layout."
  }
];

const GuideItem = ({ item, sectionId, dIdx, reverse }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Reset image error state when activeIndex changes to attempt loading the new image
  React.useEffect(() => {
    setImgError(false);
  }, [activeIndex]);

  const prefixMap = {
    home: 'gh',
    trip: 'gt',
    mypage: 'gm',
    system: 'gs'
  };
  const prefix = prefixMap[sectionId] || sectionId;
  const imgSrc = prefix === 'safemode' ? '/feature4.png' : `/${prefix}_${dIdx + 1}_${activeIndex + 1}.png`;

  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>

      {/* Text Content */}
      <div className="lg:w-1/2 space-y-6">
        <h4 className="text-3xl font-black text-slate-800 mb-6">{item.subtitle}</h4>
        <ul className="space-y-4">
          {item.details.map((detail, cIdx) => (
            <li
              key={cIdx}
              onClick={() => setActiveIndex(cIdx)}
              className={`flex gap-4 p-6 rounded-3xl border shadow-sm transition-all cursor-pointer ${activeIndex === cIdx
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500 scale-105'
                : 'bg-white border-slate-100 hover:shadow-md hover:border-blue-100'
                }`}
            >
              <CheckCircle className={`shrink-0 mt-1 transition-colors ${activeIndex === cIdx ? 'text-blue-600' : 'text-slate-300'}`} size={24} />
              <div>
                <strong className={`font-bold block mb-2 text-xl transition-colors ${activeIndex === cIdx ? 'text-blue-900' : 'text-slate-700'}`}>{detail.label}</strong>
                <span className={`font-medium leading-relaxed text-lg transition-colors ${activeIndex === cIdx ? 'text-blue-800' : 'text-slate-500'}`}>{detail.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Screenshot Placeholder */}
      <div className="lg:w-1/2 w-full">
        <div className="w-full max-w-[350px] mx-auto aspect-[9/19.5] bg-gradient-to-br from-slate-100 to-slate-200 rounded-[35px] border-[10px] border-white shadow-2xl flex items-center justify-center relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>

          {!imgError ? (
            <img
              key={activeIndex}
              src={imgSrc}
              alt={item.details[activeIndex].label}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover z-20 animate-in fade-in zoom-in-95 duration-500"
            />
          ) : (
            <div className="text-center p-6 relative z-10 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400 shadow-sm">
                <Camera size={32} />
              </div>
              <p className="font-black text-lg text-slate-700 mb-2 px-2 break-keep">{item.details[activeIndex].label}</p>
              <p className="text-slate-400 text-xs font-medium px-4 leading-relaxed">
                스크린샷 이미지 준비 중<br />
                <span className="text-[10px] text-blue-500 font-bold opacity-80 mt-1 block">파일명: {`${prefix}_${dIdx + 1}_${activeIndex + 1}.png`}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TechCard = ({ item, index }) => {
  const [showTerminal, setShowTerminal] = useState(false);

  const config = [
    {
      icon: <Sparkles className="text-rose-500" size={28} />,
      color: "from-rose-500 to-pink-500",
      bgLight: "bg-rose-50",
      border: "border-rose-100",
      completion: 95,
      terminal: {
        engine: "Gemini 3.x Pro & GPT-5x",
        contextWindow: "2M tokens supported",
        features: ["Hyper-personalized itineraries", "Natural voice search parsing", "IATA geo-coding", "Budget categorization"],
        latency: "1.2s avg"
      }
    },
    {
      icon: <Code className="text-indigo-500" size={28} />,
      color: "from-indigo-500 to-blue-500",
      bgLight: "bg-indigo-50",
      border: "border-indigo-100",
      completion: 98,
      terminal: {
        framework: "Next.js 15 (React 19 RC)",
        css: "Tailwind CSS & Global JSS",
        rendering: "Hybrid (SSR for SEO + CSR for Result)",
        lighthouse: { performance: 99, accessibility: 100, bestPractices: 100, seo: 100 }
      }
    },
    {
      icon: <Zap className="text-amber-500" size={28} />,
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      border: "border-amber-100",
      completion: 90,
      terminal: {
        database: "Google Cloud Firestore",
        syncSpeed: "120ms (Real-time snapshots)",
        auth: "Firebase Auth & NextAuth.js",
        cronJobs: ["Daily D-Day alerts at 09:00", "Weekly backup dump"]
      }
    },
    {
      icon: <Smartphone className="text-teal-500" size={28} />,
      color: "from-teal-500 to-emerald-500",
      bgLight: "bg-teal-50",
      border: "border-teal-100",
      completion: 92,
      terminal: {
        wrapper: "Android Trusted Web Activity (TWA)",
        storeAppId: "pro.mytrip2.twa",
        pwaOffline: "Workbox Service Worker caching",
        pushGateway: "FCM (Firebase Cloud Messaging)"
      }
    },
    {
      icon: <Globe className="text-sky-500" size={28} />,
      color: "from-sky-500 to-cyan-500",
      bgLight: "bg-sky-50",
      border: "border-sky-100",
      completion: 88,
      terminal: {
        integrations: ["Klook Activity Deep Link API", "Trip.com Flight Search Engine"],
        currencies: ["KRW", "USD", "JPY", "EUR", "VND"],
        exchanges: "Real-time 100% FX discount gateway"
      }
    }
  ];

  const current = config[index] || config[0];

  return (
    <div className={`relative bg-white rounded-[32px] p-8 border ${current.border} shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between overflow-hidden min-h-[460px] hover:-translate-y-2`}>
      {/* Background Gradient Line glow on Hover */}
      <div className={`absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r ${current.color} opacity-80`} />

      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 ${current.bgLight} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            {current.icon}
          </div>

          {/* Radial Completion Percentage */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500"
                strokeWidth="3.5"
                strokeDasharray={`${current.completion}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                style={{ stroke: index === 0 ? '#f43f5e' : index === 1 ? '#6366f1' : index === 2 ? '#f59e0b' : index === 3 ? '#14b8a6' : '#06b6d4' }}
              />
            </svg>
            <div className="absolute font-black text-xs text-slate-800">{current.completion}%</div>
          </div>
        </div>

        {/* Content Title */}
        <h3 className="text-2xl font-black text-slate-900 mb-4">{item.subtitle}</h3>

        {/* Switch View button */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setShowTerminal(false)}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${!showTerminal ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:text-slate-700'}`}
          >
            기능 명세
          </button>
          <button
            onClick={() => setShowTerminal(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1 ${showTerminal ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:text-slate-700'}`}
          >
            <Code size={12} /> 시스템 구조
          </button>
        </div>

        {/* Dynamic Display Area */}
        <div className="relative min-h-[220px]">
          {!showTerminal ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              {item.details.map((detail, dIdx) => (
                <div key={dIdx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <strong className="font-bold text-slate-800 block mb-1 text-base">🔹 {detail.label}</strong>
                  <span className="text-sm text-slate-500 leading-relaxed font-medium block break-keep">{detail.desc}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl font-mono text-[11px] leading-relaxed overflow-y-auto shadow-inner border border-slate-800 select-all animate-in zoom-in-95 duration-300 max-h-[230px] custom-scrollbar relative text-left">
              <div className="absolute top-2 right-2 text-[9px] text-slate-600 font-bold uppercase select-none tracking-widest">LIVE CONFIG</div>
              <span className="text-slate-500">// system_config_log.json</span>
              <pre className="mt-2 text-emerald-300 whitespace-pre-wrap">{JSON.stringify(current.terminal, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [lang, setLang] = useState('ko');
  const t = LOCALE[lang];
  const [activeGuideTab, setActiveGuideTab] = useState(0);

  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDateChange = (update) => {
    setDateRange(update);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const generatePlan = async () => {
    if (!destination.trim()) {
      alert(lang === 'ko' ? "어디로 여행을 떠나고 싶으신가요?" : "Where do you want to go?");
      return;
    }
    if (!startDate || !endDate) {
      alert(lang === 'ko' ? "여행 날짜를 선택해주세요." : "Please select your travel dates.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          companion: "초보",
          people: 2,
          budget: 50,
          hotelType: "가성비",
          tourType: "자유여행",
          themes: ["관광"],
          request: "가장 완벽한 코스로",
          language: lang
        })
      });
      const data = await response.json();
      if (data.result) {
        setResult(data.result);
      } else {
        alert("생성 실패: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <AIResult
      data={result}
      userInfo={{ destination, startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] }}
      onReset={() => setResult(null)}
    />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans relative selection:bg-blue-100 break-keep overflow-x-hidden">

      {/* 🌌 Ultra-Premium Floating Liquid Auras & Dot-Mesh Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[800px] left-[-15%] w-[60%] aspect-square bg-rose-200/25 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[1600px] right-[-15%] w-[60%] aspect-square bg-indigo-200/30 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute top-[2600px] left-[-20%] w-[65%] aspect-square bg-teal-100/30 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '11s' }} />
        <div className="absolute top-[3500px] right-[-10%] w-[55%] aspect-square bg-amber-100/25 blur-[110px] rounded-full animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute top-[4400px] left-[10%] w-[50%] aspect-square bg-rose-100/20 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />

        {/* Global Technical Map Grid */}
        <div className="absolute inset-0 opacity-[0.22] mix-blend-multiply" style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '32px 32px'
        }} />

        {/* ✈️ [Y=5%] Diagonal Flight Path (Airplane) */}
        <div className="absolute top-[5%] left-0 w-full h-[500px] z-0 overflow-hidden">
          <svg className="absolute w-full h-full opacity-[0.26]" xmlns="http://www.w3.org/2000/svg">
            <path d="M -100 400 C 250 300, 500 150, 1200 -50" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="8 8" />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full animate-fly-diagonal">
            <div className="flex items-center justify-center w-16 h-16">
              <Plane size={48} className="text-indigo-500 rotate-45 drop-shadow-[0_4px_8px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
        </div>

        {/* ⚓ [Y=15%] Floating Swaying Anchored Visual Nodes (Seoul MapPin & Route Compass) */}
        <div className="absolute top-[15%] left-[8%] z-10 animate-sway opacity-100" style={{ animationDelay: '0s' }}>
          <MapPin size={36} className="text-rose-500 drop-shadow-md" />
        </div>
        <div className="absolute top-[18%] right-[8%] z-10 animate-sway opacity-100" style={{ animationDelay: '-2s', animationDuration: '7s' }}>
          <Compass size={36} className="text-indigo-500 drop-shadow-md" />
        </div>

        {/* 🚗 [Y=25%] Horizontal Road Path (Car) */}
        <div className="absolute top-[25%] left-0 w-full h-[100px] z-0 overflow-hidden">
          <div className="absolute left-0 w-full h-[2.5px] border-t border-dashed border-rose-400/40" style={{ top: '50%' }} />
          <div className="absolute top-[10px] left-0 w-full h-full animate-drive-horizontal">
            <div className="flex items-center justify-center w-16 h-16">
              <Car size={40} className="text-rose-500 drop-shadow-[0_4px_8px_rgba(244,63,94,0.5)]" />
            </div>
          </div>
        </div>

        {/* ⚓ [Y=35%] Floating Swaying Visual Nodes (Pass Ticket & Bicycle) */}
        <div className="absolute top-[32%] left-[6%] z-10 animate-sway opacity-100" style={{ animationDelay: '-4s', animationDuration: '8s' }}>
          <Ticket size={36} className="text-amber-500 drop-shadow-md" />
        </div>
        <div className="absolute top-[38%] left-0 w-full h-[100px] z-0 overflow-hidden">
          <div className="absolute left-0 w-full h-[2px] border-t border-dashed border-emerald-400/30" style={{ top: '50%' }} />
          <div className="absolute top-[15px] left-0 w-full h-full animate-drive-horizontal" style={{ animationDelay: '-5s', animationDuration: '28s' }}>
            <div className="flex items-center justify-center w-16 h-16">
              <Bike size={40} className="text-emerald-500 drop-shadow-[0_4px_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>

        {/* 🚆 [Y=48%] Straight Rail Track (Train) */}
        <div className="absolute top-[48%] left-0 w-full h-[100px] z-0 overflow-hidden">
          <div className="absolute left-0 w-full h-[2.5px] border-t border-dashed border-teal-400/40" style={{ top: '50%' }} />
          <div className="absolute top-[10px] left-0 w-full h-full animate-train-glide">
            <div className="flex items-center justify-center w-16 h-16">
              <Train size={40} className="text-teal-500 drop-shadow-[0_4px_8px_rgba(20,184,166,0.5)]" />
            </div>
          </div>
        </div>

        {/* ⚓ [Y=58%] Floating Swaying Visual Nodes (Luggage & Ocean Cruise Ship) */}
        <div className="absolute top-[55%] left-[8%] z-10 animate-sway opacity-100" style={{ animationDelay: '-1s', animationDuration: '9s' }}>
          <Luggage size={36} className="text-orange-500 drop-shadow-md" />
        </div>
        <div className="absolute top-[60%] left-0 w-full h-[100px] z-0 overflow-hidden">
          <div className="absolute left-0 w-full h-[2px] border-t border-dashed border-sky-400/40" style={{ top: '50%' }} />
          <div className="absolute top-[15px] left-0 w-full h-full animate-drive-horizontal" style={{ animationDelay: '-10s', animationDuration: '26s' }}>
            <div className="flex items-center justify-center w-16 h-16">
              <Ship size={40} className="text-sky-500 drop-shadow-[0_4px_8px_rgba(14,165,233,0.5)]" />
            </div>
          </div>
        </div>

        {/* 🚌 [Y=70%] Technical Travel Path (Bus) */}
        <div className="absolute top-[70%] left-0 w-full h-[100px] z-0 overflow-hidden">
          <div className="absolute left-0 w-full h-[2.5px] border-t border-dashed border-amber-400/45" style={{ top: '50%' }} />
          <div className="absolute top-[10px] left-0 w-full h-full animate-drive-horizontal" style={{ animationDelay: '-3s', animationDuration: '22s' }}>
            <div className="flex items-center justify-center w-16 h-16">
              <Bus size={40} className="text-amber-500 drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)]" />
            </div>
          </div>
        </div>

        {/* ⚓ [Y=80%] Floating Swaying Visual Nodes (Explorer Map & Global Globe) */}
        <div className="absolute top-[80%] left-[8%] z-10 animate-sway opacity-100" style={{ animationDelay: '-3s', animationDuration: '10s' }}>
          <Map size={36} className="text-green-500 drop-shadow-md" />
        </div>
        <div className="absolute top-[83%] right-[8%] z-10 animate-sway opacity-100" style={{ animationDelay: '-1s', animationDuration: '8s' }}>
          <Globe size={36} className="text-teal-500 drop-shadow-md" />
        </div>

        {/* 🚇 [Y=88%] Subway Rail Track (FAQ section) */}
        <div className="absolute top-[88%] left-0 w-full h-[100px] z-0 overflow-hidden">
          <div className="absolute left-0 w-full h-[2px] border-t border-dashed border-purple-400/40" style={{ top: '50%' }} />
          <div className="absolute top-[15px] left-0 w-full h-full animate-train-glide" style={{ animationDelay: '-8s', animationDuration: '28s' }}>
            <div className="flex items-center justify-center w-16 h-16">
              <Train size={40} className="text-purple-500 drop-shadow-[0_4px_8px_rgba(168,85,247,0.5)]" />
            </div>
          </div>
        </div>

        {/* ✈️ [Y=96%] Diagonal Flight Path (Return Flight above Footer) */}
        <div className="absolute top-[96%] left-0 w-full h-[350px] z-0 overflow-hidden">
          <svg className="absolute w-full h-full opacity-[0.24]" xmlns="http://www.w3.org/2000/svg">
            <path d="M 1300 300 C 950 200, 600 50, -100 -50" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="8 8" />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full animate-train-glide" style={{ animationDuration: '32s' }}>
            <div className="flex items-center justify-center w-16 h-16">
              <Plane size={48} className="text-sky-500 drop-shadow-[0_4px_8px_rgba(14,165,233,0.5)]" style={{ transform: 'scaleX(-1) rotate(45deg)' }} />
            </div>
          </div>
        </div>
      </div>
      {/* 🔴 Header Background (Video + Fallback Image) */}
      <div className="absolute top-0 w-full h-[800px] z-0 overflow-hidden">
        {/* Soft overlay to ensure high text contrast and seamless fade into content */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/35 to-white/95 z-10 pointer-events-none" />

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-88 transition-opacity duration-1000"
          style={{ filter: "brightness(1.0) saturate(1.1)" }}
          poster="/hero_background.png"
        >
          {/* We support a local high-quality MP4 file, and fall back to a premium royalty-free travel video */}
          <source src="/hero_background.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-by-the-sea-during-sunset-34283-large.mp4" type="video/mp4" />
          {/* Static image fallback if video tags are not supported */}
          <img src="/hero_background.png" alt="Hero Background Fallback" className="w-full h-full object-cover" />
        </video>
      </div>
      <header className="w-full p-4 md:px-8 flex justify-between items-center z-[100] relative">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-[28px] md:h-8 object-contain" />
          <span className="font-extrabold text-2xl tracking-tight text-slate-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)]">AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-800 font-bold text-sm drop-shadow-[0_2px_6px_rgba(255,255,255,0.95)]">
          <a href="#onboarding" className="hover:text-blue-600 transition">{t.navGuide}</a>
          <a href="#features" className="hover:text-rose-500 transition">{t.navFeatures}</a>
          <a href="#how" className="hover:text-rose-500 transition">{t.navHow}</a>
          <a href="#community" className="hover:text-rose-500 transition">{t.navCommunity}</a>
          <a href="/blog" className="text-rose-600 hover:text-rose-500 transition">블로그</a>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex bg-white/90 p-1 rounded-full text-sm font-bold shadow-md border border-slate-200/80 backdrop-blur-sm">
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${lang === 'ko' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              한국어
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${lang === 'en' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              English
            </button>
          </div>
        </div>
      </header>

      {/* 🔴 Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 relative z-10 pt-12 pb-12 w-full">
        <div className="w-full max-w-5xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)]">
            {t.titleMain}
          </h2>
          <h1 className="text-5xl md:text-[80px] lg:text-[100px] font-black tracking-tighter mb-8 leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 drop-shadow-[0_4px_16px_rgba(255,255,255,0.95)]">
            {t.titleSub}
          </h1>

          <div className="flex items-center w-full max-w-[280px] mb-8">
            <img src="/cat.png" alt="NyangPro" className="h-38 mx-4 drop-shadow-[0_4px_12px_rgba(255,255,255,0.5)]" />
          </div>

          <p className="text-lg md:text-2xl font-bold leading-relaxed mb-12 max-w-3xl px-4 tracking-tight break-keep text-slate-800 drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)]">
            {t.subText}
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-16 px-4 w-full justify-center">
            <button onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })} className="bg-rose-400 hover:bg-rose-500 text-white rounded-full px-8 py-4 font-bold text-lg transition-all active:scale-95 shadow-xl flex justify-center items-center gap-2">
              <Navigation size={20} fill="currentColor" /> {t.btnPlan}
            </button>
            <button onClick={() => document.getElementById('onboarding').scrollIntoView({ behavior: 'smooth' })} className="bg-white hover:bg-blue-50 border border-slate-200 text-slate-800 rounded-full px-8 py-4 font-bold text-lg transition-all active:scale-95 shadow-md flex justify-center items-center gap-2">
              {t.btnLearn}
            </button>
          </div>
        </div>
      </main>
      {/* 🔴 Core Features Section (3 columns) */}
      <section id="features" className="py-24 bg-white/30 backdrop-blur-[2px] relative w-full border-t border-slate-100 overflow-hidden">
        {/* Background Decorative Auras */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-300/30 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[5%] right-[-10%] w-[45%] h-[45%] bg-pink-300/30 blur-[130px] rounded-full"></div>
          <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-amber-200/40 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-700 tracking-tight mb-4">{t.featHeading}</h2>
            <p className="text-lg md:text-xl text-slate-500 font-medium">{t.featSub}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[32px] hover:bg-white hover:shadow-xl hover:shadow-rose-900/5 hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 text-rose-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{t.f1Title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{t.f1Desc}</p>
              <div className="mt-8 w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img src="/feature1.png" alt="AI Planner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[32px] hover:bg-white hover:shadow-xl hover:shadow-rose-900/5 hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 text-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{t.f2Title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{t.f2Desc}</p>
              <div className="mt-8 w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img src="/feature2.png" alt="Social Network" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            {/* Feature 3 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[32px] hover:bg-white hover:shadow-xl hover:shadow-rose-900/5 hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 text-fuchsia-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{t.f3Title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{t.f3Desc}</p>
              <div className="mt-8 w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img src="/feature3.png" alt="Travel Fund" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            {/* Feature 4 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[32px] hover:bg-white hover:shadow-xl hover:shadow-rose-900/5 hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 text-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{t.f4Title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium">{t.f4Desc}</p>
              <div className="mt-8 w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <img src="/feature4.png" alt="Safe Mode" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔴 Onboarding School (Welcome Guide) */}
      <section id="onboarding" className="py-32 bg-gradient-to-b from-blue-50/30 to-white/40 w-full overflow-hidden relative backdrop-blur-[2px]">
        {/* Sky Theme Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[5%] right-[10%] w-[300px] h-[300px] bg-blue-100/50 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-sky-100/40 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-black mb-4 uppercase tracking-widest animate-pulse">Onboarding</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight text-slate-900">
              ✈️ <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-800">{t.onboardingTitle}</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto px-4">
              {t.onboardingSub}
            </p>
          </div>

          {/* Why Trip Maker? (Floating Bubbles) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] border border-blue-100 shadow-xl shadow-blue-500/5 transition-transform hover:-translate-y-2">
              <div className="text-3xl mb-4">🌟</div>
              <h3 className="font-black text-slate-900 text-2xl mb-2">"{t.why1Title}"</h3>
              <p className="text-slate-500 text-lg font-medium">{t.why1Desc}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] border border-blue-100 shadow-xl shadow-blue-500/5 transition-transform hover:-translate-y-2">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="font-black text-slate-900 text-2xl mb-2">"{t.why2Title}"</h3>
              <p className="text-slate-500 text-lg font-medium">{t.why2Desc}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] border border-blue-100 shadow-xl shadow-blue-500/5 transition-transform hover:-translate-y-2">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="font-black text-slate-900 text-2xl mb-2">"{t.why3Title}"</h3>
              <p className="text-slate-500 text-lg font-medium">{t.why3Desc}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] border border-blue-100 shadow-xl shadow-blue-500/5 transition-transform hover:-translate-y-2">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="font-black text-slate-900 text-2xl mb-2">"{t.why4Title}"</h3>
              <p className="text-slate-500 text-lg font-medium">{t.why4Desc}</p>
            </div>
          </div>

          {/* Vertical List Content */}
          <div className="space-y-40">
            {(lang === 'ko' ? GUIDE_DATA_KO : GUIDE_DATA_EN).map((section, sIdx) => (
              <div key={section.id} className="relative">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-16 pb-6 border-b-2 border-slate-200">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-900/20">
                    {section.icon}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                    {(() => {
                      const parts = section.title.split(' ');
                      const isNumbered = parts[0].includes('.');
                      const emoji = isNumbered ? parts[1] : parts[0];
                      const restTitle = parts.slice(isNumbered ? 2 : 1).join(' ');
                      return (
                        <>
                          <span className="mr-2">{isNumbered ? parts[0] + ' ' + emoji : emoji}</span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-800">{restTitle}</span>
                        </>
                      );
                    })()}
                  </h3>
                </div>

                {/* Section Items */}
                <div className="space-y-32">
                  {section.items.map((item, dIdx) => (
                    <GuideItem
                      key={dIdx}
                      item={item}
                      sectionId={section.id}
                      dIdx={dIdx}
                      reverse={dIdx % 2 === 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>


          {/* Quick Icon Dictionary */}
          <div className="mt-40 bg-white rounded-[60px] p-12 border border-slate-100 shadow-2xl">
            <h3 className="text-3xl font-black text-center text-slate-900 mb-12">🔍 {t.iconDictTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { i: '⚙️/💳', n: t.iconDictItem1_n, d: t.iconDictItem1_d },
                { i: '➕', n: t.iconDictItem2_n, d: t.iconDictItem2_d },
                { i: '🔔', n: t.iconDictItem3_n, d: t.iconDictItem3_d },
                { i: '📊', n: t.iconDictItem4_n, d: t.iconDictItem4_d },
                { i: '💬', n: t.iconDictItem5_n, d: t.iconDictItem5_d },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-[32px] bg-slate-50 text-center border border-transparent hover:border-blue-200 transition-colors">
                  <div className="text-3xl mb-3">{item.i}</div>
                  <div className="font-black text-slate-900 text-lg mb-1">{item.n}</div>
                  <p className="text-sm text-slate-400 font-medium leading-tight">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-12 text-center text-sm font-bold text-slate-400 italic">
              {t.iconDictTip}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">

          <div className="mt-40 grid md:grid-cols-2 gap-8">
            <div className="bg-rose-500 text-white p-10 rounded-[50px] shadow-2xl">
              <h4 className="text-3xl font-black italic mb-8">{t.hostTitle}</h4>
              <ul className="space-y-4 text-lg font-bold opacity-90">
                <li>{t.hostLi1}</li>
                <li>{t.hostLi2}</li>
                <li>{t.hostLi3}</li>
                <li>{t.hostLi4}</li>
              </ul>
            </div>
            <div className="bg-white border-4 border-slate-50 p-10 rounded-[50px] shadow-lg">
              <h4 className="text-3xl font-black italic mb-8 text-slate-900">{t.memberTitle}</h4>
              <ul className="space-y-4 text-lg font-bold text-slate-500">
                <li>{t.memberLi1}</li>
                <li>{t.memberLi2}</li>
                <li>{t.memberLi3}</li>
                <li className="opacity-30 italic">{t.memberLi4}</li>
              </ul>
            </div>
          </div>


        </div>


      </section>




      {/* 🔴 Bottom CTA */}
      <section id="cta" className="py-24 bg-rose-50 w-full relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-rose-700 tracking-tight mb-6">{t.ctaHeading}</h2>
          <p className="text-lg md:text-xl text-slate-500 font-medium mb-12">{t.ctaSub}</p>
          <div className="bg-white p-2 rounded-full shadow-2xl shadow-rose-900/10 border border-slate-200 max-w-4xl w-full flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-6 py-4 md:py-2 gap-3 group">
              <MapPin className="text-gray-400" size={24} />
              <input type="text" placeholder={t.searchPlaceholder} value={destination} onChange={(e) => setDestination(e.target.value)} className="bg-transparent w-full outline-none text-slate-800 font-semibold text-lg" />
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200 self-center" />
            <div className="flex-[0.8] flex items-center px-6 py-4 md:py-2 gap-3 group">
              <CalendarIcon className="text-gray-400" size={24} />
              <DatePicker selectsRange startDate={startDate} endDate={endDate} onChange={handleDateChange} minDate={new Date()} locale={lang === 'ko' ? ko : enUS} dateFormat="yyyy.MM.dd" placeholderText={t.datePlaceholder} className="bg-transparent w-full outline-none text-slate-800 font-semibold text-lg cursor-pointer" />
            </div>
            <button onClick={generatePlan} disabled={loading} className="bg-rose-400 hover:bg-rose-500 text-white rounded-full px-8 py-4 font-bold text-lg shadow-xl flex justify-center items-center gap-2 shrink-0 md:w-auto w-full mt-2 md:mt-0">
              {loading ? <Loader2 size={24} className="animate-spin text-white" /> : <><Navigation size={20} fill="currentColor" /> {t.ctaBtn}</>}
            </button>
          </div>
        </div>
      </section>


      {/* Tech Stack Content */}
      <section id="guide" className="py-32 bg-slate-50/30 backdrop-blur-[2px] relative w-full overflow-hidden border-t border-slate-200/50">

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-black mb-4 uppercase tracking-widest">Tech Stack</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">
              💻 <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-700">{t.techTitle}</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 font-medium">{t.techDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {(lang === 'ko' ? TECH_STACK_DATA_KO : TECH_STACK_DATA_EN)[0].items.map((item, dIdx) => (
              <TechCard key={dIdx} item={item} index={dIdx} />
            ))}
          </div>

          {/* PWA Tip */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[32px] p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Smartphone size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">Tip</span>
                  <h4 className="text-2xl font-black">{t.pwaTitle}</h4>
                </div>
                <div className="text-blue-100 font-medium text-lg leading-relaxed">
                  {t.pwaDesc}
                  <p className="mt-2 text-blue-50/90 font-bold">{t.pwaNote}</p>
                </div>
              </div>
            </div>
            <a href="https://play.google.com/store/apps/details?id=pro.mytrip2.twa" target="_blank" rel="noopener noreferrer" className="bg-white text-indigo-600 px-8 py-4 rounded-full font-black text-lg hover:bg-blue-50 transition-colors shrink-0 whitespace-nowrap">
              {t.playStore}
            </a>
          </div>
        </div>
      </section>

      {/* 🔴 FAQ Section (AEO / GEO Optimization) */}
      <section id="faq" className="py-24 bg-white/40 backdrop-blur-[2px] relative w-full overflow-hidden border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-rose-100 text-rose-600 text-sm font-black mb-4 uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              {t.faqTitle}
            </h2>
            <p className="text-lg text-slate-500 font-medium">{t.faqDesc}</p>
          </div>

          <div className="space-y-4">
            {(lang === 'ko' ? FAQ_DATA_KO : FAQ_DATA_EN).map((faq, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 hover:border-rose-200 transition-colors">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex gap-3">
                  <span className="text-rose-400">Q.</span> {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium flex gap-3">
                  <span className="text-slate-300 font-bold">A.</span> {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AEO/GEO FAQ Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": (lang === 'ko' ? FAQ_DATA_KO : FAQ_DATA_EN).map(item => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.a
                }
              }))
            })
          }}
        />
      </section>

      {/* 🔴 Footer */}
      <footer className="bg-slate-50/70 backdrop-blur-md border-t border-slate-200 pt-16 pb-8 w-full relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-6 object-contain grayscale opacity-60" />
              <span className="font-extrabold text-xl text-slate-500 tracking-tighter">AI</span>
            </div>
            <div className="flex gap-6 text-sm font-bold text-slate-500">
              <a href="/blog" className="text-rose-500 hover:text-rose-600 transition">블로그</a>
              <a href="/support" className="hover:text-rose-500 transition">{t.footerContact}</a>
              <a href="/terms" className="hover:text-rose-500 transition">{t.footerTerms}</a>
              <a href="/privacy" className="hover:text-rose-500 transition">{t.footerPrivacy}</a>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-slate-400 font-medium text-xs text-center md:text-left">
            <p>{t.footerCopy}</p>
          </div>
        </div>
      </footer>

      {/* Floating App Button */}
      <div className="hidden lg:flex fixed right-8 bottom-8 z-50">
        <a href="https://play.google.com/store/apps/details?id=pro.mytrip2.twa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-950 border border-slate-900 text-white px-6 py-3 rounded-2xl transition-all hover:-translate-y-1 shadow-2xl hover:shadow-rose-500/20 group">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            {/* Left Blue Quadrant */}
            <path d="M3.2 2.2C3.1 2.4 3 2.7 3 3.1V20.9C3 21.3 3.1 21.6 3.2 21.8L12.7 12.3L3.2 2.2Z" fill="#00D7FF" />
            {/* Right Pink/Red Quadrant */}
            <path d="M16.2 8.8L12.7 12.3L16.2 15.8L20.8 13.2C22.1 12.5 22.1 11.5 20.8 10.8L16.2 8.8Z" fill="#FF3A44" />
            {/* Top Green Quadrant */}
            <path d="M12.7 12.3L16.2 8.8L3.2 1.3C3.6 1.1 4.2 1.1 4.8 1.4L16.2 8.8L12.7 12.3Z" fill="#00F076" />
            {/* Bottom Yellow Quadrant */}
            <path d="M12.7 12.3L3.2 21.8C3.8 22.1 4.4 22.1 4.8 21.8L16.2 15.8L12.7 12.3Z" fill="#FFC107" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lang === 'ko' ? '모바일 전용 앱' : 'GET IT ON'}</span>
            <span className="text-base font-black tracking-tight text-white">Google Play</span>
          </div>
        </a>
      </div>

      <style jsx global>{`
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__input-container input { width: 100%; border: none; outline: none; background: transparent; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}