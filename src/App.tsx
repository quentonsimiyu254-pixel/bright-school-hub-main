import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Essential Page Imports (Matching your clean folder structure)
import LandingPage from './pages/LandingPage';
import RegisterInstant from './pages/RegisterInstant';
import Login from './pages/Login';
import TeacherPortal from './pages/TeacherPortal';
import ParentPortal from './pages/ParentPortal';
import StudentHub from './pages/StudentHub';
import TeacherJoin from './pages/TeacherJoin';
import NotFound from './pages/NotFound';

// If AdminDashboard is in a subfolder, ensure this path is correct:
import AdminDashboard from './components/admin/AdminDashboard'; 

/**
 * 🔐 BYPASS PROTECTED ROUTE
 * Instead of checking Supabase Auth (Email/OTP), this checks for a 
 * local session created during our "Instant" registration flow.
 */
const ProtectedRoute = ({ children, role }: { children: JSX.Element, role?: string }) => {
  const sessionData = localStorage.getItem('edusphere_session');
  
  if (!sessionData) {
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(sessionData);

  // Role Protection: Ensure users can't jump between portals manually
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

/**
 * 🚦 INSTANT DASHBOARD REDIRECTOR
 * Acts as the traffic controller for the /dashboard route.
 */
function DashboardRedirect() {
  const sessionData = localStorage.getItem('edusphere_session');
  
  if (!sessionData) return <Navigate to="/login" />;
  
  const { role } = JSON.parse(sessionData);
  
  switch (role) {
    case 'admin': return <Navigate to="/admin" />;
    case 'teacher': return <Navigate to="/teacher-portal" />;
    case 'parent': return <Navigate to="/parent-portal" />;
    case 'student': return <Navigate to="/student-hub" />;
    default: return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterInstant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join/:schoolId" element={<TeacherJoin />} />

        {/* --- DYNAMIC REDIRECT --- */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* --- SECURE PORTALS (Instant Access) --- */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/teacher-portal" 
          element={
            <ProtectedRoute role="teacher">
              <TeacherPortal />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/parent-portal" 
          element={
            <ProtectedRoute role="parent">
              <ParentPortal />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/student-hub" 
          element={
            <ProtectedRoute role="student">
              <StudentHub />
            </ProtectedRoute>
          } 
        />

        {/* --- ERROR PAGES --- */}
        <Route path="/unauthorized" element={
          <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-5xl font-black text-slate-200">403</h1>
            <p className="text-xl font-bold text-slate-800 mt-2">Access Denied</p>
            <button onClick={() => window.location.href='/login'} className="mt-4 text-indigo-600 font-bold underline">Try another account</button>
          </div>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}