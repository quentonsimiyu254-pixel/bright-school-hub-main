import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Wallet, ArrowDownCircle, Receipt, History } from 'lucide-react';

export default function FeeStatement({ studentId }: { studentId: string }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const loadFees = async () => {
      const { data: inv } = await supabase.from('fee_invoices').select('*').eq('student_id', studentId);
      const { data: pay } = await supabase.from('fee_payments').select('*').eq('student_id', studentId);
      setInvoices(inv || []);
      setPayments(pay || []);
    };
    loadFees();
  }, [studentId]);

  const totalBilled = invoices.reduce((sum, item) => sum + Number(item.amount_due), 0);
  const totalPaid = payments.reduce((sum, item) => sum + Number(item.amount_paid), 0);
  const balance = totalBilled - totalPaid;

  return (
    <div className="space-y-6">
      {/* BALANCE CARD */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Current Balance</p>
          <h2 className="text-4xl font-black">KES {balance.toLocaleString()}</h2>
          <div className="mt-6 flex gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold">Billed: {totalBilled.toLocaleString()}</div>
            <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold">Paid: {totalPaid.toLocaleString()}</div>
          </div>
        </div>
        <Wallet className="absolute -right-8 -bottom-8 text-white/5" size={180} />
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
          <History size={18} className="text-indigo-600" /> Recent Activity
        </h3>
        <div className="space-y-4">
          {payments.map(p => (
            <div key={p.id} className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <ArrowDownCircle className="text-emerald-600" size={20} />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Payment: {p.reference_no}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">{p.payment_method}</p>
                </div>
              </div>
              <span className="font-black text-emerald-700 text-sm">+{p.amount_paid.toLocaleString()}</span>
            </div>
          ))}
          
          {invoices.length === 0 && payments.length === 0 && (
            <p className="text-center py-10 text-slate-400 font-medium italic text-sm">No transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}