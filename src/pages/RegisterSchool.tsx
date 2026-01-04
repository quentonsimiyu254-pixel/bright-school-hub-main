import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function RegisterSchool() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({ schoolName: '', fullName: '', email: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insert School
      const { data: school, error: sError } = await supabase
        .from('schools')
        .insert([{ name: form.schoolName, email: form.email }])
        .select().single();

      if (sError) throw sError;

      // 2. Sign Up Admin (Role: admin, School_id: school.id)
      const { error: aError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { role: 'admin', school_id: school.id, full_name: form.fullName },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (aError) throw aError;
      alert("Registration successful! Verify your email to start setting up your school.");
      navigate('/login');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Register Your School</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-4 bg-gray-50 p-8 rounded-xl shadow" onSubmit={handleRegister}>
          <input type="text" placeholder="School Name" className="w-full p-3 border rounded text-black bg-white" required onChange={e => setForm({...form, schoolName: e.target.value})} />
          <input type="text" placeholder="Admin Full Name" className="w-full p-3 border rounded text-black bg-white" required onChange={e => setForm({...form, fullName: e.target.value})} />
          <input type="email" placeholder="Admin Email" className="w-full p-3 border rounded text-black bg-white" required onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded text-black bg-white" required onChange={e => setForm({...form, password: e.target.value})} />
          <button disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
            {loading ? "Creating..." : "Register School"}
          </button>
        </form>
      </div>
    </div>
  );
}