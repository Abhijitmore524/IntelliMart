import { useEffect, useState } from "react";
import api from "../../api/axios";

const CATEGORIES = ["CLOTHING", "ACCESSORIES", "SHOES", "CROCKERY", "ELECTRONICS", "GROCERIES"];

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({ 
    name: "", 
    price: "", 
    pcategory: "CLOTHING", 
    unitsAvailable: 1, 
    description: "" // ✅ Added Description to state
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get("/api/seller/products");
      setProducts(res.data);
    } catch (err) { alert("Failed to load products"); }
    finally { setLoading(false); }
  };

  const loadOrders = async () => {
    try {
      // ✅ Matches backend @GetMapping("/seller") in OrderController
      const res = await api.get("/api/orders/seller");
      setOrders(res.data);
    } catch (err) { 
      console.error("Order Sync Failed", err); 
    }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!editingId && !imageFile) { alert("Please select image"); return; }

    const fd = new FormData();
    if (imageFile) fd.append("image", imageFile);
    
    // ✅ Blob now includes description field
    fd.append("data", new Blob([JSON.stringify({ 
      ...form, 
      price: Number(form.price), 
      unitsAvailable: Number(form.unitsAvailable) 
    })], { type: "application/json" }));

    try {
      if (editingId) await api.put(`/api/seller/products/${editingId}`, fd);
      else await api.post("/api/seller/products", fd);
      
      alert("Product Updated");
      setForm({ name: "", price: "", pcategory: "CLOTHING", unitsAvailable: 1, description: "" });
      setImageFile(null); setEditingId(null);
      loadProducts();
    } catch (err) { alert("Save failed"); }
  };

  const edit = p => {
    setEditingId(p.id);
    setForm({ 
      name: p.name, 
      price: p.price, 
      pcategory: p.pcategory, 
      unitsAvailable: p.unitsAvailable || 1, 
      description: p.description || "" 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async id => {
    if (!window.confirm("Terminate this inventory node?")) return;
    await api.delete(`/api/seller/products/${id}`);
    loadProducts();
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-indigo-600 italic">SYNCING_SELLER_HUB...</div>;

  return (
    <div className="bg-white min-h-screen px-12 py-16 animate-in fade-in duration-1000">
      
      {/* HEADER */}
      <div className="border-l-8 border-indigo-600 pl-8 mb-16">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">Merchant_Console // 2026</span>
        <h2 className="text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Seller Dashboard</h2>
      </div>

      {/* FORM CARD - EXPANDED */}
      <div className="max-w-6xl bg-white rounded-[4rem] p-16 shadow-2xl border border-slate-50 mb-24 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-125 duration-700"></div>
        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-12 italic relative">{editingId ? "Update" : "Register"}</h3>
        
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Product_Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-3xl font-black text-2xl uppercase italic focus:ring-2 focus:ring-indigo-100 outline-none" required />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Unit_Price (₹)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-3xl font-black text-2xl italic outline-none" required />
          </div>

          {/* ✅ NEW DESCRIPTION FIELD */}
          <div className="col-span-full space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Description</label>
            <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                rows="3"
                className="w-full bg-slate-50 p-8 rounded-[2.5rem] font-bold text-xl italic focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                placeholder="Enter Description"
                required
            />
          </div>

          <div className="col-span-full space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full p-6 border-4 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50 cursor-pointer" />
            {imageFile && <img src={URL.createObjectURL(imageFile)} className="h-40 w-40 object-cover rounded-3xl mt-4 shadow-xl" />}
          </div>

          <div className="col-span-full bg-slate-50 p-10 rounded-[3rem]">
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-6">Category</p>
            <div className="flex gap-4 flex-wrap">
              {CATEGORIES.map(c => (
                <button type="button" key={c} onClick={() => setForm({...form, pcategory: c})} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${form.pcategory === c ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-400 hover:text-black'}`}>{c}</button>
              ))}
            </div>
          </div>

          <button className="col-span-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
            {editingId ? "Update Product" : "Add "}
          </button>
        </form>
      </div>

      {/* PRODUCTS TABLE */}
      <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-10">Active_Inventory</h2>
      <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-50 mb-24 animate-in slide-in-from-bottom-10 duration-1000">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white">
            <tr className="text-[10px] font-black uppercase tracking-widest italic">
              <th className="p-10">Image</th>
              <th className="p-10">Products_Name</th>
              <th className="p-10">Price</th>
              <th className="p-10">Category</th>
              <th className="p-10">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-10"><img src={p.imageUrl} className="h-24 w-24 object-cover rounded-3xl shadow-sm" /></td>
                <td className="p-10 font-black text-2xl uppercase italic text-slate-900">{p.name}</td>
                <td className="p-10 font-black text-2xl italic text-indigo-600">₹{p.price}</td>
                <td className="p-10 font-black text-[10px] uppercase text-slate-400 tracking-widest">{p.pcategory}</td>
                <td className="p-10 space-x-6">
                  <button onClick={() => edit(p)} className="text-indigo-600 font-black text-[10px] uppercase border-b-2 border-indigo-100 hover:border-indigo-600">Modify</button>
                  <button onClick={() => remove(p.id)} className="text-rose-400 font-black text-[10px] uppercase border-b-2 border-rose-100 hover:border-rose-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDERS TABLE */}
      <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-10 mt-20">Orders</h2>
      <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-50 animate-in slide-in-from-bottom-10 duration-1000">
        <table className="w-full text-left">
          <thead className="bg-indigo-600 text-white">
            <tr className="text-[10px] font-black uppercase tracking-widest italic">
              <th className="p-10">Product</th>
              <th className="p-10">Qty</th>
              <th className="p-10">Amount</th>
              <th className="p-10">Status</th>
              <th className="p-10">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-slate-300 font-black uppercase italic tracking-widest italic">No_Orders_Received_Yet</td>
              </tr>
            ) : (
              orders.map(o => (
                <tr key={`${o.orderId}-${o.productName}`} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-10 font-black text-2xl uppercase italic text-slate-900">{o.productName}</td>
                  <td className="p-10 font-black text-2xl text-slate-900">{o.quantity}</td>
                  <td className="p-10 font-black text-2xl italic text-indigo-600">₹{o.amount}</td>
                  <td className="p-10">
                    <span className="px-6 py-2 bg-slate-50 rounded-full font-black text-[9px] uppercase tracking-widest text-slate-400">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-10 font-bold text-slate-400 italic text-sm">{o.orderDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}