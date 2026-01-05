import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

// Page Imports
import SmartLogin from './pages/Login';
import RegisterSchool from './pages/RegisterSchool';
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherPortal from './pages/TeacherPortal';
import TeacherJoin from './pages/TeacherJoin';

/**
 * PROTECTED ROUTE COMPONENT
 * Checks if a user is logged in and if they have the right role (Admin/Teacher)
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
        <p className="text-slate-500 font-bold animate-pulse">Loading Edusphere...</p>
      </div>
    );
  }
  
  if (!authenticated) return <Navigate to="/login" />;
  
  // Role Protection: If user is a Teacher trying to access /admin, kick them back
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

/**
 * DASHBOARD REDIRECTOR
 * Logic that decides where to send a user immediately after they login
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

  if (role === 'admin') return <Navigate to="/admin" />;
  if (role === 'teacher') return <Navigate to="/teacher-portal" />;
  
  // Default for students or unknown roles
  return <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ACCESSIBLE ROUTES --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SmartLogin />} />
        <Route path="/register-school" element={<RegisterSchool />} />
        
        {/* --- THE MAGIC TEACHER INVITE LINK --- */}
        {/* Admin copies this from their dashboard to send via WhatsApp */}
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

        {/* --- AUTH REDIRECTOR --- */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* --- ERROR PAGES --- */}
        <Route path="/unauthorized" element={
          <div className="h-screen flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-6xl font-black text-slate-200">403</h1>
            <p className="text-xl font-bold text-slate-800 mt-4">Access Denied</p>
            <p className="text-slate-500 mb-6">You don't have permission to view this page.</p>
            <button onClick={() => window.location.href='/login'} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold">Go to Login</button>
          </div>
        } />

        <Route path="*" element={
          <div className="h-screen flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-6xl font-black text-slate-200">404</h1>
            <p className="text-xl font-bold text-slate-800 mt-4">Oops! Lost in Space?</p>
            <p className="text-slate-500 mb-6">The page you are looking for doesn't exist.</p>
            <button onClick={() => window.location.href='/login'} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold">Back to Safety</button>
          </div>
        } />
      </Routes>
    </Router>
  );
}