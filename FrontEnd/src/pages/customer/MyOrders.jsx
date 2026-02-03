import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Fetches the confirmed orders for the logged-in user
    api.get('/api/customers/me/orders')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Order log fetch failed");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-20 text-center font-black uppercase italic text-slate-300">Scanning Records...</div>;

  return (
    <div className="max-w-4xl mx-auto p-12">
      <header className="flex justify-between items-end border-b-4 border-indigo-600 pb-4 mb-10">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Order Logbook</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{orders.length} Nodes Found</p>
      </header>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="bg-slate-50 p-10 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200">
             <p className="font-bold text-slate-400 uppercase tracking-widest">No transmissions found.</p>
          </div>
        ) : (
          orders.map(o => (
            <div key={o.orderId} className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-xl hover:border-indigo-100">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${o.status === 'CONFIRMED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {o.status}
                    </span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref: #{o.orderId}</p>
                </div>
                <p className="text-2xl font-black uppercase italic text-slate-900">Purchase Node</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{o.orderDate}</p>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Node Total</p>
                <p className="text-4xl font-black text-indigo-600 tracking-tighter italic">₹{o.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <p className="mt-12 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Encrypted IntelliMart Transaction History</p>
    </div>
  );
}