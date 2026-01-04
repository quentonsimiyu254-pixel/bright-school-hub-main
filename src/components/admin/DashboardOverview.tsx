import React from "react";
import { Activity, Wallet, UserCheck, TrendingUp } from "lucide-react";

export const DashboardOverview = ({ metrics }: { metrics: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      <div className="bg-blue-600 p-6 rounded-3xl text-white">
        <Activity size={24} />
        <p className="text-xs opacity-80 mt-4 uppercase">Health Score</p>
        <h3 className="text-4xl font-black">{metrics?.global_health_score || 0}</h3>
      </div>
      
      <StatCard title="Finance" value={`${metrics?.financial_health || 0}%`} icon={<Wallet />} color="text-emerald-500" />
      <StatCard title="Attendance" value={`${metrics?.attendance_health || 0}%`} icon={<UserCheck />} color="text-blue-500" />
      <StatCard title="Academic" value={`${metrics?.academic_health || 0}%`} icon={<TrendingUp />} color="text-indigo-500" />
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
    <div className={`p-2 w-fit rounded-lg bg-white/5 ${color}`}>{icon}</div>
    <p className="text-slate-500 text-xs mt-4 uppercase font-bold">{title}</p>
    <h3 className="text-2xl font-black text-white">{value}</h3>
  </div>
);