import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instantRegister } from '../lib/instant-auth';
import { UserPlus, Shield, Users, UserCheck } from 'lucide-react';

export default function RegisterInstant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', role: 'parent', phone: '', idNumber: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetPath = await instantRegister(formData);
    navigate(targetPath); // BOOM. Instant redirect.
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Join Edusphere</h1>
        <p className="text-slate-400 font-bold mb-8 uppercase text-xs tracking-widest">No verification required</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input required className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600" 
            placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
          
          <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none"
            onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" 
            placeholder="Phone Number (Optional)" onChange={e => setFormData({...formData, phone: e.target.value})} />

          <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}