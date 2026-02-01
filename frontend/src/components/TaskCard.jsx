import React from 'react';
import { CheckCircle2, Circle, Trash2, Clock } from 'lucide-react';

const TaskCard = ({ task }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
      isCompleted 
      ? 'bg-gray-900/30 border-gray-800 opacity-60' 
      : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5'
    }`}>
      <div className="flex items-center gap-4">
        <button className={`transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-500 hover:text-cyan-400'}`}>
          {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>
        
        <div>
          <p className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-200'}`}>
            {task.content}
          </p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
            <Clock size={12} />
            <span>Added recently</span>
          </div>
        </div>
      </div>

      <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TaskCard;