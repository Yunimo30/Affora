import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';

export default function SuccessPage({ onContinueShopping }) {
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Generate a random Order ID just for show
    setOrderId('AFF-' + Math.floor(100000 + Math.random() * 900000));
  }, []);

  return (
    <div className="min-h-screen bg-affora-bg flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl max-w-lg w-full text-center">
        
        {/* Animated Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6">Thank you for your purchase. We have received your order.</p>

        <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200 mb-8">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Order ID</p>
          <p className="text-2xl font-mono font-bold text-affora-primary">{orderId}</p>
        </div>

        <div className="space-y-4">
           <button 
             onClick={onContinueShopping}
             className="w-full py-4 bg-affora-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
           >
             Continue Shopping <ArrowRight className="w-5 h-5" />
           </button>
           
           <button className="w-full py-4 bg-white text-gray-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
             <Package className="w-5 h-5" /> Track Order
           </button>
        </div>

      </div>
    </div>
  );
}