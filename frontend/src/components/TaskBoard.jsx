import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { PlusCircle } from 'lucide-react';

const TaskBoard = ({ tasks, onAddTask, onToggleTask, onUpdateTaskContent,onDeleteTask }) => {
  const [taskInput, setTaskInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && taskInput.trim()) {
      onAddTask(taskInput);
      setTaskInput(""); // Clear input after adding
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Add Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-500 transition-colors">
          <PlusCircle size={20} />
        </div>
        <input 
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task to this workspace..."
          className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-600 text-white"
        />
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-3">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggle={() => onToggleTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              onUpdateContent={onUpdateTaskContent}
            />
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl text-gray-600">
            <p>No tasks found in this workspace.</p>
            <p className="text-sm">Start by adding one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;