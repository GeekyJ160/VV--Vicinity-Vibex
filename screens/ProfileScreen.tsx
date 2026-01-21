
import React from 'react';

interface ProfileScreenProps {
  userVibe: string;
  onUpdateVibe: (v: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userVibe, onUpdateVibe }) => {
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 p-1">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-4xl">
              🚀
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-[#0F0F23]"></div>
        </div>
        <h2 className="mt-4 text-2xl font-black italic">You</h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Verified Vibe</p>
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-800/50 p-6 rounded-3xl border border-white/5">
          <h3 className="text-xs font-black uppercase text-pink-500 tracking-widest mb-4">Your Current Vibe</h3>
          <input 
            type="text" 
            value={userVibe}
            onChange={(e) => onUpdateVibe(e.target.value)}
            placeholder="Ex: Coffee, Jazz, Running..." 
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500 text-sm"
          />
          <p className="text-[10px] text-zinc-500 mt-2">Setting this helps AI match you with similar nearby vibes.</p>
        </div>

        <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-900/20">
          ⚡ BOOST MY PROFILE (3 LEFT)
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-800/30 p-4 rounded-2xl border border-white/5 text-center">
             <div className="text-xl font-bold">12</div>
             <div className="text-[9px] text-zinc-500 font-bold uppercase">Vibe Matches</div>
          </div>
          <div className="bg-zinc-800/30 p-4 rounded-2xl border border-white/5 text-center">
             <div className="text-xl font-bold">128</div>
             <div className="text-[9px] text-zinc-500 font-bold uppercase">Vicinity Views</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
