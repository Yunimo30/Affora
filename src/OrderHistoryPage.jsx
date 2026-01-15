import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Package, Clock, CheckCircle, ShoppingBag } from 'lucide-react';

export default function OrderHistoryPage({ user, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:3000/api/orders/${user.id}`)
        .then(res => {
          setOrders(res.data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4 md:p-8 animate-fade-in min-h-screen bg-affora-bg text-affora-text">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-affora-primary mb-8 transition-colors font-medium">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Browse
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-affora-primary/10 rounded-full flex items-center justify-center text-affora-primary">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading your history...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] text-center border border-gray-100 shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600">No orders yet</h2>
          <p className="text-gray-400">Time to start shopping!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg text-gray-800">Order #{order.id}</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(order.order_date).toLocaleDateString()} at {new Date(order.order_date).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase">Total Amount</p>
                    <p className="text-xl font-bold text-affora-primary">{order.total_amount}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400 font-bold uppercase">Payment</p>
                    <p className="text-sm font-bold text-gray-600 uppercase">{order.payment_method}</p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}