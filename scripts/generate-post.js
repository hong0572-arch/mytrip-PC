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
  // 터미널 인자로 주제를 받습니다. (예: node scripts/generate-post.js "후쿠오카 2박3일 일정")
  const args = process.argv.slice(2);
  const topic = args[0] || '혼자 떠나는 첫 여행 준비하기';

  console.log(`🤖 AI 트립메이커 에디터가 다음 주제로 포스팅을 작성 중입니다: "${topic}"...`);

  // 비용 효율적이고 빠른 gemini-1.5-flash 모델 사용
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
당신은 '트립메이커(TripMaker)' 앱의 메인 여행 블로그 에디터입니다.
이번 블로그 글의 타겟 독자는 "혼자 여행하는 여행자"와 "여성 여행자"입니다.
주제는 "${topic}" 입니다.

이 글의 목적은 타겟 독자가 공감할 수 있는 여행의 고민이나 로망을 이야기하면서, 트립메이커 앱의 특정 기능(활용 방법, 구체적 활용 예시)을 자연스럽고 매우 유용하게 소개하는 것입니다.
트립메이커 기능 예시 (선택 활용): "안전 동행 매칭(트립 메이트)", "안전 최우선 숙소 필터(치안 점수, 대로변 인접)", "AI 자동 동선 최적화", "실시간 위치 공유(Safe Mode)" 등.

다음 형식의 마크다운(Markdown) 문서를 작성해 주세요. 문서에는 반드시 Frontmatter 블록이 포함되어야 합니다.

[Frontmatter 형식]
---
title: "클릭을 유도하는 매력적이고 세련된 제목 (예: 혼자서도 완벽하게! 여자 혼자 떠나는 오사카 여행, 트립메이커 활용법)"
description: "구글 검색 노출(SEO)을 위한 150자 이내의 요약 설명"
date: "${format(new Date(), 'yyyy-MM-dd')}"
tags: ["혼자여행", "여성여행자", "트립메이커", "태그4", "태그5"]
seoKeywords: "혼자 여행, 여성 여행자, 안전한 여행, 트립메이커, 추천 동선"
coverImage: "/hero_background.png"
---

[본문 작성 가이드]
- 서론: 독자의 고민과 감정에 깊이 공감하는 도입부 작성.
- 본론: 주제에 맞는 트립메이커 앱 실제 활용 방법 및 구체적인 활용 예시 (h2(##), 리스트(-) 등 마크다운 활용).
- 결론: 팁 요약 및 앱 활용 격려.

참고 사항:
- HTML 태그 대신 순수 Markdown 기호만 사용할 것.
- 반드시 문서 최상단에 --- 로 감싸진 Frontmatter를 포함할 것.
- 독자에게 친근하고 다정한, 동시에 전문성 있는 에디터의 문체를 사용할 것.
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
