import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, User, Search, Menu, CheckCircle, Smartphone, Watch, Shirt, Gift, Zap, Home, 
  ChevronLeft, ChevronRight, Play, ArrowLeft, LogOut, Heart, Share2, MessageCircle, ShoppingBag, 
  Package, Send, ArrowUp, Truck, Tag, Percent, Sparkles, Layers, X, Facebook, Instagram, Twitter, Mail,
  ArrowDown, Volume2, VolumeX, Maximize2, MoreHorizontal
} from 'lucide-react';
import ProductPage from './ProductPage';
import CartDrawer from './CartDrawer';
import CheckoutPage from './CheckoutPage';
import SuccessPage from './SuccessPage';
import ReviewsPage from './ReviewsPage';
import LoginPage from './LoginPage';
import OrderHistoryPage from './OrderHistoryPage';
import UserProfilePage from './UserProfilePage'; 

export default function App() {
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewState, setViewState] = useState('browse'); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDeal, setActiveDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [user, setUser] = useState(null); 
  const [wishlistIds, setWishlistIds] = useState([]);

  const [isProductLoading, setIsProductLoading] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const categoryScrollRef = useRef(null);

  // UI Polish
  const [cartBump, setCartBump] = useState(false); 
  const [showScrollTop, setShowScrollTop] = useState(false); 
  const [isDealsCollapsed, setIsDealsCollapsed] = useState(false); 

  // App Loading & Promo State
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  // --- REELS / SHORTS FEATURE STATE ---
  const [showReelsModal, setShowReelsModal] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isReelMuted, setIsReelMuted] = useState(false);
  const [showCommentsPanel, setShowCommentsPanel] = useState(false); // New: Comments Panel
  const reelVideoRef = useRef(null);

  // EXPANDED VIDEO FEED (5 Videos - Google CDN)
  const videoFeed = [
    { 
      id: 1, 
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 
      user: "AfforaStyle", 
      desc: "Flash Sale Alert! 🚨 Get 50% off on all summer outfits today!", 
      likes: "12.5k",
      comments: "842"
    },
    { 
      id: 2, 
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", 
      user: "GadgetGeek_PH", 
      desc: "Reviewing the new Mechanical Keyboard. The clicky sound is satisfying! ⌨️", 
      likes: "8.2k",
      comments: "320"
    },
    { 
      id: 3, 
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", 
      user: "TechDaily", 
      desc: "Is this the ultimate tablet for students? Watch till the end! 📱", 
      likes: "25k",
      comments: "1.2k"
    },
    {
      id: 4,
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      user: "TravelWithAffora",
      desc: "Pack these essentials for your next beach trip! 🏖️ #Travel #Gadgets",
      likes: "5.4k",
      comments: "150"
    },
    {
      id: 5,
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      user: "FitLife_PH",
      desc: "Testing the durability of our new Smart Watch while biking! 🚴",
      likes: "18.9k",
      comments: "900"
    }
  ];

  // MOCK COMMENTS FOR PANEL
  const mockComments = [
    { user: "User123", text: "How much is this?" },
    { user: "Sarah_G", text: "Mine! Sending DM now." },
    { user: "TechGuy", text: "Does it come in black?" },
    { user: "AfforaFan", text: "Ordered mine yesterday, can't wait!" },
    { user: "Newbie", text: "Free shipping to Cebu?" },
  ];

  // Sidebar Mini Player
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const sidebarVideoRef = useRef(null);
  const [likeCount, setLikeCount] = useState(1240);
  const [isVideoLiked, setIsVideoLiked] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { user: "User1", color: "text-yellow-400", msg: "How much po?" },
    { user: "User2", color: "text-blue-300", msg: "Mine blue!" },
    { user: "User3", color: "text-pink-300", msg: "Free shipping?" },
  ]);

  const API_URL = 'http://localhost:3000/api';

  // --- HELPER FUNCTIONS ---
  const showToast = (message) => { setNotification(message); setTimeout(() => setNotification(null), 3000); };
  const checkScroll = () => { if (categoryScrollRef.current) { const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current; setShowLeftArrow(scrollLeft > 0); setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 2); } };
  const scrollCategories = (direction) => { if (categoryScrollRef.current) { const scrollAmount = 300; categoryScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' }); setTimeout(checkScroll, 300); } };
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goHome = () => { setSelectedProduct(null); setViewState('browse'); window.scrollTo(0, 0); };
  const goToCheckout = () => { setIsCartOpen(false); setViewState('checkout'); setSelectedProduct(null); window.scrollTo(0, 0); };
  const openProduct = (item) => { setIsProductLoading(true); setSelectedProduct(item); setTimeout(() => { setIsProductLoading(false); window.scrollTo(0, 0); }, 800); };
  
  // --- REELS LOGIC ---
  const openReels = () => { 
      setShowReelsModal(true); 
      setIsVideoPlaying(false); 
      if(sidebarVideoRef.current) sidebarVideoRef.current.pause(); 
  };
  const closeReels = () => { 
      setShowReelsModal(false); 
      setShowCommentsPanel(false);
      setIsVideoPlaying(true);
      if(sidebarVideoRef.current) sidebarVideoRef.current.play();
  };
  const nextReel = (e) => { 
      if(e) e.stopPropagation(); 
      setShowCommentsPanel(false); // Close comments on swipe
      setCurrentReelIndex((prev) => (prev + 1) % videoFeed.length); 
  };
  const prevReel = (e) => { 
      if(e) e.stopPropagation(); 
      setShowCommentsPanel(false); // Close comments on swipe
      setCurrentReelIndex((prev) => (prev - 1 + videoFeed.length) % videoFeed.length); 
  };

  // --- INITIAL EFFECTS ---
  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
      setTimeout(() => setShowPromoPopup(true), 500);
    }, 2000); 

    fetchProducts();
    checkScroll();
    window.addEventListener('resize', checkScroll);
    const handleScroll = () => { if (window.scrollY > 300) { setShowScrollTop(true); } else { setShowScrollTop(false); } };
    window.addEventListener('scroll', handleScroll);
    const storedUser = localStorage.getItem('affora_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCart(parsedUser.id);
      fetchWishlist(parsedUser.id);
    }
    return () => { window.removeEventListener('resize', checkScroll); window.removeEventListener('scroll', handleScroll); };
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) return;
    setCartBump(true);
    const timer = setTimeout(() => setCartBump(false), 300); 
    return () => clearTimeout(timer);
  }, [cartItems.length]);

  // --- API LOGIC ---
  const fetchProducts = async () => { try { const response = await axios.get(`${API_URL}/products`); setProducts(response.data.data); } catch (error) { console.error("Error fetching products:", error); showToast("Failed to load products. Is server running?"); } };
  const fetchCart = async (userId) => { try { const response = await axios.get(`${API_URL}/cart/${userId}`); setCartItems(response.data.data); } catch (error) { console.error(error); } };
  const fetchWishlist = async (userId) => { try { const response = await axios.get(`${API_URL}/wishlist/${userId}`); setWishlistIds(response.data.data); } catch (error) { console.error(error); } };
  const handleUpdateUser = (updatedUser) => { setUser(updatedUser); localStorage.setItem('affora_user', JSON.stringify(updatedUser)); };
  const toggleWishlist = async (product) => { if (!user) { showToast("Please log in to wishlist items."); setViewState('login'); return; } const isLiked = wishlistIds.includes(product.id); if (isLiked) { setWishlistIds(prev => prev.filter(id => id !== product.id)); showToast("Removed from Wishlist"); } else { setWishlistIds(prev => [...prev, product.id]); showToast("Added to Wishlist"); } try { await axios.post(`${API_URL}/wishlist`, { userId: user.id, productId: product.id }); } catch (error) { console.error("Wishlist error", error); } };
  const handleLogin = (user) => { 
      setUser(user);
      localStorage.setItem('affora_user', JSON.stringify(user));
      fetchCart(user.id);
      fetchWishlist(user.id);
      setViewState('browse');
      showToast(`Welcome back, ${user.name}!`);
  };
  const handleLogout = () => { setUser(null); setCartItems([]); setWishlistIds([]); localStorage.removeItem('affora_user'); setViewState('browse'); showToast("Logged out successfully"); };
  const addToCart = async (product, size, colorIndex) => { if (!user) { showToast("Please log in to add items."); setViewState('login'); return; } const color = typeof colorIndex === 'number' ? product.colors[colorIndex] : "Default"; const tempItem = { ...product, selectedSize: size, colorName: color, cartId: Date.now() }; setCartItems(prev => [...prev, tempItem]); showToast(`Added ${product.name} to cart!`); try { await axios.post(`${API_URL}/cart`, { userId: user.id, productId: product.id, size: size, color: color }); fetchCart(user.id); } catch (error) { console.error(error); } };
  const buyNow = (product, size, colorIndex) => { if (!user) { showToast("Please log in first"); setViewState('login'); return; } addToCart(product, size, colorIndex); setIsCartOpen(false); setSelectedProduct(null); setViewState('checkout'); window.scrollTo(0, 0); };
  const removeFromCart = async (indexToRemove) => { const itemToRemove = cartItems[indexToRemove]; setCartItems(cartItems.filter((_, idx) => idx !== indexToRemove)); if (itemToRemove.cartId) { try { await axios.delete(`${API_URL}/cart/${itemToRemove.cartId}`); } catch (error) { console.error(error); } } };
  const placeOrder = async (totalAmount, paymentMethod) => { if (!user) return; try { await axios.post(`${API_URL}/checkout`, { userId: user.id, total: totalAmount, paymentMethod: paymentMethod }); setCartItems([]); setViewState('success'); window.scrollTo(0, 0); } catch (error) { console.error("Checkout failed:", error); showToast("Checkout failed. Check server."); } };
  const handleVideoLike = (e) => { 
      e.stopPropagation();
      setIsVideoLiked(!isVideoLiked); 
      setLikeCount(prev => isVideoLiked ? prev - 1 : prev + 1); 
  };
  const handleVideoShare = (e) => { 
      e.stopPropagation();
      navigator.clipboard.writeText("https://affora.com/live/car-deal"); 
      showToast("Link copied to clipboard!"); 
  };
  const handleSendChat = (e) => { e.preventDefault(); if (!chatMessage.trim()) return; setChatHistory(prev => [...prev.slice(-4), { user: user ? user.name : "Me", color: "text-white", msg: chatMessage }]); setChatMessage(""); };
  const buyPartnerItem = (id) => { const item = products.find(p => p.id === id); item ? addToCart(item, "Std", 0) : showToast("Item out of stock!"); };

  const categoryMap = { 1: "Gadgets", 2: "Men's Apparel", 3: "Women's Apparel", 4: "Gadgets", 5: "Men's Apparel", 6: "Accessories", 7: "Sports", 8: "Accessories", 9: "Gadgets", 10: "Gadgets", 11: "Gadgets", 12: "Women's Apparel", 13: "Men's Apparel", 14: "Accessories", 15: "Appliances", 16: "Appliances", 17: "Furniture", 18: "Sports", 19: "Beauty", 20: "Beauty", 101: "Gadgets", 102: "Beauty", 103: "Toys & Hobbies" };
  const filteredProducts = products.filter(product => {
    const productCategory = categoryMap[product.id] || "Others";
    const categoryMatch = activeCategory === 'All' || productCategory === activeCategory;
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const dealMatch = activeDeal ? product.deal_type === activeDeal : true;
    return categoryMatch && searchMatch && dealMatch;
  });

  const categories = [ { name: "All", icon: <Home className="w-4 h-4"/> }, { name: "Men's Apparel", icon: <Shirt className="w-4 h-4"/> }, { name: "Women's Apparel", icon: <Shirt className="w-4 h-4"/> }, { name: "Gadgets", icon: <Smartphone className="w-4 h-4"/> }, { name: "Accessories", icon: <Watch className="w-4 h-4"/> }, { name: "Toys & Hobbies", icon: <Gift className="w-4 h-4"/> }, { name: "Appliances", icon: <Zap className="w-4 h-4"/> }, { name: "Sports", icon: <Gift className="w-4 h-4"/> }, { name: "Beauty", icon: <Gift className="w-4 h-4"/> }, { name: "Furniture", icon: <Home className="w-4 h-4"/> }, { name: "Automotive", icon: <Zap className="w-4 h-4"/> } ];
  
  const deals = [ 
    { label: "Flash Sale", type: "flash", color: "text-orange-500 bg-orange-50", icon: <Zap className="w-5 h-5 fill-orange-500" /> }, 
    { label: "50% Off", type: "50off", color: "text-blue-500 bg-blue-50", icon: <Percent className="w-5 h-5" /> }, 
    { label: "Free Ship", type: "freeship", color: "text-green-600 bg-green-50", icon: <Truck className="w-5 h-5" /> }, 
    { label: "Bundles", type: "bundle", color: "text-purple-500 bg-purple-50", icon: <Layers className="w-5 h-5" /> }, 
    { label: "Clearance", type: "clearance", color: "text-red-500 bg-red-50", icon: <Tag className="w-5 h-5" /> }, 
    { label: "New Arrival", type: "new", color: "text-teal-500 bg-teal-50", icon: <Sparkles className="w-5 h-5" /> } 
  ];
  
  const partnerItems = [ { id: 101, name: "PowerBank 20k", price: "₱899.00", image: "🔋" }, { id: 102, name: "Slim Tea Detox", price: "₱250.00", image: "🍵" } ];

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
        <img src="/AfforaLogo1.png" alt="Affora" className="w-32 h-auto object-contain animate-pulse mb-8" />
        <div className="w-16 h-16 border-4 border-gray-100 border-t-affora-primary rounded-full animate-spin"></div>
        <p className="text-gray-400 mt-4 text-sm font-bold tracking-widest animate-pulse">LOADING STORE...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-down { 0% { opacity: 0; transform: translateY(-20px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slide-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes bump { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .animate-bump { animation: bump 300ms ease-out; }
        .animate-card-entry { animation: slide-down 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .video-overlay-shadow { text-shadow: 0px 1px 3px rgba(0,0,0,0.8); }
        .mask-image-gradient { -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%); mask-image: linear-gradient(to bottom, transparent, black 20%); }
      `}</style>

      <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-blue-50 via-white to-purple-50 text-affora-text max-w-[100vw]">
        
        {/* --- REELS MODAL (FIXED) --- */}
        {showReelsModal && (
          <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-fade-in">
            {/* Close Button */}
            <button onClick={closeReels} className="absolute top-6 left-6 z-[210] p-3 bg-gray-800/50 rounded-full text-white hover:bg-gray-700 transition">
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full h-full max-w-[450px] aspect-[9/16] bg-gray-900 shadow-2xl overflow-hidden flex items-center">
              
              {/* FIXED: Navigation Arrows - Moved to LEFT CENTER to avoid conflict */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-[220]">
                 <button onClick={prevReel} className="p-3 bg-gray-800/50 rounded-full text-white hover:bg-gray-700 hover:scale-110 transition shadow-lg border border-white/10">
                    <ArrowUp className="w-6 h-6" />
                 </button>
                 <button onClick={nextReel} className="p-3 bg-gray-800/50 rounded-full text-white hover:bg-gray-700 hover:scale-110 transition shadow-lg border border-white/10">
                    <ArrowDown className="w-6 h-6" />
                 </button>
              </div>

              {/* Action Buttons (Right) - Now fully functional */}
              <div className="absolute right-4 bottom-28 flex flex-col gap-6 items-center z-[220]">
                 <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={handleVideoLike}
                        className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-red-500/80 transition-colors shadow-lg border border-white/10"
                    >
                       <Heart className={`w-7 h-7 transition-colors ${isVideoLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    </button>
                    <span className="text-white text-xs font-bold video-overlay-shadow">{likeCount}</span>
                 </div>
                 
                 <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowCommentsPanel(true); }}
                        className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-gray-700 transition-colors shadow-lg border border-white/10"
                    >
                       <MessageCircle className="w-7 h-7 text-white" />
                    </button>
                    <span className="text-white text-xs font-bold video-overlay-shadow">{videoFeed[currentReelIndex].comments}</span>
                 </div>

                 <div className="flex flex-col items-center gap-1">
                    <button 
                        onClick={handleVideoShare}
                        className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-green-500/80 transition-colors shadow-lg border border-white/10"
                    >
                       <Share2 className="w-7 h-7 text-white" />
                    </button>
                    <span className="text-white text-xs font-bold video-overlay-shadow">Share</span>
                 </div>
              </div>

              {/* COMMENTS PANEL (Slide Up) */}
              {showCommentsPanel && (
                <div className="absolute bottom-0 left-0 w-full h-[60%] bg-white rounded-t-3xl z-[230] animate-slide-up shadow-2xl flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Comments ({videoFeed[currentReelIndex].comments})</h3>
                        <button onClick={() => setShowCommentsPanel(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500"/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {mockComments.map((c, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                                <div><p className="text-xs font-bold text-gray-700">{c.user}</p><p className="text-sm text-gray-600">{c.text}</p></div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <input type="text" placeholder="Add a comment..." className="w-full bg-gray-100 p-3 rounded-full text-sm outline-none focus:ring-1 focus:ring-affora-primary" />
                    </div>
                </div>
              )}

              {/* Video Info (Bottom Left) */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[210]">
                 <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-2">
                    @{videoFeed[currentReelIndex].user} 
                    <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400" />
                 </h3>
                 <p className="text-white/90 text-sm leading-relaxed mb-4 max-w-[80%]">{videoFeed[currentReelIndex].desc}</p>
                 <div className="flex items-center gap-2 text-white/70 text-xs">
                    <div className="animate-spin-slow"><Volume2 className="w-4 h-4" /></div>
                    <span>Original Audio - {videoFeed[currentReelIndex].user}</span>
                 </div>
              </div>

              {/* Mute Toggle */}
              <button 
                onClick={() => setIsReelMuted(!isReelMuted)}
                className="absolute top-6 right-6 z-[220] p-2 bg-black/40 rounded-full text-white/90 hover:bg-black/60 backdrop-blur-sm"
              >
                {isReelMuted ? <VolumeX className="w-6 h-6"/> : <Volume2 className="w-6 h-6"/>}
              </button>

              {/* Main Video with Key for Animation */}
              <video 
                key={videoFeed[currentReelIndex].id} 
                ref={reelVideoRef}
                src={videoFeed[currentReelIndex].src} 
                className="w-full h-full object-cover animate-fade-in"
                autoPlay 
                loop 
                muted={isReelMuted}
                playsInline 
              />
            </div>
          </div>
        )}

        {showPromoPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowPromoPopup(false)}></div>
            <div className="bg-white p-2 rounded-[2rem] shadow-2xl relative z-10 max-w-md w-full animate-card-entry flex flex-col items-center">
               <button onClick={() => setShowPromoPopup(false)} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-20">
                 <X className="w-5 h-5 text-gray-600" />
               </button>
               <div className="w-full aspect-video bg-gradient-to-br from-purple-500 to-affora-primary rounded-t-[1.5rem] rounded-b-xl flex items-center justify-center relative overflow-hidden">
                  <Sparkles className="text-white/20 w-32 h-32 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
                  <div className="text-center text-white relative z-10">
                    <h2 className="text-3xl font-black mb-1">FLASH SALE!</h2>
                    <p className="font-medium text-white/90">Get 50% OFF your first order</p>
                  </div>
               </div>
               <div className="p-6 text-center w-full">
                  <p className="text-gray-500 text-sm mb-6">Use code <strong>AFFORA2025</strong> at checkout to claim your discount on all Gadgets & Apparel.</p>
                  <button onClick={() => { setShowPromoPopup(false); setActiveDeal('flash'); }} className="w-full py-3 bg-affora-primary text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform hover:scale-105">
                    Shop Now
                  </button>
               </div>
            </div>
          </div>
        )}

        <div className={`fixed top-24 right-5 z-[100] transition-all duration-500 transform ${notification ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
          <div className="bg-gray-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"><CheckCircle className="text-green-400 w-5 h-5" /><span className="font-medium">{notification}</span></div>
        </div>

        <button onClick={scrollToTop} className={`fixed bottom-8 right-8 z-50 p-4 bg-affora-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 transform ${showScrollTop ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}><ArrowUp className="w-6 h-6" /></button>

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemove={removeFromCart} onCheckout={goToCheckout} />

        <nav className="bg-affora-primary text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-6 md:gap-8 cursor-pointer" onClick={goHome}>
             <img src="/AfforaLogo1.png" alt="Affora Logo" className="h-10 w-auto object-contain" />
          </div>
          <div className="hidden md:block flex-1 max-w-xl mx-4 relative">
            <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-2.5 pl-6 pr-10 rounded-full text-gray-700 outline-none focus:ring-2 focus:ring-affora-light shadow-inner" />
            <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative cursor-pointer hover:text-affora-light" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className={`w-6 h-6 ${cartBump ? 'animate-bump text-yellow-300' : ''}`} />
              {cartItems.length > 0 && <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white ${cartBump ? 'animate-bump' : ''}`}>{cartItems.length}</span>}
            </div>
            <div className="hidden lg:block text-sm font-medium">{user ? (<div className="flex items-center gap-3"><span className="font-bold">Hi, {user.name}</span><button onClick={() => setViewState('orders')} title="My Orders" className="hover:text-affora-light flex items-center gap-1"><Package className="w-4 h-4"/> <span className="hidden xl:inline">Orders</span></button></div>) : (<><span className="cursor-pointer hover:underline" onClick={() => setViewState('login')}>Sign up</span> | <span className="cursor-pointer hover:underline" onClick={() => setViewState('login')}>Log in</span></>)}</div>
            <User className="w-6 h-6 cursor-pointer" onClick={() => user ? setViewState('profile') : setViewState('login')} />
            <Menu className="md:hidden w-6 h-6 cursor-pointer" />
          </div>
        </nav>

        {viewState === 'login' ? (<LoginPage onLogin={handleLogin} onBack={goHome} />) : 
         viewState === 'orders' ? (<OrderHistoryPage user={user} onBack={goHome} />) :
         viewState === 'profile' ? (<UserProfilePage user={user} onBack={goHome} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />) : 
         
         selectedProduct && isProductLoading ? (
           <div className="flex-1 container mx-auto p-8 animate-pulse">
             <div className="h-10 w-32 bg-gray-200 rounded mb-6"></div><div className="grid grid-cols-1 md:grid-cols-12 gap-8"><div className="md:col-span-1 flex flex-col gap-4"><div className="h-20 bg-gray-200 rounded"></div><div className="h-20 bg-gray-200 rounded"></div></div><div className="md:col-span-7 h-96 bg-gray-200 rounded-[2rem]"></div><div className="md:col-span-4 flex flex-col gap-4"><div className="h-10 bg-gray-200 rounded"></div><div className="h-40 bg-gray-200 rounded"></div></div></div>
           </div>
        ) : !isProductLoading && viewState === 'success' ? (<SuccessPage onContinueShopping={goHome} />) : 
         !isProductLoading && viewState === 'reviews' && selectedProduct ? (<ReviewsPage product={selectedProduct} onBack={() => setViewState('browse')} user={user} />) : 
         !isProductLoading && viewState === 'checkout' ? (<CheckoutPage cartItems={cartItems} onBack={() => { setViewState('browse'); setIsCartOpen(true); }} onPlaceOrder={placeOrder} />) : 
         selectedProduct && !isProductLoading ? (
             <ProductPage product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={addToCart} onBuyNow={buyNow} onViewReviews={() => setViewState('reviews')} isWishlisted={wishlistIds.includes(selectedProduct.id)} onToggleWishlist={() => toggleWishlist(selectedProduct)} />
         ) : 
         !selectedProduct && (
          <main className="flex-1 flex gap-2 md:gap-6 px-2 md:px-4 py-6 relative max-w-[1800px] mx-auto w-full items-start">
            
            <aside className={`hidden md:flex flex-col gap-4 pt-2 sticky top-24 flex-shrink-0 z-10 px-2 transition-all duration-300 ${isDealsCollapsed ? 'w-20 items-center' : 'w-64'}`}>
              <div className={`flex items-center ${isDealsCollapsed ? 'justify-center' : 'justify-between'} mb-2 px-1`}>
                {!isDealsCollapsed && <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">Hot Deals</h3>}
                <button onClick={() => setIsDealsCollapsed(!isDealsCollapsed)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                  {isDealsCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>
              {deals.map((deal, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveDeal(activeDeal === deal.type ? null : deal.type)}
                  className={`group relative flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-300 border-2 shadow-sm hover:shadow-md ${activeDeal === deal.type ? 'bg-white border-affora-primary shadow-md' : 'bg-white border-transparent hover:border-gray-100'} ${isDealsCollapsed ? 'p-2 justify-center aspect-square' : 'p-2.5'}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${deal.color} bg-opacity-20 flex-shrink-0`}>{deal.icon}</div>
                  {!isDealsCollapsed && (<><span className={`font-bold text-xs ${activeDeal === deal.type ? 'text-affora-primary' : 'text-gray-600'} whitespace-nowrap`}>{deal.label}</span>{activeDeal === deal.type && <CheckCircle className="w-3.5 h-3.5 text-affora-primary ml-auto" />}</>)}
                  {isDealsCollapsed && (<div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">{deal.label}<div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-gray-800"></div></div>)}
                </div>
              ))}
            </aside>

            <section className="flex-1 min-w-0">
              <div className="mb-8 relative group">
                {showLeftArrow && <button onClick={() => scrollCategories('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 shadow-md rounded-full border border-gray-100 text-gray-600 hover:text-affora-primary hover:scale-110 transition-all -ml-3 hidden md:block backdrop-blur-sm"><ChevronLeft className="w-5 h-5" /></button>}
                <div ref={categoryScrollRef} onScroll={checkScroll} className="flex gap-3 overflow-x-auto scroll-smooth pb-4 px-1 no-scrollbar">
                  {categories.map((cat) => (
                    <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat.name ? 'bg-affora-primary text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}>
                      {cat.icon}{cat.name}
                    </button>
                  ))}
                </div>
                {showRightArrow && <button onClick={() => scrollCategories('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 shadow-md rounded-full border border-gray-100 text-gray-600 hover:text-affora-primary hover:scale-110 transition-all -mr-3 hidden md:block backdrop-blur-sm"><ChevronRight className="w-5 h-5" /></button>}
              </div>

              <h2 className="text-xl font-bold mb-4 ml-1 flex items-center gap-2">
                {activeDeal ? `Deal: ${deals.find(d => d.type === activeDeal)?.label}` : "For You"}
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {searchQuery ? `Search: "${searchQuery}"` : activeCategory !== 'All' ? activeCategory : 'Selected for you'}
                </span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.length > 0 ? filteredProducts.filter(p => p.id < 100).map((item, index) => (
                  <div key={item.id} onClick={() => openProduct(item)} style={{ animationDelay: `${index * 50}ms` }} className="animate-card-entry bg-white p-3 rounded-card shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1 border border-transparent hover:border-blue-100">
                    <div className="aspect-square bg-white rounded-[1rem] mb-3 relative overflow-hidden shadow-inner group-hover:shadow-md transition-all">
                      <img src={`/products/${item.imageLabel}`} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      {item.deal && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">SALE</span>}
                    </div>
                    <div className="px-1"><h3 className="font-bold text-gray-700 text-sm truncate">{item.name}</h3><div className="flex justify-between items-center mt-1"><p className="font-bold text-affora-text">{item.price}</p><button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ShoppingCart className="w-4 h-4 text-gray-600" /></button></div></div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-20 text-gray-400">
                    <p className="mb-2">No products found for this selection.</p>
                    <button onClick={() => { setActiveCategory('All'); setActiveDeal(null); setSearchQuery(''); }} className="text-affora-primary font-bold hover:underline text-sm">Clear Filters</button>
                  </div>
                )}
              </div>
            </section>
            
            <aside className="hidden xl:block w-[300px] flex-shrink-0 sticky top-24 self-start">
               <div className="bg-white/60 p-4 rounded-card border border-white shadow-sm backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg">Affiliate</h3><Search className="w-4 h-4 text-gray-400 cursor-pointer" /></div>
                  <div className="space-y-6">
                    
                    {/* TRIGGER FOR REELS MODAL */}
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-affora-primary/20 bg-black group h-[500px] cursor-pointer" onClick={openReels}>
                      <div className="absolute top-4 left-4 z-20 flex gap-2">
                         <div className="bg-affora-primary text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> LIVE</div>
                         <div className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">👀 1.2k</div>
                      </div>
                      
                      {/* Sidebar Preview Video (ALWAYS VIDEO 1 IN FEED) */}
                      <video 
                        ref={sidebarVideoRef} 
                        src={videoFeed[0].src} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        autoPlay
                        muted 
                        loop 
                        playsInline 
                        // FIXED: Auto-next video
                        onEnded={nextReel} 
                      />
                      
                      {/* OVERLAY BUTTONS (RESTORED & FUNCTIONAL) */}
                      <div className="absolute right-4 bottom-20 z-20 flex flex-col gap-4 items-center">
                         <button className="flex flex-col items-center gap-1 group/btn" onClick={handleVideoLike}><div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-active/btn:scale-90 transition"><Heart className={`w-6 h-6 transition-colors ${isVideoLiked ? 'text-red-500 fill-red-500' : 'text-white group-hover/btn:text-red-500'}`} /></div><span className="text-white text-xs font-bold video-overlay-shadow">{likeCount}</span></button>
                         <button className="flex flex-col items-center gap-1" onClick={(e) => {e.stopPropagation(); setShowChatInput(!showChatInput)}}><div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition"><MessageCircle className="w-6 h-6 text-white" /></div><span className="text-white text-xs font-bold video-overlay-shadow">Chat</span></button>
                         <button className="flex flex-col items-center gap-1" onClick={handleVideoShare}><div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition"><Share2 className="w-6 h-6 text-white" /></div><span className="text-white text-xs font-bold video-overlay-shadow">Share</span></button>
                      </div>

                      {/* HOVER EXPAND ICON */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                         <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Maximize2 className="w-8 h-8 text-white drop-shadow-md" />
                         </div>
                      </div>

                      {showChatInput && (<div className="absolute bottom-20 w-full px-4 z-30 animate-fade-in" onClick={(e) => e.stopPropagation()}><form onSubmit={handleSendChat} className="flex gap-2"><input autoFocus type="text" className="flex-1 bg-black/60 text-white text-xs p-2 rounded-lg border border-white/20 outline-none placeholder-gray-300" placeholder="Say something..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} /><button type="submit" className="bg-affora-primary p-2 rounded-lg text-white"><Send className="w-4 h-4" /></button></form></div>)}

                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent z-20">
                         <div className="h-20 overflow-hidden flex flex-col justify-end gap-1 mb-3 mask-image-gradient">{chatHistory.map((chat, i) => (<div key={i} className="text-white/80 text-xs animate-card-entry"><span className={`font-bold ${chat.color}`}>{chat.user}:</span> {chat.msg}</div>))}</div>
                         <div className="bg-white p-2 rounded-xl flex items-center gap-3 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors" onClick={(e) => { e.stopPropagation(); buyPartnerItem(103); }}><div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">🚗</div><div className="flex-1 leading-none"><p className="font-bold text-xs text-red-500">Flash Deal!</p><p className="font-bold text-sm text-gray-800">Toy Racing Car</p></div><button className="bg-affora-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg">Buy</button></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                       <h4 className="font-bold text-xs text-gray-500 uppercase">Sponsored Partners</h4>
                       {partnerItems.map((item) => (<div key={item.id} className="bg-white p-3 rounded-card border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition cursor-pointer group" onClick={() => buyPartnerItem(item.id)}><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{item.image}</div><div className="flex-1"><p className="font-bold text-sm text-gray-800">{item.name}</p><p className="text-xs text-affora-primary font-bold">{item.price}</p></div><button className="text-gray-400 hover:text-affora-primary"><ShoppingBag className="w-4 h-4" /></button></div>))}
                    </div>
                  </div>
               </div>
            </aside>
          </main>
        )}
        <div className="fixed bottom-0 w-full h-32 bg-gradient-to-t from-blue-200/40 to-transparent pointer-events-none -z-10" />
      </div>
    </>
  );
}