
import React, { useState, useEffect, useMemo } from 'react';
import { VibeUser } from '../types';

interface MapScreenProps {
  isDarkMode: boolean;
}

const MapScreen: React.FC<MapScreenProps> = ({ isDarkMode }) => {
  const [vibes, setVibes] = useState<VibeUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<VibeUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isDynamic, setIsDynamic] = useState(true);

  useEffect(() => {
    // Initial Mock Data with normalized starting positions
    setVibes([
      { id: '1', name: 'Alex 🌙', vibe: 'Nightlife', lat: 40, lng: 30, distance: '0.2mi', verified: true, avatar: 'https://picsum.photos/id/64/150/150' },
      { id: '2', name: 'Jamie 🎸', vibe: 'Live Music', lat: 60, lng: 70, distance: '0.1mi', verified: true, avatar: 'https://picsum.photos/id/65/150/150' },
      { id: '3', name: 'Trivia @TheSpot', vibe: 'Games', lat: 25, lng: 45, distance: '0.3mi', verified: true, avatar: 'https://picsum.photos/id/66/150/150' },
      { id: '4', name: 'Sara 🏞️', vibe: 'Outdoor', lat: 75, lng: 20, distance: '0.4mi', verified: false, avatar: 'https://picsum.photos/id/67/150/150' },
      { id: '5', name: 'Jordan ☕', vibe: 'Coffee Shop', lat: 15, lng: 85, distance: '0.6mi', verified: true, avatar: 'https://picsum.photos/id/68/150/150' },
    ]);
  }, []);

  // Enhanced Simulation effect for real-time location movement
  useEffect(() => {
    if (!isDynamic) return;

    const interval = setInterval(() => {
      setVibes((currentVibes) =>
        currentVibes.map((v) => {
          // Calculate a small delta for movement (approx 0.5% - 1% of screen space)
          const dLat = (Math.random() - 0.5) * 1.2;
          const dLng = (Math.random() - 0.5) * 1.2;
          
          // Constrain movement to keep them within visible bounds (5% to 95%)
          let newLat = v.lat + dLat;
          let newLng = v.lng + dLng;
          
          if (newLat < 5 || newLat > 95) newLat = v.lat - dLat;
          if (newLng < 5 || newLng > 95) newLng = v.lng - dLng;

          return {
            ...v,
            lat: newLat,
            lng: newLng,
          };
        })
      );
    }, 3000); // Update every 3 seconds to match the CSS transition duration

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
    <div className={`relative w-full h-full overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0F0F23]' : 'bg-slate-100'}`}>
      {/* Grid Pattern Background to Simulate Map */}
      <div 
        className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300`}
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? '#EC4899' : '#94a3b8'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Map Markers with Smooth Gliding Transitions */}
      {filteredVibes.map((v) => (
        <button
          key={v.id}
          onClick={() => setSelectedUser(v)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ease-linear z-10 ${isDynamic ? 'duration-[3000ms]' : 'duration-300'} hover:scale-125 hover:z-20`}
          style={{ left: `${v.lng}%`, top: `${v.lat}%` }}
        >
          <div className={`p-1 rounded-full border-2 transition-colors ${selectedUser?.id === v.id ? 'border-pink-500 scale-110 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : v.verified ? 'border-pink-500/50' : 'border-amber-500/50'} ${isDarkMode ? 'bg-[#1E1B4B]' : 'bg-white shadow-md'}`}>
            <img src={v.avatar} alt={v.name} className="w-10 h-10 rounded-full" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1E1B4B] animate-pulse"></div>
          </div>
          <div className={`${isDarkMode ? 'bg-black/80 text-white border-white/10' : 'bg-white/90 text-slate-800 border-slate-200 shadow-sm'} backdrop-blur-sm text-[10px] px-2 py-0.5 rounded-full mt-1 border whitespace-nowrap font-bold`}>
            {v.name}
          </div>
        </button>
      ))}

      {/* User Detail Overlay */}
      {activeUser && !isChatOpen && (
        <div className={`absolute bottom-6 left-6 right-6 p-4 backdrop-blur-md rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1B4B]/90 border-pink-500/30' : 'bg-white/95 border-slate-200'}`}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src={activeUser.avatar} className="w-16 h-16 rounded-full border-2 border-pink-500" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1E1B4B]"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeUser.name}</h3>
                {activeUser.verified && <span className="text-pink-400 text-sm">✅</span>}
              </div>
              <p className={`${isDarkMode ? 'text-zinc-400' : 'text-slate-500'} text-sm`}>{activeUser.vibe} • Moving nearby</p>
            </div>
            <button 
              onClick={() => setSelectedUser(null)}
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              ✕
            </button>
          </div>
          <div className="mt-4 flex space-x-2">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex-1 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-pink-500/20 active:scale-95"
            >
              💜 VIBE CHAT
            </button>
            <button className={`flex-1 py-3 rounded-xl font-bold transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
              SEE PROFILE
            </button>
          </div>
        </div>
      )}

      {/* Top Controls */}
      {!isChatOpen && (
        <div className="absolute top-6 left-6 right-6 z-30 space-y-2">
          <div className={`backdrop-blur-md border rounded-full px-5 py-3 flex items-center shadow-lg transition-colors focus-within:border-pink-500/50 ${isDarkMode ? 'bg-[#1E1B4B]/80 border-white/10' : 'bg-white border-slate-200'}`}>
            <span className="mr-3 opacity-50 text-pink-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search Vibes, People, or Categories..." 
              className={`bg-transparent border-none outline-none w-full text-sm placeholder:text-zinc-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center px-2">
            <span className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
              {filteredVibes.length} Vibes Active
            </span>
            <button 
              onClick={() => setIsDynamic(!isDynamic)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border transition-all flex items-center gap-2 ${isDynamic ? 'bg-pink-500/20 border-pink-500 text-pink-500' : isDarkMode ? 'bg-white/5 border-white/10 text-zinc-500' : 'bg-slate-200 border-slate-300 text-slate-600'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isDynamic ? 'bg-pink-500 animate-ping' : 'bg-current'}`}></div>
              {isDynamic ? 'LIVE TRACKING' : 'STATIC MODE'}
            </button>
          </div>
        </div>
      )}

      {/* Chat Interface Modal */}
      {isChatOpen && activeUser && (
        <div className={`absolute inset-0 z-50 animate-in slide-in-from-bottom-full duration-300 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0F0F23]' : 'bg-slate-50'}`}>
          <header className={`px-6 py-4 border-b flex items-center space-x-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1B4B] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="p-2 -ml-2 hover:bg-white/5 rounded-full text-pink-500 transition-transform active:scale-90"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex-1 flex items-center space-x-3">
              <div className="relative">
                <img src={activeUser.avatar} className="w-10 h-10 rounded-full border border-pink-500" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1E1B4B]"></div>
              </div>
              <div>
                <h3 className={`font-bold text-sm leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeUser.name}</h3>
                <span className="text-[10px] text-green-400 uppercase tracking-widest font-black">Moving nearby</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
            <div className="text-center py-10">
              <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold">This is the start of your vibe chat</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <img src={activeUser.avatar} className="w-8 h-8 rounded-full" />
              <div className={`p-4 rounded-2xl rounded-tl-none border max-w-[80%] transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1B4B] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Hey! I'm around {activeUser.vibe} area. Are you nearby?</p>
                <span className="text-[10px] text-zinc-500 mt-2 block">12:45 PM</span>
              </div>
            </div>

            <div className="flex items-start justify-end space-x-3">
              <div className="bg-pink-600 p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg shadow-pink-500/20 text-white">
                <p className="text-sm">Yeah! Just checking out the vicinity. Love the vibe here!</p>
                <span className="text-[10px] text-pink-200 mt-2 block text-right">12:46 PM</span>
              </div>
            </div>

            <div className={`p-3 rounded-xl text-center transition-colors duration-300 ${isDarkMode ? 'bg-white/5' : 'bg-slate-200/50'}`}>
              <p className="text-[10px] text-zinc-400 italic">User is currently in motion...</p>
            </div>
          </div>

          <div className={`p-4 border-t pb-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#1E1B4B] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center space-x-2 rounded-2xl px-4 py-2 border transition-all duration-300 focus-within:border-pink-500/50 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <input 
                type="text" 
                placeholder="Send a vibe..." 
                className={`bg-transparent border-none outline-none flex-1 text-sm py-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button 
                className={`p-2 rounded-xl transition-all ${chatMessage ? 'bg-pink-600 text-white scale-110' : 'text-zinc-400'}`}
                disabled={!chatMessage}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
