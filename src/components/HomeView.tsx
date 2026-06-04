import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Plane, Thermometer, Info, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../types';
import { useState, useEffect } from 'react';

interface HomeViewProps {
  isAdmin: boolean;
  setActiveCategory: (cat: Category) => void;
}

const JAPAN_IMAGES = [
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578469645742-46cae010e5d4?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518144591331-17a5dd71c477?q=80&w=2070&auto=format&fit=crop"
];

export default function HomeView({ isAdmin, setActiveCategory }: HomeViewProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % JAPAN_IMAGES.length);
  const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + JAPAN_IMAGES.length) % JAPAN_IMAGES.length);

  return (
    <div className="flex flex-col p-6 md:p-10 lg:p-12 gap-8 bg-white">
      {/* Top Bar with Header and Mini Widgets */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-50 pb-8">
        <div>
           <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-brand-blue rounded-2xl shadow-sm">
                <Plane className="w-8 h-8 text-brand-accent fill-brand-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-display text-slate-900 tracking-tight">재팬 로컬로그</h2>
           </div>
           <p className="text-slate-400 text-lg md:text-xl font-medium ml-1">직접 다녀오고 알려주는 일본의 찐맛집·놀거리 지도!</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-[11px] font-bold">
              <span className="text-brand-accent">￥</span> 912.45
           </div>
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-[11px] font-bold">
              <span>Tokyo ☀️ 24°</span>
           </div>
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 경보: 정상 🟢
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* quadrant 1 (Top Left): Image Slider - Sized down */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden group aspect-[16/9] md:aspect-auto h-[240px]">
           <AnimatePresence mode="wait">
             <motion.img 
               key={currentImageIdx}
               src={JAPAN_IMAGES[currentImageIdx]} 
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ duration: 0.6 }}
               className="w-full h-full object-cover"
             />
           </AnimatePresence>
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
           <div className="absolute bottom-6 left-8 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Visual Log</p>
              <h3 className="text-2xl font-bold font-display">아름다운 일본의 풍경</h3>
           </div>

           <div className="absolute inset-y-0 left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={prevImage} className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
           </div>
           <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={nextImage} className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
           </div>
           
           <div className="absolute bottom-6 right-8 flex gap-1">
              {JAPAN_IMAGES.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === currentImageIdx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
              ))}
           </div>
        </div>

        {/* quadrant 2 (Top Right): Flight Concept - Sized down */}
        <div className="bg-[#1a2b3c] rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-white h-[240px]">
           {/* FocusFlight Inspired Background */}
           <div className="absolute inset-0 overflow-hidden opacity-30">
              <div className="absolute top-1/2 left-0 w-[200%] h-[1px] bg-sky-400 transform -translate-y-1/2 animate-pulse" />
              <div className="absolute top-1/2 left-1/4 w-[1px] h-full bg-sky-200 transform -translate-y-1/2 opacity-20" />
              <div className="absolute top-1/2 left-3/4 w-[1px] h-full bg-sky-200 transform -translate-y-1/2 opacity-20" />
           </div>

           <motion.div 
             animate={{ y: [0, -6, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="relative z-10 flex flex-col items-center gap-4"
           >
              <Plane className="w-12 h-12 text-sky-300 drop-shadow-[0_0_15px_rgba(125,211,252,0.5)] rotate-45 fill-sky-300" />
              <div className="text-center">
                 <h2 className="text-xl font-bold font-display text-sky-100 mb-1">In-Flight Now</h2>
                 <p className="text-sky-300/60 font-mono text-[8px] tracking-[0.4em] uppercase font-bold">Japan Localog Guide</p>
              </div>
           </motion.div>

           <div className="absolute bottom-8 left-10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[10px] font-mono text-sky-400 font-bold tracking-widest uppercase">Cruising at Local Spot</span>
           </div>
        </div>

        {/* quadrant 3 (Bottom Left): Season/Calendar Tips */}
        <div className="bg-brand-blue rounded-[32px] p-8 flex flex-col justify-between border border-blue-100 relative overflow-hidden group min-h-[280px]">
           <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-blue-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
           <div className="relative">
              <div className="bg-white/60 backdrop-blur w-fit p-3 rounded-2xl mb-6 shadow-sm">
                <CalendarDays className="w-6 h-6 text-brand-accent" />
              </div>
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-xl font-bold text-brand-text font-display">시즌 추천 팁</h4>
                 <button 
                   onClick={() => setActiveCategory('Posts')}
                   className="text-[10px] font-bold text-slate-400 hover:text-brand-accent transition-colors flex items-center gap-1 uppercase tracking-widest"
                 >
                   더보기 <ChevronRight className="w-3 h-3" />
                 </button>
              </div>
              <div className="space-y-4">
                 <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-white/50 shadow-sm">
                    <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-2">5~6월 추천</p>
                    <p className="text-sm font-medium leading-relaxed">
                      이바라키 국영 히타치 해변공원의 <span className="text-brand-accent font-bold">네모필라 축제</span> 정보 확인해보세요! 끝없는 푸른 꽃밭이 정말 아름다워요. ✨
                    </p>
                 </div>
                 <div className="bg-white/40 p-4 rounded-2xl text-[11px] text-slate-500 font-medium">
                   💡 도쿄 근교 가마쿠라의 수국 시즌도 곧 시작됩니다.
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-2 mt-4">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Monthly Guide</span>
             <div className="flex-1 h-[1px] bg-blue-100" />
           </div>
        </div>

        {/* quadrant 4 (Bottom Right): Popular Ranking */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[280px]">
           <div>
              <h4 className="text-xl font-bold mb-8 font-display flex items-center justify-between">
                <span>실시간 인기 여행지</span>
                <span className="text-[10px] px-3 py-1 bg-brand-yellow rounded-full uppercase tracking-widest font-bold">Top 3</span>
              </h4>
              <div className="space-y-4">
                 {[
                   { rank: 1, name: '도쿄 아자부주다이', category: '맛집/카페' },
                   { rank: 2, name: '오사카 나라 사슴공원', category: '관광지' },
                   { rank: 3, name: '이바라키 츠쿠바산', category: '풍경' },
                 ].map((item) => (
                   <div key={item.rank} className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                      <span className="text-2xl font-bold italic text-brand-accent group-hover:scale-110 transition-transform">0{item.rank}</span>
                      <div className="flex-1">
                        <p className="font-bold text-brand-text group-hover:text-black transition-colors">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{item.category}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity">
                         <img 
                           src={item.rank === 2 ? "/src/assets/images/regenerated_image_1780562218860.png" : `https://images.unsplash.com/photo-${item.rank === 1 ? '1551024601-bec78aea704b' : item.rank === 2 ? '1542640244-7e672d6cef21' : '1528143358801-41376ee6390d'}?q=80&w=100&auto=format&fit=crop`} 
                           alt="thumb" 
                           className="w-full h-full object-cover" 
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">More destinations</span>
              <button 
                onClick={() => setActiveCategory('Posts')}
                className="text-brand-accent p-1 hover:translate-x-1 transition-transform"
              >
                 <ChevronRight className="w-5 h-5" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
