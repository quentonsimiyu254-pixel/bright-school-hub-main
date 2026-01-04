import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GraduationCap, Loader2 } from "lucide-react";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 1. Check if user is an Admin
      const { data: adminData } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle(); // maybeSingle prevents errors if not found

      if (adminData) {
        toast.success("Welcome, Admin");
        navigate("/admin-dashboard");
        return;
      }

      // 2. If not admin, check if user is a Parent
      const { data: parentData } = await supabase
        .from('parent_profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();

      if (parentData) {
        toast.success("Welcome to Parent Portal");
        navigate("/parent-dashboard");
        return;
      }

      toast.error("Account role not recognized.");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
        <div className="text-center">
          <div className="inline-flex p-4 bg-blue-600 rounded-2xl mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white">BRIGHT HUB</h2>
          <p className="text-slate-500 mt-2">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all"
              placeholder="name@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "ACCESS DASHBOARD"}
          </button>
        </form>
      </div>
    </div>
  );
};