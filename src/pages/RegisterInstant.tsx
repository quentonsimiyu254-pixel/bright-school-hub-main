import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instantRegister } from '../lib/auth-service';
import { UserPlus, Shield, Users } from 'lucide-react';

export default function RegisterInstant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', role: 'parent', phone: '', idNumber: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await instantRegister(formData);
      
      // Role-based routing
      const paths: Record<string, string> = {
        admin: '/admin',
        teacher: '/teacher-portal',
        parent: '/parent-portal'
      };
      
      navigate(paths[user.role] || '/dashboard');
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please ensure your 'profiles' table is created in Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Join Edusphere</h1>
          <p className="text-indigo-600 font-bold uppercase text-xs tracking-widest">Instant Setup • No Verification</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name - Forced Dark Text */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-2 uppercase">Full Name</label>
            <input 
              required 
              type="text"
              className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-600 text-slate-900 font-bold placeholder:text-slate-300" 
              placeholder="e.g. Quenton Masinde" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-2 uppercase">Your Role</label>
            <select 
              className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-600 text-slate-900 font-bold appearance-none cursor-pointer"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="parent">👨‍👩‍👧 Parent</option>
              <option value="teacher">👨‍🏫 Teacher</option>
              <option value="admin">🔒 Admin</option>
            </select>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 ml-2 uppercase">Phone Number</label>
            <input 
              type="tel"
              className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-600 text-slate-900 font-bold placeholder:text-slate-300" 
              placeholder="07XX XXX XXX" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Registering..." : "Start Learning"}
          </button>
        </form>
      </div>
    </div>
  );
}