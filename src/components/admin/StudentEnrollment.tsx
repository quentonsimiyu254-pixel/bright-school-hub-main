import React, { useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { UserPlus, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Define exactly what our form looks like to satisfy TypeScript
interface StudentForm {
  admission_number: string;
  full_name: string;
  class_name: string;
  percentage: string;
  grade: string;
  term: string;
}

export const StudentEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StudentForm>({
    admission_number: "",
    full_name: "",
    class_name: "",
    percentage: "",
    grade: "",
    term: "Term 1 2026"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Convert percentage to a number for the database
    const payload = {
      ...formData,
      percentage: parseFloat(formData.percentage),
      admission_number: formData.admission_number.toUpperCase().trim()
    };

    const { error } = await supabase
      .from('student_report_summaries')
      .insert([payload]);

    if (error) {
      if (error.code === "23505") {
        toast.error("Admission Number already exists!");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Student Enrolled Successfully!");
      // Reset form
      setFormData({ 
        admission_number: "", 
        full_name: "", 
        class_name: "", 
        percentage: "", 
        grade: "", 
        term: "Term 1 2026" 
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
            <UserPlus className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Enroll New Student</h2>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Digital Academic Registry</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Admission Number</label>
              <input 
                className="w-full bg-[#0f1115] border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                placeholder="BSH-002"
                required
                value={formData.admission_number}
                onChange={(e) => setFormData({...formData, admission_number: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Full Name</label>
              <input 
                className="w-full bg-[#0f1115] border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                placeholder="Jane Doe"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Class / Grade</label>
              <input 
                className="w-full bg-[#0f1115] border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                placeholder="Grade 10 Blue"
                required
                value={formData.class_name}
                onChange={(e) => setFormData({...formData, class_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Term</label>
              <input 
                className="w-full bg-[#0f1115] border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all font-mono"
                value={formData.term}
                onChange={(e) => setFormData({...formData, term: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Percentage Score (%)</label>
              <input 
                type="number"
                step="0.1"
                className="w-full bg-[#0f1115] border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
                placeholder="85.5"
                required
                value={formData.percentage}
                onChange={(e) => setFormData({...formData, percentage: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-widest">Assigned Grade</label>
              <input 
                className="w-full bg-[#0f1115] border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all font-bold text-blue-500"
                placeholder="A"
                required
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 shadow-xl shadow-blue-600/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18}/> Commit to Registry</>}
          </button>
        </form>
      </div>
    </div>
  );
};