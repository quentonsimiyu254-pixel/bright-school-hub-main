import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Page Imports
import RegisterInstant from './pages/RegisterInstant';
import SmartLogin from './pages/Login'; // Updated for bypass
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherPortal from './pages/TeacherPortal';
import StudentHub from './pages/StudentHub';
import ParentPortal from './pages/ParentPortal';
import TeacherJoin from './pages/TeacherJoin';

/**
 * 🛡️ BYPASS PROTECTED ROUTE
 * Instead of checking Supabase Auth (which requires emails/OTP),
 * this checks our local "edusphere_user" session.
 */
const ProtectedRoute = ({ children, allowedRole }: { children: JSX.Element, allowedRole?: string }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localUser = localStorage.getItem('edusphere_user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 font-bold text-indigo-600">
      Loading Edusphere...
    </div>
  );

  // If no user found in local storage, send to register
  if (!user) return <Navigate to="/register" />;

  // If the user role doesn't match the page requirement
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

/**
 * 🚦 GLOBAL REDIRECTOR
 * Decides where to send the user based on their saved role.
 */
function DashboardRedirect() {
  const localUser = localStorage.getItem('edusphere_user');
  if (!localUser) return <Navigate to="/register" />;

  const user = JSON.parse(localUser);
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'teacher') return <Navigate to="/teacher-portal" />;
  if (user.role === 'parent') return <Navigate to="/parent-portal" />;
  if (user.role === 'student') return <Navigate to="/student-hub" />;

  return <Navigate to="/register" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC / ENTRY ROUTES --- */}
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/register" element={<RegisterInstant />} />
        <Route path="/login" element={<SmartLogin />} />
        <Route path="/join/:schoolId" element={<TeacherJoin />} />

        {/* --- ADMIN DASHBOARD --- */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- TEACHER PORTAL --- */}
        <Route 
          path="/teacher-portal" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherPortal />
            </ProtectedRoute>
          } 
        />

        {/* --- PARENT PORTAL --- */}
        <Route 
          path="/parent-portal" 
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentPortal />
            </ProtectedRoute>
          } 
        />

        {/* --- STUDENT HUB --- */}
        <Route 
          path="/student-hub" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentHub />
            </ProtectedRoute>
          } 
        />

        {/* --- SYSTEM ROUTES --- */}
        <Route path="/unauthorized" element={
          <div className="h-screen flex flex-col items-center justify-center p-10 text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4">Access Denied</h1>
            <p className="text-slate-500 mb-6">Your role does not allow access to this section.</p>
            <button onClick={() => { localStorage.clear(); window.location.href='/register'; }} 
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold">
              Register as Different User
            </button>
          </div>
        } />

        <Route path="*" element={
          <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-9xl font-black text-slate-100">404</h1>
            <p className="text-slate-500 -mt-10 font-bold">Page Not Found</p>
            <button onClick={() => window.location.href='/'} className="mt-6 text-indigo-600 font-bold">Return Home</button>
          </div>
        } />
      </Routes>
    </Router>
  );
}