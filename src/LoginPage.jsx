import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle State
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData; // Register needs name too

      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      onLogin(response.data.user); // Pass user back to App
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-affora-bg flex flex-col items-center justify-center p-4">
      <button onClick={onBack} className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-affora-primary font-bold transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Store
      </button>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden animate-card-entry">
        {/* Decorative Circle */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-affora-light/30 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-black text-gray-800 mb-2">{isLogin ? "Welcome Back" : "Join Affora"}</h1>
          <p className="text-gray-400">{isLogin ? "Enter your details to sign in" : "Create your account today"}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-affora-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-affora-primary outline-none transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-affora-primary transition-colors" />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-affora-primary outline-none transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-affora-primary transition-colors" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-affora-primary outline-none transition-all font-medium"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-affora-primary text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                    {isLogin ? "Sign In" : "Create Account"} 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"} 
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                className="ml-2 text-affora-primary font-bold hover:underline"
            >
                {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}