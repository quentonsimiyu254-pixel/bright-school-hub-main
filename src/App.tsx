import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RegisterSchool from './pages/RegisterSchool';
import SignUp from './pages/SignUp';
import AcceptInvite from './pages/AcceptInvite';
import AuthCallback from './pages/AuthCallback';

// Dashboards
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-school" element={<RegisterSchool />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* The Magic Link Handler */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/invite/:token" element={<AcceptInvite />} />

        {/* Protected Dashboard Routes */}
        <Route path="/admin/*" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/teacher/*" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/parent/*" element={<ProtectedRoute allowedRole="parent"><ParentDashboard /></ProtectedRoute>} />
        <Route path="/student/*" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}