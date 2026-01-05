import { supabase } from './supabase';

export const instantRegister = async (formData: any) => {
  // Determine which table to use based on the role
  const tableName = formData.role === 'parent' ? 'parents' : 'staff';
  
  const insertData: any = {
    full_name: formData.name,
    phone_number: formData.phone,
  };

  // Only add 'role' if they are joining the staff table
  if (tableName === 'staff') {
    insertData.role = formData.role; 
  }

  const { data, error } = await supabase
    .from(tableName) // This now uses 'parents' or 'staff' instead of 'profiles'
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error("Database Error:", error.message);
    throw new Error(error.message);
  }

  // Save the session locally so App.tsx knows where to send them
  const sessionUser = { ...data, role: formData.role };
  localStorage.setItem('edusphere_session', JSON.stringify(sessionUser));
  
  return sessionUser;
};