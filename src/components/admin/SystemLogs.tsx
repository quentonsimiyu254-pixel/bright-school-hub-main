import React, { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { History, ShieldAlert, Clock, Database, Loader2 } from "lucide-react";

export const SystemLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false });
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
            <History size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Audit Trail</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Real-time system security logs</p>
          </div>
        </div>
        <div className="flex gap-2">
           <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">System Online</span>
        </div>
      </div>

      <div className="bg-[#05070a] border border-white/5 rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-amber-500" /></div>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log) => (
              <div key={log.id} className="p-6 flex items-start gap-6 hover:bg-white/[0.02] transition-colors group">
                <div className="mt-1">
                  {log.action_type === 'PAYMENT' ? <Database className="text-emerald-400" size={18}/> : 
                   log.action_type === 'SYSTEM' ? <ShieldAlert className="text-amber-400" size={18}/> : 
                   <Clock className="text-blue-400" size={18}/>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.action_type}</span>
                    <span className="text-[10px] font-mono text-slate-600">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-200 font-medium">{log.description}</p>
                  <p className="text-[10px] text-slate-500 mt-1 italic">Performed by {log.admin_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};