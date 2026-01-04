import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../integrations/supabase/client";
import { 
  Users, 
  Database, 
  AlertTriangle, 
  Loader2, 
  Plus, 
  ArrowRight, 
  X,
  UserPlus,
  Trash2,
  TrendingUp,
  Wallet,
  Zap
} from 'lucide-react';

export default function StudentPage() {
  const navigate = useNavigate();
  
  // --- Core States ---
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  // --- UI & Form States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newStudent, setNewStudent] = useState({ 
    full_name: '', 
    admission_number: '', 
    current_grade: '' 
  });

  // --- Data Fetching Logic ---
  const initPage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        setDbStatus('offline');
      } else {
        setDbStatus('online');
        setStudents(data || []);
      }
    } catch (err) {
      setDbStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initPage();
  }, []);

  // --- Action Handlers ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('students').insert([newStudent]);
      if (error) throw error;
      setIsModalOpen(false);
      setNewStudent({ full_name: '', admission_number: '', current_grade: '' });
      initPage();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Permanently remove ${name} from Edusphere?`)) {
      await supabase.from('students').delete().eq('id', id);
      setStudents(students.filter(s => s.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="font-mono text-[10px] text-blue-500 tracking-[0.4em] uppercase">Booting Edusphere Core...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] text-white p-4 md:p-8 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 1: AI INTELLIGENCE DASHBOARD (ADMIN VIEW) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={40} />
            </div>
            <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-1">Health Score</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-blue-500">88%</span>
              <span className="text-[10px] text-green-500 font-bold mb-1.5 uppercase tracking-tighter">Optimized</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
            <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-1">Revenue Forecast</p>
            <p className="text-2xl font-bold font-mono text-amber-500 italic">KES 1.2M</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] border-l-red-500 border-l-4">
            <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-1 text-red-400">Risk Alerts</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              04 <span className="text-[10px] text-gray-400 font-medium tracking-normal">Active Nodes</span>
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Node: {dbStatus === 'online' ? 'Active' : 'Offline'}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-mono">Region: East-Africa-Core</p>
          </div>
        </div>

        {/* SECTION 2: HEADER ACTIONS */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tighter italic flex items-center gap-4">
              <Users className="text-blue-500" size={48} /> DIRECTORY
            </h1>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.3em] font-bold">Verified Academic Records: {students.length}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest active:scale-95"
          >
            <UserPlus size={20} /> Register Student
          </button>
        </header>

        {/* SECTION 3: DATA GRID */}
        
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-500 uppercase text-[10px] tracking-[0.2em] font-black">
                <th className="p-6">Identity</th>
                <th className="p-6">Admission No.</th>
                <th className="p-6">Grade</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="group hover:bg-blue-600/5 transition-all">
                    <td className="p-6">
                      <p className="font-bold text-blue-100 group-hover:text-blue-400 transition-colors text-lg italic">
                        {student.full_name}
                      </p>
                    </td>
                    <td className="p-6 text-gray-400 font-mono text-sm tracking-tighter uppercase">
                      {student.admission_number}
                    </td>
                    <td className="p-6">
                      <span className="bg-blue-500/10 px-4 py-1.5 rounded-full text-[10px] border border-blue-500/20 text-blue-400 font-black uppercase tracking-widest">
                        {student.current_grade}
                      </span>
                    </td>
                    <td className="p-6 text-right flex items-center justify-end gap-3">
                      <button 
                        onClick={() => navigate(`/admin/student/${student.id}`)}
                        className="text-white hover:bg-blue-600 bg-white/5 px-5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2"
                      >
                        Profile <ArrowRight size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id, student.full_name)}
                        className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <Database size={64} className="mx-auto mb-6 text-gray-800" />
                    <p className="text-gray-600 font-black italic tracking-widest uppercase">No Active Nodes Detected</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SECTION 4: REGISTRATION MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 z-50">
            <div className="bg-[#0A0D14] border border-white/10 p-10 rounded-[3rem] max-w-md w-full shadow-2xl relative animate-in zoom-in duration-300">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-black mb-1 italic flex items-center gap-3">
                <Zap className="text-blue-500" /> NEW RECORD
              </h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mb-10 font-bold">Edusphere Core Intake</p>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-600 font-black ml-1">Student Full Name</label>
                  <input required value={newStudent.full_name}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                    placeholder="Enter legal name"
                    onChange={(e) => setNewStudent({...newStudent, full_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-600 font-black ml-1">Admission Number</label>
                  <input required value={newStudent.admission_number}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-mono uppercase"
                    placeholder="e.g. ADM-2026-001"
                    onChange={(e) => setNewStudent({...newStudent, admission_number: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-600 font-black ml-1">Class Assignment</label>
                  <input required value={newStudent.current_grade}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-bold"
                    placeholder="e.g. Grade 10"
                    onChange={(e) => setNewStudent({...newStudent, current_grade: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 p-4 rounded-2xl font-black text-[10px] tracking-widest transition-all uppercase"
                  >
                    Abort
                  </button>
                  <button type="submit" disabled={isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-black text-[10px] tracking-widest shadow-lg shadow-blue-600/30 transition-all uppercase flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Commit Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}