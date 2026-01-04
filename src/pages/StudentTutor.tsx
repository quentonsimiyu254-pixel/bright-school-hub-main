import { GraduationCap, MessageSquareCode } from "lucide-react";

export default function StudentTutor() {
  return (
    <div className="p-8 text-white h-screen flex flex-col">
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-xl font-black italic flex items-center gap-2">
          <GraduationCap className="text-blue-500" /> EDUSPHERE TUTOR
        </h2>
        <div className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/20 tracking-widest">
          PERSONALIZED PATH ACTIVE
        </div>
      </header>
      <div className="flex-1 border border-white/10 rounded-[2.5rem] bg-white/5 flex flex-col items-center justify-center p-12 text-center">
        <MessageSquareCode size={64} className="text-gray-700 mb-6" />
        <h3 className="text-2xl font-bold mb-4">Hello, Student!</h3>
        <p className="text-gray-500 max-w-sm">I'm analyzing your latest quiz results to build your custom revision plan. Hang tight!</p>
      </div>
    </div>
  );
}