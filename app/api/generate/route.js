import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const TOUR_API_KEY = "8ed14b467e021a7ef5801d0a9628602170d0414f8ade42814a9cde30ec04f2fb";

// 🌍 TourAPI 연동 함수 (language 파라미터 추가!)
async function fetchRealTourData(keyword, language) {
  try {
    // ✨ 핵심: 한국어면 KorService1, 영어면 EngService1, 중국어면 ChsService1을 호출합니다!
    let serviceName = 'KorService1';
    if (language === 'en') serviceName = 'EngService1';
    else if (language === 'zh') serviceName = 'ChsService1';

    const url = `https://apis.data.go.kr/B551011/${serviceName}/searchKeyword1?serviceKey=${TOUR_API_KEY}&numOfRows=40&pageNo=1&MobileOS=ETC&MobileApp=TripMaker&_type=json&listYN=Y&arrange=O&keyword=${encodeURIComponent(keyword)}`;

    const res = await fetch(url, { method: 'GET', timeout: 5000 });
    if (!res.ok) return null;

    const data = await res.json();
    const items = data?.response?.body?.items?.item;

    if (items && items.length > 0) {
      const placesList = items.map(item => {
        // 영문일 경우 카테고리 이름도 영어로 변경
        const type = item.contenttypeid === '39'
          ? (language === 'en' ? 'Restaurant/Cafe' : (language === 'zh' ? '餐厅/咖啡馆' : '음식점/카페'))
          : (language === 'en' ? 'Tourist Attraction' : (language === 'zh' ? '旅游景点' : '관광지/명소'));

        return `- ${item.title} (${type}, Address: ${item.addr1}, lat: ${item.mapy}, lng: ${item.mapx})`;
      }).join('\n');
      return placesList;
    }
    return null;
  } catch (error) {
    console.error("TourAPI Fetch Error:", error);
    return null;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      destination, startDate, endDate, companion,
      budget, people, hotelType, tourType,
      themes, request, isLuxury, language
    } = body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let targetLang = 'Korean';
    if (language === 'en') targetLang = 'English';
    else if (language === 'zh') targetLang = 'Chinese';

    const budgetText = isLuxury
      ? (language === 'en' || language === 'zh' ? `Unlimited` : `1인당 2,000만원 ~ 5,000만원`)
      : (language === 'en' ? `Per person ${budget}0,000 KRW` : (language === 'zh' ? `每人 ${budget}0,000 韩元` : `1인당 ${budget}0,000 원`));

    // ✨ 이제 언어(language) 정보도 같이 넘겨서 한/영 데이터를 알아서 가져오게 합니다.
    const realTourData = await fetchRealTourData(destination, language);

    const tourApiPrompt = realTourData ? `
      [🚨 TOUR API REAL DATA - CRITICAL PRIORITY]
      You MUST use the following REAL places to build the itinerary.
      IMPORTANT: If you use a place from this list, you MUST include its exact 'lat' and 'lng' in the JSON output!
      
      <Real Places List>
      ${realTourData}
      </Real Places List>
    ` : "";

    const prompt = `
      You are a professional travel planner "Nyang-Pro".
      Plan a **${days}-day trip** to **${destination}** (${startDate} ~ ${endDate}).
      
      [Traveler Info]
      Companion: ${companion}, People: ${people}, Budget: ${budgetText}, Style: ${tourType}
      
      [🚨 USER REQUEST]
      "${request || "No special request"}"

      ${tourApiPrompt}

      [Output Format (JSON Only)]
      Return ONLY the following JSON.
      {
        "tripTitle": "Title in ${targetLang}",
        "arrivalIata": "3-letter IATA",
        "departureIata": "3-letter IATA",
        "weather": "Weather info",
        "travelTips": ["Tip1", "Tip2"],
        "budgetBreakdown": ["Detail..."],
        "estimatedCost": "Total Cost",
        "recommendedHotels": [
          {
            "name": "Hotel Name",
            "priceRange": "Price",
            "description": "Desc",
            "address": "Address",
            "googleSearchQuery": "Name + City"
          }
        ],
        "itinerary": [
          {
            "day": 1,
            "date": "YYYY-MM-DD",
            "places": [
              {
                "order": 1,
                "name": "Place Name", 
                "category": "Category",
                "description": "Description",
                "address": "Address",
                "googleSearchQuery": "Name + City",
                "lat": "Latitude number from Real Places List (or null if not available)",
                "lng": "Longitude number from Real Places List (or null if not available)"
              }
            ]
          }
        ],
        "quiz": [{"question": "Q?", "options": ["A","B","C","D"], "answer": 0}]
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const jsonResult = JSON.parse(text);

    return NextResponse.json({ result: jsonResult });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate plan." }, { status: 500 });
  }
}