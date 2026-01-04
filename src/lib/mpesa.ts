import { supabase } from "../integrations/supabase/client";

/**
 * EDUSPHERE PAY: M-PESA STK PUSH TRIGGER
 * Uses the Daraja 2.0 API via Supabase Edge Functions
 * * This function sends a request to your Supabase Edge Function 
 * which then triggers the M-PESA PIN prompt on the parent's phone.
 */
export const triggerStkPush = async (phoneNumber: string, amount: number, studentId: string) => {
  try {
    // 1. Sanitize phone number (Converts 07... to 2547...)
    const formattedPhone = phoneNumber.startsWith('0') 
      ? `254${phoneNumber.substring(1)}` 
      : phoneNumber.startsWith('+') 
        ? phoneNumber.substring(1)
        : phoneNumber;

    // 2. Call the Supabase Edge Function 'mpesa-push'
    const { data, error } = await supabase.functions.invoke('mpesa-push', {
      body: { 
        phone: formattedPhone, 
        amount: amount, 
        reference: `FEE-${studentId.substring(0, 5)}` 
      },
    });

    if (error) throw error;
    
    return { success: true, data };
  } catch (err) {
    console.error("M-PESA Engine Error:", err);
    return { success: false, error: err };
  }
};