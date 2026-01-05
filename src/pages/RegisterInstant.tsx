import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
// Change graduationCap to GraduationCap
import { UserPlus, Shield, Users, GraduationCap, Loader2 } from 'lucide-react';

export default function RegisterInstant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    role: 'parent', 
    phone: '', 
    idNumber: '' 
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save to Supabase (Profiles table)
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          full_name: formData.name,
          role: formData.role,
          phone_number: formData.phone,
          id_number: formData.idNumber
        }])
        .select()
        .single();

      if (error) throw error;

      // 2. BYPASS: Save session to localStorage so App.tsx knows we are logged in
      localStorage.setItem('edusphere_user', JSON.stringify(data));

      // 3. INSTANT REDIRECT
      const paths: any = {
        admin: '/admin',
        teacher: '/teacher-portal',
        parent: '/parent-portal'
      };
      navigate(paths[formData.role] || '/');
      
    } catch (err) {
      alert("Error saving details. Make sure your database table 'profiles' is ready.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 leading-tight">Create Account</h1>
          <p className="text-slate-400 font-bold text-sm">Instant access • No verification</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input required className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-medium" 
            placeholder="Your Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
          
          <div className="relative">
            <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none appearance-none font-bold text-slate-700"
              onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="parent">Register as Parent</option>
              <option value="teacher">Register as Teacher</option>
              <option value="admin">Register as Admin</option>
            </select>
          </div>

          <input required className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-medium" 
            placeholder="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})} />

          <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Start Using Edusphere"}
          </button>
        </form>
      </div>
    </div>
  );
}