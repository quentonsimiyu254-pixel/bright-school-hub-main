import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

// Page Imports
import SmartLogin from './pages/Login';
import RegisterSchool from './pages/RegisterSchool';
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherPortal from './pages/TeacherPortal';
import StudentHub from './pages/StudentHub';
import TeacherJoin from './pages/TeacherJoin';

/**
 * 🔐 PROTECTED ROUTE COMPONENT
 * Checks for session and verifies if the user has the required role.
 */
const ProtectedRoute = ({ children, allowedRole }: { children: JSX.Element, allowedRole?: string }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthenticated(true);
        // Roles are stored in user_metadata: 'admin', 'teacher', or 'student'
        setUserRole(session.user.user_metadata.role);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Entering Edusphere...</p>
      </div>
    );
  }
  
  if (!authenticated) return <Navigate to="/login" />;
  
  // Prevent cross-access (e.g., Student trying to access /admin)
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

/**
 * 🚦 DASHBOARD REDIRECTOR
 * This is the "Traffic Controller". After login, it checks the role 
 * and bounces the user to their specific workspace.
 */
function DashboardRedirect() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setRole(user?.user_metadata.role || null);
      setLoading(false);
    };
    getRole();
  }, []);

  if (loading) return null;

  // Smart Redirection Logic
  if (role === 'admin') return <Navigate to="/admin" />;
  if (role === 'teacher') return <Navigate to="/teacher-portal" />;
  if (role === 'student') return <Navigate to="/student-hub" />;
  
  // If no role is found, something is wrong, go back to login
  return <Navigate to="/login" />;
}

/**
 * 🌍 MAIN APP COMPONENT
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ACCESS --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SmartLogin />} />
        <Route path="/register-school" element={<RegisterSchool />} />
        
        {/* --- THE MAGIC TEACHER INVITE LINK --- */}
        <Route path="/join/:schoolId" element={<TeacherJoin />} />

        {/* --- PROTECTED ADMIN ROUTES --- */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- PROTECTED TEACHER ROUTES --- */}
        <Route 
          path="/teacher-portal" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherPortal />
            </ProtectedRoute>
          } 
        />

        {/* --- PROTECTED STUDENT ROUTES --- */}
        <Route 
          path="/student-hub" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentHub />
            </ProtectedRoute>
          } 
        />

        {/* --- AUTH REDIRECTOR --- */}
        {/* All users visit /dashboard immediately after login */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* --- SYSTEM PAGES --- */}
        <Route path="/unauthorized" element={
          <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50">
            <h1 className="text-6xl font-black text-slate-200">403</h1>
            <p className="text-xl font-bold text-slate-800 mt-4">Access Restricted</p>
            <p className="text-slate-500 mb-6 max-w-xs">You don't have the required clearance for this dashboard.</p>
            <button onClick={() => window.location.href='/login'} className="px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-lg shadow-indigo-100">Switch Account</button>
          </div>
        } />

        <Route path="*" element={
          <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50">
            <h1 className="text-6xl font-black text-slate-200">404</h1>
            <p className="text-xl font-bold text-slate-800 mt-4">Lost in the Hallways?</p>
            <p className="text-slate-500 mb-6">This page doesn't exist in Edusphere.</p>
            <button onClick={() => window.location.href='/login'} className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-bold shadow-lg shadow-slate-200">Back to Login</button>
          </div>
        } />
      </Routes>
    </Router>
  );
}