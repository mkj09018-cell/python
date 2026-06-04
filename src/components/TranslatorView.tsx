import { useState, useEffect } from 'react';
import { Send, BookOpen, Copy, Check, RotateCcw, History, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, where, serverTimestamp } from 'firebase/firestore';
import { TranslationRecord } from '../types';
import { TranslationHistoryView } from './TranslationHistoryView';

const DICTIONARY = [
  { jp: 'すみません (스미마센)', kr: '실례합니다 / 저기요', scene: '식당/길찾기' },
  { jp: 'これをください (코레오 쿠다사이)', kr: '이것을 주세요', scene: '쇼핑/주문' },
  { jp: 'お会計をお願いします (오카이케오 오네가이시마스)', kr: '계산 부탁드립니다', scene: '계산할 때' },
  { jp: '出口はどこですか？ (데구치와 도코데스카?)', kr: '출구는 어디인가요?', scene: '역/공항' },
  { jp: '美味しいです！ (오이시이데스!)', kr: '맛있어요!', scene: '식당' },
  { jp: '写真を撮ってもいいですか？ (샤신오 톳테모 이이데스카?)', kr: '사진 찍어도 될까요?', scene: '관광지' },
];

export default function TranslatorView() {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<TranslationRecord[]>([]);
  const [viewMode, setViewMode] = useState<'translator' | 'history'>('translator');

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'translations'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(2)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TranslationRecord[];
      setHistory(records);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      
      const data = await response.json();
      if (data.translatedText) {
        setResultText(data.translatedText);
        
        // Save to History
        if (auth.currentUser) {
          await addDoc(collection(db, 'translations'), {
            original: inputText,
            translated: data.translatedText,
            userId: auth.currentUser.uid,
            createdAt: serverTimestamp()
          });
        }
      } else {
        alert('번역 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('서버 연결에 실패했습니다.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResultText('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (viewMode === 'history') {
    return <TranslationHistoryView onBack={() => setViewMode('translator')} />;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
         <h2 className="text-3xl font-bold font-display flex items-center gap-3">
           <span className="bg-orange-100 p-2 rounded-xl">📱</span> 실시간 번역기
         </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Translator Section */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col h-fit">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                실시간 번역
              </h3>
              <button 
                onClick={handleReset}
                className="p-2.5 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-brand-accent transition-all flex items-center gap-1.5 text-xs font-bold border border-transparent hover:border-slate-100"
              >
                <RotateCcw className="w-4 h-4" /> 리셋
              </button>
            </div>
            
            <div className="space-y-4 flex-1">
               <div className="relative">
                 <textarea 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   placeholder="한국어로 입력하세요..."
                   className="w-full h-40 bg-slate-50 border-0 rounded-[2rem] p-6 text-lg focus:ring-2 focus:ring-brand-accent outline-none transition-all resize-none shadow-inner"
                 />
                 <button 
                   onClick={handleTranslate}
                   disabled={isTranslating}
                   className="absolute bottom-4 right-4 bg-brand-accent text-white p-3.5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                 >
                   {isTranslating ? (
                     <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : <Send className="w-6 h-6" />}
                 </button>
               </div>

               <div className="relative">
                  <div className="w-full h-40 bg-brand-mint/5 border border-brand-mint/10 rounded-[2rem] p-6 text-lg text-slate-700 leading-relaxed">
                    {resultText || <span className="text-slate-300 italic">번역 결과가 표시됩니다.</span>}
                  </div>
                  {resultText && (
                    <button 
                      onClick={() => copyToClipboard(resultText)}
                      className="absolute bottom-4 right-4 p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-90"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                    </button>
                  )}
               </div>
            </div>
          </div>

          {/* History Preview Section */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-brand-accent" /> 나의 번역 기록
              </h3>
              <button 
                onClick={() => setViewMode('history')}
                className="px-4 py-1.5 rounded-full bg-slate-50 text-xs font-bold text-slate-400 hover:text-brand-accent hover:bg-brand-accent/5 flex items-center gap-1 transition-all"
              >
                더보기 <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {history.length > 0 ? (
                history.map((record) => (
                  <div key={record.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-white transition-colors cursor-default">
                    <p className="text-[10px] text-slate-300 mb-1 font-bold uppercase tracking-wider">{record.original}</p>
                    <p className="text-sm font-bold text-slate-700">{record.translated}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 italic">번역 기록이 아직 없네요. 🌸</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dictionary Section */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col h-fit">
           <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
             <BookOpen className="w-5 h-5 text-brand-accent" /> 필수 회화 사전
           </h3>
           
           <div className="grid grid-cols-1 gap-4">
              {DICTIONARY.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 hover:border-brand-accent/30 transition-colors group">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-display">{item.scene}</span>
                   </div>
                   <p className="text-lg font-bold text-brand-text mb-1 group-hover:text-brand-accent transition-colors">{item.jp}</p>
                   <p className="text-sm text-slate-500">{item.kr}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
