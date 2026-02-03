import { useCart } from "../cart/CartContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Cart() {
  const { cart, removeFromCart, changeQty, clearCart, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [newAddress, setNewAddress] = useState({
    zipcode: "",
    state: "",
    city: "",
    street: "",
    detailAddress: ""
  });

  const total = cart.reduce(
    (sum, p) => sum + Number(p.productPrice || p.product?.price || 0) * Number(p.quantity),
    0
  );

  useEffect(() => {
    if (user?.id) loadAddresses();
  }, [user?.id]);

  const loadAddresses = async () => {
    try {
      const res = await api.get(`/api/addresses/customer/${user.id}`);
      setAddresses(res.data || []);
      if (res.data?.length > 0) setSelectedAddress(res.data[0].aid);
    } catch (err) {
      console.error("Failed to load addresses");
    }
  };

  const addAddress = async () => {
    if (!newAddress.street || !newAddress.zipcode || !newAddress.city || !newAddress.state) {
      return alert("Please fill in Street, City, State, and Zipcode");
    }
    try {
      await api.post(`/api/addresses/customer/${user.id}`, {
        ...newAddress,
        customerId: user.id
      });
      setNewAddress({ zipcode: "", state: "", city: "", street: "", detailAddress: "" });
      loadAddresses();
    } catch (err) {
      alert("Failed to save address");
    }
  };

  const payNow = async () => {
    if (!cart.length) return alert("Cart is empty");
    if (!selectedAddress) return alert("Select an address first");

    setIsProcessing(true);
    try {
      const orderRes = await api.post(`/api/orders/place/${user.id}`, null, { 
        params: { addressId: selectedAddress } 
      });

      const orderId = orderRes.data.orderId;
      const payRes = await api.post(`/api/payments/razorpay/${orderId}`);
      const payment = payRes.data;

      const options = {
        key: "rzp_test_SBDo89UP0tFzEp", // ✅ FIXED: Now matches application.properties
        amount: Math.round(Number(payment.amount) * 100),
        currency: "INR",
        name: "IntelliMart",
        description: `Purchase for Order #${orderId}`,
        order_id: payment.razorpayOrderId, 
        handler: async (r) => {
          try {
            await api.post(`/api/payments/verify`, null, {
              params: {
                paymentId: payment.id,
                razorpayPaymentId: r.razorpay_payment_id,
                razorpayOrderId: r.razorpay_order_id,
                signature: r.razorpay_signature
              }
            });
            await clearCart(); 
            navigate("/customer");
          } catch (error) {
            alert("Verification Failed.");
            setIsProcessing(false);
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#4f46e5" },
        modal: { ondismiss: () => setIsProcessing(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Initialization Failed. Verify Backend/Razorpay Keys.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) return (
    <div className="p-20 text-center flex flex-col items-center">
      <h1 className="text-5xl font-black text-gray-200 uppercase italic tracking-tighter">Cart is Empty</h1>
      <button onClick={() => navigate("/")} className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg">Start Shopping</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-12 bg-white min-h-screen">
      <section className="space-y-6">
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest border-l-8 border-indigo-600 pl-4">1. Review Items ({cartCount})</h2>
        <div className="space-y-4">
          {cart.map(p => (
            <div key={p.cartItemId} className="flex justify-between items-center bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-6">
                <img 
                  src={p.productImageUrl || p.product?.imageUrl || "https://via.placeholder.com/150"} 
                  alt="Product" 
                  className="h-20 w-20 rounded-2xl object-cover bg-white shadow-sm"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
                />
                <div>
                  <p className="font-bold text-gray-800 uppercase text-sm">{p.productName || p.product?.name}</p>
                  <p className="text-indigo-600 font-black">₹{p.productPrice || p.product?.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border-2 rounded-xl">
                    <button className="px-3 py-1 font-black text-slate-400" onClick={() => changeQty(p.cartItemId, p.quantity - 1)}>-</button>
                    <span className="px-3 font-bold text-sm">{p.quantity}</span>
                    <button className="px-3 py-1 font-black text-slate-400" onClick={() => changeQty(p.cartItemId, p.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeFromCart(p.cartItemId)} className="text-red-400 text-[10px] font-black uppercase tracking-widest hover:text-red-600 transition-colors">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest border-l-8 border-emerald-500 pl-4">2. Shipping Destination</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(a => (
            <div key={a.aid} onClick={() => setSelectedAddress(a.aid)} className={`p-6 rounded-[2rem] border-4 transition-all cursor-pointer ${selectedAddress === a.aid ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}>
              <p className="font-black text-gray-800 text-xs uppercase mb-1">{a.street}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{a.city}, {a.state} - {a.zipcode}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Register New Address</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border-2 p-3 rounded-xl text-xs font-bold bg-white" placeholder="Street Name" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
            <input className="border-2 p-3 rounded-xl text-xs font-bold bg-white" placeholder="Detail Address" value={newAddress.detailAddress} onChange={e => setNewAddress({...newAddress, detailAddress: e.target.value})} />
            <input className="border-2 p-3 rounded-xl text-xs font-bold bg-white" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
            <input className="border-2 p-3 rounded-xl text-xs font-bold bg-white" placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
            <input className="border-2 p-3 rounded-xl text-xs font-bold bg-white" placeholder="Zip Code" value={newAddress.zipcode} onChange={e => setNewAddress({...newAddress, zipcode: e.target.value})} />
            <button onClick={addAddress} className="bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Save Address</button>
          </div>
        </div>
      </section>

      <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 space-y-8">
        <div className="flex justify-between items-center px-4">
            <div className="text-left">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Units</p>
                <p className="font-bold text-slate-700">{cartCount}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Order Total</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{total.toLocaleString()}</p>
            </div>
        </div>
        <button disabled={isProcessing} onClick={payNow} className="w-full bg-indigo-600 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-black transition-all">
          {isProcessing ? "INITIALIZING SECURE GATEWAY..." : "AUTHORIZE PAYMENT"}
        </button>
      </section>
    </div>
  );
}