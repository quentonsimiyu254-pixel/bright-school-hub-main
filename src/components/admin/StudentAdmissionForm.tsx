import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { admitStudent } from '../../lib/student-service';
import { UserPlus, Hash, UserCircle } from 'lucide-react';

export default function StudentAdmissionForm() {
  const [parents, setParents] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', admNo: '', parentId: '' });
  const [loading, setLoading] = useState(false);

  // Fetch parents so we can link the student
  useEffect(() => {
    const getParents = async () => {
      const { data } = await supabase.from('parents').select('id, full_name');
      if (data) setParents(data);
    };
    getParents();
  }, []);

  const handleAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await admitStudent(form);
      alert("Student Admitted Successfully!");
      setForm({ name: '', admNo: '', parentId: '' }); // Reset
    } catch (err) {
      alert("Admission Failed. Check if Adm No is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 max-w-lg">
      <div className="flex items-center gap-3 mb-6 text-indigo-600">
        <UserPlus size={28} />
        <h2 className="text-2xl font-black text-slate-900">New Admission</h2>
      </div>

      <form onSubmit={handleAdmission} className="space-y-4">
        <div>
          <label className="text-xs font-black text-slate-400 ml-2 uppercase">Student Full Name</label>
          <input 
            required
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-600"
            placeholder="e.g. Prince Junior"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
        </div>

        <div>
          <label className="text-xs font-black text-slate-400 ml-2 uppercase">Admission Number</label>
          <input 
            required
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-600"
            placeholder="ADM-2024-001"
            value={form.admNo}
            onChange={e => setForm({...form, admNo: e.target.value.toUpperCase()})}
          />
        </div>

        <div>
          <label className="text-xs font-black text-slate-400 ml-2 uppercase">Link to Parent</label>
          <select 
            required
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold outline-none focus:border-indigo-600"
            value={form.parentId}
            onChange={e => setForm({...form, parentId: e.target.value})}
          >
            <option value="">Select Parent...</option>
            {parents.map(p => (
              <option key={p.id} value={p.id}>{p.full_name}</option>
            ))}
          </select>
        </div>

        <button 
          disabled={loading}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          {loading ? "Registering Student..." : "Confirm Admission"}
        </button>
      </form>
    </div>
  );
}