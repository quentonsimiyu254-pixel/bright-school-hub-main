import { createClient } from '@supabase/supabase-js';

// 1. Grab variables from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Safety Check: Alert the developer if the .env is missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase credentials missing! Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file."
  );
}

/**
 * The 'supabase' object is your main entry point to the database.
 * It is exported so you can use it in AdminDashboard, AttendanceMarker, etc.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Keeps users logged in after a page refresh
    autoRefreshToken: true,
  }
});

// Helper type for your database (optional but recommended for large projects)
export type SupabaseClient = typeof supabase;
// Add this at the bottom of your file to test the connection in the console
export const testConnection = async () => {
  const { data, error } = await supabase.from('edusphere_health_metrics').select('count');
  if (error) console.error("Database Connection Error:", error.message);
  else console.log("Database Connected Successfully!");
};