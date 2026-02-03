import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", number: "", email: "", password: "", gender: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    // Frontend Validation Logic
    if (form.number.length !== 10) {
        alert("Mobile number must be exactly 10 digits.");
        return;
    }
    if (form.password.length < 4) {
        alert("Password must be at least 4 characters.");
        return;
    }

    try {
      await api.post("/api/auth/signup/customer", {
        user: form
      });

      alert("Account created successfully. Please login.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      // ✅ Restored: Displays specific backend error messages (Email/Number exists)
      const errorMsg = err.response?.data?.message || "Signup failed";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-10 rounded-xl shadow w-[420px]">
        <h1 className="text-2xl font-semibold mb-6 text-center">Customer Signup</h1>
        
        <input name="name" placeholder="Name" className="border p-2 w-full mb-3 rounded outline-none focus:ring-2 focus:ring-indigo-100" onChange={handleChange} required />
        
        <input 
          name="number" 
          placeholder="Phone (10 digits)" 
          className="border p-2 w-full mb-3 rounded outline-none focus:ring-2 focus:ring-indigo-100" 
          maxLength={10}
          onChange={handleChange} 
          required 
        />
        
        <input name="email" placeholder="Email" type="email" className="border p-2 w-full mb-3 rounded outline-none focus:ring-2 focus:ring-indigo-100" onChange={handleChange} required />
        
        <div className="relative mb-3">
          <input 
            name="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="Password (min 4 chars)" 
            className="border p-2 w-full rounded outline-none focus:ring-2 focus:ring-indigo-100" 
            minLength={4}
            onChange={handleChange} 
            required 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <select name="gender" className="border p-2 w-full mb-6 rounded outline-none focus:ring-2 focus:ring-indigo-100" onChange={handleChange} required>
          <option value="">Select gender</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
          <option value="OTHER">OTHER</option>
        </select>

        <button className="bg-black text-white w-full py-3 rounded hover:bg-gray-800 font-bold uppercase transition-all active:scale-95">
          Create Account
        </button>
      </form>
    </div>
  );
}