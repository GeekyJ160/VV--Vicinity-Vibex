
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [peerCount, setPeerCount] = useState(0);
  
  // Real-time Self Location (Map coordinates 0-100)
  const [selfPos, setSelfPos] = useState({ lat: 50, lng: 50 });
  
  // Ref to track user headings for simulated wander
  const headings = useRef<Record<string, number>>({});
  const channel = useRef<BroadcastChannel | null>(null);
  const selfId = useRef(Math.random().toString(36).substr(2, 9));

  // 1. Initialize BroadcastChannel (Simulated P2P/WebRTC Data Channel)
  useEffect(() => {
    try {
      channel.current = new BroadcastChannel('vicinity-vibe-sync');
      setConnectionStatus('connected');

      channel.current.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'LOCATION_UPDATE' && payload.id !== selfId.current) {
          setVibes(prev => {
            const exists = prev.find(u => u.id === payload.id);
            if (exists) {
              return prev.map(u => u.id === payload.id ? { ...u, ...payload, isPeer: true } : u);
            }
            return [...prev, { ...payload, isPeer: true }];
          });
        }
      };

      // Periodic "Heartbeat" to announce presence
      const heartbeat = setInterval(() => {
        channel.current?.postMessage({
          type: 'LOCATION_UPDATE',
          payload: {
            id: selfId.current,
            name: 'You (Peer)',
            vibe: 'Syncing...',
            lat: selfPos.lat,
            lng: selfPos.lng,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=self',
            distance: '0.0mi',
            verified: true
          }
        });
      }, 2000);

      return () => {
        clearInterval(heartbeat);
        channel.current?.close();
      };
    } catch (e) {
      setConnectionStatus('offline');
    }
  }, [selfPos]);

  // 2. Real-time Geolocation Hook
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        // Map actual GPS to 0-100 coordinates for the demo map
        // This is a simplification: in a real app, we'd use a real map provider (Google Maps/Leaflet)
        // Here we simulate movement based on small changes in real GPS
        const lat = 50 + (pos.coords.latitude % 0.01) * 1000;
        const lng = 50 + (pos.coords.longitude % 0.01) * 1000;
        
        // Clamp to map boundaries
        setSelfPos({ 
          lat: Math.min(95, Math.max(5, lat)), 
          lng: Math.min(95, Math.max(5, lng)) 
        });
      },
      (err) => console.warn('Geolocation error:', err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 3. Simulated "Filler" Users and Wander Logic
  useEffect(() => {
    const initialUsers: VibeUser[] = [
      { id: 'sim-1', name: 'Alex 🌙', vibe: 'Nightlife', lat: 40, lng: 30, distance: '0.2mi', verified: true, avatar: 'https://picsum.photos/id/64/150/150' },
      { id: 'sim-2', name: 'Jamie 🎸', vibe: 'Live Music', lat: 60, lng: 70, distance: '0.1mi', verified: true, avatar: 'https://picsum.photos/id/65/150/150' },
      { id: 'sim-3', name: 'Trivia @TheSpot', vibe: 'Games', lat: 25, lng: 45, distance: '0.3mi', verified: true, avatar: 'https://picsum.photos/id/66/150/150' },
    ];
    
    initialUsers.forEach(u => headings.current[u.id] = Math.random() * Math.PI * 2);
    setVibes(initialUsers);
  }, []);

  useEffect(() => {
    if (!isDynamic) return;

    const interval = setInterval(() => {
      setVibes((currentVibes) =>
        currentVibes.map((v) => {
          // Only wander the "simulated" users, not peers from BroadcastChannel
          if (v.id.startsWith('peer-')) return v;

          let angle = headings.current[v.id] || Math.random() * Math.PI * 2;
          angle += (Math.random() - 0.5) * 0.4;
          headings.current[v.id] = angle;

          const speed = 0.8 + Math.random() * 1.2;
          const dLat = Math.cos(angle) * speed;
          const dLng = Math.sin(angle) * speed;
          
          let newLat = v.lat + dLat;
          let newLng = v.lng + dLng;
          
          if (newLat < 5 || newLat > 95) { headings.current[v.id] += Math.PI; newLat = v.lat - dLat; }
          if (newLng < 5 || newLng > 95) { headings.current[v.id] += Math.PI; newLng = v.lng - dLng; }

          const dx = newLng - selfPos.lng;
          const dy = newLat - selfPos.lat;
          const dist = Math.sqrt(dx * dx + dy * dy) * 0.02;

          return {
            ...v,
            lat: newLat,
            lng: newLng,
            distance: `${dist.toFixed(1)}mi`
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isDynamic, selfPos]);

  const filteredVibes = useMemo(() => {
    return vibes.filter((v) => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vibe.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [vibes, searchQuery]);

  return (
    <div className={`relative w-full h-full overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0F0F23]' : 'bg-slate-100'}`}>
      {/* Dynamic Radar Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square border border-pink-500/5 rounded-full animate-[pulse_8s_infinite]"></div>
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square border border-pink-500/10 rounded-full animate-[pulse_6s_infinite]"></div>
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] aspect-square border border-pink-500/20 rounded-full animate-[pulse_4s_infinite]"></div>
      </div>

      {/* Grid Pattern */}
      <div 
        className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300`}
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? '#EC4899' : '#94a3b8'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Real-time SELF Marker */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear z-50"
        style={{ left: `${selfPos.lng}%`, top: `${selfPos.lat}%` }}
      >
        <div className="relative">
          <div className="absolute inset-0 w-12 h-12 -left-4 -top-4 bg-pink-500/30 rounded-full animate-ping"></div>
          <div className="w-6 h-6 bg-pink-500 rounded-full border-4 border-white shadow-[0_0_20px_#EC4899] flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-pink-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full whitespace-nowrap uppercase tracking-widest shadow-lg">
            You (Live)
          </div>
        </div>
      </div>

      {/* Peer and Simulated Markers */}
      {filteredVibes.map((v) => (
        <button
          key={v.id}
          onClick={() => setSelectedUser(v)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ease-linear z-10 ${isDynamic ? 'duration-[3000ms]' : 'duration-300'} hover:scale-125 hover:z-20`}
          style={{ left: `${v.lng}%`, top: `${v.lat}%` }}
        >
          {isDynamic && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-10 h-10 rounded-full animate-ping ${(v as any).isPeer ? 'bg-violet-500/30' : 'bg-pink-500/20'}`}></div>
            </div>
          )}
          
          <div className={`p-1 rounded-full border-2 transition-all relative z-10 ${selectedUser?.id === v.id ? 'border-pink-500 scale-110 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : (v as any).isPeer ? 'border-violet-500' : 'border-amber-500/50'} ${isDarkMode ? 'bg-[#1E1B4B]' : 'bg-white shadow-md'}`}>
            <img src={v.avatar} alt={v.name} className="w-9 h-9 rounded-full object-cover" />
            {(v as any).isPeer && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-violet-600 rounded-full border-2 border-white flex items-center justify-center">
                 <span className="text-[6px] text-white">📡</span>
              </div>
            )}
          </div>
          
          <div className={`${isDarkMode ? 'bg-black/80 text-white border-white/10' : 'bg-white/90 text-slate-800 border-slate-200 shadow-sm'} backdrop-blur-sm text-[8px] px-2 py-0.5 rounded-full mt-1 border whitespace-nowrap font-black tracking-widest uppercase flex items-center gap-1`}>
             <span className={(v as any).isPeer ? 'text-violet-500' : 'text-pink-500'}>◈</span> {v.name}
          </div>
        </button>
      ))}

      {/* Top HUD: Connectivity & Search */}
      <div className="absolute top-6 left-6 right-6 z-30 space-y-3">
        <div className={`flex items-center justify-between px-1 transition-all`}>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-slate-200 shadow-lg'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-[9px] font-black tracking-[0.2em] uppercase ${isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>
                {connectionStatus === 'connected' ? 'RTC SYNC ACTIVE' : 'NETWORK ERROR'}
              </span>
            </div>
            <div className="w-px h-3 bg-zinc-500/30"></div>
            <span className={`text-[9px] font-black tracking-[0.1em] ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
              {vibes.length} VIBES FOUND
            </span>
          </div>
          
          <div className="flex gap-2">
            <button className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-lg ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
              📡
            </button>
          </div>
        </div>

        <div className={`backdrop-blur-md border rounded-2xl px-5 py-3 flex items-center shadow-2xl transition-all focus-within:ring-2 focus-within:ring-pink-500/50 ${isDarkMode ? 'bg-[#1E1B4B]/80 border-white/10' : 'bg-white border-slate-200'}`}>
          <span className="mr-3 text-pink-500">🔍</span>
          <input 
            type="text" 
            placeholder="Search local vibe stream..." 
            className={`bg-transparent border-none outline-none w-full text-sm font-medium placeholder:text-zinc-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* User Detail Overlay */}
      {selectedUser && !isChatOpen && (
        <div className={`absolute bottom-6 left-6 right-6 p-6 backdrop-blur-xl rounded-[2.5rem] border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-6 duration-500 z-40 ${isDarkMode ? 'bg-[#1E1B4B]/90 border-pink-500/30' : 'bg-white/95 border-slate-200'}`}>
          <div className="flex items-center space-x-5">
            <div className="relative group cursor-pointer" onClick={() => setSelectedUser(null)}>
              <img src={selectedUser.avatar} className="w-20 h-20 rounded-full border-4 border-pink-500 shadow-2xl transition-transform group-hover:scale-105" />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#1E1B4B]"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`font-black text-xl italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedUser.name}</h3>
                {selectedUser.verified && <span className="bg-pink-500 text-white p-0.5 rounded-full text-[8px]">✔</span>}
              </div>
              <p className={`text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1`}>
                {selectedUser.vibe}
              </p>
              <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'} text-[10px] font-bold`}>
                <span className="bg-white/10 px-2 py-0.5 rounded-md">📍 {selectedUser.distance} AWAY</span>
                <span className="bg-white/10 px-2 py-0.5 rounded-md uppercase">Live Now</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex-[2] py-4 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-pink-500/30 active:scale-95"
            >
              💜 CONNECT VIBE
            </button>
            <button className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
              BIO
            </button>
          </div>
        </div>
      )}

      {/* Connection Drawer (Simulated WebRTC stats) */}
      <div className={`absolute bottom-6 right-6 flex flex-col items-end space-y-2 pointer-events-none opacity-50`}>
        <div className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
          P2P CHANNEL: {selfId.current.toUpperCase()}
        </div>
        <div className={`text-[8px] font-black uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
          LATENCY: 42ms
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
