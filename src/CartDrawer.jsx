import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemove, onCheckout }) {
  // FIXED: Parse "₱14,999.00" correctly by removing symbol and commas
  const total = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.price.replace(/[₱,]/g, ''));
  }, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-affora-bg">
          <h2 className="text-xl font-bold text-gray-800">Your Cart ({cartItems.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <span className="text-6xl">🛒</span>
              <p>Your cart is empty.</p>
              <button onClick={onClose} className="text-affora-primary font-bold hover:underline">
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                {/* FIXED: IMAGE RENDERING */}
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                  <img 
                    src={`/products/${item.imageLabel}`} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-500">Size: {item.selectedSize} • {item.colorName || "Default"}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-affora-primary">{item.price}</span>
                    <button 
                      onClick={() => onRemove(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">
                ₱{total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-4 bg-affora-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group"
            >
              Checkout Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}