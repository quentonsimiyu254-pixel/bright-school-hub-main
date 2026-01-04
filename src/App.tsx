import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RegisterSchool from './pages/RegisterSchool';
import AcceptInvite from './pages/AcceptInvite';
import SignUp from './pages/SignUp'; // For Individual Signup (Path B)

// Dashboards
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* --- STEP 1: PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/check-role" replace />} />
        
        {/* --- STEP 2: ENTRY MODELS --- */}
        {/* Path A: School Registration */}
        <Route path="/register-school" element={<RegisterSchool />} />
        
        {/* Path B: Individual Signup */}
        <Route path="/signup" element={<SignUp />} />

        {/* --- STEP 5: INVITE ACCEPTANCE --- */}
        <Route path="/invite/:token" element={<AcceptInvite />} />

        {/* --- ROLE-BASED PROTECTED DASHBOARDS --- */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/teacher/*" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/parent/*" 
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/student/*" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- AUTO-REDIRECT LOGIC --- */}
        <Route path="/check-role" element={<RoleRedirectHandler />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Helper component to send logged-in users to their 
 * specific dashboard based on their database role.
 */
function RoleRedirectHandler() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setTarget(`/${profile?.role || 'login'}`);
      } else {
        setTarget('/login');
      }
    }
    getRole();
  }, []);

  if (!target) return null;
  return <Navigate to={target} replace />;
}

export default App;