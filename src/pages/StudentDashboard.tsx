import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, GraduationCap, Book, Calendar, Award } from 'lucide-react';

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStudent() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getStudent();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <div className="p-10 text-center">Loading Student Portal...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap size={28} />
            <h1 className="text-xl font-bold">Bright School Student Hub</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-indigo-800 px-4 py-2 rounded hover:bg-red-500 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.email?.split('@')[0]}!</h2>
          <p className="text-gray-500">Here is what's happening with your studies today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500">
            <p className="text-sm text-gray-500 uppercase">Current Term</p>
            <p className="text-xl font-bold text-gray-800">Term 3, 2026</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500 uppercase">Attendance</p>
            <p className="text-xl font-bold text-gray-800">98%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
            <p className="text-sm text-gray-500 uppercase">Assignments</p>
            <p className="text-xl font-bold text-gray-800">4 Pending</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
            <p className="text-sm text-gray-500 uppercase">Mean Grade</p>
            <p className="text-xl font-bold text-gray-800">A-</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Class Timetable */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-indigo-700">
              <Calendar size={20} />
              <h3 className="font-bold">Today's Timetable</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between p-3 bg-slate-50 rounded">
                <span>Mathematics</span>
                <span className="text-gray-500">08:00 AM</span>
              </li>
              <li className="flex justify-between p-3 bg-slate-50 rounded">
                <span>English Literature</span>
                <span className="text-gray-500">10:30 AM</span>
              </li>
              <li className="flex justify-between p-3 bg-slate-50 rounded">
                <span>Chemistry Lab</span>
                <span className="text-gray-500">01:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Recent Notes/Materials */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-orange-600">
              <Book size={20} />
              <h3 className="font-bold">Study Materials</h3>
            </div>
            <div className="space-y-4">
              <div className="border p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                <p className="font-medium text-gray-800">Biology_Notes_Circulatory.pdf</p>
                <p className="text-xs text-gray-400">Uploaded 2 hours ago</p>
              </div>
              <div className="border p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                <p className="font-medium text-gray-800">History_Revision_Paper_2.docx</p>
                <p className="text-xs text-gray-400">Uploaded Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}