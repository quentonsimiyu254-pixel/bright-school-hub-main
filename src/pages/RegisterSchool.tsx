import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { School, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function RegisterSchool() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    schoolName: '',
    fullName: '',
    email: '',
    password: '',
    country: 'Kenya' // Default or change as needed
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the School entry
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert([{ 
          name: form.schoolName, 
          country: form.country 
        }])
        .select()
        .single();

      if (schoolError) throw schoolError;

      // 2. Sign up the Admin user
      // Since "Confirm Email" is OFF in Supabase, this creates a session immediately
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

      // 3. Smooth Redirect
      // If session exists (which it should with email confirm OFF), go to Admin Dashboard
      if (authData.session) {
        navigate('/admin');
      } else {
        // Fallback in case settings haven't updated yet
        alert("Account created! Please log in.");
        navigate('/login');
      }

    } catch (err: any) {
      console.error("Registration error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <School className="text-white" size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Register Your School
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            {/* School Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">School Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Bright Academy"
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
              />
            </div>

            <hr className="border-slate-100" />

            {/* Admin Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Admin Full Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Work Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="admin@school.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-200 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span className="flex items-center gap-2">
                    Create School Account <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} />
            <span>Secure, encrypted institutional registration</span>
          </div>
        </div>
      </div>
    </div>
  );
}