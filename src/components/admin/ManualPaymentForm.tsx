import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion"; // <-- This fixes your error
import { 
  Search, 
  CreditCard, 
  User, 
  ArrowRight, 
  Banknote, 
  History,
  Loader2
} from "lucide-react";

export const ManualPaymentForm = () => {
  // State for searching
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [student, setStudent] = useState<any>(null);
  
  // State for payment processing
  const [amount, setAmount] = useState("");
  const [refCode, setRefCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Deposit");
  const [loading, setLoading] = useState(false);

  // 1. Search for Student by Admission Number
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!admissionNumber) return toast.error("Enter an admission number");

    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, fee_balance, admission_number")
      .eq("admission_number", admissionNumber.toUpperCase().trim())
      .single();

    if (error || !data) {
      toast.error("Student Not Found", {
        description: `No record found for ${admissionNumber.toUpperCase()}`
      });
      setStudent(null);
    } else {
      setStudent(data);
      toast.success("Student Found");
    }
    setLoading(false);
  };

  // 2. Process the Manual Payment
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !amount || !refCode) return;

    setLoading(true);
    const paymentAmount = parseFloat(amount);
    const newBalance = (student.fee_balance || 0) - paymentAmount;

    try {
      // Step A: Update Student Balance in Profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ fee_balance: newBalance })
        .eq("id", student.id);

      if (updateError) throw updateError;

      // Step B: Insert record into Transactions table
      const { error: txError } = await supabase.from("transactions").insert({
        student_id: student.id,
        amount: paymentAmount,
        reference_code: refCode.toUpperCase().trim(),
        method: paymentMethod,
        status: "completed",
        description: `Manual payment recorded by Admin`
      });

      if (txError) throw txError;

      // Success UI Feedback
      toast.success("Payment Successful", {
        description: `KES ${paymentAmount.toLocaleString()} credited to ${student.full_name}.`,
      });

      // Reset Form
      setStudent(null);
      setAdmissionNumber("");
      setAmount("");
      setRefCode("");

    } catch (error: any) {
      toast.error("Payment Failed", {
        description: error.message || "An error occurred while saving."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
          <Banknote size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Record Manual Payment</h2>
          <p className="text-slate-500 text-sm">Update fee balances for Bank, Cash, or Check deposits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Search & Student Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Search size={14} /> 1. Locate Student
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="ADM-001..."
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-mono"
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-white text-black font-bold py-3 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Search Record"}
              </button>
            </div>
          </div>

          {student && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-600/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-blue-100 font-medium">Verified Student</p>
                  <p className="font-bold leading-tight">{student.full_name}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] uppercase text-blue-100 mb-1">Current Balance</p>
                <h4 className="text-2xl font-black">KES {student.fee_balance?.toLocaleString()}</h4>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: Payment Details Form */}
        <div className="lg:col-span-2">
          {!student ? (
            <div className="h-full border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-600">
                <CreditCard size={32} />
              </div>
              <h4 className="text-slate-400 font-bold">Waiting for Student Selection</h4>
              <p className="text-slate-600 text-xs mt-2 max-w-[200px]">Search for a student on the left to unlock the payment form.</p>
            </div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handlePayment}
              className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-6"
            >
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                <CreditCard size={14} /> 2. Entry Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 ml-2">Amount Received (KES)</label>
                  <input
                    type="number"
                    required
                    placeholder="5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-500 text-lg font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 ml-2">Reference Code (Bank/M-PESA)</label>
                  <input
                    type="text"
                    required
                    placeholder="REF12345678"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-500 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-500 ml-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Bank Deposit", "Cash", "Check"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === m 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "bg-white/5 border-white/5 text-slate-500 hover:border-white/20"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Post Transaction <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>

      {/* Footer Helper */}
      <div className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
        <History className="text-yellow-500" size={18} />
        <p className="text-[11px] text-yellow-200/60 uppercase tracking-widest font-bold">
          All manual entries are audited. Double-check Reference Codes before posting.
        </p>
      </div>
    </div>
  );
};