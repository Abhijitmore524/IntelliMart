import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart(); 
  const navigate = useNavigate();
  
  // ✅ Detect Role: Search box will be hidden for ROLE_ADMIN
  const isAdmin = user?.role === "ROLE_ADMIN";

  const handleSearch = (e) => {
    const value = e.target.value;
    // ✅ Logic guard: prevent navigation to an empty query which can break parameters
    if (value.trim() === "") {
        navigate("/", { replace: true });
    } else {
        navigate(`/?query=${encodeURIComponent(value)}`, { replace: true });
    }
  };

  return (
    <nav className="flex items-center justify-between px-16 py-8 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <Link to="/" className="text-4xl font-black tracking-tighter text-slate-900 italic uppercase">
        Intelli<span className="text-indigo-600">Mart</span>
      </Link>

      {/* ✅ Hide Search Box if User is Admin */}
      {!isAdmin && (
        <div className="flex-1 max-w-xl mx-20 animate-in fade-in duration-500">
          <input
            type="text"
            placeholder="Search For Products"
            onChange={handleSearch}
            className="w-full px-10 py-3.5 bg-slate-50 rounded-full text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none border border-slate-100"
          />
        </div>
      )}

      {/* ✅ High-Visibility Font Protocol (text-slate-800 and text-[13px]) */}
      <div className="flex items-center gap-10 text-[13px] font-black uppercase tracking-[0.3em] text-slate-800">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        
        {/* Account Link logic routes based on role */}
        <Link to={isAdmin ? "/admin" : "/customer"} className="hover:text-indigo-600 transition-colors">Account</Link>
        
        {!isAdmin && (
          <Link to="/cart" className="relative group hover:text-slate-900 transition-colors">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-6 bg-indigo-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center italic animate-bounce shadow-lg shadow-indigo-200">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {user ? (
          <button 
            onClick={() => { logout(); navigate("/login"); }} 
            className="text-rose-500 font-black hover:text-rose-700 border-l-2 border-slate-100 pl-10 ml-2 italic"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-slate-900 text-white px-10 py-4 rounded-full text-[11px] font-black tracking-widest hover:bg-indigo-600 shadow-2xl transition-all">
            Authorize
          </Link>
        )}
      </div>
    </nav>
  );
}