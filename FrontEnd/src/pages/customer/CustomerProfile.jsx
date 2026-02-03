import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // ✅ State now matches your UserDto exactly
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    gender: '',
  });

  useEffect(() => {
    // ⚠️ I removed "loadAddresses" to stop the backend error "No mapping for GET /api/address/me"
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/api/customers/me');
      setProfile(res.data);
      // ✅ Properly syncs with the nested 'user' object in your DTO
      setFormData({
        name: res.data.user.name || '',
        email: res.data.user.email || '',
        number: res.data.user.number || '',
        gender: res.data.user.gender || '',
      });
    } catch (err) { 
      console.error("Identity synchronization protocol failed"); 
    }
  };

  const handleSave = async () => {
    try {
      // ✅ Matches your CustomerDto { user: UserDto } structure for the update
      await api.put('/api/customers/me', { 
        user: { ...profile.user, ...formData } 
      });
      setIsEditing(false);
      loadProfile();
      alert("Identity Hub Synchronized!");
    } catch (err) { 
      alert("Update failed - check server connection"); 
    }
  };

  if (!profile) return (
    <div className="h-screen flex items-center justify-center font-black animate-pulse text-indigo-600 italic">
      ESTABLISHING_IDENTITY_LINK...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-12 space-y-16 animate-in fade-in duration-1000">
      
      {/* --- GIANT EXPANDED IDENTITY CARD --- */}
      <div className="bg-white rounded-[4rem] p-20 shadow-2xl border border-slate-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-125 duration-1000"></div>
        
        <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.5em] mb-16 italic relative">
            Identity_Node / Profile_Update
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
          
          {/* COLUMN 1 */}
          <div className="space-y-12">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase text-slate-300 tracking-[0.4em]">Node_Name</label>
              <input 
                disabled={!isEditing}
                className={`w-full p-8 rounded-[2rem] font-black text-4xl uppercase italic transition-all ${isEditing ? 'bg-slate-50 border-2 border-indigo-100 focus:border-indigo-600 outline-none shadow-inner' : 'bg-transparent border-none text-slate-900'}`} 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase text-slate-300 tracking-[0.4em]">Primary_Node_Email</label>
              <p className="text-indigo-600 font-black tracking-widest text-lg uppercase px-2">{profile.user.email}</p>
              <p className="text-[9px] text-slate-400 italic px-2">Permanent node identifier (Read-only)</p>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="space-y-12">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase text-slate-300 tracking-[0.4em]">Contact_Link</label>
              <input 
                disabled={!isEditing}
                className={`w-full p-8 rounded-[2rem] font-black text-4xl italic transition-all ${isEditing ? 'bg-slate-50 border-2 border-indigo-100 focus:border-indigo-600 outline-none shadow-inner' : 'bg-transparent border-none text-slate-900'}`} 
                value={formData.number} 
                onChange={e => setFormData({...formData, number: e.target.value})} 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase text-slate-300 tracking-[0.4em]">Gender_Protocol</label>
              {isEditing ? (
                <select 
                  className="w-full p-8 bg-slate-50 border-2 border-indigo-100 rounded-[2rem] font-black text-2xl uppercase italic focus:border-indigo-600 outline-none transition-all appearance-none"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="">Select_Protocol</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              ) : (
                <p className="text-slate-900 text-3xl font-black italic uppercase tracking-tighter px-2">
                  {profile.user.gender || "Undefined"}
                </p>
              )}
            </div>
          </div>

          {/* ACTION HUB */}
          <div className="md:col-span-2 pt-12">
            {isEditing ? (
              <div className="flex gap-8">
                <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-10 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-slate-900 transition-all active:scale-95 shadow-indigo-200">Execute_Update</button>
                <button onClick={() => setIsEditing(false)} className="px-12 text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Abort_Changes</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full py-10 rounded-[2.5rem] border-4 border-slate-900 font-black uppercase text-xs tracking-[0.4em] hover:bg-slate-900 hover:text-white transition-all shadow-xl">Modify_Identity_Protocol</button>
            )}
          </div>
        </div>
      </div>

      {/* --- MINIMIZED FOOTER --- */}
      <div className="bg-slate-50/50 rounded-[3rem] p-12 border border-slate-100 text-center">
        <p className="text-[11px] font-black uppercase text-slate-300 tracking-[1em] italic">
            Shipping_Nodes_Offline // Database_Bypassed
        </p>
      </div>
    </div>
  );
}