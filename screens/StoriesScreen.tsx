
import React from 'react';

const StoriesScreen: React.FC = () => {
  const stories = [
    { id: 1, name: 'Alex', img: 'https://picsum.photos/id/10/200/200', active: true },
    { id: 2, name: 'Jamie', img: 'https://picsum.photos/id/11/200/200', active: true },
    { id: 3, name: 'Taylor', img: 'https://picsum.photos/id/12/200/200', active: false },
    { id: 4, name: 'You', img: 'https://picsum.photos/id/13/200/200', active: false },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 italic">Live Stories</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {stories.map(s => (
          <div key={s.id} className="flex flex-col items-center shrink-0 space-y-2">
            <div className={`w-20 h-20 rounded-full p-1 border-2 ${s.active ? 'border-pink-500' : 'border-zinc-700'}`}>
              <img src={s.img} className="w-full h-full rounded-full object-cover grayscale-[0.2]" alt={s.name} />
            </div>
            <span className="text-xs text-zinc-400 font-bold">{s.name}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-10 bg-zinc-800/50 rounded-3xl p-10 border border-white/5 text-center">
        <div className="text-4xl mb-4">📸</div>
        <h3 className="text-lg font-bold">Add to your Story</h3>
        <p className="text-zinc-500 text-sm mt-2 max-w-[200px] mx-auto">Share your current vicinity vibe with everyone nearby for 24 hours.</p>
        <button className="mt-6 bg-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-500 transition-colors">
          OPEN CAMERA
        </button>
      </div>
    </div>
  );
};

export default StoriesScreen;
