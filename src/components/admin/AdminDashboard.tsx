import { useState, useEffect } from 'react';
// Fixed path: go up two levels to reach src/lib
import { supabase } from '../../lib/supabase'; 
import { useNavigate } from 'react-router-dom';
import { 
  Users, School, UserPlus, LogOut, 
  Settings, CheckCircle, Copy, 
  LayoutDashboard, BookOpen, GraduationCap 
} from 'lucide-react';
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [schoolName, setSchoolName] = useState('Loading...');
  const [adminName, setAdminName] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [stats, setStats] = useState({ teachers: 0, students: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setAdminName(user.user_metadata.full_name || 'Administrator');

    // Fetch School Name using the school_id from metadata
    const schoolId = user.user_metadata.school_id;
    const { data: school } = await supabase
      .from('schools')
      .select('name')
      .eq('id', schoolId)
      .single();

    if (school) setSchoolName(school.name);
    
    // Generate the "Magic Link" for Teachers
    // This uses the current domain + join path + school ID
    setInviteLink(`${window.location.origin}/join/${schoolId}`);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Copied! Now paste this link to your teachers on WhatsApp.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-72 bg-slate-900 text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Edusphere</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active />
          <NavItem icon={<Users size={20}/>} label="Teachers" />
          <NavItem icon={<BookOpen size={20}/>} label="Classes" />
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 p-4 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all"
        >
          <LogOut size={20}/> <span className="font-semibold">Sign Out</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{schoolName}</h2>
            <p className="text-slate-500 mt-1 font-medium text-lg text-indigo-600">Welcome back, {adminName}</p>
          </div>
          <div className="flex gap-3">
             <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               System Live
             </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* STATS CARDS */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard icon={<Users className="text-blue-600"/>} label="Total Staff" value="0" />
            <StatCard icon={<GraduationCap className="text-purple-600"/>} label="Total Students" value="0" />
            
            {/* SETUP CHECKLIST */}
            <div className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CheckCircle className="text-indigo-600" /> Getting Started
              </h3>
              <div className="space-y-4">
                <CheckItem label="School Registered" done />
                <CheckItem label="Add First Teacher" done={false} />
                <CheckItem label="Create Academic Term" done={false} />
              </div>
            </div>
          </div>

          {/* TEACHER INVITE SECTION */}
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200">
            <div className="bg-indigo-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <UserPlus size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Invite Teachers</h3>
            <p className="text-indigo-100 mb-8 leading-relaxed">
              Copy this link and send it to your staff. They can join your school instantly.
            </p>
            
            <div className="bg-indigo-700/50 p-4 rounded-2xl border border-indigo-400/30 mb-6 break-all text-sm font-mono">
              {inviteLink}
            </div>

            <button 
              onClick={copyInvite}
              className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-transform active:scale-95"
            >
              <Copy size={20} /> Copy Magic Link
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- REUSABLE COMPONENTS FOR CLEANER CODE --- */

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-800'
    }`}>
      {icon} <span className="font-semibold">{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
      <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-slate-500 font-medium">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function CheckItem({ label, done }: { label: string, done: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
      <span className={`font-semibold ${done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{label}</span>
      {done ? <CheckCircle size={20} className="text-green-500" /> : <div className="w-5 h-5 border-2 border-slate-200 rounded-full"></div>}
    </div>
  );
}