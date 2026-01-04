import React from 'react';
import { 
  BookOpen, Sparkles, BrainCircuit, Users, 
  CheckCircle, Clock, Plus, BarChart2, Zap
} from 'lucide-react';

export default function TeacherDashboard() {
  const weakStudents = [
    { name: "John Kamau", topic: "Quadratic Equations", risk: "High" },
    { name: "Sarah Chen", topic: "Photosynthesis", risk: "Medium" }
  ];

  return (
    <div className="min-h-screen bg-[#05070A] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-3">
              <BookOpen className="text-blue-500" size={32} /> TEACHER NODE
            </h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">Class: Form 3 East • Physics & Math</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
            <Plus size={16} /> New Lesson Plan
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* AI Lesson Planner */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-purple-400" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest italic">AI Lesson Engine (CBC/IGCSE)</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-6 bg-blue-600/10 border border-blue-600/20 rounded-3xl group cursor-pointer hover:bg-blue-600/20 transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg italic">Thermodynamics: Heat Transfer</h4>
                      <p className="text-gray-500 text-xs mt-1 italic">Generated for Tomorrow, 08:00 AM</p>
                    </div>
                    <CheckCircle className="text-blue-500" />
                  </div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl opacity-50">
                  <h4 className="font-bold text-lg italic">Electromagnetism Intro</h4>
                  <p className="text-gray-500 text-xs mt-1">Pending Syllabus Review</p>
                </div>
              </div>
            </div>

            {/* Performance Heatmap Placeholder */}
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem]">
               <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Class Attention & Attendance</h3>
               <div className="h-32 flex items-end gap-1">
                  {[...Array(30)].map((_, i) => (
                    <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm hover:bg-blue-500 transition-all" style={{ height: `${Math.random() * 100}%` }} />
                  ))}
               </div>
            </div>
          </div>

          {/* AI Interventions Sidebar */}
          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[3rem]">
              <h3 className="text-red-500 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap size={16} /> AI Interventions
              </h3>
              <div className="space-y-4">
                {weakStudents.map((s, i) => (
                  <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-xs font-bold text-white uppercase">{s.name}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">Gap: {s.topic}</p>
                    <div className="mt-3 bg-red-500/20 text-red-500 text-[8px] font-black px-2 py-1 rounded inline-block tracking-tighter">
                      ACTION REQUIRED
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem]">
               <BarChart2 className="text-blue-500 mb-4" />
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Syllabus Progress</p>
               <p className="text-3xl font-black italic mt-1">74%</p>
               <p className="text-xs text-green-500 font-bold mt-2 tracking-tight">On Track for Term 3</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}