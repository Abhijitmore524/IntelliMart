import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useCart } from "../../cart/CartContext";

export default function CustomerDashboard() {
  const { cartCount } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState({ profile: null, addresses: [], orders: [], payments: [] });
  const [loading, setLoading] = useState(true);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, ordersRes, paymentsRes] = await Promise.all([
        api.get("/api/customers/me"),
        api.get("/api/customers/me/orders"),
        api.get("/api/customers/me/payments")
      ]);

      let addressData = [];
      try {
        const addrRes = await api.get("/api/address/me");
        addressData = addrRes.data || [];
      } catch (addrErr) {
        console.error("Address node sync failed...", addrErr);
      }

      setData({
        profile: profileRes.data,
        addresses: addressData,
        orders: ordersRes.data || [],
        payments: paymentsRes.data || []
      });
    } catch (err) {
      console.error("Core Dashboard sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await api.put("/api/customers/me", data.profile);
      setIsEditingProfile(false);
      loadData();
    } catch (err) { alert("Update failed"); }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "CONFIRMED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "PENDING": return "bg-amber-50 text-amber-600 border-amber-100";
      case "SUCCESS": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-indigo-600 animate-pulse text-sm uppercase tracking-[0.3em] italic">Synchronizing_Identity_Hub</p>
    </div>
  );

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-16">
        
        {/* --- MINIMALIST HERO SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] italic">Account Overview</span>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
              Welcome, {data.profile?.user?.name.split(' ')[0]}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white border border-slate-100 px-8 py-4 rounded-[2rem] shadow-sm flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Active Cart Items</p>
                  <p className="text-xl font-black text-slate-900 italic">{cartCount}</p>
               </div>
               <div className="h-8 w-[1px] bg-slate-100"></div>
               <button onClick={loadData} className="text-indigo-600 hover:rotate-180 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
               </button>
            </div>
          </div>
        </div>

        {/* --- NAVIGATION PILLS --- */}
        <div className="flex gap-2 bg-white p-2 rounded-full border border-slate-100 w-fit shadow-sm">
          {['profile', 'orders', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
                activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* --- PROFILE HUB --- */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 italic">Identity Details</h3>
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <input className="w-full bg-slate-50 border-none p-5 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-600 transition-all" value={data.profile?.user?.name} onChange={e => setData({...data, profile: {...data.profile, user: {...data.profile.user, name: e.target.value}}})} />
                      <input className="w-full bg-slate-50 border-none p-5 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-600 transition-all" value={data.profile?.user?.number} onChange={e => setData({...data, profile: {...data.profile, user: {...data.profile.user, number: e.target.value}}})} />
                      <button onClick={handleProfileUpdate} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100">Update Node</button>
                      <button onClick={() => setIsEditingProfile(false)} className="w-full text-slate-400 font-black text-[9px] uppercase tracking-widest">Cancel</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{data.profile?.user?.name}</p>
                        <p className="text-indigo-600 text-xs font-black tracking-widest uppercase">{data.profile?.user?.email}</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Link</p>
                        <p className="text-slate-700 font-black italic">{data.profile?.user?.number}</p>
                      </div>
                      <button onClick={() => setIsEditingProfile(true)} className="w-full py-4 rounded-2xl border-2 border-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Modify Profile</button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm h-full">
                  <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-8 italic">Registered Shipping Nodes</h3>
                  {data.addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
                      <p className="text-[10px] font-black text-slate-300 uppercase italic">No Addresses Encoded</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.addresses.map(addr => (
                        <div key={addr.aid} className="group p-8 border border-slate-100 rounded-[2.5rem] bg-white hover:border-indigo-600 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-sm font-black text-slate-800 uppercase italic mb-2">{addr.addrLine1}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{addr.city}, {addr.state} {addr.zipCode}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- ORDER LEDGER --- */}
          {activeTab === 'orders' && (
            <div className="grid gap-6">
              {data.orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[4rem] text-center border border-slate-100">
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] italic">No Transactions Recorded</p>
                </div>
              ) : (
                data.orders.map(order => (
                  <div key={order.orderId} className="group bg-white rounded-[3rem] border border-slate-100 p-10 flex flex-col md:flex-row justify-between items-center hover:shadow-2xl transition-all duration-500 gap-8">
                    <div className="flex items-center gap-10">
                      <div className="bg-slate-50 h-20 w-20 rounded-3xl flex items-center justify-center">
                        <svg className="text-slate-300" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ID #{order.orderId}</p>
                        <p className="font-black text-slate-900 text-4xl tracking-tighter italic leading-none">₹{order.totalAmount?.toLocaleString()}</p>
                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{order.orderDate}</p>
                      </div>
                    </div>
                    <div className={`px-10 py-3 rounded-full border font-black text-[9px] uppercase tracking-[0.2em] ${statusStyle(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* --- PAYMENT LEDGER --- */}
          {activeTab === 'payments' && (
            <div className="grid gap-6">
              {data.payments.length === 0 ? (
                <div className="bg-white p-20 rounded-[4rem] text-center border border-slate-100">
                   <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Payment Database Empty</p>
                </div>
              ) : (
                data.payments.map(p => (
                  <div key={p.id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 group">
                    <div className="space-y-4">
                      <div className={`w-fit px-4 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusStyle(p.status)}`}>
                        {p.status}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Ref: {p.razorpayPaymentId || 'UNPROCESSED'}</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none mt-2">₹{p.amount?.toLocaleString()}</p>
                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-1 italic">Linked to Order #{p.orderId}</p>
                      </div>
                    </div>
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                      <svg className="text-slate-300 group-hover:text-indigo-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <p className="text-center text-[8px] font-black text-slate-200 uppercase tracking-[0.6em] italic">
          IntelliMart Secure Access Hub — Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}