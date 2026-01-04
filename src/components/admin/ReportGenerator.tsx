import React, { useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { Search, FileText, Printer, Loader2, Award } from "lucide-react";
import { toast } from "sonner";

export const ReportGenerator = () => {
  const [studentId, setStudentId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!studentId) return toast.error("Please enter an Admission Number");
    
    setLoading(true);
    const { data: res, error } = await supabase
      .from('student_report_summaries')
      .select('*')
      .eq('admission_number', studentId.toUpperCase())
      .maybeSingle();
    
    if (error || !res) {
      toast.error("Student not found. Try BSH-001");
      setData(null);
    } else {
      setData(res);
      toast.success("Report Generated!");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <h2 className="text-xl font-black mb-2">Report Retrieval</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Enter Admission Number to generate PDF</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <input 
            className="bg-[#0f1115] border border-white/10 p-4 rounded-2xl flex-1 md:w-64 text-white focus:border-blue-500 outline-none transition-all" 
            placeholder="e.g. BSH-001" 
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <button 
            onClick={handleSearch} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-8 rounded-2xl font-black text-white transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
          </button>
        </div>
      </div>

      {/* Result Display */}
      {data && (
        <div className="bg-white text-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {/* Decorative Background */}
          <Award className="absolute right-[-20px] top-[-20px] size-64 text-slate-100 -rotate-12" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
               <div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Academic Transcript</h2>
                 <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mt-1">Bright School Intelligent OS</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Term Period</p>
                 <p className="font-bold">{data.term}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Student Name</p>
                <p className="text-xl font-bold">{data.full_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Class Assignment</p>
                <p className="text-xl font-bold">{data.class_name}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Final Mean Grade</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-blue-600">{data.grade}</span>
                  <span className="text-xl font-bold text-slate-400">({data.percentage}%)</span>
                </div>
              </div>
              <button 
                onClick={() => window.print()} 
                className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-bold transition-all"
              >
                <Printer size={18} /> Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};