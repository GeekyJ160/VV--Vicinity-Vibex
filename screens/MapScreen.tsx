
import React, { useState, useEffect, useMemo } from 'react';
import { VibeUser } from '../types';

const MapScreen: React.FC = () => {
  const [vibes, setVibes] = useState<VibeUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<VibeUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isDynamic, setIsDynamic] = useState(true);

  useEffect(() => {
    // Initial Mock Data
    setVibes([
      { id: '1', name: 'Alex 🌙', vibe: 'Nightlife', lat: 40, lng: 30, distance: '0.2mi', verified: true, avatar: 'https://picsum.photos/id/64/150/150' },
      { id: '2', name: 'Jamie 🎸', vibe: 'Live Music', lat: 60, lng: 70, distance: '0.1mi', verified: true, avatar: 'https://picsum.photos/id/65/150/150' },
      { id: '3', name: 'Trivia @TheSpot', vibe: 'Games', lat: 25, lng: 45, distance: '0.3mi', verified: true, avatar: 'https://picsum.photos/id/66/150/150' },
      { id: '4', name: 'Sara 🏞️', vibe: 'Outdoor', lat: 75, lng: 20, distance: '0.4mi', verified: false, avatar: 'https://picsum.photos/id/67/150/150' },
    ]);
  }, []);

  // Simulation effect for real-time location movement
  useEffect(() => {
    if (!isDynamic) return;

    const interval = setInterval(() => {
      setVibes((currentVibes) =>
        currentVibes.map((v) => ({
          ...v,
          // Subtle jitter to simulate walking/moving around the vicinity
          lat: v.lat + (Math.random() - 0.5) * 0.5,
          lng: v.lng + (Math.random() - 0.5) * 0.5,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isDynamic]);

  // Filter vibes based on search query
  const filteredVibes = useMemo(() => {
    return vibes.filter((v) => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vibe.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [vibes, searchQuery]);

  // Sync selected user data if their position updates
  const activeUser = useMemo(() => {
    return filteredVibes.find(v => v.id === selectedUser?.id) || null;
  }, [filteredVibes, selectedUser]);

  return (
    <div className="relative w-full h-full bg-[#0F0F23] overflow-hidden">
      {/* Grid Pattern Background to Simulate Map */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #EC4899 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Map Markers */}
      {filteredVibes.map((v) => (
        <button
          key={v.id}
          onClick={() => setSelectedUser(v)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[3000ms] ease-linear hover:scale-125 hover:duration-300 z-10"
          style={{ left: `${v.lng}%`, top: `${v.lat}%` }}
        >
          <div className={`p-1 rounded-full border-2 transition-colors ${v.verified ? 'border-pink-500 bg-[#1E1B4B]' : 'border-amber-500 bg-[#1E1B4B] shadow-lg shadow-pink-500/20'}`}>
            <img src={v.avatar} alt={v.name} className="w-10 h-10 rounded-full" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1E1B4B] animate-pulse"></div>
          </div>
          <div className="bg-black/80 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-full mt-1 border border-white/10 whitespace-nowrap">
            {v.name}
          </div>
        </button>
      ))}

      {/* User Detail Overlay */}
      {activeUser && !isChatOpen && (
        <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#1E1B4B]/90 backdrop-blur-md rounded-2xl border border-pink-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-20">
          <div className="flex items-center space-x-4">
            <img src={activeUser.avatar} className="w-16 h-16 rounded-full border-2 border-pink-500" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg">{activeUser.name}</h3>
                {activeUser.verified && <span className="text-pink-400 text-sm">✅</span>}
              </div>
              <p className="text-zinc-400 text-sm">{activeUser.vibe} • {activeUser.distance} away</p>
            </div>
            <button 
              onClick={() => setSelectedUser(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 flex space-x-2">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex-1 py-3 bg-pink-600 hover:bg-pink-500 rounded-xl font-bold transition-colors"
            >
              💜 VIBE CHAT
            </button>
            <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
              SEE PROFILE
            </button>
          </div>
        </div>
      )}

      {/* Top Controls */}
      {!isChatOpen && (
        <div className="absolute top-6 left-6 right-6 z-30 space-y-2">
          <div className="bg-[#1E1B4B]/80 backdrop-blur-md border border-white/10 rounded-full px-5 py-3 flex items-center shadow-lg focus-within:border-pink-500/50 transition-colors">
            <span className="mr-3 opacity-50 text-pink-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search Vibes, People, or Categories..." 
              className="bg-transparent border-none outline-none w-full text-sm text-white placeholder:text-zinc-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setIsDynamic(!isDynamic)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border transition-all ${isDynamic ? 'bg-pink-500/20 border-pink-500 text-pink-500' : 'bg-white/5 border-white/10 text-zinc-500'}`}
            >
              {isDynamic ? '🛰️ LIVE TRACKING' : '📍 STATIC MODE'}
            </button>
          </div>
        </div>
      )}

      {/* Chat Interface Modal */}
      {isChatOpen && activeUser && (
        <div className="absolute inset-0 z-50 bg-[#0F0F23] animate-in slide-in-from-bottom-full duration-300 flex flex-col">
          <header className="px-6 py-4 bg-[#1E1B4B] border-b border-white/10 flex items-center space-x-4">
            <button 
              onClick={() => setIsChatOpen(false)}
              className="p-2 -ml-2 hover:bg-white/5 rounded-full text-pink-500"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex-1 flex items-center space-x-3">
              <img src={activeUser.avatar} className="w-10 h-10 rounded-full border border-pink-500" />
              <div>
                <h3 className="font-bold text-sm leading-none">{activeUser.name}</h3>
                <span className="text-[10px] text-green-400 uppercase tracking-widest font-black">Online Now</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="text-center py-10">
              <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold">This is the start of your vibe chat</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <img src={activeUser.avatar} className="w-8 h-8 rounded-full" />
              <div className="bg-[#1E1B4B] p-4 rounded-2xl rounded-tl-none border border-white/5 max-w-[80%]">
                <p className="text-sm">Hey! I'm around {activeUser.vibe} area. Are you nearby?</p>
                <span className="text-[10px] text-zinc-500 mt-2 block">12:45 PM</span>
              </div>
            </div>

            <div className="flex items-start justify-end space-x-3">
              <div className="bg-pink-600 p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg shadow-pink-500/20">
                <p className="text-sm">Yeah! Just checking out the vicinity. Love the vibe here!</p>
                <span className="text-[10px] text-pink-200 mt-2 block text-right">12:46 PM</span>
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl text-center">
              <p className="text-[10px] text-zinc-400 italic">User is currently moving...</p>
            </div>
          </div>

          <div className="p-4 bg-[#1E1B4B] border-t border-white/10 pb-10">
            <div className="flex items-center space-x-2 bg-white/5 rounded-2xl px-4 py-2 border border-white/10 focus-within:border-pink-500/50 transition-colors">
              <input 
                type="text" 
                placeholder="Send a vibe..." 
                className="bg-transparent border-none outline-none flex-1 text-sm py-2"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button 
                className={`p-2 rounded-xl transition-all ${chatMessage ? 'bg-pink-600 text-white scale-110' : 'text-zinc-600'}`}
                disabled={!chatMessage}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State when no results found */}
      {filteredVibes.length === 0 && searchQuery && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5">
            <p className="text-zinc-400 mb-2">No vibes match your search</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-pink-500 text-sm font-bold pointer-events-auto"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
