import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function SmartLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Check if it's a Student (Admission Number)
      if (identifier.toUpperCase().startsWith('ADM')) {
        const { data: student, error: sError } = await supabase
          .from('students')
          .select('*')
          .eq('admission_number', identifier.toUpperCase())
          .single();

        if (student) {
          localStorage.setItem('edusphere_user', JSON.stringify({ ...student, role: 'student' }));
          navigate('/student-hub');
          return;
        }
      }

      // 2. Check if it's a Staff/Parent (Phone or Full Name)
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .or(`phone_number.eq.${identifier},full_name.ilike.%${identifier}%`)
        .single();

      if (profile) {
        localStorage.setItem('edusphere_user', JSON.stringify(profile));
        
        // Dynamic Redirect based on saved role
        const paths: any = {
          admin: '/admin',
          teacher: '/teacher-portal',
          parent: '/parent-portal'
        };
        navigate(paths[profile.role] || '/register');
      } else {
        setError('No account found. Please check your details or register.');
      }
    } catch (err) {
      setError('System connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* LOGO SECTION */}
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-100 text-white mb-4">
            <Search size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 font-bold mt-2 uppercase text-xs tracking-[0.2em]">Edusphere Global Hub</p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Identify Yourself</label>
              <input 
                required
                className="w-full mt-2 p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-indigo-600 focus:bg-white transition-all text-lg font-medium"
                placeholder="Phone, ADM No, or Name"
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-2xl text-sm font-bold animate-shake">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Enter Portal <ArrowRight size={20}/></>}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 font-bold text-sm">New to the school?</p>
            <button 
              onClick={() => navigate('/register')}
              className="mt-2 text-indigo-600 font-black hover:underline"
            >
              Create an Account Instantly
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-slate-300 text-xs font-bold uppercase tracking-widest">
          Secured by Edusphere Node • Thika, Kenya
        </p>
      </div>
    </div>
  );
}