import React, { useState } from 'react';
import { LogIn, UserPlus, Zap } from 'lucide-react';

const Auth = ({ onAuthAction }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  // --- NEW: Error State ---
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors when the user clicks the button
    
    // We pass 'setError' to App.jsx so the backend error can be displayed here
    onAuthAction(formData, isLogin ? 'login' : 'register', setError);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 font-sans text-gray-100">
      <div className="absolute w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -top-10 -left-10"></div>
      
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-500/20 p-4 rounded-2xl border border-cyan-500/30">
            <Zap className="text-cyan-400" size={32} fill="currentColor" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
          {isLogin ? 'Nexus Protocol' : 'Initialize Identity'}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          {isLogin ? 'Welcome back, Engineer.' : 'Begin your journey into the Nexus.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            
            <input 
              placeholder='Username'
              type="text" 
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 transition-all text-white"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div>
            <input 
              placeholder='Password'
              type="password" 
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 mt-1 outline-none focus:border-cyan-500 transition-all text-white"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {/* --- NEW: THE ERROR BOX (Only shows if there is an error) --- */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl animate-in fade-in zoom-in-95 duration-300">
              <p className="text-red-400 text-xs text-center font-bold tracking-wide">
                ⚠️ {error.toUpperCase()}
              </p>
            </div>
          )}

          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-black py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]">
            {isLogin ? <LogIn size={20}/> : <UserPlus size={20}/>}
            {isLogin ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="w-full text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2"
          >
            {isLogin ? "New here? Register a new ID" : "Already have an ID? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;