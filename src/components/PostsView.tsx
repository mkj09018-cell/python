import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Image as ImageIcon, ArrowRight, Plus, X, Upload, Map as MapIcon, Globe } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Region, Post } from '../types';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for leaflet default icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const VISITED_REGIONS: { id: Region; name: string; x: number; y: number; lat: number; lng: number }[] = [
  { id: 'Tokyo', name: '도쿄', x: 73, y: 58, lat: 35.6895, lng: 139.6917 },
  { id: 'Osaka', name: '오사카', x: 58, y: 68, lat: 34.6937, lng: 135.5023 },
  { id: 'Nara', name: '나라', x: 60, y: 69, lat: 34.6851, lng: 135.8048 },
  { id: 'Ibaraki', name: '이바라키', x: 78, y: 50, lat: 36.3659, lng: 140.4712 },
  { id: 'Tsukuba', name: '츠쿠바', x: 76, y: 52, lat: 36.0835, lng: 140.0766 },
  { id: 'Ushiku', name: '우시쿠', x: 75, y: 54, lat: 35.9800, lng: 140.1500 },
  { id: 'Sapporo', name: '삿포로', x: 82, y: 12, lat: 43.0611, lng: 141.3564 },
  { id: 'Otaru', name: '오타루', x: 80, y: 15, lat: 43.1907, lng: 141.0032 },
  { id: 'Fukuoka', name: '후쿠오카', x: 22, y: 82, lat: 33.5904, lng: 130.4017 },
  { id: 'Saitama', name: '사이타마', x: 72, y: 55, lat: 35.8617, lng: 139.6455 },
  { id: 'Mito', name: '미토', x: 79, y: 48, lat: 36.3659, lng: 140.4712 },
  { id: 'Kobe', name: '고베', x: 56, y: 68, lat: 34.6901, lng: 135.1955 },
  { id: 'Toyama', name: '토야마', x: 62, y: 45, lat: 36.6960, lng: 137.2137 },
  { id: 'Shirakawago', name: '시라카와고', x: 60, y: 50, lat: 36.2715, lng: 136.9066 },
  { id: 'Kanagawa', name: '가나가와(카마쿠라)', x: 72, y: 60, lat: 35.3190, lng: 139.5471 },
];

interface PostsViewProps {
  isAdmin: boolean;
  setActiveCategory?: (cat: any) => void;
}

