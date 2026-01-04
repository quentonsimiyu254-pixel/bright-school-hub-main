import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'student' }, // Default role for individuals
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) alert(error.message);
    else alert("Check your email to verify your account!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSignUp} className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Individual Signup</h2>
        <input type="email" placeholder="Email" className="w-full p-3 border rounded bg-white text-black" required onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-3 border rounded bg-white text-black" required onChange={e => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}