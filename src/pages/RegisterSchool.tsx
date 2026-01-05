import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { School, ArrowRight, ShieldCheck, Loader2, User, Mail, Lock } from 'lucide-react';

export default function RegisterSchool() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    schoolName: '',
    fullName: '',
    email: '',
    password: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the School record first
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert([{ name: form.schoolName }])
        .select()
        .single();

      if (schoolError) throw new Error("School creation failed: " + schoolError.message);

      // 2. Sign up the Admin (Instant login because email confirmation is OFF)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            role: 'admin',
            school_id: school.id,
            full_name: form.fullName,
          },
        },
      });

      if (authError) throw authError;

      // 3. THE "SMOOTHIE" REDIRECT
      // If the signup works, Supabase returns a session immediately. 
      // We go straight to the dashboard.
      if (authData.user) {
        navigate('/admin');
      }

    } catch (err: any) {
      console.error("Registration error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200">
            <School className="text-white" size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Open Your School Hub
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          Ready for global registration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200 sm:rounded-3xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            
            {/* SCHOOL NAME */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Institution Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <School size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. Westside High School"
                  onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                />
              </div>
            </div>

            <div className="py-2 flex items-center gap-4">
               <div className="h-px bg-slate-100 flex-1"></div>
               <span className="text-xs text-slate-300 font-bold uppercase">Admin Details</span>
               <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            {/* ADMIN NAME */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="Full Name"
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="admin@school.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="Password"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none shadow-lg shadow-indigo-100 transition-all disabled:opacity-70 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <span className="flex items-center gap-2">
                  Launch Institution <ArrowRight size={20} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" />
            <span>Instant Access Enabled</span>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}