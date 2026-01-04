import React, { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { Briefcase, UserPlus, Mail, Phone, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const StaffManagement = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    employee_id: "",
    full_name: "",
    role: "",
    department: "",
    email: ""
  });

  const fetchStaff = async () => {
    setLoading(true);
    const { data } = await supabase.from('staff_registry').select('*').order('full_name');
    setStaff(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('staff_registry').insert([newStaff]);
    if (error) toast.error(error.message);
    else {
      toast.success("Staff member added");
      setShowForm(false);
      fetchStaff();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
        <div>
          <h2 className="text-2xl font-black">Staff Directory</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Faculty & Operations Team</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all"
        >
          <UserPlus size={18} /> {showForm ? "VIEW LIST" : "ADD STAFF"}
        </button>
      </div>

      {showForm ? (
        /* Add Staff Form */
        <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-10 rounded-[3rem]">
          <form onSubmit={handleAddStaff} className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
              <input required className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none" 
                onChange={(e) => setNewStaff({...newStaff, full_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Employee ID</label>
              <input required className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none" 
                placeholder="STAFF-002" onChange={(e) => setNewStaff({...newStaff, employee_id: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Role</label>
              <input required className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none" 
                placeholder="Teacher" onChange={(e) => setNewStaff({...newStaff, role: e.target.value})} />
            </div>
            <button className="col-span-2 bg-indigo-600 py-4 rounded-2xl font-black mt-4">CONFIRM ENROLLMENT</button>
          </form>
        </div>
      ) : (
        /* Staff Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <div key={member.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:border-indigo-500/50 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="size-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Briefcase size={24} />
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {member.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{member.full_name}</h3>
              <p className="text-indigo-400 text-sm font-bold mb-4">{member.role}</p>
              
              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                  <Mail size={12} /> {member.email || "No email added"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};