import { motion } from 'motion/react';
import { ExternalLink, ShieldAlert, Youtube, Smartphone } from 'lucide-react';

const NEWS_DATA = [
  { id: 1, type: '자연재해', title: '간토 지역 집중 호우 주의보... 산사태 위험 지역 대피 권고', date: '2026-05-30', content: '일본 기상청은 오늘 오후 간토 지역에 시간당 50mm 이상의 강한 비가 내릴 것으로 예보했습니다...' },
  { id: 2, type: '범죄', title: '신주쿠 카부키초 일대 호객 행위 집중 단속... 여행객 주의 당부', date: '2026-05-29', content: '경찰은 최근 급증하는 불법 호객 행위로부터 관광객을 보호하기 위해 야간 순찰을 강화합니다...' },
  { id: 3, type: '날씨', title: '오키나와 인근 해상에서 태풍 발생 가능성... 주말 여행 일정 확인 필요', date: '2026-05-28', content: '기상청은 남해상에서 북상 중인 저기압이 태풍으로 발달할 가능성이 크다고 전했습니다...' },
  { id: 4, type: '자연재해', title: '이바라키현 규모 4.2 지진 발생... 쓰나미 위험은 없어', date: '2026-05-27', content: '오늘 오전 10시경 이바라키현 남부에서 지진이 발생했으나 큰 피해는 접수되지 않았습니다...' },
];

const RECOMMENDED_APPS = [
  { name: 'NERV (방재 정보)', desc: '지진, 해일, 화산 등 실시간 재난 알림' },
  { name: 'Yahoo! Disaster Prevention', desc: '일본 현지에서 가장 신뢰받는 방재 앱' },
];

const YOUTUBE_CHANNELS = [
  { name: 'ANN News (실시간)', desc: '일본의 가장 빠른 속보 방송' },
  { name: 'Weather News', desc: '전문적인 기상 정보 채널' },
];

export default function NewsView() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
       <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold font-display flex items-center gap-3">
            <span className="bg-purple-100 p-2 rounded-xl">📰</span> 일본 뉴스 및 안전 정보
          </h2>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: News List (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-4">
             {NEWS_DATA.map((news) => (
               <motion.div 
                 key={news.id}
                 whileHover={{ x: 5 }}
                 className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:border-brand-accent/40 transition-all cursor-pointer group"
               >
                  <div className="flex justify-between items-center mb-3">
                     <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                        news.type === '자연재해' ? 'bg-red-50 text-red-500' : 
                        news.type === '범죄' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                     }`}>
                       {news.type}
                     </span>
                     <span className="text-xs text-slate-400">{news.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-brand-accent transition-colors">{news.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {news.content}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    자세히 보기 <ArrowRight className="w-3 h-3" />
                  </div>
               </motion.div>
             ))}
          </div>

          {/* Right: Sidebar Info */}
          <div className="space-y-8">
             {/* Recommended Apps */}
             <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <Smartphone className="w-5 h-5 text-brand-accent" /> 재난 대비 추천 앱
                </h4>
                <div className="space-y-4">
                   {RECOMMENDED_APPS.map((app, i) => (
                     <div key={i} className="flex flex-col gap-1 p-4 bg-slate-50 rounded-2xl">
                        <p className="font-bold text-sm flex items-center justify-between">
                          {app.name} <ExternalLink className="w-3 h-3 text-slate-300" />
                        </p>
                        <p className="text-xs text-slate-500">{app.desc}</p>
                     </div>
                   ))}
                </div>
             </section>

             {/* Youtube Channels */}
             <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <Youtube className="w-5 h-5 text-red-500" /> 뉴스 유튜브 채널
                </h4>
                <div className="space-y-4">
                   {YOUTUBE_CHANNELS.map((ch, i) => (
                     <div key={i} className="flex flex-col gap-1 p-4 bg-slate-50 rounded-2xl">
                        <p className="font-bold text-sm flex items-center justify-between">
                          {ch.name} <ExternalLink className="w-3 h-3 text-slate-300" />
                        </p>
                        <p className="text-xs text-slate-500">{ch.desc}</p>
                     </div>
                   ))}
                </div>
             </section>

             {/* Emergency Banner */}
             <div className="bg-red-500 text-white p-6 rounded-[2rem] shadow-lg flex items-center gap-4">
                <ShieldAlert className="w-10 h-10 flex-shrink-0" />
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Emergency Contact</p>
                   <p className="text-lg font-bold">일본 긴급 번호: 110, 119</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
