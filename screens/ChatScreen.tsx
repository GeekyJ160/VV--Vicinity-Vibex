
import React, { useState } from 'react';
import { VibeUser } from '../types';

interface ChatScreenProps {
  user: VibeUser | null;
  isDarkMode: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, isDarkMode }) => {
  const [msg, setMsg] = useState('');

  if (!user) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
        <div className="text-6xl mb-4 opacity-20">💬</div>
        <h2 className={`${isDarkMode ? 'text-zinc-500' : 'text-slate-400'} italic`}>Start a conversation from the Map or Swipe screens</h2>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className={`px-6 py-4 border-b flex items-center space-x-3 transition-colors duration-300 ${isDarkMode ? 'border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
        <img src={user.avatar} className="w-10 h-10 rounded-full border border-pink-500" alt="" />
        <div>
          <h3 className={`font-bold text-sm leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
          <span className="text-[10px] text-green-400 font-black uppercase tracking-tighter">Vibe Matching...</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-start">
          <div className={`p-4 rounded-2xl rounded-tl-none max-w-[80%] transition-colors duration-300 ${isDarkMode ? 'bg-zinc-800/80 text-white' : 'bg-white text-slate-800 border border-slate-200 shadow-sm'}`}>
            <p className="text-sm italic">Matched via "{user.vibe}" energy!</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className={`p-4 rounded-2xl rounded-tl-none max-w-[80%] transition-colors duration-300 ${isDarkMode ? 'bg-zinc-800/80 text-white' : 'bg-white text-slate-800 border border-slate-200 shadow-sm'}`}>
            <p className="text-sm">Hey! I noticed we're both into {user.vibe.split(' ')[0]} right now. Want to catch up?</p>
          </div>
        </div>
      </div>

      <div className={`p-4 pb-10 transition-colors duration-300 ${isDarkMode ? 'bg-transparent' : 'bg-white border-t border-slate-100'}`}>
        <div className={`flex items-center space-x-2 rounded-2xl px-4 border transition-all duration-300 focus-within:border-pink-500/50 ${isDarkMode ? 'bg-zinc-800/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
          <input 
            type="text" 
            placeholder="Send a message..." 
            className={`bg-transparent border-none outline-none flex-1 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button className={`p-2 transition-all ${msg ? 'text-pink-500 scale-110' : 'text-zinc-600'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
