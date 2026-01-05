import { useEffect, useState } from 'react';
import { getAllStudents } from '../../lib/student-service';
import { Search, MoreVertical, User, Phone } from 'lucide-react';

export default function StudentTable() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const data = await getAllStudents();
    setStudents(data || []);
  }

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_number.includes(searchTerm.toUpperCase())
  );

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      {/* Table Header & Search */}
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Student Directory</h2>
          <p className="text-slate-400 font-bold text-sm">Managing {students.length} active students</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or ADM..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none text-slate-900 font-semibold transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Actual Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Adm No</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Parent / Guardian</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                      {student.full_name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-800">{student.full_name}</span>
                  </div>
                </td>
                <td className="p-6 font-mono font-bold text-indigo-600">{student.admission_number}</td>
                <td className="p-6">
                  <div className="text-slate-800 font-bold text-sm">{student.parents?.full_name || 'Not Linked'}</div>
                  <div className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                    <Phone size={12} /> {student.parents?.phone_number || 'No Phone'}
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase">Active</span>
                </td>
                <td className="p-6 text-right text-slate-300">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}