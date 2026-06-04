/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import ExchangeView from './components/ExchangeView';
import TranslatorView from './components/TranslatorView';
import NewsView from './components/NewsView';
import WeatherView from './components/WeatherView';
import PostsView from './components/PostsView';
import CommunityView from './components/CommunityView';
import RecommendationsView from './components/RecommendationsView';
import AuthModal from './components/AuthModal';
import { Category } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, getDocFromServer, onSnapshot } from 'firebase/firestore';
import { Power } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState("지금 일본은 한창 더워지고 있네요! 이번 주 추천지는 홋카이도입니다✨");

  useEffect(() => {
    // ... test connection logic ...
    
    // Fetch Status Message
    const unsubConfig = onSnapshot(doc(db, 'config', 'main'), (doc) => {
      if (doc.exists()) {
        setStatusMessage(doc.data().statusMessage);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check if user is admin in Firestore
        // We use mkj09018@gmail.com as the bootstrapped admin email
        if (user.email === 'mkj09018@gmail.com') {
          setIsAdmin(true);
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            setIsAdmin(adminDoc.exists());
          } catch (e) {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    alert('로그아웃 되었습니다.');
  };

  const renderContent = () => {
    switch (activeCategory) {
      case 'Home':
        return <HomeView isAdmin={isAdmin} setActiveCategory={setActiveCategory} />;
      case 'Exchange':
        return <ExchangeView />;
      case 'Translator':
        return <TranslatorView />;
      case 'News':
        return <NewsView />;
      case 'Weather':
        return <WeatherView />;
      case 'Posts':
        return <PostsView isAdmin={isAdmin} setActiveCategory={setActiveCategory} />;
      case 'Recommendations':
        return <RecommendationsView isAdmin={isAdmin} />;
      case 'Community':
        return <CommunityView isAdmin={isAdmin} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-400 italic">"{activeCategory}" 페이지 준비중입니다. 🌸</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-800 font-sans">
      <Sidebar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        statusMessage={statusMessage}
        isAdmin={isAdmin}
      />
      
      <main className="flex-1 overflow-y-auto relative scrollbar-hide">
        {isAdmin && (
          <div className="bg-brand-accent text-white py-2 px-4 text-center text-xs font-bold tracking-widest uppercase shadow-sm sticky top-0 z-[100]">
            운영자 관리 모드입니다.
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full flex flex-col"
          >
            <div className="flex-1">
              {renderContent()}
            </div>

            {/* Global Footer Admin Button - Pinned to absolute bottom of content */}
            <div className="p-8 flex justify-end items-center border-t border-slate-100/50">
               <button 
                 onClick={() => !user ? setIsAuthModalOpen(true) : (isAdmin ? handleLogout() : alert('관리자 계정이 아닙니다.'))}
                 className={`p-1.5 rounded-md transition-all active:scale-90 opacity-40 hover:opacity-100 flex items-center gap-2 group ${
                   isAdmin ? 'text-brand-accent opacity-100' : 'text-slate-300 hover:text-slate-500'
                 }`}
                 title={isAdmin ? "관리자 모드" : "로그인"}
               >
                 {isAdmin && <span className="text-[9px] font-bold tracking-tighter invisible group-hover:visible">ADMIN</span>}
                 <Power className="w-3.5 h-3.5" />
               </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={handleLogin}
        />
      </main>
    </div>
  );
}
