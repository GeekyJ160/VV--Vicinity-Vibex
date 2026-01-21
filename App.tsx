
import React, { useState } from 'react';
import MapScreen from './screens/MapScreen';
import SwipeScreen from './screens/SwipeScreen';
import RouletteScreen from './screens/RouletteScreen';
import PromoDashboardScreen from './screens/PromoDashboardScreen';
import StoriesScreen from './screens/StoriesScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import { TabType, VibeUser } from './types';
import { MapIcon, FeedIcon, RouletteIcon, PromoIcon, ProfileIcon, HeartIcon, StoryIcon, ChatIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.SWIPE);
  const [userVibe, setUserVibe] = useState<string>("");
  const [selectedChatUser, setSelectedChatUser] = useState<VibeUser | null>(null);

  const handleStartChat = (user: VibeUser) => {
    setSelectedChatUser(user);
    setActiveTab(TabType.CHAT);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TabType.SWIPE: 
        return <SwipeScreen userVibe={userVibe} onMatch={handleStartChat} />;
      case TabType.MAP: 
        return <MapScreen userVibe={userVibe} onChat={handleStartChat} />;
      case TabType.ROULETTE: 
        return <RouletteScreen userVibe={userVibe} onAction={() => setActiveTab(TabType.MAP)} />;
      case TabType.STORIES:
        return <StoriesScreen />;
      case TabType.PROMOS: 
        return <PromoDashboardScreen />;
      case TabType.PROFILE: 
        return <ProfileScreen userVibe={userVibe} onUpdateVibe={setUserVibe} />;
      case TabType.CHAT:
        return <ChatScreen user={selectedChatUser} />;
      default: 
        return <SwipeScreen userVibe={userVibe} onMatch={handleStartChat} />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0F0F23] text-white">
      <header className="px-6 py-4 bg-[#1E1B4B] border-b border-white/10 flex justify-between items-center shrink-0 shadow-lg z-50">
        <h1 className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
          VICINITY VIBE
        </h1>
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/20 border border-amber-500/50 text-amber-500 text-[10px] px-2 py-1 rounded-full font-black">3 BOOSTS</div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-amber-500 border-2 border-white/20"></div>
        </div>
      </header>

      <main className="flex-1 relative overflow-auto bg-[#0F0F23]">
        {renderContent()}
      </main>

      <nav className="h-20 bg-[#1E1B4B] border-t border-white/10 flex items-center justify-around px-2 shrink-0 z-50">
        <NavButton active={activeTab === TabType.SWIPE} onClick={() => setActiveTab(TabType.SWIPE)} icon={<HeartIcon />} label="Swipe" />
        <NavButton active={activeTab === TabType.MAP} onClick={() => setActiveTab(TabType.MAP)} icon={<MapIcon />} label="Map" />
        <NavButton active={activeTab === TabType.ROULETTE} onClick={() => setActiveTab(TabType.ROULETTE)} icon={<RouletteIcon />} label="Play" />
        <NavButton active={activeTab === TabType.STORIES} onClick={() => setActiveTab(TabType.STORIES)} icon={<StoryIcon />} label="Live" />
        <NavButton active={activeTab === TabType.CHAT} onClick={() => setActiveTab(TabType.CHAT)} icon={<ChatIcon />} label="Chat" />
        <NavButton active={activeTab === TabType.PROFILE} onClick={() => setActiveTab(TabType.PROFILE)} icon={<ProfileIcon />} label="Me" />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 transition-all ${active ? 'text-pink-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    {icon}
    <span className="text-[9px] uppercase font-bold tracking-widest">{label}</span>
  </button>
);

export default App;
