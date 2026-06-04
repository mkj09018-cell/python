import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, History, Copy, Check, Search, Trash2 } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { TranslationRecord } from '../types';

interface TranslationHistoryViewProps {
  onBack: () => void;
}

export function TranslationHistoryView({ onBack }: TranslationHistoryViewProps) {
  const [records, setRecords] = useState<TranslationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'translations'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TranslationRecord[]);
    });

    return () => unsubscribe();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteRecord = async (id: string) => {
    if (confirm('이 번역 기록을 삭제하시겠습니까?')) {
      await deleteDoc(doc(db, 'translations', id));
    }
  };

  const filteredRecords = records.filter(r => 
    r.original.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.translated.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-brand-text font-bold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> 돌아가기
        </button>
        <h2 className="text-2xl font-bold font-display flex items-center gap-3">
          <History className="w-6 h-6 text-brand-accent" /> 전체 번역 기록
        </h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 min-h-[600px]">
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input 
            type="text"
            placeholder="기록 검색 (원본 또는 번역문)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-14 pr-6 text-slate-600 focus:ring-2 focus:ring-brand-accent outline-none transition-all"
          />
        </div>

        <div className="space-y-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <motion.div 
                layout
                key={record.id} 
                className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-brand-accent/30 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Original</p>
                    <p className="text-slate-500 font-medium">{record.original}</p>
                  </div>
                  <button 
                    onClick={() => deleteRecord(record.id)}
                    className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="bg-white/50 p-4 rounded-2xl border border-slate-200/50">
                  <p className="text-[10px] font-bold text-brand-accent uppercase tracking-wider mb-2">Translation</p>
                  <p className="text-xl font-bold text-slate-800 mb-4">{record.translated}</p>
                  <button 
                    onClick={() => copyToClipboard(record.translated, record.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      copiedId === record.id 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-brand-text text-white hover:scale-105'
                    }`}
                  >
                    {copiedId === record.id ? (
                      <><Check className="w-3.5 h-3.5" /> 복사 완료</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> 복사하기</>
                    )}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium">검색 결과가 없거나 기록이 비어있습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
