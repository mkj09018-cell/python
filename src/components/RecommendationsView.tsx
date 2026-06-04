import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronLeft, ChevronRight, Filter, ChevronDown, Plus, X, MapPin } from 'lucide-react';
import { Recommendation } from '../types';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  serverTimestamp, updateDoc, doc, setDoc, deleteDoc, 
  getDoc, increment 
} from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface RecommendationsViewProps {
  isAdmin: boolean;
}

export default function RecommendationsView({ isAdmin }: RecommendationsViewProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [regionTab, setRegionTab] = useState<'Tokyo' | 'Tsukuba'>('Tokyo');
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newReco, setNewReco] = useState({ name: '', category: 'Food' as 'Food' | 'Cafe', description: '', imageUrl: '', region: 'Tokyo' as 'Tokyo' | 'Tsukuba', lat: 35.6895, lng: 139.6917 });

  useEffect(() => {
    const q = query(collection(db, 'recommendations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setRecommendations(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'recommendations');
    });
    return () => unsubscribe();
  }, []);

  // Fetch initial likes for the current user
  useEffect(() => {
    if (!auth.currentUser || recommendations.length === 0) return;
    
    const checkLikes = async () => {
      const newLikes: Record<string, boolean> = {};
      // We check likes for each recommendation.
      // Optimization: In a large app, we would query the subcollection differently.
      for (const reco of recommendations) {
        const likeDocRef = doc(db, 'recommendations', reco.id, 'userLikes', auth.currentUser!.uid);
        const likeDoc = await getDoc(likeDocRef);
        if (likeDoc.exists()) newLikes[reco.id] = true;
      }
      setUserLikes(newLikes);
    };
    checkLikes();
  }, [auth.currentUser, recommendations]);

  const handleAddRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'recommendations'), {
        ...newReco,
        lat: Number(newReco.lat),
        lng: Number(newReco.lng),
        likesCount: 0,
        authorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setNewReco({ name: '', category: 'Food', description: '', imageUrl: '', region: 'Tokyo', lat: 35.6895, lng: 139.6917 });
      alert('추천집이 등록되었습니다!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'recommendations');
    }
  };

  const toggleLike = async (recoId: string) => {
    if (!auth.currentUser) {
      alert('좋아요를 누르려면 로그인이 필요합니다.');
      return;
    }

    const userId = auth.currentUser.uid;
    const likeDocRef = doc(db, 'recommendations', recoId, 'userLikes', userId);
    const recoDocRef = doc(db, 'recommendations', recoId);

    try {
      const isLiked = userLikes[recoId];
      if (isLiked) {
        await deleteDoc(likeDocRef);
        await updateDoc(recoDocRef, { likesCount: increment(-1) });
        setUserLikes(prev => ({ ...prev, [recoId]: false }));
      } else {
        await setDoc(likeDocRef, { userId, createdAt: serverTimestamp() });
        await updateDoc(recoDocRef, { likesCount: increment(1) });
        setUserLikes(prev => ({ ...prev, [recoId]: true }));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `recommendations/${recoId}/userLikes`);
    }
  };

  const filtered = recommendations
    .filter(r => r.region === regionTab)
    .filter(r => !showLikedOnly || userLikes[r.id])
    .sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = a.createdAt ? (a.createdAt as any).seconds : 0;
        const dateB = b.createdAt ? (b.createdAt as any).seconds : 0;
        return dateB - dateA;
      }
      return (b.likesCount || 0) - (a.likesCount || 0);
    });

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
       <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold font-display flex items-center gap-3">
            <span className="bg-brand-blue p-2 rounded-xl">🍣</span> 찐맛집 & 카페 추천
          </h2>
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-brand-accent text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> 추천집 등록
            </button>
          )}
       </div>

       {/* Map Box */}
       <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 mb-6">
          <div className="w-full h-[400px] bg-brand-mint/5 rounded-[2rem] overflow-hidden relative border border-slate-50">
            <MapContainer 
              center={regionTab === 'Tokyo' ? [35.6895, 139.6917] : [36.0835, 140.0766]} 
              zoom={11} 
              style={{ width: '100%', height: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.filter(r => r.lat && r.lng).map((reco) => (
                <Marker key={reco.id} position={[reco.lat!, reco.lng!]}>
                  <Popup>
                    <div className="p-2 min-w-[150px]">
                      <img src={reco.imageUrl} alt={reco.name} className="w-full h-20 object-cover rounded-lg mb-2" />
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{reco.name}</h4>
                      <p className="text-[10px] text-brand-accent font-bold uppercase">{reco.category}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <MapPin className="w-3 h-3 text-red-500" /> {regionTab} 맛집 지도
            </div>
          </div>
       </div>

       <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
               <AnimatePresence>
                  {isAdding && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-8"
                    >
                       <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative">
                          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-slate-300">
                             <X className="w-4 h-4" />
                          </button>
                          <form onSubmit={handleAddRecommendation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input required placeholder="가게명" className="p-3 bg-slate-50 rounded-xl" value={newReco.name} onChange={e => setNewReco({...newReco, name: e.target.value})} />
                             <select className="p-3 bg-slate-50 rounded-xl" value={newReco.category} onChange={e => setNewReco({...newReco, category: e.target.value as any})}>
                                <option value="Food">맛집</option>
                                <option value="Cafe">카페</option>
                             </select>
                             <input required placeholder="이미지 URL" className="p-3 bg-slate-50 rounded-xl md:col-span-2" value={newReco.imageUrl} onChange={e => setNewReco({...newReco, imageUrl: e.target.value})} />
                             <textarea required placeholder="추천 이유..." className="p-3 bg-slate-50 rounded-xl md:col-span-2 h-20" value={newReco.description} onChange={e => setNewReco({...newReco, description: e.target.value})} />
                             <div className="grid grid-cols-2 gap-2 md:col-span-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 ml-1">위도 (Latitude)</label>
                                  <input type="number" step="any" required placeholder="35.6895" className="w-full p-3 bg-slate-50 rounded-xl" value={newReco.lat} onChange={e => setNewReco({...newReco, lat: parseFloat(e.target.value)})} />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 ml-1">경도 (Longitude)</label>
                                  <input type="number" step="any" required placeholder="139.6917" className="w-full p-3 bg-slate-50 rounded-xl" value={newReco.lng} onChange={e => setNewReco({...newReco, lng: parseFloat(e.target.value)})} />
                                </div>
                             </div>
                             <select className="p-3 bg-slate-50 rounded-xl" value={newReco.region} onChange={e => setNewReco({...newReco, region: e.target.value as any})}>
                                <option value="Tokyo">도쿄</option>
                                <option value="Tsukuba">츠쿠바</option>
                             </select>
                             <button className="bg-brand-text text-white font-bold rounded-xl p-3">등록</button>
                          </form>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
               <div className="flex gap-2">
                 {['Tokyo', 'Tsukuba'].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setRegionTab(tab as any)}
                     className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                       regionTab === tab 
                       ? 'bg-brand-text text-white shadow-lg' 
                       : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                     }`}
                   >
                     {tab === 'Tokyo' ? '도쿄' : '츠쿠바'}
                   </button>
                 ))}
               </div>
             </div>

             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowLikedOnly(!showLikedOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    showLikedOnly 
                    ? 'bg-red-50 border-red-100 text-red-500' 
                    : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${showLikedOnly ? 'fill-current' : ''}`} />
                  좋아요만 보기
                </button>

                <div className="relative group">
                   <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-100 text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all">
                     <Filter className="w-3 h-3" />
                     {sortBy === 'newest' ? '최신순' : '인기순'}
                     <ChevronDown className="w-3 h-3" />
                   </button>
                   <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-2xl shadow-xl border border-slate-50 hidden group-hover:block z-50 overflow-hidden">
                      <button onClick={() => setSortBy('newest')} className="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-500 hover:bg-slate-50 uppercase tracking-widest">최신순</button>
                      <button onClick={() => setSortBy('likes')} className="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-500 hover:bg-slate-50 uppercase tracking-widest">인기순</button>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((reco) => (
              <motion.div 
                layout
                key={reco.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group flex flex-col h-full"
              >
                 <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                    <img src={reco.imageUrl} alt={reco.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                      {reco.category}
                    </div>
                    <button 
                      onClick={() => toggleLike(reco.id)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-md group/heart transition-all active:scale-90"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${userLikes[reco.id] ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
                    </button>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                     <div>
                       <h4 className="text-xl font-bold text-brand-text mb-3 leading-tight font-display">{reco.name}</h4>
                       <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                         {reco.description}
                       </p>
                     </div>
                     <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                          {reco.region}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                          <Heart className="w-3 h-3 fill-slate-100" /> {reco.likesCount || 0}
                        </div>
                     </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
       </div>

       {/* Pagination */}
       <div className="mt-16 flex justify-center items-center gap-4">
          <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:border-brand-accent hover:text-brand-accent transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <button key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${i === 1 ? 'bg-brand-text text-white border-brand-text' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>
                {i}
              </button>
            ))}
          </div>
          <button className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:border-brand-accent hover:text-brand-accent transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
       </div>
    </div>
  );
}
