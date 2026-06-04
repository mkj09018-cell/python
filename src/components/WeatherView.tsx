import { Search, Thermometer, Droplets, Wind, Map as MapIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const REGIONS = [
  { id: 'Hokkaido', name: '홋카이도', temp: 18, humidity: 45, dust: '좋음' },
  { id: 'Tohoku', name: '토호쿠', temp: 20, humidity: 50, dust: '좋음' },
  { id: 'Kanto', name: '칸토', temp: 24, humidity: 60, dust: '보통' },
  { id: 'Chubu', name: '중부', temp: 22, humidity: 55, dust: '좋음' },
  { id: 'Kansai', name: '간사이', temp: 26, humidity: 58, dust: '보통' },
  { id: 'Chugoku', name: '추코쿠', temp: 23, humidity: 62, dust: '좋음' },
  { id: 'Shikoku', name: '시코쿠', temp: 24, humidity: 65, dust: '좋음' },
  { id: 'Kyushu', name: '큐슈', temp: 25, humidity: 70, dust: '보통' },
  { id: 'Okinawa', name: '오키나와', temp: 29, humidity: 80, dust: '좋음' },
  { id: 'Tokyo', name: '도쿄', temp: 24, humidity: 62, dust: '보통' },
  { id: 'Osaka', name: '오사카', temp: 26, humidity: 55, dust: '보통' },
  { id: 'Kyoto', name: '쿄토', temp: 25, humidity: 50, dust: '좋음' },
  { id: 'Tsukuba', name: '츠쿠바', temp: 23, humidity: 58, dust: '좋음' },
  { id: 'Saitama', name: '사이타마', temp: 24, humidity: 60, dust: '좋음' },
  { id: 'Sapporo', name: '삿포로', temp: 18, humidity: 42, dust: '좋음' },
];

export default function WeatherView() {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const filteredRegions = REGIONS.filter(r => r.name.includes(searchQuery));

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
       <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold font-display flex items-center gap-3">
            <span className="bg-pink-100 p-2 rounded-xl flex items-center justify-center text-white shadow-sm shadow-pink-50">☀️</span> 지역별 날씨 정보
          </h2>
       </div>

       <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
         {/* Search Bar */}
         <div className="relative mb-16 max-w-xl mx-auto">
            <div className="relative group">
               <input 
                 type="text"
                 value={searchQuery}
                 onChange={(e) => {
                   setSearchQuery(e.target.value);
                   setShowAutocomplete(true);
                 }}
                 onFocus={() => setShowAutocomplete(true)}
                 placeholder="지역 이름을 검색하세요 (예: 도쿄, 오사카...)"
                 className="w-full bg-slate-50 border-0 rounded-[2rem] px-8 py-5 text-lg shadow-inner focus:ring-2 focus:ring-brand-accent outline-none transition-all pl-16"
               />
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6" />
            </div>

            <AnimatePresence>
               {showAutocomplete && searchQuery && (
                 <motion.div 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-20"
                 >
                    {filteredRegions.map((r) => (
                      <button 
                        key={r.id}
                        onClick={() => {
                          setSelectedRegion(r);
                          setSearchQuery(r.name);
                          setShowAutocomplete(false);
                        }}
                        className="w-full text-left px-8 py-4 hover:bg-brand-mint/20 transition-colors flex items-center gap-3"
                      >
                         <MapIcon className="w-4 h-4 text-brand-accent" />
                         <span className="font-medium">{r.name}</span>
                      </button>
                    ))}
                    {filteredRegions.length === 0 && (
                      <div className="px-8 py-4 text-slate-400 italic text-sm">결과가 없습니다.</div>
                    )}
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
               <div className="flex justify-center w-full">
                  <p className="text-[21px] font-black text-slate-500 font-display uppercase tracking-wider">지도를 클릭하여 지역을 선택하세요</p>
               </div>
               {/* Map Illustration */}
               <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 relative aspect-square flex items-center justify-center overflow-hidden group">
               {/* Detailed Japan Map SVG with Region-specific paths */}
               <svg viewBox="0 0 400 400" className="w-full h-full text-slate-200 fill-current drop-shadow-sm">
                 {/* Hokkaido */}
                 <path 
                   d="M245 42 L268 35 L292 48 L308 65 L298 92 L275 105 L245 108 L225 98 L222 75 L235 55 Z M265 38 L285 25 L300 35 L285 45 Z" 
                   className="hover:fill-brand-yellow/80 transition-colors cursor-pointer" 
                   onClick={() => setSelectedRegion(REGIONS[0])} 
                 />
                 
                 {/* Tohoku (North Honshu) */}
                 <path 
                   d="M225 110 L245 108 L265 135 L272 165 L255 195 L225 210 L210 185 L215 145 Z" 
                   className="hover:fill-brand-mint/60 transition-colors cursor-pointer" 
                   onClick={() => setSelectedRegion(REGIONS[1])} 
                 />
                 
                 {/* Kanto (Tokyo area) */}
                 <path 
                   d="M225 210 L255 195 L278 215 L265 245 L245 255 L215 248 L210 225 Z" 
                   className="hover:fill-brand-mint/80 transition-colors cursor-pointer" 
                   onClick={() => setSelectedRegion(REGIONS[2])} 
                 />
                 
                 {/* Chubu (Central Honshu) */}
                 <path 
                   d="M175 195 L210 185 L225 210 L210 225 L215 248 L185 260 L165 245 L160 215 Z" 
                   className="hover:fill-brand-mint/60 transition-colors cursor-pointer" 
                   onClick={() => setSelectedRegion(REGIONS[3])} 
                 />
                 
                 {/* Kansai (Osaka area) */}
                 <path 
                   d="M145 235 L165 245 L185 260 L168 285 L145 288 L128 275 L130 250 Z" 
                   className="hover:fill-brand-mint/90 transition-colors cursor-pointer" 
                   onClick={() => setSelectedRegion(REGIONS[4])} 
                 />
                 
                 {/* Chugoku (West Honshu) */}
                 <path 
                   d="M95 255 L130 250 L128 275 L90 285 L75 270 Z" 
                   className="hover:fill-brand-mint/60 transition-colors cursor-pointer" 
                   onClick={() => setSelectedRegion(REGIONS[5])} 
                 />
                 
                 {/* Shikoku */}
                 <path 
                   d="M105 295 L145 292 L142 320 L110 325 L95 310 Z" 
                   className="hover:fill-brand-yellow/80 transition-colors cursor-pointer" 
                   onClick={() => setSelectedRegion(REGIONS[6])} 
                 />
                 
                 {/* Kyushu */}
                 <path 
                   d="M55 295 L85 288 L98 315 L88 355 L65 365 L48 340 L50 310 Z" 
                   className="hover:fill-brand-mint hover:opacity-100 transition-colors cursor-pointer" 
                   onClick={() => setSelectedRegion(REGIONS[7])} 
                 />
                 
                 {/* Okinawa */}
                 <path 
                   d="M30 375 L45 372 L42 385 L28 388 Z" 
                   className="hover:fill-brand-accent transition-colors cursor-pointer" 
                   onClick={() => setSelectedRegion(REGIONS[8])} 
                 />
                 <circle cx="20" cy="385" r="3" className="hover:fill-brand-accent transition-colors cursor-pointer" onClick={() => setSelectedRegion(REGIONS[8])} />
                 
                 {/* Labels */}
                 <text x="245" y="80" className="text-[10px] fill-slate-500 font-bold pointer-events-none drop-shadow-sm">Sapporo</text>
                 <text x="240" y="235" className="text-[10px] fill-slate-500 font-bold pointer-events-none drop-shadow-sm">Tokyo</text>
                 <text x="145" y="272" className="text-[10px] fill-slate-500 font-bold pointer-events-none drop-shadow-sm">Osaka</text>
                 <text x="60" y="340" className="text-[10px] fill-slate-500 font-bold pointer-events-none drop-shadow-sm">Fukuoka</text>
                 <text x="10" y="375" className="text-[9px] fill-slate-400 font-bold pointer-events-none">Okinawa</text>

                 {/* Specific City Points */}
                 <circle cx="235" cy="72" r="4" className="fill-brand-accent/40 hover:fill-brand-accent transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedRegion(REGIONS[14]); }} />
                 <circle cx="242" cy="225" r="4" className="fill-brand-accent/40 hover:fill-brand-accent transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedRegion(REGIONS[9]); }} />
                 <circle cx="150" cy="258" r="4" className="fill-brand-accent/40 hover:fill-brand-accent transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedRegion(REGIONS[10]); }} />
                 <circle cx="158" cy="250" r="3" className="fill-brand-accent/40 hover:fill-brand-accent transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedRegion(REGIONS[11]); }} />
                 <circle cx="248" cy="210" r="3" className="fill-brand-accent/40 hover:fill-brand-accent transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedRegion(REGIONS[12]); }} />
                 <circle cx="232" cy="215" r="3" className="fill-brand-accent/40 hover:fill-brand-accent transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedRegion(REGIONS[13]); }} />
               </svg>
            </div>
         </div>

         {/* Weather Info */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedRegion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="flex items-center justify-between px-2">
                    <h3 className="text-4xl font-bold font-display text-brand-text">{selectedRegion.name}</h3>
                    <div className="flex items-center gap-3">
                       <div className="text-[46px] font-bold font-display text-brand-accent">
                          {selectedRegion.temp}<span className="text-2xl">°C</span>
                       </div>
                       <div className="w-16 h-16 bg-brand-mint/10 rounded-full flex items-center justify-center">
                          <Thermometer className="w-8 h-8 text-brand-accent" />
                       </div>
                    </div>
                 </div>

                 {/* Main Metrics (Top Area) */}
                 <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                    <div className="grid grid-cols-3 gap-6">
                       <div className="flex flex-col items-center gap-2">
                          <Droplets className="w-6 h-6 text-blue-400" />
                          <span className="text-[14px] font-bold text-slate-400 uppercase tracking-tight">습도</span>
                          <span className="text-[23px] font-bold text-slate-700">{selectedRegion.humidity}%</span>
                       </div>
                       <div className="flex flex-col items-center gap-2 border-x border-slate-200">
                          <Wind className="w-6 h-6 text-emerald-400" />
                          <span className="text-[14px] font-bold text-slate-400 uppercase tracking-tight">미세먼지</span>
                          <span className="text-[23px] font-bold text-slate-700">{selectedRegion.dust}</span>
                       </div>
                       <div className="flex flex-col items-center gap-2">
                          <Thermometer className="w-6 h-6 text-orange-400" />
                          <span className="text-[14px] font-bold text-slate-400 uppercase tracking-tight">체감온도</span>
                          <span className="text-[23px] font-bold text-slate-700">{selectedRegion.temp + 2}°C</span>
                       </div>
                    </div>
                 </div>

                 {/* Hourly Forecast (Separated) */}
                 <div className="space-y-4 px-2">
                    <p className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> 하루의 예보 (Daily)
                    </p>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                       {[8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4, 6].map((hour, i) => (
                         <div key={i} className="flex-shrink-0 flex flex-col items-center bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-brand-mint transition-colors cursor-default min-w-[70px]">
                            <span className="text-[9px] font-bold text-slate-400 mb-2">{hour}시</span>
                            <span className="text-2xl mb-1">{hour > 6 && hour < 19 ? '☀️' : '🌙'}</span>
                            <span className="text-sm font-bold text-slate-700">{selectedRegion.temp + parseInt((Math.sin(i/2)*4).toFixed(0))}°</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4 px-2">
                    <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span> 7일간 예보 (Weekly)
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                         <div key={i} className="flex-shrink-0 w-24 flex flex-col items-center bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-brand-mint transition-colors cursor-default">
                            <span className="text-[10px] font-bold text-slate-400 uppercase mb-3">{day}</span>
                            <span className="text-2xl mb-2">☀️</span>
                            <span className="text-sm font-bold text-slate-700">{selectedRegion.temp + (i%2 === 0 ? 1 : -1)}°</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            </AnimatePresence>
         </div>
       </div>
    </div>
  );
}
