
import React, { useState, useMemo } from 'react';
import { VibeUser } from '../types';

interface SwipeScreenProps {
  userVibe: string;
  onMatch: (user: VibeUser) => void;
}

const SwipeScreen: React.FC<SwipeScreenProps> = ({ userVibe, onMatch }) => {
  const [index, setIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);

  const mockUsers: VibeUser[] = [
    { id: '1', name: 'Alex 🌙', vibe: 'Nightlife Coffee ☕', lat: 40, lng: 30, distance: '0.2mi', verified: true, avatar: 'https://picsum.photos/id/64/400/500' },
    { id: '2', name: 'Jamie 🎸', vibe: 'Live Music Rock', lat: 60, lng: 70, distance: '0.5mi', verified: true, avatar: 'https://picsum.photos/id/65/400/500' },
    { id: '3', name: 'Sam 🌳', vibe: 'Park Hangout Chill', lat: 25, lng: 45, distance: '0.1mi', verified: true, avatar: 'https://picsum.photos/id/66/400/500' },
    { id: '4', name: 'Taylor 🍻', vibe: 'Happy Hour Beer', lat: 75, lng: 20, distance: '0.9mi', verified: false, avatar: 'https://picsum.photos/id/67/400/500' },
  ];

  // Simple heuristic for "AI" matching
  const scoredUsers = useMemo(() => {
    if (!userVibe) return mockUsers.map(u => ({ ...u, score: 0.5 }));
    const userWords = userVibe.toLowerCase().split(' ');
    return mockUsers.map(user => {
      const matchWords = user.vibe.toLowerCase().split(' ').filter(w => userWords.includes(w));
      return { ...user, score: matchWords.length > 0 ? 0.8 + (matchWords.length * 0.05) : 0.4 + Math.random() * 0.2 };
    }).sort((a, b) => b.score - a.score);
  }, [userVibe]);

  const currentUser = scoredUsers[index];

  const handleAction = (isVibe: boolean) => {
    if (isVibe && currentUser.score > 0.7) {
      setShowMatch(true);
      setTimeout(() => {
        setShowMatch(false);
        onMatch(currentUser);
      }, 2000);
    } else {
      setIndex((prev) => (prev + 1) % scoredUsers.length);
    }
  };

  if (!currentUser) return <div className="p-10 text-center text-zinc-500">No more vibes nearby...</div>;

  return (
    <div className="h-full flex flex-col p-6 items-center justify-center relative">
      {showMatch && (
        <div className="absolute inset-0 z-50 bg-emerald-500 flex flex-col items-center justify-center text-white animate-in zoom-in duration-300">
          <div className="text-6xl mb-4">💖</div>
          <h2 className="text-3xl font-black">PERFECT VIBE MATCH!</h2>
          <p className="mt-2 opacity-80">Connecting you now...</p>
        </div>
      )}

      <div className="relative w-full max-w-[350px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
        <img src={currentUser.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={currentUser.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-2xl font-bold">{currentUser.name}</h3>
            {currentUser.verified && <span className="text-pink-500">✅</span>}
          </div>
          <p className="text-zinc-300 text-sm mt-1">{currentUser.vibe}</p>
          <div className="flex justify-between items-center mt-4">
             <span className="text-[10px] bg-pink-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest">{currentUser.distance} away</span>
             <span className="text-xs font-black text-emerald-400">{(currentUser.score * 100).toFixed(0)}% MATCH</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-6 mt-10">
        <button 
          onClick={() => handleAction(false)}
          className="w-16 h-16 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl hover:bg-zinc-700 transition-colors"
        >
          ✕
        </button>
        <button 
          onClick={() => handleAction(true)}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 shadow-xl shadow-pink-500/20 flex items-center justify-center text-3xl hover:scale-110 transition-transform"
        >
          💖
        </button>
      </div>
      
      <button className="mt-8 text-xs font-black text-amber-500 uppercase tracking-[0.2em] animate-pulse">
        ⚡ 3 BOOSTS LEFT
      </button>
    </div>
  );
};

export default SwipeScreen;
