import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserCheck, BookOpen, AlertCircle, TrendingUp, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const TeacherMonitor = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffStats();
  }, []);

  const fetchStaffStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('teacher_performance_stats')
      .select('*');
    
    if (error) {
      toast.error("Failed to load staff metrics");
    } else {
      setStaff(data || []);
    }
    setLoading(false);
  };

  const sendReminder = (name: string) => {
    toast.success(`Reminder sent to ${name}`, {
      description: "A system notification has been dispatched to their portal."
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-mono text-xs uppercase tracking-widest">Auditing Staff Performance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-xl font-black text-white italic">Staff Performance Index</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Instructional Quality & Administrative Compliance</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
          <TrendingUp className="text-green-500" size={16} />
          <span className="text-xs font-bold text-white">94% Global Compliance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((teacher, index) => {
          // Calculate grading percentage based on an arbitrary goal (e.g., 100 marks per class)
          const gradingGoal = teacher.assigned_classes * 50; 
          const gradingProgress = Math.min(Math.round((teacher.marks_entered_count / (gradingGoal || 1)) * 100), 100);

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={teacher.teacher_id} 
              className="bg-white/5 border border-white/10 p-7 rounded-[2.5rem] hover:bg-white/[0.08] transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20">
                  {teacher.full_name[0]}
                </div>
                <div className={`flex flex-col items-end`}>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    teacher.attendance_rate < 90 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {Math.round(teacher.attendance_rate)}% Attendance
                  </span>
                  {teacher.attendance_rate < 85 && (
                    <span className="text-[9px] text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle size={10} /> Critical Absence
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-white font-black text-lg tracking-tight">{teacher.full_name}</h4>
              <p className="text-xs text-slate-500 font-medium mb-8">
                Manager of <span className="text-indigo-400">{teacher.assigned_classes}</span> Academic Units
              </p>

              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-slate-500" />
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Grading Progress</span>
                  </div>
                  <span className="text-xs text-white font-mono font-bold">{gradingProgress}%</span>
                </div>
                
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${gradingProgress}%` }}
                    className={`h-full transition-all duration-1000 ${
                      gradingProgress < 50 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                  />
                </div>
                
                <p className="text-[10px] text-slate-500 italic">
                  {teacher.marks_entered_count} individual entries verified this term.
                </p>
              </div>

              <button 
                onClick={() => sendReminder(teacher.full_name)}
                className="w-full mt-8 py-4 bg-white/5 hover:bg-white text-slate-400 hover:text-black border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
              >
                <Mail size={14} className="group-hover:scale-110 transition-transform" />
                Push Notification
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};