import React, { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { Users, Trash2, Edit, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

export const StudentList = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_report_summaries')
      .select('*')
      .order('full_name', { ascending: true });

    if (!error) setStudents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to remove this student?")) return;
    
    const { error } = await supabase
      .from('student_report_summaries')
      .delete()
      .eq('id', id);

    if (!error) {
      toast.success("Student removed from registry");
      fetchStudents();
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Search & Stats Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-xl">
            <Users className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-white">Student Registry</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{students.length} Total Enrolled</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            className="w-full bg-black/40 border border-white/10 p-3 pl-12 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* The Table */}
      <div className="bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <th className="p-6">Admission No.</th>
                <th className="p-6">Full Name</th>
                <th className="p-6">Class</th>
                <th className="p-6 text-center">Mean Grade</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6 font-mono text-indigo-400 font-bold">{student.admission_number}</td>
                  <td className="p-6 font-bold text-slate-200">{student.full_name}</td>
                  <td className="p-6 text-slate-400">{student.class_name}</td>
                  <td className="p-6 text-center">
                    <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-black border border-indigo-500/20">
                      {student.grade} ({student.percentage}%)
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => deleteStudent(student.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};