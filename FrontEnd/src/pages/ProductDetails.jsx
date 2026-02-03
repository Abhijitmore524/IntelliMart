import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useCart } from "../cart/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]); // Added state for similar products

  const loadProductNode = useCallback(async () => {
    // ✅ SAFETY GUARD: Prevent calling backend with "undefined" string
    // This fixes the MethodArgumentTypeMismatchException in your logs
    if (!id || id === "undefined") return;

    try {
      setLoading(true);
      const res = await api.get(`/api/products/${id}`);
      setP(res.data);

      // ✅ ADDED: Fetch similar products based on the current category
      if (res.data?.pcategory) {
        const similarRes = await api.get(`/api/products/search?category=${res.data.pcategory}`);
        // Filter out current product and limit to 4 items
        const filtered = similarRes.data
          .filter(item => item.id !== parseInt(id))
          .slice(0, 4);
        setSimilarProducts(filtered);
      }
    } catch (err) { 
      console.error("Node Sync Failed", err); 
      setP(null);
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => {
    // ✅ Check if ID exists before attempting to load
    if (id && id !== "undefined") {
      window.scrollTo(0, 0);
      loadProductNode();
    }
  }, [id, loadProductNode]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-indigo-600 italic animate-pulse">
      SYNCING_TECHNICAL_METADATA...
    </div>
  );
  
  if (!p) return <div className="h-screen flex flex-col items-center justify-center font-black uppercase text-slate-400 italic">Node_Not_Found</div>;

  return (
    <div className="bg-white min-h-screen px-8 lg:px-24 py-20 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* REFINED STUDIO IMAGE (Original Colors) */}
        <div className="rounded-[4rem] overflow-hidden bg-white shadow-2xl border border-slate-50 group">
          <img 
            src={p.imageUrl} 
            alt={p.name} 
            className="w-full h-[650px] object-cover transition-all duration-[1.5s] group-hover:scale-105" 
          />
        </div>

        {/* INFO HUB */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="bg-indigo-600 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic">{p.pcategory}</span>
            </div>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-tight">
              {p.name}
            </h1>
            <p className="text-5xl font-black text-indigo-600 italic tracking-tighter">
              ₹{p.price?.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 border-y border-slate-100 py-12">
            <div className="space-y-2 border-l-4 border-indigo-600 pl-6">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Merchant</p>
              <p className="font-black text-slate-900 text-xl italic uppercase tracking-tighter">{p.sellerName || "Verified_Node"}</p>
            </div>
            <div className="space-y-2 border-l-4 border-slate-100 pl-6">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Availability</p>
              <p className={`font-black text-xl uppercase italic tracking-tighter ${p.unitsAvailable > 0 ? "text-slate-900" : "text-rose-500"}`}>
                {p.unitsAvailable > 0 ? `${p.unitsAvailable}_Units` : "Out of Stock"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Description</p>
            <p className="text-slate-500 leading-relaxed font-medium text-lg italic whitespace-pre-line">
              {p.description || "No data provided."}
            </p>
          </div>

          <button 
            onClick={() => addToCart(p.id, 1)} 
            disabled={p.unitsAvailable <= 0} 
            className="w-full py-8 rounded-[2rem] bg-indigo-600 text-white font-black uppercase text-[10px] tracking-[0.4em] hover:bg-slate-900 shadow-2xl shadow-indigo-100 transition-all active:scale-95"
          >
            {p.unitsAvailable > 0 ? "Add to Cart" : "Currently Unavailable"}
          </button>
        </div>
      </div>

      {/* ✅ ADDED: SIMILAR PRODUCTS SECTION */}
      {similarProducts.length > 0 && (
        <div className="mt-40 space-y-16">
          <div className="flex items-center gap-6">
            <div className="h-10 w-2 bg-indigo-600"></div>
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Similar Products</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            {similarProducts.map((item, idx) => (
              <div 
                key={item.id} 
                style={{ animationDelay: `${idx * 150}ms` }}
                className="group cursor-pointer animate-in fade-in slide-in-from-bottom-10 duration-700"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <div className="overflow-hidden rounded-[3rem] aspect-square bg-slate-50 shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-slate-100">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                </div>
                <div className="mt-8 space-y-2 text-center">
                  <h3 className="font-black text-xl uppercase italic tracking-tighter text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                  <p className="font-black text-indigo-600 italic">₹{item.price?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}