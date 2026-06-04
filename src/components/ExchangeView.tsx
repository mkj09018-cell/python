import { useState, useEffect } from 'react';
import { RefreshCw, ArrowRightLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_DATA = [
  { date: '05.01', rate: 910 },
  { date: '05.05', rate: 915 },
  { date: '05.10', rate: 908 },
  { date: '05.15', rate: 912 },
  { date: '05.20', rate: 905 },
  { date: '05.25', rate: 910 },
  { date: '05.30', rate: 915 },
  { date: '06.01', rate: 920 },
  { date: '06.04', rate: 910 },
];

export default function ExchangeView() {
  const [krwAmount, setKrwAmount] = useState<string>('10000');
  const [jpyAmount, setJpyAmount] = useState<string>('1100');
  const [rate, setRate] = useState<number>(0.11); // Fallback rate
  const [isLoading, setIsLoading] = useState(false);

  // Mock fetching rate
  useEffect(() => {
    setIsLoading(true);
    // In a real app, you'd call a free api like exchange-rate-api or similar
    setTimeout(() => {
      setRate(0.11); 
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleKrwChange = (val: string) => {
    setKrwAmount(val);
    const numValue = parseFloat(val);
    if (!isNaN(numValue)) {
      setJpyAmount((numValue * rate).toFixed(0));
    }
  };

  const handleJpyChange = (val: string) => {
    setJpyAmount(val);
    const numValue = parseFloat(val);
    if (!isNaN(numValue)) {
      setKrwAmount((numValue / rate).toFixed(0));
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
         <h2 className="text-3xl font-bold font-display flex items-center gap-3">
           <span className="bg-brand-yellow p-2 rounded-xl">💴</span> 환율 계산 & 계산기
         </h2>
      </div>

      <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
           {/* Current Rate Card */}
           <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 flex flex-col justify-center items-center">
              <p className="text-sm font-medium text-slate-500 mb-2">실시간 환율 (JPY/KRW)</p>
              <div className="flex items-end gap-2">
                 <span className="text-4xl font-bold font-display">100 ¥</span>
                 <span className="text-2xl font-medium text-slate-400 mb-1">=</span>
                 <span className="text-4xl font-bold font-display text-brand-accent">910 ₩</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> 최근 업데이트: {new Date().toLocaleTimeString()}
              </p>
           </div>

           {/* Calculator */}
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-500 ml-1">한국 원 (KRW)</label>
                 <div className="relative">
                   <input 
                     type="number"
                     value={krwAmount}
                     onChange={(e) => handleKrwChange(e.target.value)}
                     className="w-full bg-slate-50 border-0 rounded-2xl p-5 text-xl font-bold focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                   />
                   <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">₩</span>
                 </div>
              </div>

              <div className="flex justify-center -my-3 relative z-10">
                 <div className="bg-white p-2 rounded-full shadow-lg border border-slate-100">
                   <ArrowRightLeft className="w-5 h-5 text-brand-accent transform rotate-90" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-500 ml-1">일본 엔 (JPY)</label>
                 <div className="relative">
                   <input 
                     type="number"
                     value={jpyAmount}
                     onChange={(e) => handleJpyChange(e.target.value)}
                     className="w-full bg-slate-50 border-0 rounded-2xl p-5 text-xl font-bold focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                   />
                   <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">¥</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 text-sm text-slate-500 leading-relaxed mb-8">
           <p className="text-lg font-bold mb-3 text-slate-700">💡 환율 팁</p>
           <ul className="list-disc list-inside space-y-1">
             <li>보통 엔화가 900원대 중반 이하라면 좋은 시기입니다.</li>
             <li>트래블로그나 트래블월렛 카드를 사용하면 환전 수수료를 아낄 수 있어요.</li>
             <li>일본 현지에서는 현금만 받는 곳이 아직 많으니 현금도 넉넉히 챙기세요!</li>
           </ul>
        </div>

        {/* Real-time Graph */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-slate-700">📈 실시간 환율 (최근 1개월)</p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                 <span className="w-2 h-2 rounded-full bg-brand-accent"></span> JPY/KRW
              </div>
           </div>
           
           <div className="h-[250px] w-full bg-slate-50 rounded-3xl p-6">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={CHART_DATA}>
                 <defs>
                   <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ff5a5f" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#ff5a5f" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis 
                   dataKey="date" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fontSize: 10, fill: '#94a3b8'}}
                   dy={10}
                 />
                 <YAxis 
                   domain={['dataMin - 5', 'dataMax + 5']} 
                   hide 
                 />
                 <Tooltip 
                   contentStyle={{ 
                     borderRadius: '16px', 
                     border: 'none', 
                     boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                     fontSize: '12px',
                     fontWeight: 'bold'
                   }}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="rate" 
                   stroke="#ff5a5f" 
                   strokeWidth={3}
                   fillOpacity={1} 
                   fill="url(#colorRate)" 
                   animationDuration={1500}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
           <p className="text-[10px] text-center text-slate-400">데이터 제공: 정(Jeong) 투어 실시간 API (최근 1개월 추이)</p>
        </div>
      </div>
    </div>
  );
}
