import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      // ✅ UPDATED PATH: Corrected to match backend /api/orders/seller
      const res = await api.get("/api/orders/seller");
      setOrders(res.data);
    } catch (err) { alert("Failed to load seller orders"); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status/${status}`);
      loadOrders();
    } catch (err) { alert("Status update failed"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-indigo-600 italic">FETCHING_ORDER_LOGBOOK...</div>;

  return (
    <div className="bg-white min-h-screen px-12 py-16 animate-in fade-in duration-1000">
      <div className="border-l-8 border-indigo-600 pl-8 mb-16">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">Transaction_Log // Seller_Inbound</span>
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Seller Orders</h1>
      </div>

      <div className="grid gap-10">
        {orders.length === 0 ? (
          <div className="p-20 text-center border-4 border-dashed border-slate-100 rounded-[4rem] text-slate-200 uppercase font-black tracking-[1em] italic">No_Nodes_Active</div>
        ) : (
          orders.map(o => (
            <div key={`${o.orderId}-${o.productName}`} className="group bg-white rounded-[3.5rem] border border-slate-50 p-12 flex flex-col md:flex-row justify-between items-center hover:shadow-2xl transition-all duration-700 animate-in slide-in-from-bottom-10">
              <div className="space-y-2 text-center md:text-left">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Order_ID_#{o.orderId}</p>
                <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{o.productName}</h3>
                <div className="flex gap-6 pt-4 justify-center md:justify-start">
                  <span className="text-[10px] font-black text-indigo-600 uppercase italic">Quantity: {o.quantity}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase italic">Recorded: {o.orderDate}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="text-center md:text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Settlement_Amount</p>
                  <p className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">₹{o.amount}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-10 py-3 rounded-full border-2 font-black text-[10px] uppercase tracking-widest ${o.status === "SHIPPED" ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {o.status}
                  </span>
                  
                  {o.status === "PLACED" && (
                    <button onClick={() => updateStatus(o.orderId, "PACKED")} className="bg-indigo-600 text-white px-10 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all">Execute_Pack</button>
                  )}
                  {o.status === "PACKED" && (
                    <button onClick={() => updateStatus(o.orderId, "SHIPPED")} className="bg-slate-900 text-white px-10 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-600 transition-all">Execute_Ship</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}