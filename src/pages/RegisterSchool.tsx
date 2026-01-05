import { useState } from 'react';
import { School, ArrowRight } from 'lucide-react';

export default function RegisterSchool() {
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    password: ''
  });

  const handleNewWaySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // WE WILL ADD THE NEW WAY HERE
    console.log("New registration flow triggered:", formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-indigo-600 rounded-2xl mb-4 text-white">
            <School size={28} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">New Registration</h2>
          <p className="text-slate-500 font-medium">Starting fresh with new ways</p>
        </div>

        <form onSubmit={handleNewWaySignup} className="space-y-4">
          <input 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
            placeholder="School Name"
            onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
          />
          <input 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
            placeholder="Admin Email"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
            placeholder="Password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
            Proceed <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}