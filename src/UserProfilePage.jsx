import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, User, Mail, Lock, Save, Package, Heart, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';

export default function UserProfilePage({ user, onBack, onLogout, onUpdateUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '' // FIXED: Start empty. Don't show current hash.
  });
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    if (user) {
        axios.get(`${API_URL}/users/${user.id}/stats`)
             .then(res => setStats(res.data))
             .catch(err => console.error(err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Backend now handles empty password intelligently
      await axios.put(`${API_URL}/users/${user.id}`, formData);
      
      // Update local state (keep password hidden/empty in UI)
      onUpdateUser({ ...user, name: formData.name, email: formData.email });
      
      setMessage("Profile updated successfully!");
      setFormData(prev => ({ ...prev, password: '' })); // Reset password field
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
        try {
            await axios.delete(`${API_URL}/users/${user.id}`);
            onLogout();
            alert("Account deleted.");
        } catch (e) {
            console.error(e);
            alert("Failed to delete account.");
        }
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in min-h-screen">
      
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-affora-primary mb-8 transition-colors font-medium">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Browse
      </button>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-affora-primary/10 rounded-full flex items-center justify-center text-affora-primary">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-bold">
            <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stats Card */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-affora-primary rounded-full mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-400 text-sm mb-6">{user.email}</p>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <Package className="w-6 h-6 text-affora-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{stats.orders}</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Orders</div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-xl">
                        <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{stats.wishlist}</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Wishlist</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                {message && (
                    <div className="absolute top-0 left-0 w-full bg-green-500 text-white p-3 text-center font-bold text-sm flex items-center justify-center gap-2 animate-slide-down">
                        <CheckCircle className="w-4 h-4" /> {message}
                    </div>
                )}

                <h3 className="text-lg font-bold text-gray-700 mb-6">Account Details</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-affora-primary outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-affora-primary outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input 
                                type="password" 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Leave blank to keep current password"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-affora-primary outline-none transition-all placeholder-gray-400 text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="bg-affora-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-70"
                        >
                            <Save className="w-5 h-5" /> {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h4 className="text-red-500 font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Danger Zone</h4>
                    <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button 
                        onClick={handleDeleteAccount}
                        className="px-6 py-3 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors"
                    >
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}