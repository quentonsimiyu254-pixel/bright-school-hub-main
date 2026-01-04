import React, { useState, useEffect } from "react";
import { supabase } from "../../integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Component Imports
import { DashboardOverview } from "./DashboardOverview";
import { ReportGenerator } from "./ReportGenerator";
import { StudentEnrollment } from "./StudentEnrollment";
import { StudentList } from "./StudentList";
import { FeeManager } from "./FeeManager";
import { StaffManagement } from "./StaffManagement";
import { SystemLogs } from "./SystemLogs";

// Icons
import { 
  LayoutDashboard, 
  FileText, 
  UserPlus, 
  Users,
  Wallet,
  Briefcase,
  History,
  LogOut, 
  RefreshCw, 
  Loader2,
  ChevronRight,
  ShieldCheck,
  Bell
} from "lucide-react";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("overview");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sync Global Metrics
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('edusphere_health_metrics')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setMetrics(data);
    } catch (error: any) {
      console.error("Fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Securely logged out");
      navigate("/auth");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020408] text-white font-sans selection:bg-blue-500/30">
      
      {/* --- SIDEBAR (Fixed) --- */}
      <aside className="w-72 border-r border-white/5 bg-[#05070a] p-8 flex flex-col fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-600/40">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black italic tracking-tighter leading-none">BRIGHT HUB</h1>
            <span className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase">Intelligence OS</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={view === "overview"} onClick={() => setView("overview")} />
          
          <div className="pt-4 pb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Academics</div>
          <SidebarItem icon={<FileText size={20}/>} label="Report Cards" active={view === "reports"} onClick={() => setView("reports")} />
          <SidebarItem icon={<UserPlus size={20}/>} label="Enrollment" active={view === "enrollment"} onClick={() => setView("enrollment")} />
          <SidebarItem icon={<Users size={20}/>} label="Student List" active={view === "list"} onClick={() => setView("list")} />
          
          <div className="pt-4 pb-2 text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Operations</div>
          <SidebarItem icon={<Wallet size={20}/>} label="Fee Finance" active={view === "finance"} onClick={() => setView("finance")} />
          <SidebarItem icon={<Briefcase size={20}/>} label="Staff Team" active={view === "staff"} onClick={() => setView("staff")} />
          <SidebarItem icon={<History size={20}/>} label="System Logs" active={view === "logs"} onClick={() => setView("logs")} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
          <button onClick={fetchMetrics} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-blue-400 transition-all w-full px-4 uppercase tracking-widest">
            <RefreshCw size={12} className={loading ? "animate-spin text-blue-500" : ""} />
            Sync Realtime
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm">
            <LogOut size={18} />
            Exit System
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT (Offset by Sidebar Width) --- */}
      <main className="ml-72 flex-1 min-h-screen relative">
        {/* Transparent Header */}
        <header className="sticky top-0 z-40 bg-[#020408]/80 backdrop-blur-md p-10 pb-6 flex justify-between items-center border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Terminal / {view.replace('-', ' ')}
            </div>
            <h2 className="text-3xl font-black capitalize tracking-tight">
              {view === "overview" ? "Command Center" : view.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
             <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020408]" />
             </button>
             <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-2xl border border-white/10">
                <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black shadow-lg shadow-blue-600/20">
                  QP
                </div>
                <div>
                  <p className="text-xs font-black">Quenton Prince</p>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Master Admin</p>
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic View Section */}
        <section className="p-10 max-w-7xl mx-auto">
          {loading && view === "overview" ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="size-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <ShieldCheck size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
              </div>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.5em] animate-pulse text-center">
                Syncing Secure <br/> Data Nodes
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {view === "overview" && <DashboardOverview metrics={metrics} />}
              {view === "reports" && <ReportGenerator />}
              {view === "enrollment" && <StudentEnrollment />}
              {view === "list" && <StudentList />}
              {view === "finance" && <FeeManager />}
              {view === "staff" && <StaffManagement />}
              {view === "logs" && <SystemLogs />}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

/* --- Internal Sidebar Item Component --- */
const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group ${
      active 
      ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30" 
      : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
    }`}
  >
    <div className="flex items-center gap-3.5 font-bold text-sm tracking-tight">
      <span className={active ? "text-white" : "text-slate-500 group-hover:text-blue-400 transition-colors"}>
        {icon}
      </span>
      <span>{label}</span>
    </div>
    {active && <ChevronRight size={14} className="text-blue-200" />}
  </button>
);