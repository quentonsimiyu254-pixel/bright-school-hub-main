import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function RegisterSchool() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ schoolName: '', fullName: '', email: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: school, error: sError } = await supabase
        .from('schools').insert([{ name: form.schoolName }]).select().single();
      if (sError) throw sError;

      const { error: aError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { role: 'admin', school_id: school.id, full_name: form.fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (aError) throw aError;
      alert("Success! Check your email to verify and enter your dashboard.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Register School</h2>
        <input type="text" placeholder="School Name" className="w-full p-3 border rounded bg-white text-black" required onChange={e => setForm({...form, schoolName: e.target.value})} />
        <input type="text" placeholder="Your Full Name" className="w-full p-3 border rounded bg-white text-black" required onChange={e => setForm({...form, fullName: e.target.value})} />
        <input type="email" placeholder="Admin Email" className="w-full p-3 border rounded bg-white text-black" required onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password" className="w-full p-3 border rounded bg-white text-black" required onChange={e => setForm({...form, password: e.target.value})} />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
          {loading ? "Processing..." : "Create School & Admin"}
        </button>
      </form>
    </div>
  );
}