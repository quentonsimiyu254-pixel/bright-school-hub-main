import { supabase } from './supabase';

// Make sure 'export' is written before 'const'
export const instantRegister = async (formData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      full_name: formData.name,
      role: formData.role,
      phone_number: formData.phone,
      id_number: formData.idNumber
    }])
    .select()
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw error;
  }

  // Save to local storage for the "Zero Friction" session
  localStorage.setItem('edusphere_session', JSON.stringify(data));
  return data;
};

export const detectIdentity = (input: string) => {
  if (input.toUpperCase().startsWith('ADM')) return 'student';
  if (/^(?:254|0)?(7|1)\d{8}$/.test(input)) return 'phone';
  return 'staff';
};