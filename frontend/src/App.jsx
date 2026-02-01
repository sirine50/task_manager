import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import WorkspaceSidebar from './components/WorkspaceSidebar';
import TaskBoard from './components/TaskBoard';
import Auth from './components/Auth';
import { authAPI, workspacesAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWsId, setSelectedWsId] = useState(null);

  // Load workspaces when user logs in
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const data = await workspacesAPI.getWorkspaces(user.user_id);
          setWorkspaces(data);
          if (data.length > 0) setSelectedWsId(data[0].id);
        } catch (err) {
          console.error("Fetch Error:", err);
        }
      }
    };
    loadData();
  }, [user]);

  const handleAuth = async (formData, type, setError) => {
    try {
      if (type === 'register') {
        const newUser = await authAPI.register(formData);
        setUser(newUser);
      } else {
        const User = await authAPI.LogIn(formData);
        setUser(User);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setWorkspaces([]);
    setSelectedWsId(null);
  };

  const handleAddWorkspace = async (name) => {
    try {
      const newWs = await workspacesAPI.addWorkspace({ 
        name: name, 
        owner_id: user.user_id 
      });
      // Python returns {"id": ..., "name": ...}, so we use it directly
      setWorkspaces((prev) => [...prev, newWs]);
      setSelectedWsId(newWs.id);
    } catch (err) {
      alert("Error adding workspace");
    }
  };

  const handleDeleteWorkspace = async (id) => {
    try {
      await workspacesAPI.removeWorkspace(id);
      // Remove from UI state
      setWorkspaces((prev) => {
        const filtered = prev.filter(ws => ws.id !== id);
        // If we deleted the current one, select the first available or null
        if (selectedWsId === id) {
          setSelectedWsId(filtered.length > 0 ? filtered[0].id : null);
        }
        return filtered;
      });
    } catch (err) {
      alert("Error deleting workspace");
    }
  };

  if (!user) return <Auth onAuthAction={handleAuth} />;

  // Find the workspace object to get its name for the header
  const currentWorkspace = workspaces.find(ws => ws.id === selectedWsId);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      <Navbar username={user.username} onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar 
          workspaces={workspaces} 
          selectedId={selectedWsId}
          onSelect={setSelectedWsId}
          onAdd={handleAddWorkspace}
          onDelete={handleDeleteWorkspace}
        />
          
        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-black">
          <div className="max-w-3xl mx-auto">
            
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-tighter border border-cyan-500/20 rounded">
                  Status: Operational
                </span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                {currentWorkspace?.name || "Select a Workspace"}
              </h1>
              <p className="text-gray-500 mt-2 text-sm italic">
                Nexus Engine Subsystem / Root_ID: {selectedWsId || "NULL"}
              </p>
            </header>

            <section className="animate-in fade-in zoom-in-95 duration-500">
              <TaskBoard tasks={[]} /> 
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;