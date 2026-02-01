import React from 'react';
import { Layout, LogOut, Bell, UserX } from 'lucide-react';

const Navbar = ({ username, onLogout }) => {
  return (
    <nav className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-cyan-500 p-1.5 rounded-lg">
          <Layout size={20} className="text-gray-900" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          NEXUS<span className="text-cyan-500 text-xs ml-1 font-normal uppercase tracking-widest">TaskFlow</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-gray-800">
           <div className="text-right hidden sm:block">
             <p className="text-xs font-bold text-white leading-none">{username || 'User'}</p>
             <p className="text-[10px] text-cyan-500 font-medium">Engineer Mode</p>
           </div>
           <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
            {username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group"
        >
          <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Logout</span>
          <LogOut size={20} />
        </button>
        <button 
            onClick={() => { if(window.confirm("Delete account? This cannot be undone.")) onUpdateUser('delete'); }}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group mr-2"
            title="Delete Account"
            >
            <UserX size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;