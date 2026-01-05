import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Receipt, 
  LayoutDashboard, 
  LogOut, 
  Star, 
  Phone,
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function StudentHub() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  async function fetchStudentData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/login');

    const admNo = user.user_metadata.admission_number;
    
    // Fetch student data AND link the parent information in one query
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        schools(name),
        parents(full_name, phone_number)
      `)
      .eq('admission_number', admNo)
      .single();

    if (error) {
      console.error("Error fetching student:", error);
    } else {
      setStudent(data);
    }
    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-indigo-700">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-indigo-700 p-4 md:p-8 pb-20">
      <div className="max-w-2xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-start text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none">{student?.full_name}</h1>
              <p className="text-indigo-200 font-bold text-xs uppercase tracking-widest mt-1">
                {student?.admission_number} • {student?.schools?.name}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-3 bg-white/10 hover:bg-rose-500 rounded-2xl transition-all border border-white/5"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-indigo-900/20">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Current Class</p>
            <p className="text-2xl font-black text-indigo-900">Form 3 East</p>
          </div>
          <div className="bg-amber-400 p-6 rounded-[2rem] shadow-xl shadow-amber-900/20">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/60 mb-1">Mean Grade</p>
            <p className="text-2xl font-black text-indigo-900">B+</p>
          </div>
        </div>

        {/* MAIN NAVIGATION GRID */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <MenuButton 
            icon={<BookOpen size={24} />} 
            title="Academic Results" 
            desc="View Term 3 Report Card" 
            badge="New"
          />
          <MenuButton 
            icon={<Receipt size={24} />} 
            title="Fee Statement" 
            desc="Current Balance: KES 4,500" 
          />
          <MenuButton 
            icon={<LayoutDashboard size={24} />} 
            title="Assignments" 
            desc="3 Pending tasks for this week" 
          />
        </div>

        {/* PARENT / EMERGENCY CONTACT (As requested) */}
        <div className="bg-indigo-800/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-indigo-300" />
            <h3 className="text-indigo-200 font-black text-[10px] uppercase tracking-widest">Linked Guardian</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-black text-lg">{student?.parents?.full_name || 'No Parent Linked'}</p>
              <p className="text-indigo-300 font-bold text-sm">{student?.parents?.phone_number || '---'}</p>
            </div>
            {student?.parents?.phone_number && (
              <a 
                href={`tel:${student?.parents?.phone_number}`} 
                className="p-4 bg-indigo-500 hover:bg-white hover:text-indigo-600 text-white rounded-2xl transition-all shadow-lg"
              >
                <Phone size={20} />
              </a>
            )}
          </div>
        </div>

        {/* FOOTER MOTIVATION */}
        <p className="text-center mt-10 text-indigo-300/50 font-bold text-xs uppercase tracking-[0.2em]">
          Powered by Edusphere Global
        </p>

      </div>
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */

function MenuButton({ icon, title, desc, badge }: any) {
  return (
    <button className="bg-white p-6 rounded-[2.2rem] flex items-center justify-between w-full text-left hover:scale-[1.02] active:scale-95 transition-all shadow-md group">
      <div className="flex items-center gap-5">
        <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-800 text-lg leading-none">{title}</h3>
            {badge && (
              <span className="bg-rose-100 text-rose-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                {badge}
              </span>
            )}
          </div>
          <p className="text-slate-400 font-medium text-xs mt-1">{desc}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-all" />
    </button>
  );
}