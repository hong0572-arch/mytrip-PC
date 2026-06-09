
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://tripmaker.tips'),
  title: {
    default: "Trip Maker - 내 손안의 AI 여행 가이드",
    template: `%s | Trip Maker`
  },
  description: "일본, 유럽, 동남아 어디든! AI가 즉시 짜주는 맞춤형 여행 일정. Trip Maker와 함께 가장 안전하고 스마트한 여행을 계획하세요.",
  keywords: ["AI 여행 계획", "트립메이커", "Trip Maker", "여행 일정 짜기", "AI 플래너", "해외여행 코스", "나홀로 여행", "가족여행 계획"],
  alternates: {
    canonical: 'https://tripmaker.tips',
    languages: {
      'ko-KR': 'https://tripmaker.tips',
      'en-US': 'https://tripmaker.tips/?lang=en',
    },
  },
  openGraph: {
    title: "Trip Maker - 내 손안의 AI 여행 가이드",
    description: "AI가 제안하는 최적의 여행 코스! 지금 바로 나만의 여행을 만들어보세요.",
    url: "https://tripmaker.tips",
    siteName: "Trip Maker",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip Maker AI Travel Guide",
    description: "AI가 즉시 짜주는 맞춤형 여행 일정",
    images: ["/og-image.jpg"],
  },
  other: {
    "geo.region": "KR",
    "geo.placename": "Seoul",
    "geo.position": "37.5665;126.9780",
    "ICBM": "37.5665, 126.9780",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://tripmaker.tips/#organization",
                  "name": "트립메이커 (Trip Maker)",
                  "url": "https://tripmaker.tips",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://tripmaker.tips/logo.png"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "email": "tripmaker@tripmaker.tips",
                    "contactType": "customer support"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://tripmaker.tips/#website",
                  "url": "https://tripmaker.tips",
                  "name": "Trip Maker - AI 여행 플래너",
                  "description": "AI가 즉시 짜주는 맞춤형 여행 일정 및 안심 동행 서비스",
                  "publisher": {
                    "@id": "https://tripmaker.tips/#organization"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://tripmaker.tips/#application",
                  "name": "Trip Maker",
                  "operatingSystem": "Web, Android, iOS",
                  "applicationCategory": "TravelApplication",
                  "description": "AI-powered travel planner for personalized itineraries.",
                  "url": "https://tripmaker.tips",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "KRW"
                  },
                  "publisher": {
                    "@id": "https://tripmaker.tips/#organization"
                  }
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
