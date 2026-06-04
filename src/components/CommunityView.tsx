import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Image as ImageIcon, ArrowRight, Plus, X, Upload, MessageSquare } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  location: string;
  authorName: string;
  createdAt: any;
}

export default function CommunityView({ isAdmin }: { isAdmin: boolean }) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', location: '', imageUrl: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setPosts(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'community_posts');
    });
    return () => unsubscribe();
  }, []);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
       alert('로그인이 필요한 서비스입니다.');
       return;
    }

    try {
      await addDoc(collection(db, 'community_posts'), {
        ...newPost,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || '익명 여행자',
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setNewPost({ title: '', content: '', location: '', imageUrl: '' });
      alert('게시물이 등록되었습니다! 정보를 공유해주셔서 감사합니다. ✨');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'community_posts');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
       <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold font-display flex items-center gap-3 mb-2">
              <span className="bg-brand-mint/20 p-2 rounded-xl">🤝</span> 여러분의 여행지 공유판
            </h2>
            <p className="text-slate-400 text-sm">함께 가기 좋은 숨은 명소들을 자유롭게 공유해주세요!</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-brand-text text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> 내 여행지 공유하기
          </button>
       </div>

       <AnimatePresence>
         {isAdding && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-12 relative"
           >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-6 right-8 p-2 hover:bg-slate-50 rounded-xl"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
              <h3 className="text-xl font-bold mb-2">게시물 작성</h3>
              <p className="text-xs text-slate-400 mb-6 font-medium">부적절한 게시물은 관리자에 의해 삭제될 수 있습니다.</p>
              
              <form onSubmit={handleAddPost} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      required
                      placeholder="게시물 제목"
                      value={newPost.title}
                      onChange={e => setNewPost({...newPost, title: e.target.value})}
                      className="bg-slate-50 border-0 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-accent px-5"
                    />
                    <input 
                      required
                      placeholder="여행지 위치 (예: 오사카 난바)"
                      value={newPost.location}
                      onChange={e => setNewPost({...newPost, location: e.target.value})}
                      className="bg-slate-50 border-0 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-accent px-5"
                    />
                 </div>
                 <div className="flex gap-2">
                    <input 
                      required
                      placeholder="이미지 URL"
                      value={newPost.imageUrl}
                      onChange={e => setNewPost({...newPost, imageUrl: e.target.value})}
                      className="flex-1 bg-slate-50 border-0 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-accent px-5"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-100 text-slate-600 px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors shrink-0"
                    >
                      <Upload className="w-4 h-4" /> 파일에서 불러오기
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                 </div>
                 <textarea 
                   required
                   placeholder="이 곳은 어떤 곳인가요? 추천 이유를 들려주세요!"
                   value={newPost.content}
                   onChange={e => setNewPost({...newPost, content: e.target.value})}
                   className="w-full h-32 bg-slate-50 border-0 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-accent resize-none px-5"
                 />
                 <button className="w-full bg-brand-text text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-100 hover:scale-[1.01] transition-all">공유 완료하기</button>
              </form>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Posts Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group cursor-pointer flex flex-col"
            >
               <div className="aspect-[4/3] relative overflow-hidden bg-slate-200">
                  <img src={post.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-brand-accent" /> {post.location}
                  </div>
               </div>
               <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-brand-text mb-2 line-clamp-1 group-hover:text-brand-accent transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-brand-mint/30 rounded-full flex items-center justify-center text-[10px] font-bold text-brand-accent">
                           {post.authorName.charAt(0)}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{post.authorName}</span>
                     </div>
                     <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                       {post.createdAt ? new Date((post.createdAt as any)?.seconds * 1000).toLocaleDateString() : 'Just now'}
                     </span>
                  </div>
               </div>
            </motion.div>
          ))}
          {posts.length === 0 && !isAdding && (
            <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
               <MessageSquare className="w-12 h-12 text-slate-100" />
               <p className="text-slate-300 font-medium italic">아직 공유된 여행지가 없네요. 첫 정보를 공유해보세요!</p>
            </div>
          )}
       </div>
    </div>
  );
}
