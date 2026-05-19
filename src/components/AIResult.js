'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    MapPin, Calendar, Wallet, Users, Compass, ExternalLink,
    BedDouble, Navigation, Home, Search, Download, Loader2
} from 'lucide-react';
import { motion } from "framer-motion";

// ✨ PDF 및 이미지 변환 라이브러리
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { getTranslation } from '../lib/translations';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // 기존 프로젝트의 env 설정과 동일하게 맞춰주세요
const DAY_COLORS = ['#FF4B4B', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export default function AIResult({ data, userInfo, onReset, language = 'ko' }) {
    const t = getTranslation(language);
    const [tripPlan, setTripPlan] = useState(null);
    const [loadingAction, setLoadingAction] = useState(null);
    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const markersRef = useRef([]);
    const polylineRef = useRef([]);

    // 1. 데이터 파싱
    useEffect(() => {
        if (!data) return;
        try {
            let initialData = data;
            if (typeof data === 'string') {
                const cleanData = data.replace(/```json/g, '').replace(/```/g, '').trim();
                initialData = JSON.parse(cleanData);
            }

            // 공공데이터(TourAPI) 좌표가 있다면 구조 변환
            if (initialData.itinerary) {
                initialData.itinerary.forEach(day => {
                    day.places.forEach(place => {
                        if (place.lat && place.lng) {
                            place.coordinates = { lat: parseFloat(place.lat), lng: parseFloat(place.lng) };
                        }
                    });
                });
            }
            setTripPlan(initialData);
        } catch (e) {
            console.error(t.common.error_parsing + ":", e);
        }
    }, [data, t]);

    // 2. 구글 맵 로드 및 마커 표시
    useEffect(() => {
        if (!tripPlan || !tripPlan.itinerary) return;

        const loadMap = () => {
            if (!window.google || !mapRef.current) return;

            if (!googleMapRef.current) {
                const startLocation = tripPlan.itinerary[0]?.places[0]?.coordinates || { lat: 37.5665, lng: 126.9780 };
                googleMapRef.current = new google.maps.Map(mapRef.current, {
                    center: startLocation,
                    zoom: 13,
                    disableDefaultUI: false,
                    styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]
                });
            }

            const map = googleMapRef.current;
            markersRef.current.forEach(m => m.setMap(null));
            polylineRef.current.forEach(p => p.setMap(null));
            markersRef.current = []; polylineRef.current = [];

            const bounds = new google.maps.LatLngBounds();
            let needsAutoFix = false;

            tripPlan.itinerary.forEach((dayItem, index) => {
                const dayColor = DAY_COLORS[index % DAY_COLORS.length];
                const path = [];

                dayItem.places.forEach((place, placeIdx) => {
                    if (place.coordinates) {
                        path.push(place.coordinates);
                        bounds.extend(place.coordinates);
                        const marker = new google.maps.Marker({
                            position: place.coordinates, map,
                            icon: { path: google.maps.SymbolPath.CIRCLE, fillColor: dayColor, fillOpacity: 1, strokeColor: "white", strokeWeight: 2, scale: 12 },
                            label: { text: (placeIdx + 1).toString(), color: "white", fontWeight: "bold", fontSize: "12px" }
                        });
                        markersRef.current.push(marker);
                    } else {
                        needsAutoFix = true; // 좌표가 없는 해외/기타 장소는 검색 필요
                    }
                });

                if (path.length > 1) {
                    const line = new google.maps.Polyline({ path, geodesic: true, strokeColor: dayColor, strokeOpacity: 0.8, strokeWeight: 4, map });
                    polylineRef.current.push(line);
                }
            });

            if (!bounds.isEmpty()) map.fitBounds(bounds);

            // 좌표가 없는 경우(해외 등)에만 텍스트로 검색해서 핀 꽂기
            if (needsAutoFix) performSilentAutoFix(map);
        };

        if (!window.google) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true; script.defer = true;
            script.onload = loadMap;
            document.head.appendChild(script);
        } else {
            loadMap();
        }
    }, [tripPlan]);

    const performSilentAutoFix = async (mapInstance) => {
        const service = new google.maps.places.PlacesService(mapInstance);
        const newPlan = { ...tripPlan };
        const region = tripPlan.destination || "";
        let isUpdated = false;

        for (let dayIdx = 0; dayIdx < newPlan.itinerary.length; dayIdx++) {
            for (let placeIdx = 0; placeIdx < newPlan.itinerary[dayIdx].places.length; placeIdx++) {
                const place = newPlan.itinerary[dayIdx].places[placeIdx];
                if (place.coordinates) continue; // 이미 좌표가 있으면 패스

                await new Promise((resolve) => {
                    setTimeout(() => {
                        let searchQuery = `${region} ${place.name}`;
                        service.findPlaceFromQuery({ query: searchQuery, fields: ['geometry'] }, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
                                place.coordinates = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
                                isUpdated = true;
                            }
                            resolve();
                        });
                    }, 300);
                });
            }
        }
        if (isUpdated) setTripPlan({ ...newPlan });
    };

    // --- 🔥 PDF 다운로드 (완벽한 A4 분할 출력) ---
    const handleDownloadPDF = async () => {
        const PDF_TEMPLATE_ID = "pdf-document-template";
        const source = document.getElementById(PDF_TEMPLATE_ID);
        if (!source) return;

        setLoadingAction('pdf');
        try {
            // 1. 임시 출력 컨테이너 생성 (화면 밖에 배치)
            const printContainerId = 'pdf-print-container';
            let printContainer = document.getElementById(printContainerId);
            if (printContainer) printContainer.remove();

            printContainer = document.createElement('div');
            printContainer.id = printContainerId;
            printContainer.style.position = 'fixed';
            printContainer.style.top = '0';
            printContainer.style.left = '0';
            printContainer.style.zIndex = '-9999';
            printContainer.style.backgroundColor = '#f0f0f0';
            document.body.appendChild(printContainer);

            // 2. A4 규격 설정 (mm 단위)
            const A4_WIDTH_MM = 210;
            const A4_HEIGHT_MM = 297;
            const MARGIN_MM = 15;

            // 픽셀 단위 변환 (96DPI 기준 대략적 계산)
            const PAGE_WIDTH_PX = 794; // A4 width at 96 DPI
            const PAGE_HEIGHT_PX = 1123; // A4 height at 96 DPI
            const PADDING_PX = 56; // approx 15mm

            const createPage = () => {
                const page = document.createElement('div');
                page.className = 'pdf-page bg-white shadow-lg';
                page.style.width = `${PAGE_WIDTH_PX}px`;
                page.style.height = `${PAGE_HEIGHT_PX}px`;
                page.style.padding = `${PADDING_PX}px`;
                page.style.boxSizing = 'border-box';
                page.style.marginBottom = '20px';
                page.style.overflow = 'hidden';
                page.style.position = 'relative';
                page.style.fontFamily = 'sans-serif';

                const contentArea = document.createElement('div');
                contentArea.style.width = '100%';
                contentArea.style.height = '100%';
                contentArea.className = 'flex flex-col';
                page.appendChild(contentArea);

                printContainer.appendChild(page);
                return { page, content: contentArea };
            };

            // 3. 페이지네이션 로직
            const items = Array.from(source.querySelectorAll('.pdf-item'));
            const pages = [];

            let currentPage = createPage();
            pages.push(currentPage);

            for (const item of items) {
                const clone = item.cloneNode(true);
                clone.style.marginTop = '0';
                clone.style.marginBottom = '20px';

                currentPage.content.appendChild(clone);

                const contentHeight = currentPage.content.scrollHeight;
                const maxHeight = currentPage.content.clientHeight;

                if (contentHeight > maxHeight) {
                    currentPage.content.removeChild(clone);
                    currentPage = createPage();
                    pages.push(currentPage);
                    currentPage.content.appendChild(clone);
                }
            }

            // 렌더링 안정화 대기
            await new Promise(resolve => setTimeout(resolve, 800));

            // 4. 각 페이지를 이미지로 변환하여 PDF 병합
            const pdf = new jsPDF('p', 'mm', 'a4');

            for (let i = 0; i < pages.length; i++) {
                const pageElement = pages[i].page;

                const imgData = await toPng(pageElement, {
                    quality: 1.0,
                    pixelRatio: 2,
                    cacheBust: true,
                    backgroundColor: 'white',
                });

                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
            }

            pdf.save(`${tripPlan.tripTitle || 'trip_plan'}.pdf`);
            document.body.removeChild(printContainer);

        } catch (error) {
            console.error("PDF Pagination Error:", error);
            alert(t.common.error_pdf);
        } finally {
            setLoadingAction(null);
        }
    };

    if (!tripPlan) return <div className="h-screen flex items-center justify-center">{t.common.loading}</div>;

    // 🔥 여기서부터 진짜 PC 버전 2단 스플릿 뷰 레이아웃!
    return (
        <div className="w-full h-screen flex flex-col md:flex-row bg-white overflow-hidden">

            {/* 좌측: 구글 맵 영역 (PC에서는 화면의 절반 차지) */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-full relative shadow-lg z-10">
                <div ref={mapRef} className="w-full h-full bg-gray-200" />
                <button onClick={onReset} className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md text-gray-800 font-bold rounded-xl shadow-md flex items-center gap-2 hover:bg-white transition">
                    <Home size={16} /> {t.common.home}
                </button>
                <button
                    onClick={handleDownloadPDF}
                    disabled={loadingAction === 'pdf'}
                    className="absolute top-6 right-6 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-70"
                >
                    {loadingAction === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {t.common.save_pdf}
                </button>
            </div>

            {/* 우측: 상세 일정 영역 (스크롤 가능) */}
            <div className="w-full md:w-1/2 h-[60vh] md:h-full overflow-y-auto bg-gray-50 p-6 md:p-10 custom-scrollbar">
                <div className="max-w-xl mx-auto space-y-8">

                    {/* 타이틀 및 예산 요약 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h1 className="text-5xl font-black text-gray-900 mb-2">{tripPlan.tripTitle}</h1>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-lg font-bold flex items-center gap-1"><MapPin size={18} /> {userInfo?.destination}</span>
                            <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-lg font-bold flex items-center gap-1"><Calendar size={18} /> {userInfo?.startDate}</span>
                        </div>
                        <h3 className="font-black text-gray-800 text-2xl mb-2 border-b pb-2">💰 {t.result.budget_summary}: <span className="text-rose-500">{tripPlan.estimatedCost}</span></h3>
                        <ul className="text-lg text-gray-600 space-y-1 list-disc list-inside">
                            {tripPlan.budgetBreakdown?.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                    </div>

                    {/* 추천 숙소 */}
                    {tripPlan.recommendedHotels && tripPlan.recommendedHotels.length > 0 && (
                        <div>
                            <h3 className="font-black text-2xl text-gray-800 mb-3 flex items-center gap-2"><BedDouble className="text-indigo-500" /> {t.result.recommended_hotels}</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {tripPlan.recommendedHotels.map((hotel, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group cursor-pointer hover:border-indigo-400 transition" onClick={() => window.open(`https://www.google.com/search?q=${hotel.name}`, '_blank')}>
                                        <div>
                                            <h4 className="font-black text-xl text-gray-900 group-hover:text-indigo-600 transition">{hotel.name}</h4>
                                            <p className="text-base text-gray-500">{hotel.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-rose-500 font-bold text-lg block">{hotel.priceRange}</span>
                                            <Search size={18} className="inline text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 데일리 일정 */}
                    <div>
                        <h3 className="font-black text-2xl text-gray-800 mb-4 flex items-center gap-2"><Compass className="text-indigo-500" /> {t.result.itinerary_detail}</h3>
                        {tripPlan.itinerary?.map((day, dIdx) => (
                            <div key={dIdx} className="mb-8">
                                <div className="inline-block bg-slate-800 text-white px-4 py-1.5 rounded-lg font-bold text-lg mb-4 shadow-sm">
                                    {t.result.day} {day.day} <span className="font-normal opacity-70 ml-2">{day.date}</span>
                                </div>
                                <div className="pl-4 border-l-2 border-slate-200 ml-2 space-y-4">
                                    {day.places.map((place, pIdx) => (
                                        <div key={pIdx} className="relative pl-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer" onClick={() => { if (place.coordinates) { googleMapRef.current?.panTo(place.coordinates); googleMapRef.current?.setZoom(16); } }}>
                                            <div className="absolute -left-[29px] top-4 w-7 h-7 bg-white border-2 border-slate-800 rounded-full flex items-center justify-center text-base font-bold text-slate-800 z-10">{pIdx + 1}</div>
                                            <h4 className="font-black text-2xl text-gray-900 mb-1">{place.name}</h4>
                                            <span className="inline-block bg-gray-100 text-gray-500 text-sm px-2 py-0.5 rounded mb-2">{place.category}</span>
                                            <p className="text-lg text-gray-600 leading-relaxed mb-3">{place.description}</p>

                                            <div className="flex gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`, '_blank'); }} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-base font-bold flex items-center gap-1 hover:bg-blue-100 transition"><ExternalLink size={16} /> {t.result.google_maps}</button>
                                                {!place.category?.includes("Restaurant") && !place.category?.includes("음식점") && (
                                                    <button onClick={(e) => { e.stopPropagation(); window.open(`https://www.klook.com/ko/search?query=${encodeURIComponent(place.name)}`, '_blank'); }} className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-lg text-base font-bold flex items-center gap-1 hover:bg-rose-100 transition">🎟️ {t.result.tickets}</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* 🔥 [핵심] PDF 변환용 숨겨진 A4 서식 (Smart Pagination 적용) */}
            <div
                id="pdf-document-template"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -9999,
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '15mm',
                    backgroundColor: 'white',
                    color: 'black',
                    fontFamily: 'sans-serif',
                    visibility: 'hidden'
                }}
            >
                {tripPlan && (
                    <>
                        <div className="pdf-item text-center border-b-2 border-black pb-5 mb-8">
                            <h1 className="text-3xl font-bold mb-2">{tripPlan.tripTitle}</h1>
                            <p className="text-gray-500">{t.pdf.subtitle}</p>
                        </div>

                        {/* 1. 여행 개요 */}
                        <div className="pdf-item mb-8">
                            <h2 className="text-xl font-bold border-l-4 border-indigo-600 pl-3 mb-4">{t.pdf.overview}</h2>
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                <ul className="space-y-2">
                                    <li className="flex"><span className="font-bold w-24">{t.pdf.destination}:</span> {userInfo?.destination}</li>
                                    <li className="flex"><span className="font-bold w-24">{t.pdf.start_date}:</span> {userInfo?.startDate}</li>
                                    <li className="flex"><span className="font-bold w-24">{t.pdf.total_cost}:</span> {tripPlan.estimatedCost}</li>
                                    <li>
                                        <span className="font-bold block mb-1">{t.pdf.budget_detail}:</span>
                                        <ul className="list-disc list-inside pl-2 text-sm text-gray-700">
                                            {tripPlan.budgetBreakdown?.map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 2. 상세 일정 */}
                        <div className="mb-8">
                            <h2 className="pdf-item text-xl font-bold border-l-4 border-indigo-600 pl-3 mb-4">{t.pdf.itinerary}</h2>
                            {tripPlan.itinerary?.map((day, idx) => (
                                <div key={idx} className="mb-6">
                                    <div className="pdf-item mb-3">
                                        <h3 className="font-bold text-lg bg-indigo-50 px-3 py-1 rounded inline-block text-indigo-800">
                                            {t.result.day} {day.day} <span className="text-sm font-normal text-gray-500 ml-2">{day.date}</span>
                                        </h3>
                                    </div>
                                    <div className="space-y-3 pl-2 border-l-2 border-gray-200 ml-2">
                                        {day.places.map((place, pIndex) => (
                                            <div key={pIndex} className="pdf-item bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100 relative">
                                                <h4 className="font-bold text-gray-800 text-base">
                                                    <span className="text-rose-500 mr-2">{pIndex + 1}.</span>
                                                    {place.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">{place.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}