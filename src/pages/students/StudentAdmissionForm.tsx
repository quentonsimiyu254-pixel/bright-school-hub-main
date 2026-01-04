import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const StudentAdmissionForm = ({ onComplete }: { onComplete: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    admissionNumber: "",
    classId: "",
    parentEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the student profile in Supabase
      const { data, error } = await supabase.from('profiles').insert([
        { 
          full_name: formData.fullName,
          admission_number: formData.admissionNumber,
          role: 'student',
          fee_balance: 0
        }
      ]);

      if (error) throw error;
      alert("Student enrolled successfully!");
      onComplete(); // Refresh the list or close the modal
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 text-white animate-in zoom-in-95 duration-200">
      <h3 className="text-xl font-bold mb-4">New Student Enrollment</h3>
      
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Full Name</label>
        <input 
          placeholder="e.g. John Doe" 
          className="w-full bg-black/20 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 transition-all"
          onChange={e => setFormData({...formData, fullName: e.target.value})}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Admission Number</label>
        <input 
          placeholder="e.g. ADM-2024-001" 
          className="w-full bg-black/20 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 transition-all"
          onChange={e => setFormData({...formData, admissionNumber: e.target.value})}
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 py-3 mt-4 rounded-xl font-bold transition-all disabled:opacity-50"
      >
        {loading ? "Processing..." : "Enroll Student"}
      </button>
    </form>
  );
};