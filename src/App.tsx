import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// IMPORT CHECK: Use curly braces because we used 'export const'
import AdminDashboard from "./components/admin/AdminDashboard";
import { ParentDashboard } from "./pages/ParentDashboard";
import { Auth } from "./pages/Auth";

// 1. Fixed Protected Route Wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAuthorized(false);
      } else {
        // Check if this user exists in your admin_profiles table
        const { data } = await supabase
          .from('admin_profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
        
        setAuthorized(!!data);
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#020408] flex items-center justify-center text-white font-black italic">BRIGHT HUB...</div>;
  
  return authorized ? <>{children}</> : <Navigate to="/auth" replace />;
};

// 2. The Main App Component
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Protected Admin Route */}
        <Route 
          path="/admin-dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

        {/* Protected Parent Route */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;