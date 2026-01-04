import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserPlus, ClipboardList, Users, Settings, Link as LinkIcon, Check } from 'lucide-react';

export default function AdminDashboard() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('teacher');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const schoolId = user?.user_metadata?.school_id;

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

      const link = `${window.location.origin}/invite/${data.token}`;
      setGeneratedLink(link);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white p-6 hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold italic text-white">BrightHub Admin</h2>
        </div>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 p-2 bg-indigo-800 rounded-lg cursor-pointer">
            <Settings size={20}/> 
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-3 p-2 hover:bg-indigo-800 rounded-lg cursor-pointer text-indigo-200">
            <Users size={20}/> 
            <span>Management</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">School Setup Control</h1>
          <p className="text-gray-500">Welcome to your institution's command center.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Setup Checklist */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
              <ClipboardList className="text-blue-600" size={20} /> 
              Setup Checklist
            </h2>
            <div className="space-y-4">
              {[
                { task: 'Register School Profile', done: true },
                { task: 'Invite Teachers', done: false },
                { task: 'Add Classes & Subjects', done: false },
                { task: 'Invite Parents/Students', done: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className={item.done ? 'text-gray-400 line-through' : 'text-gray-700'}>{item.task}</span>
                  {item.done ? <Check className="text-green-500" size={18} /> : <div className="w-5 h-5 border-2 rounded-full border-gray-300"></div>}
                </div>
              ))}
            </div>
          </section>

          {/* Invite System UI */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
              <UserPlus className="text-indigo-600" size={20} /> 
              Invite Staff & Users
            </h2>
            <form onSubmit={handleGenerateInvite} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  placeholder="user@example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating Link...' : 'Generate Invite Link'}
              </button>
            </form>

            {/* Generated Link Display */}
            {generatedLink && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium mb-2">Invite link ready to share:</p>
                <div className="flex items-center gap-2">
                  <input 
                    readOnly 
                    value={generatedLink} 
                    className="flex-1 text-xs p-2 bg-white border border-gray-200 rounded text-gray-600" 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      alert("Copied to clipboard!");
                    }}
                    className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    <LinkIcon size={16} className="text-gray-600" />
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