import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Star, User, PieChart, BarChart2, ShoppingCart, Clock, Heart, Users } from 'lucide-react';

export default function ReviewsPage({ product, onBack }) {
  const [activeTab, setActiveTab] = useState('feedbacks');
  const [wishlistCount, setWishlistCount] = useState(0); // NEW STATE

  // Fetch Analytics when tab changes
  useEffect(() => {
    if (activeTab === 'tracker') {
        axios.get(`http://localhost:3000/api/analytics/wishlist/${product.id}`)
             .then(res => setWishlistCount(res.data.count))
             .catch(err => console.error(err));
    }
  }, [activeTab, product.id]);

  const reviews = [
    { id: 1, user: "Sarah J.", variant: "Red Shad", rating: 5, comment: "Absolutely love the quality! Matches the description perfectly.", images: [1, 2, 3] },
    { id: 2, user: "Mark D.", variant: "Red Shad", rating: 5, comment: "Fast delivery and great packaging. Will buy again.", images: [1, 2] },
    { id: 3, user: "Emily R.", variant: "Rainbow K", rating: 5, comment: "The colors are vibrant and the material is soft.", images: [1, 2] },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in min-h-screen bg-affora-bg text-affora-text">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-affora-primary transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Product
        </button>
        <div className="flex items-center gap-2 text-affora-primary bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
           {activeTab === 'feedbacks' ? <PieChart className="w-5 h-5" /> : <BarChart2 className="w-5 h-5" />}
           <span className="font-bold">Feedback Analysis Dashboard</span>
        </div>
      </div>

      <div className="flex gap-8 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('feedbacks')} className={`text-2xl font-bold pb-2 border-b-4 transition-colors ${activeTab === 'feedbacks' ? 'text-gray-800 border-gray-800' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>Feedbacks</button>
        <button onClick={() => setActiveTab('tracker')} className={`text-2xl font-bold pb-2 border-b-4 transition-colors ${activeTab === 'tracker' ? 'text-gray-800 border-gray-800' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>Tracker</button>
      </div>

      {activeTab === 'feedbacks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-fade-in">
          <div className="lg:col-span-4 space-y-6 h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-gray-500" /></div>
                  <div><h4 className="font-bold text-sm">{review.user}</h4><p className="text-xs text-gray-500">Variant: {review.variant}</p></div>
                </div>
                <div className="flex text-yellow-400 mb-2">{[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-3 h-3" />)}</div>
                <p className="text-sm text-gray-600 mb-3">{review.comment}</p>
                <div className="flex gap-2">{review.images.map((img, i) => (<div key={i} className="w-16 h-16 bg-blue-100 rounded-lg border border-blue-200"></div>))}</div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4 flex flex-col items-center justify-start pt-10">
            <h2 className="text-2xl font-bold mb-8">Ratings {product.rating}/5.0</h2>
            <div className="relative w-64 h-64 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform" style={{ background: `conic-gradient(#5B9BD5 0% 47.6%, #1E3A8A 47.6% 67.4%, #60A5FA 67.4% 87.2%, #9CA3AF 87.2% 100%)` }}>
              <div className="absolute top-10 right-2 text-xs font-bold bg-white/90 px-2 py-1 rounded shadow-sm">5★ 47.6%</div>
              <div className="absolute bottom-10 right-10 text-xs font-bold bg-white/90 px-2 py-1 rounded shadow-sm">4★ 27.8%</div>
            </div>
            <div className="mt-8 text-center"><h3 className="text-lg font-bold mb-2">Users Ratings</h3><p className="text-sm text-gray-500">Based on recent purchases</p></div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* FIXED: IMAGE RENDERING */}
            <div className="aspect-[4/5] bg-white rounded-[2rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-sm relative group">
                <img 
                    src={`/products/${product.imageLabel}`} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tracker' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-200">
              <span className="text-sm text-gray-500 font-medium text-center">Total people visited</span>
              <div className="flex items-center gap-3"><Users className="w-8 h-8 text-blue-500" /><span className="text-3xl font-bold text-gray-800">1,250</span></div>
            </div>
            <div className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-200">
              <span className="text-sm text-gray-500 font-medium text-center">Total Sold of Item</span>
              <div className="flex items-center gap-3"><ShoppingCart className="w-8 h-8 text-blue-400" /><span className="text-3xl font-bold text-gray-800">967</span></div>
            </div>
            <div className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-200">
              <span className="text-sm text-gray-500 font-medium text-center">Avg. Time Spent</span>
              <div className="flex items-center gap-3"><Clock className="w-8 h-8 text-blue-300" /><span className="text-3xl font-bold text-gray-800">5 Mins</span></div>
            </div>
            
            {/* REAL DYNAMIC DATA */}
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-md border border-affora-primary/20 transform scale-105">
              <span className="text-sm text-affora-primary font-bold text-center uppercase tracking-wide">Added to Wishlist</span>
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500 animate-pulse" />
                <span className="text-4xl font-bold text-gray-900">{wishlistCount}</span>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-1 bg-blue-50 p-8 rounded-[2rem] flex flex-col items-center shadow-inner">
              <h3 className="text-lg font-bold text-gray-700 mb-6 self-start">Color Preference</h3>
              <div className="relative w-56 h-56 rounded-full shadow-lg" style={{ background: `conic-gradient(#3B82F6 0% 20.7%, #1F2937 20.7% 72.4%, #EF4444 72.4% 100%)` }}></div>
            </div>
            <div className="lg:col-span-2 bg-gray-50 p-6 rounded-[2rem] border border-gray-200 relative overflow-hidden">
               <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-gray-700">Page Visits (Monthly)</h3></div>
               <div className="w-full h-64 relative">
                 <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,90 Q25,85 33,60 T66,40 T100,10 V100 H0 Z" fill="#5B9BD5" fillOpacity="0.2" />
                    <path d="M0,90 Q25,85 33,60 T66,40 T100,10" fill="none" stroke="#5B9BD5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                 </svg>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}