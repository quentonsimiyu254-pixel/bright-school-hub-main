import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Globe, Shield, BellRing, Palette, Loader2, Camera } from "lucide-react";

export const SchoolSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('school_settings').select('*').single();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('school_settings').update(settings).eq('id', 1);
    
    if (!error) {
      toast.success("Settings Synchronized", { description: "Changes applied across all portals." });
    } else {
      toast.error("Update Failed");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-500">Loading Configuration...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic">Core Configuration</h2>
          <p className="text-slate-500 text-sm">Define your institution's digital identity and rules.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <SettingsTab icon={<Globe />} label="Institution Profile" active />
          <SettingsTab icon={<Palette />} label="Branding & UI" />
          <SettingsTab icon={<BellRing />} label="Notification Rules" />
          <SettingsTab icon={<Shield />} label="Security & Roles" />
        </div>

        {/* Main Form */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">School Name</span>
              <input 
                type="text" 
                value={settings.school_name}
                onChange={(e) => setSettings({...settings, school_name: e.target.value})}
                className="w-full mt-2 bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Active Term</span>
                <select 
                  value={settings.current_term}
                  onChange={(e) => setSettings({...settings, current_term: e.target.value})}
                  className="w-full mt-2 bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                >
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Academic Year</span>
                <input 
                  type="text" 
                  value={settings.academic_year}
                  onChange={(e) => setSettings({...settings, academic_year: e.target.value})}
                  className="w-full mt-2 bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                />
              </label>
            </div>

            <div className="pt-6 border-t border-white/5">
              <span className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">System Branding</span>
              <div className="mt-4 flex items-center gap-6">
                <div className="w-20 h-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-600 hover:border-blue-500/50 cursor-pointer transition-all">
                  <Camera size={24} />
                  <span className="text-[8px] mt-1 font-bold">UPLOAD</span>
                </div>
                <p className="text-xs text-slate-500 max-w-[200px]">Upload a high-resolution PNG for the sidebar and report cards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, active = false }: any) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
    active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-white/5'
  }`}>
    {React.cloneElement(icon, { size: 18 })}
    {label}
  </button>
);