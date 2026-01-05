import { supabase } from './supabase';

export const admitStudent = async (studentData: any) => {
  const { data, error } = await supabase
    .from('students')
    .insert([{
      admission_number: studentData.admNo,
      full_name: studentData.name,
      parent_id: studentData.parentId, // 🔗 Link to Parent
      school_id: studentData.schoolId,
      pin: '1234' // Default PIN for student login
    }])
    .select()
    .single();

  if (error) {
    console.error("Admission Error:", error.message);
    throw error;
  }
  return data;
};
export const getAllStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      admission_number,
      full_name,
      created_at,
      parents (
        full_name,
        phone_number
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};