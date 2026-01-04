import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  UserPlus, ClipboardList, Users, Settings, 
  Link as LinkIcon, Check, LogOut, LayoutDashboard 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('teacher');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [schoolName, setSchoolName] = useState('Your School');

  // Fetch School Data on Mount
  useEffect(() => {
    async function getSchoolInfo() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.school_id) {
        const { data } = await supabase
          .from('schools')
          .select('name')
          .eq('id', user.user_metadata.school_id)
          .single();
        if (data) setSchoolName(data.name);
      }
    }
    getSchoolInfo();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedLink('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const schoolId = user?.user_metadata?.school_id;

      if (!schoolId) throw new Error("No school linked to this account.");

      const { data, error } = await supabase
        .from('invites')
        .insert([{ 
          email: inviteEmail, 
          role: inviteRole, 
          school_id: schoolId 
        }])
        .select()
        .single();

      if (error) throw error;

      // Generates a link using your LIVE Vercel domain automatically
      const link = `${window.location.origin}/invite/${data.token}`;
      setGeneratedLink(link);
      setInviteEmail(''); // Clear input
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* --- Sidebar --- */}
      <aside className="w-full md:w-64 bg-indigo-950 text-white p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <Settings size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Admin Hub</h2>
        </div>
        
        <nav className="space-y-2 flex-1">
          <div className="flex items-center gap-3 p-3 bg-indigo-900 rounded-xl cursor-pointer">
            <LayoutDashboard size={18}/> <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-indigo-300 hover:bg-indigo-900 rounded-xl cursor-pointer transition">
            <Users size={18}/> <span>Staff & Students</span>
          </div>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 p-3 w-full text-red-400 hover:bg-red-950/30 rounded-xl transition"
        >
          <LogOut size={18}/> <span>Sign Out</span>
        </button>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{schoolName}</h1>
            <p className="text-slate-500">Global School Management System</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
            Status: <span className="text-green-600">● Live</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* STEP 3: Setup Checklist */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardList className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Registration Checklist</h2>
            </div>
            <div className="space-y-4">
              {[
                { task: 'Create School Profile', done: true },
                { task: 'Set Academic Term', done: false },
                { task: 'Invite Teachers', done: generatedLink !== '' },
                { task: 'Enroll First Student', done: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className={item.done ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}>
                    {item.task}
                  </span>
                  {item.done ? (
                    <div className="bg-green-100 p-1 rounded-full"><Check className="text-green-600" size={16} /></div>
                  ) : (
                    <div className="w-6 h-6 border-2 rounded-full border-slate-200"></div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* STEP 4: Global Invite System */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Add New User</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Enter an email to generate a secure joining link for staff or parents.</p>
            
            <form onSubmit={handleGenerateInvite} className="space-y-4">
              <input 
                type="email" 
                placeholder="email@institution.com"
                className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <select 
                className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
              </select>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Link...' : 'Generate Invite Link'}
              </button>
            </form>

            {/* Generated Link Result */}
            {generatedLink && (
              <div className="mt-8 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Share this link</p>
                <div className="flex items-center gap-2">
                  <input 
                    readOnly 
                    value={generatedLink} 
                    className="flex-1 text-sm p-3 bg-white border border-indigo-200 rounded-xl text-slate-600" 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      alert("Link copied to clipboard!");
                    }}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                  >
                    <LinkIcon size={18} />
                  </button>
                </div>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}