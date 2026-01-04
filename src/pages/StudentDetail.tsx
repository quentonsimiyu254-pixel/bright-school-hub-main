import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, BrainCircuit, Activity, Wallet, 
  TrendingDown, ShieldAlert, Calendar, CheckCircle2 
} from "lucide-react";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for AI analysis - in a real app, this comes from Supabase
  const studentStats = {
    attendance: 84,
    feeBalance: 12500,
    riskLevel: "Amber",
    aiPrediction: "15% drop in performance predicted due to irregular attendance in week 4."
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white p-4 md:p-8 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 transition-all font-black text-[10px] tracking-widest uppercase"
        >
          <ArrowLeft size={16} /> Back to Directory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BrainCircuit size={120} />
              </div>
              
              <h1 className="text-5xl font-black italic tracking-tighter mb-4 uppercase">
                Academic Profile
              </h1>
              <p className="text-gray-500 font-mono text-xs tracking-[0.3em] mb-12 uppercase">
                Node ID: {id?.slice(0, 8)}...
              </p>

              {/* AI Insight Module */}
              <div className="p-8 bg-blue-600/10 border border-blue-600/20 rounded-[2rem] relative group">
                <div className="absolute -top-3 left-8 bg-blue-600 text-[10px] font-black px-4 py-1 rounded-full tracking-widest uppercase">
                  AI Analysis
                </div>
                <h3 className="flex items-center gap-2 font-black text-blue-400 mb-3 text-sm italic uppercase tracking-wider">
                  <BrainCircuit size={18} /> Predictive Insight
                </h3>
                <p className="text-lg text-blue-100/80 font-medium leading-relaxed italic">
                  "{studentStats.aiPrediction}"
                </p>
              </div>
            </div>

            {/* Attendance Heatmap Placeholder */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem]">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Calendar size={14} /> Attendance Trends (30 Days)
              </h3>
              <div className="flex gap-2 h-12">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full ${i === 14 || i === 15 ? 'bg-red-500/40' : 'bg-blue-500/20'}`} 
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-600 mt-4 font-bold uppercase tracking-widest">
                Red indicates AI-detected absenteeism patterns
              </p>
            </div>
          </div>

          {/* Sidebar Intelligence */}
          <div className="space-y-6">
            
            {/* Risk Gauge */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] text-center">
              <ShieldAlert className="mx-auto mb-4 text-amber-500" size={32} />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Dropout Risk</p>
              <p className="text-3xl font-black text-amber-500 uppercase italic tracking-tighter">Amber</p>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-6">
                <div className="bg-amber-500 h-full w-[65%] rounded-full shadow-[0_0_10px_#f59e0b]" />
              </div>
            </div>

            {/* Finance Module */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem]">
              <Wallet className="text-blue-500 mb-6" size={24} />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Fee Balance</p>
              <p className="text-3xl font-black italic tracking-tighter">KES {studentStats.feeBalance.toLocaleString()}</p>
              <button className="w-full mt-6 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all">
                Generate Payment Link
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-600 p-8 rounded-[3rem] shadow-xl shadow-blue-600/20">
              <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-4">Admin Controls</p>
              <div className="space-y-3">
                <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all">
                  <CheckCircle2 size={14} /> Approve Exams
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all">
                  <TrendingDown size={14} /> Intervention Log
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}