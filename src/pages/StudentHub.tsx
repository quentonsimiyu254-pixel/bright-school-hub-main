import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Receipt, LayoutDashboard, LogOut, Star } from 'lucide-react';

export default function StudentHub() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  async function fetchStudentData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/login');

    const admNo = user.user_metadata.admission_number;
    const { data } = await supabase
      .from('students')
      .select('*, schools(name)')
      .eq('admission_number', admNo)
      .single();

    setStudent(data);
  }

  return (
    <div className="min-h-screen bg-indigo-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center text-white mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{student?.full_name || 'Student'}</h1>
              <p className="text-indigo-200 font-bold text-sm uppercase tracking-widest">
                {student?.admission_number} • {student?.schools?.name}
              </p>
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => navigate('/login'))} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <LogOut size={20} />
          </button>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Class" value="Form 3B" color="bg-white" textColor="text-indigo-600" />
          <StatCard label="Rank" value="#12" color="bg-indigo-500" textColor="text-white" />
          <StatCard label="Attendance" value="98%" color="bg-indigo-500" textColor="text-white" />
          <StatCard label="Mean Grade" value="A-" color="bg-amber-400" textColor="text-indigo-900" />
        </div>

        {/* MAIN MENU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenuButton 
            icon={<BookOpen size={32} />} 
            title="Academic Results" 
            desc="Check your CATs and Termly reports" 
          />
          <MenuButton 
            icon={<Receipt size={32} />} 
            title="Fee Statement" 
            desc="View balance and payment history" 
          />
          <MenuButton 
            icon={<LayoutDashboard size={32} />} 
            title="Assignments" 
            desc="Download homework and notes" 
          />
          <MenuButton 
            icon={<Star size={32} />} 
            title="Co-Curricular" 
            desc="Sports, Clubs and Certificates" 
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, textColor }: any) {
  return (
    <div className={`${color} p-6 rounded-[2rem] shadow-xl shadow-indigo-700/20`}>
      <p className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${textColor}`}>{label}</p>
      <p className={`text-2xl font-black ${textColor}`}>{value}</p>
    </div>
  );
}

function MenuButton({ icon, title, desc }: any) {
  return (
    <button className="bg-white p-8 rounded-[2.5rem] flex items-center gap-6 text-left hover:scale-[1.02] transition-all group border-b-4 border-slate-200">
      <div className="bg-indigo-50 p-4 rounded-3xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-800">{title}</h3>
        <p className="text-slate-400 font-medium text-sm">{desc}</p>
      </div>
    </button>
  );
}