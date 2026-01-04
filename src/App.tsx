import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
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
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a clean loader while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Bright School Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        {/* If user is logged in, redirect them away from login/signup to the root */}
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/" replace />} />

        {/* --- Protected Dashboards --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/parent" 
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- Logic for the Root Path (/) --- */}
        {/* This helps redirect the user to their specific dashboard automatically */}
        <Route path="/" element={
          session ? (
            <div className="flex h-screen w-full items-center justify-center">
              <p>Redirecting to your dashboard...</p>
              {/* Note: Your Login.tsx usually handles this redirect, 
                  but this acts as a safety net */}
              <Navigate to="/login" replace /> 
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Fallback for broken links */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;