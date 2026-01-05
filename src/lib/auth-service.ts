import { supabase } from './supabase';

export const instantRegister = async (formData: any) => {
  let table = '';
  let insertData: any = {
    full_name: formData.name,
    phone_number: formData.phone,
  };

  // Logic to determine which table to use
  if (formData.role === 'parent') {
    table = 'parents';
  } else {
    table = 'staff';
    insertData.role = formData.role; // Stores 'admin' or 'teacher'
    insertData.id_number = formData.idNumber;
  }

  const { data, error } = await supabase
    .from(table)
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error("Database Error:", error.message);
    throw error;
  }

  // Save the session with the role so App.tsx knows where to send them
  const sessionUser = { ...data, role: formData.role };
  localStorage.setItem('edusphere_session', JSON.stringify(sessionUser));
  
  return sessionUser;
};