import { useState } from 'react';
import { detectIdentity } from '../lib/auth-service';
import { ShieldCheck, Smartphone, UserCircle, Loader2 } from 'lucide-react';

export default function SmartLogin() {
  const [step, setStep] = useState(1); // 1: Identity, 2: OTP/PIN
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<any>(null);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const detection = await detectIdentity(identifier);
    setUserType(detection);
    
    // Logic: If Admin/Teacher -> Trigger SMS OTP
    // Logic: If Student -> Prompt for PIN or Parent OTP
    setTimeout(() => { 
      setStep(2); 
      setLoading(false); 
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Edusphere</h1>
          <p className="text-slate-500 font-medium">Global School Hub</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-6">
            <div className="relative">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Identity</label>
              <input 
                required
                className="w-full mt-2 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-lg focus:border-indigo-600 outline-none transition-all"
                placeholder="Phone / Admission / Staff ID"
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <button className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : "Continue"}
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-indigo-50 p-6 rounded-3xl flex items-center gap-4 border border-indigo-100">
              <div className="bg-white p-2 rounded-xl shadow-sm"><UserCircle className="text-indigo-600"/></div>
              <div>
                <p className="text-xs font-bold text-indigo-400 uppercase">Verifying</p>
                <p className="font-bold text-indigo-900">{identifier}</p>
              </div>
            </div>

            <input 
              type="text"
              maxLength={6}
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-center text-3xl font-black tracking-[1rem] outline-none focus:border-indigo-600"
              placeholder="000000"
            />
            
            <p className="text-center text-sm text-slate-400 font-medium">
              {userType?.type === 'student' ? "Enter your parent's OTP or your PIN" : "Enter the OTP sent via WhatsApp/SMS"}
            </p>

            <button className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold text-lg">
              Verify & Enter
            </button>
            <button onClick={() => setStep(1)} className="w-full text-slate-400 font-bold text-sm">Change ID</button>
          </div>
        )}
      </div>
    </div>
  );
}