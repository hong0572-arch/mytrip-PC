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

  // 가장 안정적이고 최신 모델인 gemini-1.5-pro-latest 사용
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

  if (!topic) {
    console.log(`🤖 주제가 지정되지 않아 AI 에디터가 트렌디한 주제를 스스로 기획 중입니다...`);
    const topicPrompt = `
      당신은 2030 여성 혼행족 타겟의 수석 여행 블로그 에디터입니다.
      오늘 작성할 가장 클릭률이 높고 구글 검색량이 많은 "여자 혼자 해외/국내 여행" 관련 롱테일(Long-tail) 키워드 주제를 1개만 제안해주세요.
      예시: "여자 혼자 방콕 여행 치안 좋은 숙소 고르는 법", "2박 3일 삿포로 혼자 여행 경비 및 동선 총정리"
      오직 주제 문장 딱 1줄만 출력하세요.
    `;
    const topicResult = await model.generateContent(topicPrompt);
    topic = topicResult.response.text().trim();
  }

  console.log(`📝 기획된 오늘의 포스팅 주제: "${topic}"`);
  console.log(`⏳ 본문 및 SEO/GEO 메타데이터를 생성 중입니다...`);

  const prompt = `
당신은 '트립메이커(TripMaker)' 앱의 메인 여행 블로그 에디터입니다.
타겟 독자: "혼자 여행하는 2030 여성 여행자"
오늘의 주제: "${topic}"

[목적]
타겟 독자의 여행 고민에 깊이 공감하며, 트립메이커 앱의 유용한 기능(치안 데이터 기반 숙소 필터링, 안전 동행 '트립 메이트' 매칭, AI 동선 최적화, 위치 공유 Safe Mode 등)을 자연스럽게 해결책으로 제시합니다.

[GEO(생성형 검색) 및 SEO 최적화 지침]
최근 AI 검색엔진(ChatGPT, Perplexity)과 구글 스니펫 노출에 최적화되도록 아래 구조를 반드시 지켜주세요.
1. 요약 블록: 글의 최상단 도입부 직후에 바쁜 독자를 위한 **[핵심 3줄 요약]** 블록을 인용구(>)로 넣으세요.
2. 롱테일 키워드: "여자 혼자 여행", "안전한 여행지", "트립메이커 앱" 등 구체적인 검색어를 자연스럽게 본문에 5번 이상 배치하세요.
3. 정보 가독성: H2(##), H3(###) 소제목과 총알 기호(-) 리스트를 적극 활용하세요.
4. FAQ 구조: 글 마지막 부분에 **[자주 묻는 질문 (FAQ)]** 섹션을 만들어 주제와 관련된 2개의 Q&A를 작성하세요.

[Frontmatter 형식 (반드시 문서 맨 위 --- 로 감쌀 것)]
---
title: "클릭을 유도하는 매력적인 제목 (최대 40자 내외)"
description: "구글 검색 결과에 노출될 150자 이내의 호기심 유발 요약 설명"
date: "${format(new Date(), 'yyyy-MM-dd')}"
tags: ["혼자여행", "여성여행자", "트립메이커", "태그4", "태그5"]
seoKeywords: "여자 혼자 여행, 안전한 해외여행, 트립메이커 활용법, 주제관련키워드1, 주제관련키워드2"
coverImage: "/hero_background.png"
---

[본문 작성]
(HTML을 절대 쓰지 말고 오직 순수 Markdown 기호만 사용할 것. 친절하고 다정하면서 전문성 있는 에디터의 문체 유지.)
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
