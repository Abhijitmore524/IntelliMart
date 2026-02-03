import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchCart = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/api/cart/${user.id}`);
      setCart(res.data || []);
    } catch (err) {
      console.error("Cart sync failed", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?.id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000); 
  };

  const addToCart = async (productId, qty = 1) => {
    if (!user?.id) return alert("Please login to add items to cart.");

    try {
      // ✅ POST to your backend cart/add endpoint
      await api.post(`/api/cart/add/${user.id}/${productId}/${qty}`);
      
      // ✅ Refresh immediately so the Navbar badge updates instantly
      await fetchCart(); 
      
      showToast("Item added to cart!"); 
    } catch (err) {
      console.error("Add to cart error:", err);
      showToast("Could not add item.");
    }
  };

  const changeQty = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/api/cart/update/${cartItemId}`, null, {
        params: { quantity }
      });
      fetchCart();
    } catch (err) { console.error("Update qty error", err); }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/api/cart/remove/${cartItemId}`);
      fetchCart();
    } catch (err) { console.error("Remove error", err); }
  };

  const clearCart = async () => {
    try {
      await api.delete(`/api/cart/clear/${user.id}`);
      setCart([]);
    } catch (err) { console.error("Clear error", err); }
  };

  // ✅ REDUCE logic sums all individual item quantities
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      changeQty,
      removeFromCart,
      clearCart,
      cartCount
    }}>
      {children}

      {/* ✅ PERSISTENT FLOATING NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in fade-in slide-in-from-right-10 duration-300">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl border border-slate-700 flex items-center gap-4">
            <div className="bg-emerald-500 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-black">
              ✓
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em]">{toast}</p>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);