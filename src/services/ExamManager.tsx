import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateReportCard } from "../components/admin/ReportGenerator.tsx";
import { GraduationCap, FileDown, Search } from "lucide-react";

export const ExamManager = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      const { data } = await supabase
        .from('exam_results')
        .select(`*, profiles(full_name, admission_number), subjects(name)`)
        .order('created_at', { ascending: false });
      setResults(data || []);
      setLoading(false);
    };
    fetchExams();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <GraduationCap className="text-blue-500" /> Academic Records
        </h2>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-500 text-xs uppercase">
            <tr>
              <th className="p-5">Student</th>
              <th className="p-5">Subject</th>
              <th className="p-5">Score</th>
              <th className="p-5 text-right">Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {results.map((res) => (
              <tr key={res.id} className="text-gray-300">
                <td className="p-5 font-bold">{res.profiles?.full_name}</td>
                <td className="p-5">{res.subjects?.name}</td>
                <td className="p-5 font-mono">{res.score}/{res.out_of}</td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => generateReportCard(res.profiles, [res])}
                    className="bg-blue-600/10 text-blue-400 px-4 py-2 rounded-xl text-xs hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <FileDown size={14} className="inline mr-2" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};