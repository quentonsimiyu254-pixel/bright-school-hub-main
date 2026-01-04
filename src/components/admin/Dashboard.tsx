import React, { useState } from "react";
import { FinanceManager } from "./FinanceManager";
import { ManualPaymentForm } from "./ManualPaymentForm";
import { ExamManager } from "../../services/ExamManager";
import { 
  LayoutDashboard, 
  Wallet, 
  PlusCircle, 
  GraduationCap, 
  LogOut,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("ledger");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const menuItems = [
    { id: "ledger", label: "Finance Ledger", icon: <Wallet size={20} /> },
    { id: "payment", label: "Record Payment", icon: <PlusCircle size={20} /> },
    { id: "exams", label: "Exam Records", icon: <GraduationCap size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#020408] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">B</div>
          <span className="font-bold text-xl tracking-tight">BrightHub</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-all text-sm">
            <Settings size={20} /> Settings
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-sm"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeView === "ledger" && <FinanceManager />}
          {activeView === "payment" && <ManualPaymentForm />}
          {activeView === "exams" && <ExamManager />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;