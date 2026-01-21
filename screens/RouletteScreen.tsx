
import React, { useState } from 'react';

interface RouletteScreenProps {
  onAction: () => void;
}

const RouletteScreen: React.FC<RouletteScreenProps> = ({ onAction }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const options = [
    'Nightlife @BarVV', 
    'Live Music nearby', 
    'Trivia Night', 
    'Food Trucks', 
    'Park Hangout', 
    'Arcade Games', 
    'Yoga Flow', 
    'Coffee & Chat'
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    
    setTimeout(() => {
      setIsSpinning(false);
      const win = options[Math.floor(Math.random() * options.length)];
      setResult(win);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500">
          BOREDOM ROULETTE
        </h2>
        <p className="text-zinc-400">Can't decide? Let the Vibe find you.</p>
      </div>

      <div className="relative">
        <div 
          className={`w-64 h-64 rounded-full border-8 border-[#1E1B4B] shadow-[0_0_50px_rgba(236,72,153,0.3)] relative overflow-hidden transition-all duration-[2000ms] ease-out ${isSpinning ? 'rotate-[1440deg]' : ''}`}
          style={{
            background: `conic-gradient(
              #EC4899 0deg 45deg, 
              #F59E0B 45deg 90deg, 
              #8B5CF6 90deg 135deg, 
              #10B981 135deg 180deg, 
              #EF4444 180deg 225deg, 
              #3B82F6 225deg 270deg, 
              #F97316 270deg 315deg, 
              #8B5CF6 315deg 360deg
            )`
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#1E1B4B] rounded-full border-4 border-white flex items-center justify-center font-bold text-xs">
            VV
          </div>
        </div>
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white"></div>
      </div>

      {!result ? (
        <button 
          onClick={handleSpin}
          disabled={isSpinning}
          className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${isSpinning ? 'bg-zinc-700 opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-violet-600 hover:scale-105 shadow-xl shadow-pink-500/20'}`}
        >
          {isSpinning ? 'SPINNING...' : '🎰 SPIN THE WHEEL'}
        </button>
      ) : (
        <div className="w-full space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-white/10 p-6 rounded-2xl border border-pink-500/50 shadow-2xl">
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">Your Vibe Is:</p>
            <h3 className="text-2xl font-bold text-pink-400">{result}</h3>
          </div>
          <button 
            onClick={onAction}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold transition-all"
          >
            LET'S GO! 🚀
          </button>
          <button 
            onClick={() => setResult(null)}
            className="w-full py-3 text-zinc-500 hover:text-white transition-all text-sm font-semibold"
          >
            Spin Again
          </button>
        </div>
      )}
    </div>
  );
};

export default RouletteScreen;
