import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { format } from 'date-fns';

// 환경 변수 로드
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY가 설정되어 있지 않습니다.');
  process.exit(1);
} else {
  const maskedKey = API_KEY.length > 8
    ? `${API_KEY.substring(0, 6)}...${API_KEY.substring(API_KEY.length - 4)}`
    : 'INVALID_SHORT_KEY';
  console.log(`🔑 사용 중인 API Key: ${maskedKey} (길이: ${API_KEY.length})`);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const generatePostForLang = async (lang) => {
  console.log(`\n🌐 [${lang.toUpperCase()}] 자동 블로그 포스팅 생성을 시작합니다.`);
  
  try {
    // 가장 안정적이고 최신 모델인 gemini-3.1-flash-lite 사용
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    
    let topic = "";

    if (lang === 'ko') {
      // 더 넓고 다양한 타겟층 유입을 위한 랜덤 테마 배열 (한국어)
      const themesKo = [
        "국내/해외 가성비 여행 경비 절약 및 예산 계획",
        "복잡한 여행 동선 쉽게 짜는 법 및 일정 관리 꿀팁",
        "안전한 해외여행 숙소 고르는 기준 및 치안 팁",
        "짧은 일정(주말, 2박 3일 등)을 알차게 보내는 효율적인 여행 코스",
        "혼행족을 위한 밥친구, 사진 친구 등 안전한 동행 구하는 방법",
        "극P(즉흥적) 여행자도 실패 없는 스마트한 여행 어플/IT 기기 추천",
        "SNS 핫플 피하는 나만의 숨겨진 로컬 여행지 찾는 법"
      ];
      const randomTheme = themesKo[Math.floor(Math.random() * themesKo.length)];
      
      const topicPrompt = `
        당신은 수백만 방문자를 보유한 트렌디한 여행 블로그의 수석 에디터입니다.
        오늘 포스팅할 메인 테마는 "[${randomTheme}]" 입니다.
        이 테마를 바탕으로, 현재 2030 여행자들이 구글에서 가장 많이 검색할 법한 '클릭률이 폭발하는 롱테일(Long-tail) 키워드 기반의 구체적인 글 주제'를 딱 1개만 제안해주세요.
        예시: "2박 3일 삿포로 여행, 교통비 아끼는 효율적인 동선 짜는 법", "여자 혼자 방콕 여행, 밤에도 치안 걱정 없는 숙소 위치 추천"
        오직 주제 문장 딱 1줄만 출력하세요.
      `;
      const topicResult = await model.generateContent(topicPrompt);
      topic = topicResult.response.text().trim().replace(/^"|"$/g, '');
    } else {
      // 더 넓고 다양한 타겟층 유입을 위한 랜덤 테마 배열 (영어)
      const themesEn = [
        "How to save travel budget & smart planning tips",
        "Easy travel itinerary & route optimization guide",
        "Choosing safe hotels & security tips for female travelers",
        "Efficient short trip travel course (weekend getaway)",
        "How to find safe travel companions & eat-buddies for solo travelers",
        "Smart travel apps & tech devices for spontaneous travelers",
        "How to find hidden local spots avoiding crowded tourist traps"
      ];
      const randomTheme = themesEn[Math.floor(Math.random() * themesEn.length)];
      
      const topicPrompt = `
        You are the editor-in-chief of a trendy travel blog with millions of visitors.
        Today's main theme is "[${randomTheme}]".
        Based on this theme, suggest exactly ONE specific blog post topic/title that 2030 travelers are most likely to search for on Google (high CTR, long-tail keyword-based).
        Example: "2-Day Tokyo Itinerary: How to Save Transportation Costs", "Solo Female Travel in Bangkok: Safest Hotel Areas Recommended"
        Output only the topic sentence in English, exactly 1 line, without any quotes or explanations.
      `;
      const topicResult = await model.generateContent(topicPrompt);
      topic = topicResult.response.text().trim().replace(/^"|"$/g, '');
    }

    console.log(`📝 [${lang.toUpperCase()}] 오늘의 포스팅 주제: "${topic}"`);
    console.log(`⏳ 본문 및 SEO/GEO 메타데이터를 생성 중입니다...`);

    let prompt = "";

    if (lang === 'ko') {
      prompt = `
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
language: "ko"
coverImage: "/hero_background.png"
---

[본문 작성]
(HTML을 절대 쓰지 말고 오직 순수 Markdown 기호만 사용할 것. 친절하고 전문성 있는 여행 인플루언서의 문체 유지.)
`;
    } else {
      prompt = `
You are the main travel blog editor of 'TripMaker' app.
Today's blog topic is "${topic}".

[Goal]
Provide rich, helpful travel information that readers will enjoy. Natural integration is key: **smoothly promote the TripMaker app in the middle and conclusion** as the ultimate app to solve their travel worries. Do not make it look like forced advertising; keep a warm, helpful, and professional tone.

[TripMaker App Promotion Features (Use appropriate ones for the topic)]
- AI Route Optimization: Automatically calculates walking distance and traffic to plan the best route based on Google Maps in one click.
- Safety & 대로변 (Main Street) Hotel Filter: Helps find hotels located in safe areas, even for late-night walks.
- Trip Mate (Companion Matching): Connect with verified, trustworthy users to find eat-buddies or photo-mates.
- Real-time Location Sharing (Safe Mode): Share live location with family/friends for extra safety.

[GEO (Generative Engine Optimization) & SEO Guidelines]
To optimize for AI search engines (ChatGPT, Perplexity) and Google Featured Snippets:
1. Summary Block: Put a **[Key 3-Line Summary]** block using blockquote (>) at the very top of the post.
2. Keywords Integration: Naturally integrate high-traffic keywords like "solo travel", "travel planner app", "TripMaker", "safe travel" at least 5 times in the body.
3. Readability: Use H2(##), H3(###), and bullet points(-) to organize information clearly.
4. FAQ Structure: End the post with a **[Frequently Asked Questions (FAQ)]** section containing exactly 2 Q&As (one of them must feature a TripMaker function).

[Frontmatter Format (Surround with --- at the very top)]
---
title: "Eye-catching, high-CTR title (max 40 characters)"
description: "A summary under 150 characters that will show on Google search results"
date: "${format(new Date(), 'yyyy-MM-dd')}"
tags: ["traveltips", "travelplanner", "travelapp", "TripMaker", "tag5"]
seoKeywords: "travel planning, travel app, TripMaker, safe travel, topic-related-keyword1, topic-related-keyword2"
language: "en"
coverImage: "/hero_background.png"
---

[Body Output]
(Do NOT use HTML tags. Write only in pure Markdown. Keep a warm, friendly travel influencer tone.)
`;
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // 슬러그(파일명) 생성 로직
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const safeTopic = topic.replace(/\s+/g, '-').replace(lang === 'ko' ? /[^a-zA-Z0-9가-힣-]/g : /[^a-zA-Z0-9-]/g, '').toLowerCase();
    const slug = `${dateStr}-${lang}-${safeTopic || 'new-post'}`;
    const filename = `${slug}.md`;
    
    // 1. AI에게 주제에 맞는 고품질 이미지 생성 영어 프롬프트 기획 요청
    console.log(`⏳ AI 커버 이미지 생성을 위해 전용 프롬프트를 기획하고 있습니다...`);
    const imgPromptText = lang === 'ko' ? `
      당신은 여행 블로그의 전문 크리에이티브 디렉터입니다.
      오늘 포스팅할 주제는 "${topic}" 입니다.
      이 주제에 완벽히 매칭되며, 독자가 클릭하고 싶게 만드는 따뜻하고 아름다운 여행 사진(cover image)을 생성하기 위한 AI 프롬프트를 영어로 1문장만 작성해 주세요.
      - 규칙 1: 인물(얼굴)보다는 아름다운 풍경, 도시 골목, 감성적인 여행 소품, 열차 창밖 풍경 등의 요소를 위주로 하세요.
      - 규칙 2: 따뜻하고 부드러운 빛(warm lighting, soft focus, aesthetic travel photography, photorealistic, 8k, highly detailed) 분위기를 묘사하세요.
      - 규칙 3: 오직 영어로 작성된 프롬프트 문장 딱 1줄만 출력하세요 (부가 설명, 인용부호 "" 절대 금지).
    ` : `
      You are a professional creative director of a travel blog.
      Today's post topic is "${topic}".
      Write exactly ONE sentence of English AI image prompt to generate a beautiful travel cover photo matching this topic.
      - Rule 1: Focus on scenic views, vintage city streets, cozy travel details, or views from train windows, rather than close-up faces of people.
      - Rule 2: Describe a warm, aesthetic travel photography style with soft focus, warm lighting, photorealistic, 8k, highly detailed.
      - Rule 3: Output exactly 1 line of the English prompt without any quotes, brackets, or explanations.
    `;
    
    let coverImagePath = "/hero_background.png"; // 실패 시 기본 이미지 폴백
    try {
      const imgPromptResult = await model.generateContent(imgPromptText);
      const imgPrompt = imgPromptResult.response.text().trim().replace(/^"|"$/g, '');
      console.log(`🎨 기획된 이미지 프롬프트: "${imgPrompt}"`);
      
      // 2. Pollinations AI를 통해 이미지 다운로드
      console.log(`📸 AI 커버 이미지를 생성하는 중입니다...`);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imgPrompt)}?width=1024&height=768&nologo=true&private=true&seed=${Math.floor(Math.random() * 100000)}`;
      
      const imgResponse = await fetch(pollinationsUrl);
      if (imgResponse.ok) {
        const buffer = Buffer.from(await imgResponse.arrayBuffer());
        const publicDir = path.join(process.cwd(), 'public/images/posts');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        const imgFilename = `${slug}.jpg`;
        fs.writeFileSync(path.join(publicDir, imgFilename), buffer);
        coverImagePath = `/images/posts/${imgFilename}`;
        console.log(`✅ AI 커버 이미지가 다운로드되어 저장되었습니다: ${coverImagePath}`);
      } else {
        console.warn(`⚠️ 이미지 생성 서버 응답 오류 (HTTP ${imgResponse.status}), 기본 이미지를 사용합니다.`);
      }
    } catch (imgError) {
      console.error(`❌ AI 이미지 생성 중 오류 발생, 기본 커버이미지를 사용합니다:`, imgError);
    }
    
    // 3. 생성된 본문의 coverImage 경로를 동적으로 치환
    let postContent = responseText;
    postContent = postContent.replace(/coverImage:\s*["']?\/hero_background\.png["']?/g, `coverImage: "${coverImagePath}"`);
    
    const outputDir = path.join(process.cwd(), 'content/posts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, postContent, 'utf8');
    
    console.log(`✅ [${lang.toUpperCase()}] 포스팅 및 AI 이미지 생성이 완벽히 완료되었습니다!`);
    console.log(`📂 글 저장 위치: content/posts/${filename}`);
    if (coverImagePath !== "/hero_background.png") {
      console.log(`📂 이미지 저장 위치: public${coverImagePath}`);
    }

    // SNS (디스코드, 텔레그램) 채널로 자동 알림 전송
    const cleanTitle = postContent.match(/title:\s*["']?(.*?)["']?\r?\n/)?.[1] || topic;
    const cleanDesc = postContent.match(/description:\s*["']?(.*?)["']?\r?\n/)?.[1] || "TripMaker AI Editor Post";
    await sendSnsAlerts(cleanTitle, slug, cleanDesc, lang, coverImagePath);
    
  } catch (error) {
    console.error(`❌ [${lang.toUpperCase()}] 포스팅 생성 중 오류가 발생했습니다:`, error);
    throw error;
  }
};

// 📡 디스코드 / 텔레그램 알림 전송 모듈
const sendSnsAlerts = async (title, slug, description, lang, coverImagePath) => {
  const baseUrl = 'https://tripmaker.tips';
  const postUrl = `${baseUrl}/blog/${slug}`;
  
  // 1. 디스코드 웹훅 알림 (DISCORD_WEBHOOK_URL 환경변수 존재 시)
  const discordUrl = process.env.DISCORD_WEBHOOK_URL;
  if (discordUrl) {
    try {
      console.log(`📡 [Discord] 새 포스팅 알림 전송 중...`);
      const payload = {
        embeds: [{
          title: lang === 'ko' ? `📝 새 블로그 포스팅: ${title}` : `📝 New Blog Post: ${title}`,
          description: description,
          url: postUrl,
          color: 16001118, // Rose-500 (#F43F5E)
          fields: [
            { name: 'Language', value: lang === 'ko' ? '🇰🇷 한국어 (Korean)' : '🇺🇸 영어 (English)', inline: true },
            { name: 'Link', value: `[Read Article](${postUrl})`, inline: true }
          ],
          image: {
            url: coverImagePath.startsWith('http') ? coverImagePath : `${baseUrl}${coverImagePath}`
          },
          timestamp: new Date().toISOString(),
          footer: {
            text: 'TripMaker AI Editor Hub',
            icon_url: `${baseUrl}/logo.png`
          }
        }]
      };
      
      const res = await fetch(discordUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        console.log(`✅ [Discord] 알림 전송 성공!`);
      } else {
        console.warn(`⚠️ [Discord] 전송 실패 (HTTP ${res.status})`);
      }
    } catch (err) {
      console.error(`❌ [Discord] 알림 전송 중 예외 발생:`, err);
    }
  }

  // 2. 텔레그램 채널 알림 (TELEGRAM_BOT_TOKEN 및 TELEGRAM_CHAT_ID 환경변수 존재 시)
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChatId) {
    try {
      console.log(`📡 [Telegram] 새 포스팅 알림 전송 중...`);
      
      // 마크다운 형식으로 포맷팅 (특수문자 이스케이프 주의)
      const text = lang === 'ko'
        ? `*📝 새 블로그 포스팅 발행*\n\n*제목:* ${title}\n*요약:* ${description}\n\n👉 [블로그에서 전체 읽기](${postUrl})`
        : `*📝 New Blog Post Published*\n\n*Title:* ${title}\n*Summary:* ${description}\n\n👉 [Read Full Post on Blog](${postUrl})`;
      
      const tgUrl = `https://api.telegram.org/bot${tgToken}/sendMessage`;
      const res = await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: text,
          parse_mode: 'Markdown',
          disable_web_page_preview: false
        })
      });
      if (res.ok) {
        console.log(`✅ [Telegram] 알림 전송 성공!`);
      } else {
        console.warn(`⚠️ [Telegram] 전송 실패 (HTTP ${res.status})`);
      }
    } catch (err) {
      console.error(`❌ [Telegram] 알림 전송 중 예외 발생:`, err);
    }
  }
};

const generatePost = async () => {
  const args = process.argv.slice(2);
  let topic = args[0];

  try {
    if (topic) {
      // 주제가 명시적으로 주어진 경우, 한글/영어 중 하나로 자동 판단해서 1개만 만듦
      const isKorean = /[가-힣]/.test(topic);
      await generatePostForLang(isKorean ? 'ko' : 'en');
    } else {
      // 주제가 없는 자동 빌드 시에는 매일 한글 1개, 영어 1개씩 동시에 생성
      await generatePostForLang('ko');
      await generatePostForLang('en');
    }
  } catch (err) {
    console.error(`❌ 블로그 포스트 생성 프로세스가 실패했습니다:`, err);
    process.exit(1);
  }
};

generatePost();
