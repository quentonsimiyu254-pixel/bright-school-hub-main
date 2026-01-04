import React, { useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { Wallet, Search, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const FeeManager = () => {
  const [searchId, setSearchId] = useState("");
  const [feeData, setFeeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const fetchFees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_fees')
      .select('*, student_report_summaries(full_name)')
      .eq('admission_number', searchId.toUpperCase())
      .maybeSingle();

    if (data) setFeeData(data);
    else toast.error("Fee record not found");
    setLoading(false);
  };

  const handlePayment = async () => {
    const newPaid = feeData.amount_paid + parseFloat(paymentAmount);
    const newStatus = newPaid >= feeData.total_bill ? "Cleared" : "Partial";

    const { error } = await supabase
      .from('student_fees')
      .update({ amount_paid: newPaid, status: newStatus, last_payment_date: new Date() })
      .eq('id', feeData.id);

    if (!error) {
      toast.success("Payment Processed");
      fetchFees();
      setPaymentAmount("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex gap-4">
        <input 
          className="flex-1 bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none"
          placeholder="Enter Admission Number (BSH-001)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={fetchFees} className="bg-blue-600 px-8 rounded-2xl font-black flex items-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          CHECK ACCOUNT
        </button>
      </div>

      {feeData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Account Summary</p>
            <h3 className="text-2xl font-bold mb-1">{feeData.student_report_summaries.full_name}</h3>
            <p className="text-blue-500 font-mono text-sm mb-6">{feeData.admission_number}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Total Bill</span>
                <span className="font-bold">KES {feeData.total_bill}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Paid Amount</span>
                <span className="font-bold text-emerald-400">KES {feeData.amount_paid}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400 font-bold">Balance Due</span>
                <span className="font-black text-xl text-red-400">KES {feeData.total_bill - feeData.amount_paid}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-600/20">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-white" />
              <h3 className="font-black text-white uppercase tracking-tighter">Process Payment</h3>
            </div>
            <input 
              type="number"
              className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-white placeholder:text-white/40 mb-4 outline-none font-black text-2xl"
              placeholder="0.00"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
            <button 
              onClick={handlePayment}
              className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all"
            >
              RECORD TRANSACTION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};