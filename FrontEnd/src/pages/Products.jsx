import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../cart/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  const [filters, setFilters] = useState({ category: "", minPrice: "", maxPrice: "", sortBy: "price_asc" });

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      params.append("sortBy", filters.sortBy);

      const res = await api.get(`/api/products/search?${params.toString()}`);
      setProducts(res.data || []);
    } catch (err) { console.error("Sync Failure", err); }
  }, [filters, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchProducts(); }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-1000">
      
      {/* --- PREMIUM HERO BANNER --- */}
      <div className="relative h-[60vh] mx-10 mt-6 overflow-hidden rounded-[4rem] group shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000" 
          className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-[3s]" 
          alt="Banner"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-20 space-y-4">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[1em] animate-pulse">System_Online // 2026</span>
          <h1 className="text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
            Global <br /> <span className="text-indigo-500">Inventory</span>
          </h1>
        </div>
      </div>

      <div className="px-14 py-20">
        {/* --- FILTER BAR --- */}
        <div className="flex flex-wrap items-center justify-between gap-10 mb-20 pb-10 border-b border-slate-50">
          <div className="flex gap-4">
            {["All", "Electronics", "Fashion", "Home"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilters({ ...filters, category: cat === "All" ? "" : cat })}
                className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  (filters.category === cat || (cat === "All" && !filters.category))
                    ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105"
                    : "bg-slate-50 text-slate-400 hover:text-black border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
              <input type="number" placeholder="MIN" className="w-16 bg-transparent text-[11px] font-bold outline-none" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} />
              <div className="h-4 w-[1px] bg-slate-200"></div>
              <input type="number" placeholder="MAX" className="w-16 bg-transparent text-[11px] font-bold outline-none" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} />
            </div>
            <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} className="bg-white border-2 border-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none transition-all hover:bg-black hover:text-white">
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {products.map((p, idx) => (
            <div key={p.id} style={{ animationDelay: `${idx * 100}ms` }} className="group relative animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer overflow-hidden rounded-[3rem] bg-slate-50 aspect-square shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
              </div>
              <div className="mt-8 text-center space-y-2">
                <h2 className="font-black text-2xl uppercase italic tracking-tighter text-slate-900">{p.name}</h2>
                <p className="text-indigo-600 font-black text-2xl italic tracking-tighter">₹{p.price?.toLocaleString()}</p>
                <button onClick={(e) => { e.stopPropagation(); addToCart(p.id, 1); }} className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all active:scale-95 mt-4">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}