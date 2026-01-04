import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Search, Save, CheckCircle } from "lucide-react";

export const GradeEntryForm = () => {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [score, setScore] = useState("");
  const [outOf, setOutOf] = useState("100");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load subjects from database on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from("subjects").select("*");
      if (data) setSubjects(data);
    };
    fetchSubjects();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, admission_number")
      .eq("admission_number", admissionNumber.toUpperCase())
      .single();

    if (error) alert("Student not found! Check the admission number.");
    else setStudent(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("exam_results").insert({
      student_id: student.id,
      subject_id: selectedSubject,
      score: parseFloat(score),
      out_of: parseFloat(outOf),
      term: "Term 1",
      year: 2026
    });

    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setScore("");
      }, 3000);
    } else {
      alert("Error saving marks: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 max-w-2xl mx-auto shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white">
          <GraduationCap size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">Enter Academic Marks</h2>
      </div>

      {!student ? (
        <div className="space-y-4">
          <label className="text-sm text-gray-400 ml-1">Find Student by Admission Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="BRIGHT-001"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all"
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-indigo-600 px-6 rounded-2xl hover:bg-indigo-700 transition-all text-white"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-top-2">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
            <p className="text-indigo-400 text-[10px] uppercase font-bold mb-1">Grading for:</p>
            <p className="text-white font-bold">{student.full_name} ({student.admission_number})</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 ml-2 mb-2 block">Subject</label>
              <select 
                required
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500"
              >
                <option value="" className="bg-[#05070A]">Select a Subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#05070A]">{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 ml-2 mb-2 block">Score</label>
                <input
                  type="number"
                  required
                  placeholder="85"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 ml-2 mb-2 block">Out of</label>
                <input
                  type="number"
                  required
                  value={outOf}
                  onChange={(e) => setOutOf(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              success ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? "Saving..." : success ? <><CheckCircle size={18}/> Saved!</> : <><Save size={18}/> Record Grade</>}
          </button>
          
          <button type="button" onClick={() => setStudent(null)} className="w-full text-xs text-gray-500 hover:text-white">
            Change Student
          </button>
        </form>
      )}
    </div>
  );
};