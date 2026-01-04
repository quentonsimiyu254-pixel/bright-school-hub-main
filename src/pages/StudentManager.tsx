import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const StudentManager = () => {
 interface Student {
  id: string;
  full_name: string;
  admission_number: string;
  fee_balance: number;
}

const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student');
    if (data) setStudents(data);
  };

  useEffect(() => { fetchStudents(); }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Student Enrollment</h2>
        <button className="bg-blue-600 px-4 py-2 rounded-xl text-sm">+ Add Student</button>
      </div>
      <table className="w-full text-left text-gray-300">
        <thead>
          <tr className="border-b border-white/10 text-gray-500">
            <th className="pb-4">Name</th>
            <th className="pb-4">Adm No.</th>
            <th className="pb-4">Class</th>
            <th className="pb-4">Fee Balance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s: any) => (
            <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-4">{s.full_name}</td>
              <td>{s.admission_number || 'N/A'}</td>
              <td>Grade 4</td>
              <td className={s.fee_balance > 0 ? 'text-red-400' : 'text-green-400'}>
                KES {s.fee_balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};