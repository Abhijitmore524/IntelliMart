import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

/** PROFESSIONAL ICON ASSETS */
const TRASH_ICON = "🗑️";
const EDIT_ICON = "✏️";
const REVENUE_ICON = "💰";
const USERS_ICON = "👥";
const VENDOR_ICON = "🏢";
const BOX_ICON = "📦";

const STATUSES = ["CONFIRMED", "INTRANSIT", "DISPATCHED", "OUTFORDELIVERY", "DELIVERED", "PENDING"];
const CATEGORIES = ["CLOTHING", "ACCESSORIES", "SHOES", "CROCKERY", "ELECTRONICS", "GROCERIES"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];

export default function AdminDashboard() {
  const { user } = useAuth(); 
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductImage, setEditProductImage] = useState(null);
  const [editingSeller, setEditingSeller] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const productEditRef = useRef(null);
  const sellerEditRef = useRef(null);
  const customerEditRef = useRef(null);

  useEffect(() => { 
    loadAll(); 
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [p, s, o, c, pay] = await Promise.all([
        api.get("/api/admin/products"),
        api.get("/api/admin/sellers"),
        api.get("/api/admin/orders"),
        api.get("/api/admin/customers"),
        api.get("/api/admin/payments"),
      ]);
      setProducts(p.data || []);
      setSellers(s.data || []);
      setOrders(o.data || []);
      setCustomers(c.data || []);
      setPayments(pay.data || []);
    } catch (err) { alert("System load failed."); } finally { setLoading(false); }
  };

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const saveProductEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify({
        ...editingProduct,
        price: Number(editingProduct.price),
        unitsAvailable: Number(editingProduct.unitsAvailable)
      })], { type: "application/json" }));
      if (editProductImage) formData.append("image", editProductImage);

      await api.put(`/api/admin/products/${editingProduct.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setEditingProduct(null); setEditProductImage(null); loadAll();
      alert("Inventory Synchronized");
    } catch (e) { alert("Product Protocol Failure"); }
  };

  const saveSellerEdit = async () => {
    try {
      await api.put(`/api/admin/sellers/${editingSeller.id}`, editingSeller);
      setEditingSeller(null); loadAll();
      alert("Vendor Profile Updated");
    } catch (err) { alert("Seller Update Error"); }
  };

  const saveCustomerEdit = async () => {
    try {
      await api.put(`/api/admin/customers/${editingCustomer.id}`, editingCustomer);
      setEditingCustomer(null); 
      loadAll();
      alert("Client Security Profile Updated");
    } catch (err) { alert("Client Update Protocol Error"); }
  };

  const deleteItem = async (endpoint, id) => {
    if (window.confirm("Execution requested. Proceed?")) {
        await api.delete(`${endpoint}/${id}`);
        loadAll();
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, null, { 
        params: { status: status.trim().toUpperCase() } 
      });
      loadAll();
    } catch (e) { alert("Status Transition Denied"); }
  };

  const totalRevenue = payments
    .filter(p => p.paymentStatus === "SUCCESS")
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    
  const inventoryValue = products.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.unitsAvailable) || 0), 0);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse text-5xl italic tracking-tighter uppercase">ESTABLISHING_MAINFRAME_LINK...</div>;

  return (
    <div className="bg-[#fcfcfd] min-h-screen p-8 lg:p-20 space-y-32 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- HEADER --- */}
      <div className="relative animate-in fade-in slide-in-from-top duration-1000">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-4">
                <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.6em] ml-2">Mainframe_Access // 2026</p>
                <h1 className="text-8xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                    Welcome, <span className="text-indigo-600 inline-block">{user?.name || "Admin"}</span>
                </h1>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-50 flex items-center gap-16 min-w-[450px] group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative flex gap-12 items-center">
                    <div>
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1 italic">System_Time</p>
                        <p className="text-5xl font-black text-slate-900 italic tracking-tighter tabular-nums leading-none">
                            {currentTime.toLocaleTimeString([], { hour12: false })}
                        </p>
                    </div>
                </div>
                <button onClick={loadAll} className="relative ml-auto bg-slate-900 text-white p-8 rounded-full shadow-xl hover:bg-indigo-600 transition-all active:scale-90 flex items-center justify-center group/btn">
                    <span className="group-hover/btn:rotate-180 transition-transform duration-700 text-3xl">🔄</span>
                </button>
            </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { icon: REVENUE_ICON, label: 'Total Revenue', val: `₹${totalRevenue.toLocaleString()}`, color: 'text-emerald-500' },
            { icon: USERS_ICON, label: 'Active Clients', val: customers.length, color: 'text-indigo-500' },
            { icon: VENDOR_ICON, label: 'Authorized Vendors', val: sellers.length, color: 'text-slate-800' },
            { icon: BOX_ICON, label: 'Asset Magnitude', val: products.length, color: 'text-blue-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-12 rounded-[4rem] shadow-xl shadow-slate-100/50 border border-slate-50 flex flex-col justify-between h-72 group hover:border-indigo-200 transition-all duration-500 animate-in fade-in zoom-in" style={{animationDelay: `${i * 100}ms`}}>
              <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] group-hover:text-indigo-400 transition-colors">{stat.icon} {stat.label}</p>
              <h4 className={`text-5xl font-black ${stat.color} tracking-tighter italic leading-none`}>{stat.val}</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Verified Protocols</p>
            </div>
          ))}
      </section>

      {/* --- ASSET LEDGER --- */}
      <section ref={productEditRef} className="space-y-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic border-l-[16px] border-indigo-600 pl-8">Asset Ledger</h2>
        
        {editingProduct && (
          <div className="bg-white p-16 rounded-[5rem] shadow-2xl border-t-[14px] border-indigo-600 mb-16 animate-in zoom-in duration-500">
            <h3 className="text-3xl font-black text-indigo-600 mb-12 uppercase tracking-widest italic">Override Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <input className="bg-slate-50 p-8 rounded-[2.5rem] font-black text-2xl italic outline-none focus:ring-4 focus:ring-indigo-50" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="Name" />
              <input className="bg-slate-50 p-8 rounded-[2.5rem] font-black text-2xl italic outline-none focus:ring-4 focus:ring-indigo-50" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder="Price" />
              <select className="bg-slate-50 p-8 rounded-[2.5rem] font-black text-2xl italic appearance-none" value={editingProduct.pcategory} onChange={e => setEditingProduct({...editingProduct, pcategory: e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <div className="lg:col-span-3 space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4">Description</p>
                  <textarea className="w-full bg-slate-50 p-10 rounded-[3rem] font-black text-xl italic outline-none focus:ring-4 focus:ring-indigo-50 min-h-[150px]" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-8 mt-16">
                <button onClick={saveProductEdit} className="flex-1 bg-indigo-600 text-white py-8 rounded-full font-black uppercase shadow-2xl hover:bg-black transition-all">Execute Sync</button>
                <button onClick={() => setEditingProduct(null)} className="px-16 text-slate-300 font-black uppercase text-xs tracking-widest italic hover:text-rose-600">Abort</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[5rem] shadow-xl border border-slate-50 overflow-hidden px-10 pt-10">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead className="bg-slate-900 text-white italic">
                <tr className="text-[18px] font-black uppercase tracking-[0.2em]">
                    <th className="py-12 px-10 rounded-l-[2rem]">Visual</th>
                    <th className="py-12 px-10">Name</th>
                    <th className="py-12 px-10">Price</th>
                    <th className="py-12 px-10 text-center rounded-r-[2rem]">Action</th>
                </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-all duration-300 border-b group">
                  <td className="py-10 px-10"><img src={p.imageUrl} className="h-28 w-28 object-cover rounded-[2.5rem] shadow-lg border-4 border-white group-hover:scale-110 transition-transform duration-500" /></td>
                  <td className="py-10 px-10 font-black text-slate-900 text-3xl tracking-tighter uppercase italic">{p.name}</td>
                  <td className="py-10 px-10 font-black text-indigo-600 text-3xl italic">₹{p.price}</td>
                  <td className="py-10 px-10 flex justify-center gap-6 h-48 items-center">
                    <button onClick={() => { setEditingProduct({...p}); scrollToRef(productEditRef); }} className="bg-slate-100 text-slate-900 px-14 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Edit</button>
                    <button onClick={() => deleteItem("/api/admin/products", p.id)} className="bg-rose-50 text-rose-500 p-8 rounded-[2.5rem] hover:bg-rose-600 hover:text-white transition-all">{TRASH_ICON}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- PARTNER MAINFRAME --- */}
      <section ref={sellerEditRef} className="space-y-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic border-l-[16px] border-[#1e293b] pl-8">Seller Details</h2>
        
        {/* ✅ RESTORED SELLER EDIT BOX */}
        {editingSeller && (
          <div className="bg-white p-16 rounded-[5rem] shadow-2xl border-t-[14px] border-[#1e293b] mb-16 animate-in zoom-in duration-500">
            <h3 className="text-3xl font-black text-slate-800 mb-12 uppercase italic">Update Vendor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <input className="bg-slate-50 p-8 rounded-[2.5rem] font-black text-2xl italic outline-none" value={editingSeller.companyName} onChange={e => setEditingSeller({...editingSeller, companyName: e.target.value})} placeholder="Company" />
              <input className="bg-slate-50 p-8 rounded-[2.5rem] font-black text-2xl italic outline-none" value={editingSeller.user.name} onChange={e => setEditingSeller({...editingSeller, user: {...editingSeller.user, name: e.target.value}})} placeholder="Authorized Name" />
              <input className="bg-slate-50 p-8 rounded-[2.5rem] font-black text-2xl italic outline-none" value={editingSeller.user.number} onChange={e => setEditingSeller({...editingSeller, user: {...editingSeller.user, number: e.target.value}})} placeholder="Mobile" />
              <input className="bg-[#f1f5f9] p-8 rounded-[2.5rem] font-black text-2xl italic text-slate-400" value={editingSeller.user.email} disabled />
            </div>
            <button onClick={saveSellerEdit} className="w-full mt-16 bg-slate-900 text-white py-10 rounded-full font-black uppercase text-xs tracking-[0.5em] hover:bg-indigo-600 transition-all">Update</button>
          </div>
        )}

        <div className="bg-white rounded-[5rem] shadow-xl border border-slate-50 overflow-hidden px-10 pt-10">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead className="bg-slate-100 italic border-b font-black uppercase text-[18px] tracking-[0.2em] text-slate-400">
                <tr>
                    <th className="py-12 px-10 rounded-l-[2rem]">Name</th>
                    <th className="py-12 px-10">Email</th>
                    <th className="py-12 px-10 text-center rounded-r-[2rem]">Action</th>
                </tr>
            </thead>
            <tbody>
              {sellers.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-all border-b group">
                  <td className="py-12 px-10 font-black text-slate-900 text-4xl tracking-tighter uppercase italic">{s.companyName}</td>
                  <td className="py-12 px-10 font-bold text-slate-400 text-2xl uppercase tracking-widest">{s.user?.email}</td>
                  <td className="py-12 px-10 flex justify-center gap-6 h-48 items-center">
                    <button onClick={() => { setEditingSeller({...s, user: {...s.user}}); scrollToRef(sellerEditRef); }} className="bg-slate-900 text-white px-16 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-indigo-600 transition-all italic">Edit</button>
                    <button onClick={() => deleteItem("/api/admin/sellers", s.id)} className="bg-rose-50 text-rose-500 p-8 rounded-[2rem] hover:bg-rose-600 hover:text-white transition-all">{TRASH_ICON}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- CLIENT HUB --- */}
      <section ref={customerEditRef} className="space-y-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic border-l-[16px] border-[#10b981] pl-8">Client Info</h2>
        
        {/* ✅ RESTORED CUSTOMER EDIT BOX */}
        {editingCustomer && (
          <div className="bg-white p-16 rounded-[5rem] shadow-2xl border-t-[14px] border-[#10b981] mb-16 animate-in zoom-in duration-500">
            <h3 className="text-3xl font-black text-[#065f46] mb-12 uppercase italic">Update Customer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <input className="bg-slate-50 p-8 rounded-[2.5rem] font-black text-2xl italic outline-none focus:ring-4 focus:ring-emerald-50" value={editingCustomer.user.name} onChange={e => setEditingCustomer({...editingCustomer, user: {...editingCustomer.user, name: e.target.value}})} placeholder="Full Name" />
              <input className="bg-slate-50 p-8 rounded-[2.5rem] font-black text-2xl italic outline-none focus:ring-4 focus:ring-emerald-50" value={editingCustomer.user.number} onChange={e => setEditingCustomer({...editingCustomer, user: {...editingCustomer.user, number: e.target.value}})} placeholder="Mobile" />
              <select className="bg-slate-50 p-8 rounded-[2.5rem] font-black text-2xl italic appearance-none" value={editingCustomer.user.gender} onChange={e => setEditingCustomer({...editingCustomer, user: {...editingCustomer.user, gender: e.target.value}})}>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}</select>
            </div>
            <button onClick={saveCustomerEdit} className="w-full mt-16 bg-[#10b981] text-white py-10 rounded-full font-black uppercase text-xs tracking-[0.5em] shadow-2xl hover:bg-black transition-all">Update</button>
          </div>
        )}

        <div className="bg-white rounded-[5rem] shadow-xl border border-slate-50 overflow-hidden px-10 pt-10">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead className="bg-[#ecfdf5] italic border-b font-black uppercase text-[18px] tracking-[0.2em] text-[#059669]">
                <tr>
                    <th className="py-12 px-10 rounded-l-[2rem]">Name</th>
                    <th className="py-12 px-10">Email</th>
                    <th className="py-12 px-10 text-center rounded-r-[2rem]">Action</th>
                </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-emerald-50/40 transition-all border-b group">
                  <td className="py-12 px-10 font-black text-slate-900 text-4xl tracking-tighter uppercase italic">{c.user?.name}</td>
                  <td className="py-12 px-10 font-black text-emerald-600 text-2xl uppercase tracking-widest">{c.user?.email}</td>
                  <td className="py-12 px-10 flex justify-center gap-6 h-48 items-center">
                    <button onClick={() => { setEditingCustomer({...c, user: {...c.user}}); scrollToRef(customerEditRef); }} className="bg-emerald-50 text-emerald-700 px-20 py-6 rounded-[2.5rem] font-black text-[12px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all italic shadow-sm">Edit</button>
                    <button onClick={() => deleteItem("/api/admin/customers", c.id)} className="bg-rose-50 text-rose-500 p-8 rounded-[2rem] hover:bg-rose-600 hover:text-white transition-all">{TRASH_ICON}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- SETTLEMENT HUB (Orders) --- */}
      <section className="space-y-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic border-l-[16px] border-[#a855f7] pl-8">Order Details</h2>
        <div className="bg-white rounded-[5rem] overflow-hidden shadow-2xl border border-slate-50 px-10 pt-10">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead className="bg-[#faf5ff] text-purple-400 italic text-[18px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="py-12 px-10 rounded-l-[2rem]">Client</th>
                <th className="py-12 px-10">Amount</th>
                <th className="py-12 px-10">Status</th>
                <th className="py-12 px-10 text-center rounded-r-[2rem]">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.orderId} className="border-b hover:bg-purple-50/40 transition-all">
                  <td className="py-12 px-10 font-black text-slate-900 text-3xl uppercase italic tracking-tighter">CLIENT_REF_{o.customerId}</td>
                  <td className="py-12 px-10 font-black text-purple-600 text-5xl italic tracking-tighter leading-none">₹{o.totalAmount}</td>
                  <td className="py-12 px-10">
                    <select className={`border-4 rounded-[2rem] px-10 py-5 text-xs font-black outline-none transition-all ${o.status === "DELIVERED" ? "bg-emerald-500 text-white border-emerald-400" : "bg-white text-slate-900 border-purple-100"}`} value={o.status} onChange={(e) => updateStatus(o.orderId, e.target.value)}>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                  </td>
                  <td className="py-12 px-10 flex justify-center h-48 items-center">
                      <button onClick={() => deleteItem("/api/admin/orders", o.orderId)} className="bg-rose-50 text-rose-600 p-8 rounded-[2.5rem] hover:bg-rose-600 hover:text-white transition-all active:scale-90">{TRASH_ICON}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- FINANCIAL OVERSIGHT (Payments) --- */}
      <section className="space-y-12 pb-40">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic border-l-[16px] border-[#2dd4bf] pl-8">payment Details</h2>
        <div className="bg-white rounded-[5rem] overflow-hidden shadow-2xl border border-slate-50 px-10 pt-10">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead className="bg-[#f0fdfa] italic text-[18px] font-black text-teal-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="py-12 px-10 rounded-l-[2rem]">Order ID</th>
                <th className="py-12 px-10">Gateway Status</th>
                <th className="py-12 px-10">Method</th>
                <th className="py-12 px-10 text-right rounded-r-[2rem]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id} className="border-b hover:bg-teal-50/10 transition-all">
                  <td className="py-14 px-10 font-black text-slate-900 text-4xl tracking-tighter uppercase leading-none italic">ORD_{pay.orderId}</td>
                  <td className="py-14 px-10">
                    <div className={`inline-block px-14 py-5 rounded-full font-black text-[12px] uppercase tracking-[0.4em] ${pay.paymentStatus === 'SUCCESS' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-rose-100 text-rose-500 border border-rose-200'} shadow-lg`}>
                        {pay.paymentStatus}
                    </div>
                  </td>
                  <td className="py-14 px-10 font-black text-slate-300 text-2xl uppercase tracking-widest italic">{pay.paymentMethod || "UPI / CARD"}</td>
                  <td className="py-14 px-10 font-black text-slate-900 text-6xl italic text-right tracking-tighter leading-none">₹{pay.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="text-center pb-20 border-t border-slate-100 pt-20">
          <p className="text-[12px] font-black text-slate-300 uppercase tracking-[1em] italic">All Rights Reserved &copy;2026</p>
      </footer>
    </div>
  );
}