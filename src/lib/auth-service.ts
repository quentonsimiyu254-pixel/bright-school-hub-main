import { supabase } from './supabase';

export const detectIdentity = async (input: string) => {
  // 1. Check if it's an Admission Number (e.g., ADM-123)
  if (input.toUpperCase().startsWith('ADM')) {
    return { type: 'student', field: 'admission_number' };
  }
  
  // 2. Check if it's a Phone Number (e.g., 07... or +254...)
  const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
  if (phoneRegex.test(input)) {
    return { type: 'phone', field: 'phone_number' };
  }

  // 3. Default to Staff ID
  return { type: 'staff', field: 'staff_id' };
};