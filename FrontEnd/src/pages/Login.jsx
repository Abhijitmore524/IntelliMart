import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ Restored Toggle
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    
    // ✅ Sync with Backend: Minimum 4 characters
    if (password.length < 4) {
        setError("Password must be at least 4 characters.");
        return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data);
      const role = res.data.role;

      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else if (role === "ROLE_SELLER") {
        navigate("/seller");
      } else {
        navigate("/"); 
      }
    } catch (err) {
      console.error("Login Failed:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 p-4">
      <form 
        onSubmit={submit} 
        className="bg-white w-full max-w-[400px] p-10 rounded-2xl shadow-2xl transition-all"
      >
        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-800">
          IntelliMart
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Please enter your details to sign in
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 ml-1">Email Address</label>
            <input
              type="email"
              className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="name@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 ml-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
              minLength={4}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* ✅ Eye Toggle Icon */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="text-right text-sm text-indigo-600 mt-3 mb-6 font-medium">
          <Link to="/forgot-password" stroke="sm" className="hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 active:scale-95"
          }`}
        >
          {loading ? "AUTHENTICATING..." : "SIGN IN"}
        </button>

        <p className="text-center mt-8 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}