import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AcceptInvite() {
  const { token } = useParams();
  const [invite, setInvite] = useState<any>(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function fetchInvite() {
      const { data } = await supabase.from('invites').select('*, schools(name)').eq('token', token).single();
      setInvite(data);
    }
    fetchInvite();
  }, [token]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: invite.email,
      password,
      options: { data: { role: invite.role, school_id: invite.school_id } }
    });
    if (!error) alert("Account created! Verify email to log in.");
  };

  if (!invite) return <div className="p-10 text-center">Validating invite...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-2 text-black">Welcome to {invite.schools.name}</h2>
        <p className="text-gray-600 mb-6 text-sm">You've been invited as a <b>{invite.role}</b>. Set your password to join.</p>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input type="password" placeholder="Password" className="w-full p-3 border rounded text-black bg-white" required onChange={e => setPassword(e.target.value)} />
          <button className="w-full py-3 bg-green-600 text-white rounded font-bold">Join School</button>
        </form>
      </div>
    </div>
  );
}