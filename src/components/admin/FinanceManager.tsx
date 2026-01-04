import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
// ../ moves from admin to components, another ../ moves from components to src
import { generateFeeReceipt } from "../../services/receiptGenerator";
import { Wallet, Printer, Search, Plus } from "lucide-react";

export const FinanceManager = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`*, profiles(full_name, fee_balance)`)
      .order('created_at', { ascending: false });
    if (!error) setTransactions(data || []);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-600 p-8 rounded-[2rem] text-white">
          <Wallet className="mb-4" />
          <p className="text-blue-100 text-sm">Total Collections (Term 1)</p>
          <h2 className="text-3xl font-bold">KES 1,240,000</h2>
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex flex-col justify-center items-center border-dashed">
          <button className="bg-white text-black h-12 w-12 rounded-full flex items-center justify-center hover:scale-110 transition-all">
            <Plus size={24} />
          </button>
          <p className="text-white font-bold mt-3 text-sm">Record Manual Payment</p>
        </div>
      </div>

      <div className="bg-[#080A0F] border border-white/10 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase font-mono">
            <tr>
              <th className="p-5">Student</th>
              <th className="p-5">Ref Code</th>
              <th className="p-5">Amount</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/[0.02]">
                <td className="p-5 text-white font-medium">{tx.profiles?.full_name}</td>
                <td className="p-5 text-gray-500 font-mono">{tx.reference_code}</td>
                <td className="p-5 text-green-400 font-bold">KES {tx.amount.toLocaleString()}</td>
                <td className="p-5 text-right">
                  <button onClick={() => generateFeeReceipt(tx)} className="text-blue-400 p-2 hover:bg-blue-400/10 rounded-lg">
                    <Printer size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};