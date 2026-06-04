import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, Github, LogIn } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-10">
           <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold font-display text-brand-text mb-1">운영자 로그인</h3>
                <p className="text-xs text-slate-400">관리자 전용 대시보드 접근용</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
           </div>

           <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                 <Lock className="w-5 h-5 text-slate-300" />
                 <p className="text-xs text-slate-500 leading-tight">
                    네이버 로그인 연동 대기중입니다.<br />
                    현재는 <span className="font-bold text-brand-text">Google 로그인</span>으로 관리자 인가를 진행합니다.
                 </p>
              </div>

              <button 
                onClick={onLogin}
                className="w-full bg-brand-text text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                   <div className="w-3 h-3 bg-red-500 rounded-full" />
                </div>
                Google 계정으로 로그인
              </button>

              <div className="relative py-4 flex items-center gap-4">
                 <div className="flex-1 h-[1px] bg-slate-100" />
                 <span className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">or</span>
                 <div className="flex-1 h-[1px] bg-slate-100" />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 tracking-widest">Admin Email</label>
                 <div className="relative">
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 </div>
              </div>

              <button 
                disabled={!email}
                className="w-full border border-slate-200 text-slate-500 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                비밀번호로 로그인
              </button>
           </div>
        </div>

        <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 flex justify-center gap-6">
           <p className="text-[10px] text-center text-slate-400">
             본 시스템은 인가된 사용자만 접근 가능합니다.<br />
             개인정보보호 및 보안 규정을 준수해주세요.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
