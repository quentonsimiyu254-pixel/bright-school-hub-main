import React, { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { ReportGenerator } from "../components/admin/ReportGenerator";
import { 
  User, 
  BookOpen, 
  Calendar, 
  Bell, 
  CreditCard,
  LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ParentDashboard = () => {
  const navigate = useNavigate();
  const [parentData, setParentData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("report");

  useEffect(() => {
    const fetchParentProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch parent details and linked student
        const { data } = await supabase
          .from('parent_profiles')
          .select('*, students(*)')
          .eq('id', user.id)
          .single();
        setParentData(data);
      }
    };
    fetchParentProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-blue-600">Bright Parent Port</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavBtn 
            active={activeTab === "report"} 
            onClick={() => setActiveTab("report")}
            icon={<BookOpen size={18} />} 
            label="Academic Report" 
          />
          <NavBtn 
            active={activeTab === "finance"} 
            onClick={() => setActiveTab("finance")}
            icon={<CreditCard size={18} />} 
            label="Fee Statement" 
          />
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 font-semibold p-3 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome, {parentData?.full_name || 'Parent'}</h2>
            <p className="text-slate-500 text-sm">Viewing portal for: <span className="font-bold text-blue-600">{parentData?.students?.full_name}</span></p>
          </div>
          <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100">
            <User className="text-slate-400" />
          </div>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {activeTab === "report" && (
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-slate-700">Termly Performance</h3>
              {/* We reuse the ReportGenerator component here */}
              <ReportGenerator />
            </div>
          )}

          {activeTab === "finance" && (
            <div className="p-10 text-center">
              <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">Fee Statement</h3>
              <p className="text-slate-500">Billing details for the 2026 session will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
      active ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"
    }`}
  >
    {icon} {label}
  </button>
);