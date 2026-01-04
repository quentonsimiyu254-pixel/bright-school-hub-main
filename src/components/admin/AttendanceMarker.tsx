import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Search, 
  Save, 
  Calendar as CalendarIcon,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export const AttendanceMarker = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, admission_number")
      .eq("role", "student")
      .order("full_name", { ascending: true });

    if (data) {
      setStudents(data);
      // Initialize everyone as 'present' by default (Admin Speed)
      const initial: Record<string, string> = {};
      data.forEach(s => initial[s.id] = 'present');
      setAttendanceData(initial);
    }
    setLoading(false);
  };

  const toggleStatus = (studentId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    const records = Object.entries(attendanceData).map(([studentId, status]) => ({
      student_id: studentId,
      date: today,
      status: status
    }));

    const { error } = await supabase
      .from("attendance")
      .upsert(records, { onConflict: 'student_id, date' });

    if (!error) {
      toast.success("Attendance Synchronized", {
        description: `Pulse check completed for ${records.length} students.`
      });
    } else {
      toast.error("Sync Failed", { description: error.message });
    }
    setSaving(false);
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <CalendarIcon size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">{today}</span>
          </div>
          <h2 className="text-3xl font-black text-white italic">Daily Pulse Check</h2>
          <p className="text-slate-500 text-sm mt-1">Marking attendance updates the Global Health Score instantly.</p>
        </div>
        
        <button 
          onClick={saveAttendance}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Sync Attendance
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Quick find student..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* STUDENT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500 font-mono animate-pulse">Initializing Register...</div>
        ) : filteredStudents.map((student) => (
          <motion.div 
            layout
            key={student.id}
            onClick={() => toggleStatus(student.id)}
            className={`cursor-pointer p-5 rounded-3xl border transition-all flex items-center justify-between group ${
              attendanceData[student.id] === 'present' 
              ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40' 
              : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                attendanceData[student.id] === 'present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {student.full_name[0]}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm leading-tight">{student.full_name}</h4>
                <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">{student.admission_number}</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {attendanceData[student.id] === 'present' ? (
                <CheckCircle2 className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              <span className={`text-[8px] font-black uppercase mt-1 ${
                attendanceData[student.id] === 'present' ? 'text-green-500' : 'text-red-500'
              }`}>
                {attendanceData[student.id]}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};