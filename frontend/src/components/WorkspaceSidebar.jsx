import React, { useState } from 'react';
import { Plus, Folder, Trash2 } from 'lucide-react';

const WorkspaceSidebar = ({ workspaces, selectedId, onSelect, onAdd, onDelete }) => {
  const [newName, setNewName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAdd(newName);
    setNewName("");
  };

  return (
    <aside className="w-72 bg-gray-900/50 h-[calc(100vh-64px)] p-4 border-r border-gray-800 flex flex-col">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 px-2">Workspaces</h2>
      <div className="flex-1 overflow-y-auto space-y-1 mb-4">
        {workspaces.map((ws) => (
          <div key={ws.id} className="group relative">
            <button 
              onClick={() => onSelect(ws.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                selectedId === ws.id 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <Folder size={18} />
              <span className="text-sm font-semibold truncate pr-8">{ws.name}</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(ws.id); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-auto pt-4 border-t border-gray-800 relative">
        <input 
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New Workspace..."
          className="w-full bg-gray-800/30 border border-gray-700 rounded-xl py-2 px-3 text-sm text-white outline-none focus:border-cyan-500/50 transition-all"
        />
        <button type="submit" className="absolute right-2 top-5.5 p-1 bg-cyan-500 rounded-lg text-gray-950">
          <Plus size={16} strokeWidth={3} />
        </button>
      </form>
    </aside>
  );
};

export default WorkspaceSidebar;