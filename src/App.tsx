import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

// Pages
import SmartLogin from './pages/Login';
import RegisterSchool from './pages/RegisterSchool';
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherJoin from './pages/TeacherJoin';

// Reusable Protected Route Component
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

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">Loading Edusphere...</div>;
  
  if (!authenticated) return <Navigate to="/login" />;
  
  // If a specific role is required (e.g., admin only)
  if (allowedRole && userRole !== allowedRole) return <Navigate to="/unauthorized" />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SmartLogin />} />
        <Route path="/register-school" element={<RegisterSchool />} />
        
        {/* --- THE MAGIC INVITE ROUTE --- */}
        {/* This is where teachers land when they click the WhatsApp link */}
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

        {/* --- PROTECTED TEACHER/STUDENT ROUTES (Placeholders) --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {/* This logic can redirect to /admin or /teacher based on role */}
              <DashboardRedirect />
            </ProtectedRoute>
          } 
        />

        {/* 404 Page */}
        <Route path="*" element={<div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-black">404</h1>
          <p className="text-slate-500">Page not found</p>
          <button onClick={() => window.location.href='/login'} className="mt-4 text-indigo-600 font-bold">Go Back Home</button>
        </div>} />
      </Routes>
    </Router>
  );
}

// Helper component to send users to the right dashboard after login
function DashboardRedirect() {
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setRole(user?.user_metadata.role);
    };
    getRole();
  }, []);

  if (!role) return null;
  if (role === 'admin') return <Navigate to="/admin" />;
  if (role === 'teacher') return <Navigate to="/teacher-portal" />;
  return <Navigate to="/student-hub" />;
}

export default App;