
import React from 'react';
import { Home, Users as UsersIcon, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onUsersClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOpen = false, onClose, onUsersClick }) => {
  return (
    <aside
      className={`w-64 h-screen bg-[#0c0c0e] border-r border-white/5 flex flex-col fixed left-0 top-0 transform transition-transform duration-200 ease-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:fixed md:transform-none z-50`}
    >
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold italic">AV</span>
        </div>
        <h1 className="text-blue-500 font-bold text-xl tracking-tight">AfriVacx</h1>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded hover:bg-white/10 text-gray-400"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-2">
        <a href="#" className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg text-white">
          <Home className="w-5 h-5 opacity-70" />
          <span className="font-medium">Home</span>
        </a>
        <button
          onClick={onUsersClick}
          className="w-full flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg text-gray-400 transition-colors text-left"
        >
          <UsersIcon className="w-5 h-5 opacity-70" />
          <span className="font-medium">Users</span>
        </button>
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <a href="#" className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
          <Settings className="w-5 h-5 opacity-70" />
          <span className="font-medium">Settings</span>
        </a>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 p-3 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 opacity-70" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
