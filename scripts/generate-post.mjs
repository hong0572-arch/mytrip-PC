import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { format } from 'date-fns';

// 환경 변수 로드
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY가 .env.local 파일에 설정되어 있지 않습니다.');
  console.error('   루트 디렉토리의 .env.local 파일에 GEMINI_API_KEY=your_key_here 를 추가해주세요.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const generatePost = async () => {
  const args = process.argv.slice(2);
  let topic = args[0];

  // 가장 안정적이고 최신 모델인 gemini-1.5-flash 사용
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  if (!topic) {
    console.log(`🤖 주제가 지정되지 않아 AI 에디터가 트렌디한 주제를 스스로 기획 중입니다...`);
    
    // 더 넓고 다양한 타겟층 유입을 위한 랜덤 테마 배열
    const themes = [
      "국내/해외 가성비 여행 경비 절약 및 예산 계획",
      "복잡한 여행 동선 쉽게 짜는 법 및 일정 관리 꿀팁",
      "안전한 해외여행 숙소 고르는 기준 및 치안 팁",
      "짧은 일정(주말, 2박 3일 등)을 알차게 보내는 효율적인 여행 코스",
      "혼행족을 위한 밥친구, 사진 친구 등 안전한 동행 구하는 방법",
      "극P(즉흥적) 여행자도 실패 없는 스마트한 여행 어플/IT 기기 추천",
      "SNS 핫플 피하는 나만의 숨겨진 로컬 여행지 찾는 법"
    ];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    
    const topicPrompt = `
      당신은 수백만 방문자를 보유한 트렌디한 여행 블로그의 수석 에디터입니다.
      오늘 포스팅할 메인 테마는 "[${randomTheme}]" 입니다.
      이 테마를 바탕으로, 현재 2030 여행자들이 구글에서 가장 많이 검색할 법한 '클릭률이 폭발하는 롱테일(Long-tail) 키워드 기반의 구체적인 글 주제'를 딱 1개만 제안해주세요.
      예시: "2박 3일 삿포로 여행, 교통비 아끼는 효율적인 동선 짜는 법", "여자 혼자 방콕 여행, 밤에도 치안 걱정 없는 숙소 위치 추천"
      오직 주제 문장 딱 1줄만 출력하세요.
    `;
    const topicResult = await model.generateContent(topicPrompt);
    topic = topicResult.response.text().trim();
  }

  console.log(`📝 기획된 오늘의 포스팅 주제: "${topic}"`);
  console.log(`⏳ 본문 및 SEO/GEO 메타데이터를 생성 중입니다...`);

  const prompt = `
당신은 '트립메이커(TripMaker)' 앱의 메인 여행 블로그 에디터입니다.
오늘의 블로그 주제는 "${topic}" 입니다.

[목적]
독자가 흥미롭게 읽을 수 있는 유익한 여행 정보를 풍부하게 제공하면서, **글의 중간과 결론 부근에서 자연스럽게 트립메이커 앱이 이 문제나 니즈를 완벽하게 해결해주는 필수 앱임을 홍보**해야 합니다. 억지로 광고하는 느낌이 아니라, "이 앱을 쓰면 이런 고민이 싹 해결된다"는 진정성 있는 톤앤매너를 유지하세요.

[트립메이커 앱 홍보 소스 (주제에 맞는 것만 골라서 활용)]
- AI 자동 동선 최적화: 클릭 한 번이면 구글맵 기반으로 걷는 거리까지 계산해 최적의 루트를 짜줌.
- 치안/대로변 기반 안심 숙소 필터: 밤늦게 다녀도 안전한 위치의 숙소만 찾아줌.
- 트립 메이트(동행 매칭): 본인 인증된 신뢰할 수 있는 유저들끼리 밥친구, 사진친구 매칭 가능.
- 위치 공유 (Safe Mode): 가족/친구에게 내 위치를 실시간으로 공유해 안심할 수 있음.

[GEO(생성형 검색) 및 SEO 최적화 지침]
최근 AI 검색엔진(ChatGPT, Perplexity)과 구글 스니펫 노출에 최적화되도록 아래 구조를 지켜주세요.
1. 요약 블록: 글의 최상단에 바쁜 독자를 위한 **[핵심 3줄 요약]** 블록을 인용구(>)로 넣으세요.
2. 자연스러운 키워드 배치: "혼자 해외여행", "여행 일정 어플", "트립메이커", "안전한 여행" 등 트래픽이 높은 키워드를 본문에 5번 이상 자연스럽게 녹이세요.
3. 가독성 극대화: H2(##), H3(###) 소제목과 총알 기호(-) 리스트를 활용해 정보를 깔끔하게 정리하세요.
4. FAQ 구조: 글 맨 마지막에 **[자주 묻는 질문 (FAQ)]** 섹션을 만들어 2개의 Q&A를 포함하세요 (Q 중 하나는 트립메이커 기능에 대한 질문 포함).

[Frontmatter 형식 (문서 맨 위 --- 로 감쌀 것)]
---
title: "클릭을 유발하는 호기심 가득한 제목 (최대 40자 내외)"
description: "구글 검색 결과에 노출될 150자 이내의 요약 설명"
date: "${format(new Date(), 'yyyy-MM-dd')}"
tags: ["해외여행", "여행준비", "여행어플추천", "트립메이커", "태그5"]
seoKeywords: "해외여행 일정 짜기, 여행 어플 추천, 트립메이커, 안전한 여행, 주제관련키워드1, 주제관련키워드2"
coverImage: "/hero_background.png"
---

[본문 작성]
(HTML을 절대 쓰지 말고 오직 순수 Markdown 기호만 사용할 것. 친절하고 전문성 있는 여행 인플루언서의 문체 유지.)
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // 슬러그(파일명) 생성 로직
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const safeTopic = topic.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9가-힣-]/g, '').toLowerCase();
    const slug = `${dateStr}-${safeTopic || 'new-post'}`;
    const filename = `${slug}.md`;
    
    const outputDir = path.join(process.cwd(), 'content/posts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, responseText, 'utf8');
    
    console.log(`✅ 포스팅 생성이 완료되었습니다!`);
    console.log(`📂 저장 위치: content/posts/${filename}`);
  } catch (error) {
    console.error('❌ 포스팅 생성 중 오류가 발생했습니다:', error);
  }
};

generatePost();
