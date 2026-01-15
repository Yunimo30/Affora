import React, { useState } from 'react';
import { ArrowLeft, CreditCard, MapPin, CheckCircle, ShoppingBag, Banknote, Smartphone, QrCode, Tag, X } from 'lucide-react';

export default function CheckoutPage({ cartItems, onBack, onPlaceOrder }) {
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  // Calculation Logic
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace(/[₱,]/g, '')), 0);
  const shipping = 0; 
  const total = subtotal - discount + shipping;

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === 'WELCOME10') {
      setDiscount(subtotal * 0.10); 
      setAppliedVoucher('WELCOME10');
      setVoucherError('');
    } else if (voucherCode.toUpperCase() === 'SAVE20') {
      setDiscount(500); // Fixed 500 Pesos off
      setAppliedVoucher('SAVE20');
      setVoucherError('');
    } else {
      setVoucherError('Invalid code');
      setDiscount(0);
      setAppliedVoucher(null);
    }
  };

  const clearVoucher = () => {
    setVoucherCode('');
    setDiscount(0);
    setAppliedVoucher(null);
  };

  const handlePlaceOrder = () => {
    const formattedTotal = "₱" + total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    onPlaceOrder(formattedTotal, paymentMethod);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in max-w-6xl">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-affora-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <ShoppingBag className="text-affora-primary w-5 h-5" /> Review Your Order
            </h2>
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  {/* FIXED: IMAGE RENDERING */}
                  <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img 
                      src={`/products/${item.imageLabel}`} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <span className="font-bold text-affora-primary">{item.price}</span>
                    </div>
                    <div className="mt-1 flex gap-3 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase font-medium">Size: {item.selectedSize}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase font-medium flex items-center gap-1">
                        Color: {item.colorName}
                        <span className="w-2 h-2 rounded-full inline-block border border-gray-300" style={{backgroundColor: item.colorName.startsWith('#') ? item.colorName : '#ccc'}}></span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <MapPin className="text-affora-primary w-5 h-5" /> Shipping Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-affora-light outline-none transition-all" />
              <input type="text" placeholder="Last Name" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-affora-light outline-none transition-all" />
              <input type="text" placeholder="Street Address / Barangay" className="md:col-span-2 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-affora-light outline-none transition-all" />
              <input type="text" placeholder="City / Municipality" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-affora-light outline-none transition-all" />
              <input type="text" placeholder="Zip Code" className="p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-affora-light outline-none transition-all" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <Banknote className="text-affora-primary w-5 h-5" /> Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div onClick={() => setPaymentMethod('cod')} className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-affora-primary bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Banknote className="w-5 h-5" /></div>
                <div><p className="font-bold text-gray-800">Cash on Delivery</p><p className="text-xs text-gray-500">Pay when received</p></div>
              </div>
              <div onClick={() => setPaymentMethod('gcash')} className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === 'gcash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">GC</div>
                <div><p className="font-bold text-gray-800">GCash</p><p className="text-xs text-gray-500">E-Wallet</p></div>
              </div>
               <div onClick={() => setPaymentMethod('maya')} className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === 'maya' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs border border-green-400">MY</div>
                <div><p className="font-bold text-gray-800">Maya / QRPH</p><p className="text-xs text-gray-500">Scan to Pay</p></div>
              </div>
              <div onClick={() => setPaymentMethod('card')} className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === 'card' ? 'border-affora-primary bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><CreditCard className="w-5 h-5" /></div>
                <div><p className="font-bold text-gray-800">Credit Card</p><p className="text-xs text-gray-500">Visa / Mastercard</p></div>
              </div>
            </div>
            
            {(paymentMethod === 'gcash' || paymentMethod === 'maya') && (
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl animate-fade-in border-2 border-dashed border-gray-300">
                  <QrCode className="w-16 h-16 text-gray-400 mb-2" />
                  <p className="font-bold text-gray-700">Scan QR Code</p>
                  <p className="text-sm text-gray-500 text-center">A QR code will be generated after you click "Place Order"</p>
              </div>
            )}
             {paymentMethod === 'card' && (
              <div className="space-y-4 animate-fade-in p-4 bg-gray-50 rounded-xl">
                 <input type="text" placeholder="Card Number" className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-affora-primary outline-none" />
                 <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="MM/YY" className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-affora-primary outline-none" />
                   <input type="text" placeholder="CVC" className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-affora-primary outline-none" />
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-fit space-y-4">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-lg border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Order Summary</h3>
            
            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Voucher Code</label>
                {appliedVoucher ? (
                    <div className="flex justify-between items-center bg-green-50 text-green-700 p-2 rounded-lg border border-green-200">
                        <span className="flex items-center gap-2 text-sm font-bold"><Tag className="w-4 h-4" /> {appliedVoucher}</span>
                        <button onClick={clearVoucher}><X className="w-4 h-4 hover:text-green-900"/></button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Enter Code (e.g. WELCOME10)" 
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            className="flex-1 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-affora-light"
                        />
                        <button onClick={handleApplyVoucher} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors">Apply</button>
                    </div>
                )}
                {voucherError && <p className="text-xs text-red-500 mt-1 ml-1">{voucherError}</p>}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
                {discount > 0 && (
                     <div className="flex justify-between text-green-600 font-medium">
                       <span>Discount</span>
                       <span>-₱{discount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                     </div>
                )}
                
                <div className="border-t border-dashed border-gray-200 my-2 pt-2">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>₱{total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <p className="text-xs text-right text-gray-400 font-normal">Includes VAT</p>
                </div>
            </div>

            <button 
                onClick={handlePlaceOrder}
                className="w-full mt-6 py-4 bg-affora-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
                <CheckCircle className="w-5 h-5" /> Place Order
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">Secure Checkout via Affora Pay</p>
            </div>
        </div>

      </div>
    </div>
  );
}