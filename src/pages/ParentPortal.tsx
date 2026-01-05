import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Users, 
  Phone, 
  MapPin, 
  ChevronRight, 
  GraduationCap, 
  LogOut, 
  CreditCard,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ParentPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    fetchParentData();
  }, []);

  async function fetchParentData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/login');
      return;
    }

    // 1. Fetch Parent Profile using Phone from Auth
    const { data: parentData } = await supabase
      .from('parents')
      .select('*')
      .eq('phone_number', user.phone)
      .single();

    if (parentData) {
      setParent(parentData);

      // 2. Fetch Linked Students + Their School Info + Fee Summaries
      const { data: students } = await supabase
        .from('students')
        .select(`
          *,
          schools(name),
          fee_invoices(amount_due),
          fee_payments(amount_paid)
        `)
        .eq('parent_id', parentData.id);

      setChildren(students || []);
    }
    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Helper to calculate balance per child
  const getBalance = (child: any) => {
    const billed = child.fee_invoices?.reduce((sum: number, i: any) => sum + Number(i.amount_due), 0) || 0;
    const paid = child.fee_payments?.reduce((sum: number, i: any) => sum + Number(i.amount_paid), 0) || 0;
    return billed - paid;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* --- TOP HEADER --- */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Users size={18} />
          </div>
          <span className="font-black text-lg tracking-tight">Edusphere</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <LogOut size={20} />
        </button>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        
        {/* --- PARENT PROFILE CARD --- */}
        <header className="relative bg-indigo-900 rounded-[2.5rem] p-8 text-white overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="relative z-10">
            <p className="text-indigo-300 font-bold text-xs uppercase tracking-[0.2em] mb-2">Guardian Profile</p>
            <h1 className="text-3xl font-black mb-6">{parent?.full_name}</h1>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md text-sm font-medium">
                <Phone size={14} className="text-indigo-300" /> {parent?.phone_number}
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md text-sm font-medium">
                <MapPin size={14} className="text-indigo-300" /> {parent?.address || 'Kenya'}
              </div>
            </div>
          </div>
          <User className="absolute -right-10 -bottom-10 text-white/5" size={200} />
        </header>

        {/* --- CHILDREN LIST SECTION --- */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-black text-slate-800">My Children</h3>
            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-black">
              {children.length} Enrolled
            </span>
          </div>

          {children.length > 0 ? (
            children.map((child) => {
              const balance = getBalance(child);
              return (
                <div key={child.id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-4 rounded-3xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <GraduationCap size={28} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">{child.full_name}</h4>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{child.schools?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Admission</p>
                      <p className="font-black text-slate-900">{child.admission_number}</p>
                    </div>
                  </div>

                  {/* MINI DASHBOARD FOR CHILD */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Fee Balance</p>
                      <p className={`font-black ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        KES {balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Attendance</p>
                      <p className="font-black text-slate-900">94%</p>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-slate-50 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2">
                    View Full Statement <ChevronRight size={16} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <AlertCircle size={32} />
              </div>
              <p className="text-slate-500 font-bold">No students linked to this phone number.</p>
              <p className="text-slate-400 text-sm mt-1">Please contact the school admin to link your profile.</p>
            </div>
          )}
        </section>

        {/* --- NOTIFICATIONS / ANNOUNCEMENTS --- */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-amber-500" /> School Updates
          </h3>
          <div className="space-y-4">
            <AnnouncementItem 
              title="End of Term Meeting" 
              date="15th Jan" 
              desc="Parents-Teachers association meeting in the main hall."
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function AnnouncementItem({ title, date, desc }: any) {
  return (
    <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="bg-white min-w-[50px] h-[50px] rounded-xl flex flex-col items-center justify-center shadow-sm">
        <span className="text-[10px] font-black text-indigo-600 uppercase leading-none">Jan</span>
        <span className="text-lg font-black text-slate-800 leading-none">15</span>
      </div>
      <div>
        <p className="font-black text-slate-800 text-sm">{title}</p>
        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}