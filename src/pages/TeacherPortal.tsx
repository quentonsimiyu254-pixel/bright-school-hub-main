import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  BookOpen, 
  Award, 
  Users, 
  LogOut, 
  Bell, 
  Calendar,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function TeacherPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState('');
  const [schoolName, setSchoolName] = useState('');

  useEffect(() => {
    fetchTeacherData();
  }, []);

  async function fetchTeacherData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setTeacherName(user.user_metadata.full_name || 'Teacher');

    const schoolId = user.user_metadata.school_id;
    const { data: school } = await supabase
      .from('schools')
      .select('name')
      .eq('id', schoolId)
      .single();

    if (school) setSchoolName(school.name);
    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
            <BookOpen size={24} />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800">Edusphere</span>
        </div>

        <nav className="space-y-2 flex-1">
          <TeacherNavItem icon={<ClipboardCheck size={20}/>} label="Attendance" active />
          <TeacherNavItem icon={<Award size={20}/>} label="Grades & Exams" />
          <TeacherNavItem icon={<Users size={20}/>} label="My Students" />
          <TeacherNavItem icon={<Calendar size={20}/>} label="Timetable" />
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-10 flex items-center gap-3 p-4 w-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all font-bold"
        >
          <LogOut size={20}/> Exit Portal
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mwalimu {teacherName.split(' ')[0]}</h2>
            <p className="text-emerald-600 font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              {schoolName} Portal
            </p>
          </div>
          <div className="flex gap-3">
            <button className="relative p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: ACTIONS & SCHEDULE */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActionCard 
                title="Mark Attendance" 
                desc="Launch today's roll call" 
                icon={<ClipboardCheck size={28} className="text-emerald-600" />} 
                color="bg-emerald-50"
              />
              <ActionCard 
                title="Enter Grades" 
                desc="Record CATs and Exams" 
                icon={<Award size={28} className="text-blue-600" />} 
                color="bg-blue-50"
              />
            </div>

            {/* UPCOMING CLASSES */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-800 text-xl">Today's Schedule</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jan 5, 2026</span>
              </div>
              <div className="space-y-4">
                <ScheduleItem time="08:30 AM" subject="Mathematics" room="Form 3 East" active />
                <ScheduleItem time="10:45 AM" subject="Physics" room="Form 2 West" />
                <ScheduleItem time="02:00 PM" subject="Science Lab" room="Form 1 North" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TASKS & INSIGHTS */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-slate-400 font-bold text-sm uppercase mb-1">Students assigned</p>
                <h4 className="text-5xl font-black mb-6 tracking-tighter">42</h4>
                <div className="flex -space-x-3 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                      {i === 5 ? '+37' : ''}
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-sm font-bold transition-all">
                  View Class Directory
                </button>
              </div>
              <BookOpen className="absolute -right-10 -bottom-10 text-white/5" size={200} />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 text-xl mb-6">Reminders</h3>
              <div className="space-y-5">
                <TaskItem task="Verify Form 3 Grades" completed={true} />
                <TaskItem task="Attendance for 10:45 class" completed={false} />
                <TaskItem task="Submit Science Lab Report" completed={false} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* --- REUSABLE UI COMPONENTS --- */

function TeacherNavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
      active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:bg-slate-50 hover:text-emerald-600'
    }`}>
      {icon} <span className="font-bold">{label}</span>
    </div>
  );
}

function ActionCard({ title, desc, icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
      <div className={`${color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-black text-slate-800 text-xl mb-1">{title}</h3>
      <p className="text-slate-500 font-medium text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function ScheduleItem({ time, subject, room, active = false }: any) {
  return (
    <div className={`flex items-center justify-between p-5 rounded-3xl transition-all ${
      active ? 'bg-emerald-50 border-2 border-emerald-100' : 'bg-slate-50 border-2 border-transparent'
    }`}>
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-2xl ${active ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
          <Clock size={20} />
        </div>
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">{time}</p>
          <p className="font-black text-slate-800 text-lg">{subject}</p>
          <p className="text-sm font-bold text-emerald-600">{room}</p>
        </div>
      </div>
      <ChevronRight size={20} className={active ? 'text-emerald-600' : 'text-slate-300'} />
    </div>
  );
}

function TaskItem({ task, completed }: any) {
  return (
    <div className="flex items-center gap-4 p-1">
      <div className={`transition-all ${completed ? 'text-emerald-500' : 'text-slate-200'}`}>
        {completed ? <CheckCircle size={24} fill="currentColor" className="text-emerald-500 fill-emerald-100" /> : <div className="w-6 h-6 border-2 border-slate-200 rounded-full" />}
      </div>
      <span className={`font-bold transition-all ${completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
        {task}
      </span>
    </div>
  );
}