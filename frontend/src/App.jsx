import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import WorkspaceSidebar from './components/WorkspaceSidebar';
import TaskBoard from './components/TaskBoard';
import Auth from './components/Auth';
import { authAPI, workspacesAPI, tasksAPI } from './services/api'; // Added tasksAPI

function App() {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWsId, setSelectedWsId] = useState(null);
  const [tasks, setTasks] = useState([]); // Real task state

  // 1. Load Workspaces
  useEffect(() => {
    const loadWorkspaces = async () => {
      if (user) {
        try {
          const data = await workspacesAPI.getWorkspaces(user.user_id);
          setWorkspaces(data);
          if (data.length > 0 && !selectedWsId) setSelectedWsId(data[0].id);
        } catch (err) { console.error(err); }
      }
    };
    loadWorkspaces();
  }, [user]);

  // 2. Load Tasks (Triggers when workspace changes)
  useEffect(() => {
    const loadTasks = async () => {
      if (selectedWsId) {
        try {
          const data = await tasksAPI.gettasks(selectedWsId);
          setTasks(data);
        } catch (err) { console.error(err); }
      } else {
        setTasks([]);
      }
    };
    loadTasks();
  }, [selectedWsId]);

  // --- TASK HANDLERS ---
  const handleAddTask = async (content) => {
    try {
      const response = await tasksAPI.addTask({
        content: content,
        workspace_id: selectedWsId,
        status: "pending"
      });
      // MAPPING: Convert 'task_id' from backend to 'id' for frontend
      const newTask = { 
        id: response.task_id, 
        content: response.content, 
        status: response.status 
      };
      setTasks(prev => [...prev, newTask]);
    } catch (err) { alert(err); }
  };

  const onUpdateTaskContent = async (task, newContent) => {
  try {
    await tasksAPI.updateTask({
      content: newContent,
      status: task.status,
      workspace_id: selectedWsId
    }, task.id);
    
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, content: newContent } : t
    ));
  } catch (err) {
    alert("Update failed");
  }
};

  const handleToggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await tasksAPI.updateTask({
        content: task.content,
        status: newStatus,
        workspace_id: selectedWsId
      }, task.id);
      
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, status: newStatus } : t
      ));
    } catch (err) { alert(err); }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) { alert(err); }
  };

  // --- AUTH / WORKSPACE HANDLERS (Same as yesterday) ---
  const handleAuth = async (formData, type, setError) => {
    try {
      const User = type === 'register' ? await authAPI.register(formData) : await authAPI.LogIn(formData);
      setUser(User);
    } catch (error) { setError(error); }
  };

  const handleDeleteAccount = async () => {
  if (window.confirm("ARE YOU SURE? This will delete your account and ALL your workspaces forever.")) {
    try {
      await authAPI.deleteUser(user.user_id);
      // After deleting from DB, clear the frontend state (Log out)
      setUser(null)
      alert("Account deleted successfully.");
    } catch (err) {
      alert("Error deleting account: " + err);
    }
  }
};

  const handleAddWorkspace = async (name) => {
    try {
      const newWs = await workspacesAPI.addWorkspace({ name, owner_id: user.user_id });
      setWorkspaces(prev => [...prev, newWs]);
      setSelectedWsId(newWs.id);
    } catch (err) { alert(err); }
  };

  const handleDeleteWorkspace = async (id) => {
    try {
      await workspacesAPI.removeWorkspace(id);
      const updated = workspaces.filter(ws => ws.id !== id);
      setWorkspaces(updated);
      setSelectedWsId(updated.length > 0 ? updated[0].id : null);
    } catch (err) { alert(err); }
  };

  if (!user) return <Auth onAuthAction={handleAuth} />;

  const currentWorkspace = workspaces.find(ws => ws.id === selectedWsId);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Navbar username={user.username} onLogout={() => setUser(null)} onDeleteAccount={handleDeleteAccount}/>
      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar 
          workspaces={workspaces} 
          selectedId={selectedWsId}
          onSelect={setSelectedWsId}
          onAdd={handleAddWorkspace}
          onDelete={handleDeleteWorkspace}
        />
        <main className="flex-1 p-8 overflow-y-auto bg-gray-950">
          <div className="max-w-3xl mx-auto">
            <header className="mb-10">
              <h1 className="text-4xl font-extrabold">{currentWorkspace?.name || "Select Workspace"}</h1>
            </header>
            
            <TaskBoard 
              tasks={tasks} 
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTaskContent={onUpdateTaskContent}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;