import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const verifyUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const sanitizedEmail = email.toLowerCase().trim();
      const res = await api.post('/api/auth/verify-email', { email: sanitizedEmail });
      if (res.status === 200) setStep(2); 
    } catch (err) {
      setError(err.response?.data?.message || "Active identity not found.");
    } finally { setLoading(false); }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    // ✅ Length Sync
    if (newPassword.length < 4) {
      setError("Security protocol: Minimum 4 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Security Mismatch: Hashes differ.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { 
        email: email.toLowerCase().trim(), 
        newPassword 
      });
      alert("Protocol Updated. Sign in now.");
      navigate('/login');
    } catch (err) { 
      setError("Reset protocol failure."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 font-sans">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-600"></div>
        <div className="text-center space-y-2 mb-12">
          <p className="text-indigo-600 font-black text-[9px] uppercase tracking-[0.4em]">Auth_Recovery // 2026</p>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            {step === 1 ? "Recovery Hub" : "Reset Pass"}
          </h2>
        </div>

        {error && <div className="bg-rose-50 text-rose-600 text-[10px] font-black uppercase p-4 rounded-2xl mb-8 text-center border border-rose-100 italic">{error}</div>}

        {step === 1 ? (
          <form onSubmit={verifyUser} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-slate-300 tracking-widest ml-4">Email Address</label>
              <input type="email" required value={email} placeholder="name@mainframe.com" className="w-full bg-slate-50 border-2 border-transparent p-5 rounded-2xl font-bold italic outline-none focus:border-indigo-100" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] hover:bg-indigo-600 shadow-xl group transition-all">
              {loading ? "SEARCHING..." : "Verify Identity"}
            </button>
          </form>
        ) : (
          <form onSubmit={updatePassword} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  minLength={4}
                  placeholder="New Password" 
                  className="w-full bg-slate-50 border-2 border-transparent p-5 rounded-2xl font-bold outline-none focus:border-indigo-100" 
                  onChange={(e) => setNewPassword(e.target.value)} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-5 text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Confirm Password" 
                className="w-full bg-slate-50 border-2 border-transparent p-5 rounded-2xl font-bold outline-none focus:border-indigo-100" 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
            <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] hover:bg-slate-900 shadow-xl transition-all">
              {loading ? "SYNCING..." : "Change Password"}
            </button>
          </form>
        )}
        <div className="text-center mt-12 pt-8 border-t border-slate-50">
          <Link to="/login" className="text-[9px] font-black uppercase text-slate-400 hover:text-indigo-600 italic tracking-widest">
            ← Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}