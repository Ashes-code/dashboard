
import React from 'react';
import { ChevronDown, Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-transparent">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-white/10 text-gray-300"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-base md:text-lg text-gray-300 font-medium">
          Hello, melas
        </h2>
      </div>
      <div className="flex items-center max-w-[60%] sm:max-w-none space-x-3 sm:space-x-4 bg-white/5 px-3 sm:px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
        <img 
          src="https://picsum.photos/seed/melas/32/32" 
          alt="Avatar" 
          className="w-8 h-8 rounded-full border border-white/10"
        />
        <div className="hidden xs:flex sm:flex flex-col min-w-0">
          <span className="text-sm font-medium text-gray-300 truncate">melasin4@gmail.com</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
    </header>
  );
};

export default TopBar;
