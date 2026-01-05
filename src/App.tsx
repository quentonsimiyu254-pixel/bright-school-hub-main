import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import RegisterInstant from './pages/RegisterInstant';
import SmartLogin from './pages/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherPortal from './pages/TeacherPortal';
import StudentHub from './pages/StudentHub';
import ParentPortal from './pages/ParentPortal';

/**
 * 🛡️ THE BYPASS GUARD
 * Checks localStorage instead of Supabase Auth
 */
const ProtectedRoute = ({ children, allowedRole }: { children: JSX.Element, allowedRole?: string }) => {
  const localUser = localStorage.getItem('edusphere_user');
  
  if (!localUser) return <Navigate to="/login" />;

  const user = JSON.parse(localUser);

  // If role doesn't match, block access
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Entry Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterInstant />} />
        <Route path="/login" element={<SmartLogin />} />

        {/* 🏢 Admin Section */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* 🧑‍🏫 Teacher Section */}
        <Route path="/teacher-portal" element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherPortal />
          </ProtectedRoute>
        } />

        {/* 👨‍👩‍👦 Parent Section */}
        <Route path="/parent-portal" element={
          <ProtectedRoute allowedRole="parent">
            <ParentPortal />
          </ProtectedRoute>
        } />

        {/* 🎓 Student Section */}
        <Route path="/student-hub" element={
          <ProtectedRoute allowedRole="student">
            <StudentHub />
          </ProtectedRoute>
        } />

        {/* Error Handling */}
        <Route path="/unauthorized" element={
          <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Access Denied</h1>
            <p className="text-slate-500 mb-6">You don't have the right role for this portal.</p>
            <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} 
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100">
              Logout & Try Again
            </button>
          </div>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}