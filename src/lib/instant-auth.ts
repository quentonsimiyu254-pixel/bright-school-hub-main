import { supabase } from './supabase';

export const instantRegister = async (formData: any) => {
  // 1. Save to database
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

  if (error) throw error;

  // 2. Set a local 'session' so the app remembers who this is
  localStorage.setItem('edusphere_user', JSON.stringify(data));

  // 3. Return the redirect path
  const paths: any = {
    admin: '/admin',
    teacher: '/teacher-portal',
    parent: '/parent-portal'
  };

  return paths[formData.role];
};