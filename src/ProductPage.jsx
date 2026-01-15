import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, ArrowLeft, Heart, Share2, Zap, User, BarChart2 } from 'lucide-react';

export default function ProductPage({ onBack, product, onAddToCart, onBuyNow, onViewReviews, isWishlisted, onToggleWishlist }) {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    setSelectedColor(0);
    setSelectedSize(product.sizes[0]);
  }, [product]);

  const previewReviews = [
    { id: 1, user: "Sarah J.", rating: 5, comment: "Absolutely love the quality! Matches the description perfectly.", date: "2 days ago" },
    { id: 2, user: "Mark D.", rating: 4, comment: "Great fit, but shipping took a bit longer than expected.", date: "1 week ago" },
    { id: 3, user: "Emily R.", rating: 5, comment: "The material is so soft. Definitely buying another color.", date: "2 weeks ago" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-affora-text hover:text-affora-primary mb-6 transition-colors font-medium">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Browse
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        
        {/* COL 1: Thumbnails */}
        <div className="hidden md:flex md:col-span-1 flex-col gap-4">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="aspect-[3/4] bg-white rounded-lg cursor-pointer transition-all border-2 border-transparent hover:border-blue-200 overflow-hidden">
              <img src={`/products/${product.imageLabel}`} className="w-full h-full object-cover opacity-70 hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* COL 2: Main Image */}
        <div className="md:col-span-6 lg:col-span-7">
          <div className="aspect-square bg-white rounded-[2rem] relative shadow-lg flex items-center justify-center overflow-hidden border border-gray-100 group">
            <img 
                src={`/products/${product.imageLabel}`} 
                alt={product.name} 
                className="w-full h-full object-cover transform group-hover:scale-125 transition-transform duration-700 cursor-crosshair"
            />
            <span className="absolute top-4 right-4 bg-white/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Zoom Active</span>
          </div>
        </div>

        {/* COL 3: Details */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} fill={i < product.rating ? "currentColor" : "none"} className="w-5 h-5" />)}
              </div>
              <span className="text-gray-400 text-sm">({product.reviewCount} Reviews)</span>
            </div>
            <div className="text-3xl font-bold text-affora-primary">{product.price}</div>
            {product.deal && <p className="text-sm text-green-600 font-medium mt-1">Free Shipping Deal</p>}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <hr className="border-gray-200" />

          {/* Selectors */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Color:</h3>
            <div className="grid grid-cols-4 gap-3">
              {product.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  className={`h-12 md:h-16 rounded-md transition-all transform border ${selectedColor === idx ? 'ring-2 ring-affora-primary scale-105 shadow-md border-transparent' : 'border-gray-200 hover:opacity-80'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-700 mb-3">Size:</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-full border text-sm font-bold transition-colors ${selectedSize === size ? 'bg-affora-primary text-white border-affora-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-affora-primary'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 flex gap-4">
            <button onClick={() => onAddToCart(product, selectedSize, selectedColor)} className="flex-1 py-4 bg-blue-100 text-affora-primary font-bold rounded-xl hover:bg-blue-200 transition-colors flex justify-center items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Add To Cart
            </button>
            <button onClick={() => onBuyNow(product, selectedSize, selectedColor)} className="flex-1 py-4 bg-affora-primary text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-600 transition-colors flex justify-center items-center gap-2">
               <Zap className="w-5 h-5" /> Buy Now
            </button>
          </div>
          
          <div className="flex gap-4 text-gray-400 text-sm font-medium justify-center">
             <button onClick={onToggleWishlist} className={`flex items-center gap-1 transition-colors ${isWishlisted ? 'text-red-500 font-bold' : 'hover:text-gray-600'}`}>
               <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}/> {isWishlisted ? 'Saved' : 'Wishlist'}
             </button>
             <button className="flex items-center gap-1 hover:text-gray-600"><Share2 className="w-4 h-4"/> Share</button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          <button onClick={onViewReviews} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-affora-primary text-affora-primary font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
            <BarChart2 className="w-5 h-5" /> View Feedback Analysis
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previewReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-gray-500" /></div>
                  <div><p className="font-bold text-gray-900">{review.user}</p><p className="text-xs text-gray-400">{review.date}</p></div>
                </div>
                <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} fill={i < review.rating ? "currentColor" : "none"} className="w-3 h-3" />)}</div>
              </div>
              <p className="text-gray-600 leading-relaxed">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}