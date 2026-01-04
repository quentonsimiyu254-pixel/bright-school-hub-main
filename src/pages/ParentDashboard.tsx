import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, BookOpen, CreditCard, User } from 'lucide-react';

// This matches your "App.tsx" import
export default function ParentDashboard() {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParentStudentData();
  }, []);

  const fetchParentStudentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetching student details linked to this parent email
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('parent_email', user?.email)
        .single();

      if (error) throw error;
      setStudentData(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <div className="p-8 text-center">Loading Student Records...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">Bright School Parent Portal</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <User size={24} />
              </div>
              <h2 className="text-lg font-bold">Student Profile</h2>
            </div>
            <p className="text-gray-600"><strong>Name:</strong> {studentData?.name || 'N/A'}</p>
            <p className="text-gray-600"><strong>Class:</strong> {studentData?.class || 'N/A'}</p>
            <p className="text-gray-600"><strong>Admission No:</strong> {studentData?.admission_no || 'N/A'}</p>
          </div>

          {/* Fee Status Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <CreditCard size={24} />
              </div>
              <h2 className="text-lg font-bold">Fee Balance</h2>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              Ksh {studentData?.fee_balance || 0}
            </p>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">
              Pay Now
            </button>
          </div>

          {/* Academic Summary Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <BookOpen size={24} />
              </div>
              <h2 className="text-lg font-bold">Latest Grade</h2>
            </div>
            <p className="text-gray-600 text-sm italic">Term 3 Performance</p>
            <p className="text-4xl font-black text-purple-600 mt-2">
              {studentData?.mean_grade || 'B+'}
            </p>
          </div>

        </div>

        {/* Detailed Report Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
          <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center border-dashed border-2 border-gray-200">
            <p className="text-gray-400 text-sm">Exam Analytics Chart will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
}