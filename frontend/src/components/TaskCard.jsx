import React, { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Clock, Check } from 'lucide-react';

const TaskCard = ({ task, onToggle, onDelete, onUpdateContent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.content);
  const isCompleted = task.status === 'completed';

  const handleSave = () => {
    if (editValue.trim() && editValue !== task.content) {
      onUpdateContent(task, editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(task.content);
      setIsEditing(false);
    }
  };

  return (
    <div className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
      isCompleted 
      ? 'bg-gray-900/30 border-gray-800 opacity-60' 
      : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/50'
    }`}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onToggle}
          className={`transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-500 hover:text-cyan-400'}`}
        >
          {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="bg-gray-950 border border-cyan-500 rounded px-2 py-1 text-sm text-white outline-none w-full"
              />
            </div>
          ) : (
            <p 
              onDoubleClick={() => !isCompleted && setIsEditing(true)}
              className={`text-sm font-medium cursor-pointer ${isCompleted ? 'line-through text-gray-500' : 'text-gray-200 hover:text-cyan-300'}`}
              title="Double click to edit"
            >
              {task.content}
            </p>
          )}
          <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
            <Clock size={12} />
            <span>Double-click text to edit</span>
          </div>
        </div>
      </div>

      <button 
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TaskCard;