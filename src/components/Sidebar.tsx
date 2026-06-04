import { 
  Home as HomeIcon, 
  MapPin, 
  CloudSun, 
  CircleDollarSign, 
  Newspaper, 
  Languages, 
  Utensils,
  Edit3,
  Power
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Category } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface SidebarProps {
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  statusMessage: string;
  isAdmin: boolean;
}

const MENU_ITEMS = [
  { id: 'Home', label: '홈', icon: HomeIcon },
  { id: 'Posts', label: '여행 기록', icon: MapPin },
  { id: 'Weather', label: '현지 날씨', icon: CloudSun },
  { id: 'Exchange', label: '환율 정보', icon: CircleDollarSign },
  { id: 'News', label: '현지 뉴스', icon: Newspaper },
  { id: 'Translator', label: '번역기', icon: Languages },
  { id: 'Recommendations', label: '추천 맛집', icon: Utensils },
  { id: 'Community', label: '여행 정보 공유', icon: Newspaper },
] as const;

export default function Sidebar({ activeCategory, setActiveCategory, statusMessage, isAdmin }: SidebarProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState(statusMessage);
  
  // NOTE: In a real app, you'd check admin status here to show/hide edit button
  // For simplicity since we are moving the login button, we'll keep the edit logic
  // but it would ideally use a context or global state.
  // We'll assume the user who is logged in and is admin can see the edit button
  // but since we removed isAdmin prop for now to simplify, let's keep it minimal.

  const handleUpdateStatus = async () => {
    try {
      await updateDoc(doc(db, 'config', 'main'), {
        statusMessage: tempStatus,
        updatedAt: serverTimestamp()
      });
      setIsEditingStatus(false);
    } catch (e) {
      alert('상태메시지 수정 권한이 없습니다.');
      setIsEditingStatus(false);
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Profile Area at Top */}
      <div className="p-6 border-b border-slate-50">
        <div className="w-40 h-40 rounded-3xl bg-brand-blue mb-6 overflow-hidden shadow-md mx-auto aspect-square group">
          <img 
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=400&h=400&fit=crop" 
            alt="주인장 ジョン" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center px-2">
          <h2 className="text-2xl font-black text-brand-text mb-1 font-display">ジョン</h2>
          <p className="text-xs text-slate-400 leading-tight mb-6 font-medium">
            일본 방방곳곳을 직접 다녀오고,<br />그 중 추천 장소를 소개합니다!
          </p>
          
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/50 relative group">
            {isEditingStatus ? (
              <div className="space-y-2">
                <textarea 
                  value={tempStatus} 
                  onChange={e => setTempStatus(e.target.value)}
                  className="w-full text-[11px] bg-white border border-slate-200 p-2 rounded-lg outline-none resize-none"
                  rows={2}
                />
                <div className="flex gap-1 justify-end">
                  <button onClick={() => setIsEditingStatus(false)} className="text-[9px] px-2 py-1 bg-slate-200 rounded">취소</button>
                  <button onClick={handleUpdateStatus} className="text-[9px] px-2 py-1 bg-brand-text text-white rounded">저장</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[11px] text-brand-text leading-relaxed font-medium">
                  "{statusMessage}"
                </p>
                {isAdmin && (
                  <button 
                    onClick={() => { setIsEditingStatus(true); setTempStatus(statusMessage); }}
                    className="absolute -top-2 -right-2 p-1.5 bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-50 border border-slate-100"
                  >
                    <Edit3 className="w-2.5 h-2.5 text-slate-400" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveCategory(item.id as Category)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeCategory === item.id 
                ? 'bg-brand-blue text-brand-accent font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeCategory === item.id ? 'text-brand-accent' : 'group-hover:text-slate-700'}`} />
            <span className="flex-1 text-left text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
