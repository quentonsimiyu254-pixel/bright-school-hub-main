import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserPlus, School, Loader2, ShieldCheck } from 'lucide-react';

export default function TeacherJoin() {
  const { schoolId } = useParams(); // Gets ID from the URL link
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [schoolName, setSchoolName] = useState('your new school');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });

  useEffect(() => {
    async function getSchoolName() {
      const { data } = await supabase.from('schools').select('name').eq('id', schoolId).single();
      if (data) setSchoolName(data.name);
    }
    getSchoolName();
  }, [schoolId]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            role: 'teacher',
            school_id: schoolId,
            full_name: form.fullName,
          }
        }
      });

      if (error) throw error;
      
      // Instant login (no email confirmation)
      if (data.user) {
        alert(`Welcome to ${schoolName}!`);
        navigate('/dashboard'); // Teachers will go to their specific dashboard
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-600 rounded-2xl mb-4 text-white">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Join {schoolName}</h2>
          <p className="text-slate-500 mt-2 font-medium">Create your staff account</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <input
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <input
            type="email"
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Work Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Create Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Join Staff Portal"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          <span>Verified Invitation Link</span>
        </div>
      </div>
    </div>
  );
}