export default function PostsView({ isAdmin, setActiveCategory }: PostsViewProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', region: 'Tokyo' as Region, imageUrl: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setPosts(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    });
    return () => unsubscribe();
  }, []);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'posts'), {
        ...newPost,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setNewPost({ title: '', content: '', region: 'Tokyo', imageUrl: '' });
      alert('게시물이 등록되었습니다!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
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
          <h2 className="text-3xl font-bold font-display flex items-center gap-3">
            <span className="bg-brand-mint/40 p-2 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-50">🗺️</span> ジョン의 여행지 기록
          </h2>
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-brand-accent text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> 게시물 작성
            </button>
          )}
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
              <h3 className="text-xl font-bold mb-6">새 게시물 작성</h3>
              <form onSubmit={handleAddPost} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      required
                      placeholder="제목"
                      value={newPost.title}
                      onChange={e => setNewPost({...newPost, title: e.target.value})}
                      className="bg-slate-50 border-0 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-accent px-5"
                    />
                    <select 
                      value={newPost.region}
                      onChange={e => setNewPost({...newPost, region: e.target.value as Region})}
                      className="bg-slate-50 border-0 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-accent appearance-none px-5"
                    >
                      {VISITED_REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
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
                      className="bg-slate-100 text-slate-600 px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors"
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
                   placeholder="내용을 입력하세요..."
                   value={newPost.content}
                   onChange={e => setNewPost({...newPost, content: e.target.value})}
                   className="w-full h-32 bg-slate-50 border-0 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-accent resize-none px-5"
                 />
                 <button className="w-full bg-brand-text text-white py-4 rounded-xl font-bold">저장하기</button>
              </form>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Interactive Map Section */}
       <div className="bg-white rounded-[3rem] p-4 shadow-sm border border-slate-100 mb-4 relative flex flex-col items-center group/map">
          <div className="absolute top-8 left-10 z-10 pointer-events-none">
             <div className="flex items-center gap-3 mb-1">
               <h3 className="text-[24px] font-bold">방문 지도</h3>
             </div>
             <p className="text-xs text-slate-400">핀을 눌러 해당 지역의 글을 확인하세요.</p>
          </div>

          <div className="relative w-full max-w-4xl aspect-[16/9] bg-brand-mint/5 rounded-[2rem] flex items-center justify-center p-0 md:p-12 overflow-hidden">
            {showInteractiveMap ? (
              <div className="w-full h-full rounded-[2rem] overflow-hidden">
                <MapContainer 
                  center={[38.0, 137.5]} 
                  zoom={5} 
                  style={{ width: '100%', height: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {VISITED_REGIONS.map((region) => (
                    <Marker key={region.id} position={[region.lat, region.lng]}>
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-bold text-slate-800">{region.name}</h4>
                          <p className="text-xs text-slate-500">방문한 지역</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            ) : (
              <>
                {/* Detailed Japan Map Image */}
                <img 
                   src="/src/assets/images/regenerated_image_1780563632140.png" 
                   alt="Japan Map" 
                   className="w-full h-full object-contain z-0"
                />
                
                {/* Pins */}
                {VISITED_REGIONS.map((region) => (
                   <div 
                     key={region.id}
                     className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                     style={{ left: `${region.x}%`, top: `${region.y}%` }}
                     onMouseEnter={() => setHoveredRegion(region.name)}
                     onMouseLeave={() => setHoveredRegion(null)}
                   >
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="bg-red-500 p-1.5 rounded-full shadow-lg border-2 border-white"
                      >
                        <MapPin className="w-3 h-3 text-white fill-current" />
                      </motion.div>
                      
                      <AnimatePresence>
                        {hoveredRegion === region.name && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-50 font-bold"
                          >
                            {region.name}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-800" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                ))}
              </>
            )}
          </div>

          <button 
            onClick={() => setShowInteractiveMap(!showInteractiveMap)}
            className="absolute bottom-6 right-8 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-100 shadow-lg text-sm font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all z-20 group"
          >
             {showInteractiveMap ? (
               <>
                 <MapIcon className="w-4 h-4 text-brand-accent" />
                 <span>일러스트 지도로 보기</span>
               </>
             ) : (
               <>
                 <Globe className="w-4 h-4 text-brand-accent" />
                 <span>실제 지도로 보기</span>
               </>
             )}
          </button>
       </div>

       {/* Sub-layout section below the map - Sections Swapped and Spacing Reduced */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between group">
             <div>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xl font-bold">추천 여행지 살펴보아요!</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                   ジョン이 직접 추천하는 시즌별 여행팁과<br />
                   지역별 ホット플레이스를 확인해보세요.
                </p>
             </div>
             <div className="mt-8 flex gap-3">
                <button 
                   onClick={() => setActiveCategory?.('Home')}
                   className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all"
                >
                   추천 팁 보기
                </button>
                <button 
                   onClick={() => setActiveCategory?.('Recommendations')}
                   className="flex-1 bg-brand-blue text-brand-accent py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all"
                >
                   맛집 보기
                </button>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between group">
             <div>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xl font-bold">여러분의 여행지를 알려주세요!</h3>
                   <button 
                     onClick={() => setActiveCategory?.('Community')}
                     className="text-[10px] font-bold text-slate-400 hover:text-brand-accent transition-colors flex items-center gap-1 uppercase tracking-widest"
                   >
                     더보기 <ArrowRight className="w-3 h-3" />
                   </button>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                   나만 알고 있는 숨은 명소, 맛집 정보를 공유해보세요.<br />
                   자유롭게 게시글을 작성하고 소통할 수 있습니다.
                </p>
             </div>
             <button 
               onClick={() => setActiveCategory?.('Community')}
               className="mt-8 bg-slate-50 text-slate-700 py-3 rounded-2xl font-bold text-sm hover:bg-brand-mint/20 hover:text-brand-accent transition-all flex items-center justify-center gap-2"
             >
               게시판 이동하기
             </button>
          </div>
       </div>

       {/* Posts Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group cursor-pointer h-full flex flex-col"
            >
               <div className="aspect-square relative overflow-hidden bg-slate-200">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" /> {post.region}
                  </div>
               </div>
               <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-brand-text mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest">
                      {post.createdAt ? new Date((post.createdAt as any)?.seconds * 1000).toLocaleDateString() : 'Loading...'}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between group-hover:translate-x-1 transition-transform">
                     <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">Read More <ArrowRight className="w-3 h-3" /></span>
                     <ImageIcon className="w-4 h-4 text-slate-200" />
                  </div>
               </div>
            </motion.div>
          ))}
          {posts.length === 0 && !isAdding && (
            <div className="col-span-full py-20 text-center text-slate-400 italic font-medium">
               작성된 여행 기록이 없습니다. {isAdmin && "첫 글을 작성해 보세요!"}
            </div>
          )}
       </div>
    </div>
  );
}
