import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Capture the session from the URL (Supabase does this automatically)
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("Auth error:", error);
        navigate('/login');
        return;
      }

      // 2. Read the role we stored in the metadata during SignUp/Register
      const role = session.user.user_metadata?.role || 'student';

      // 3. Smooth landing: Send them directly to their dashboard
      // We use replace: true so they can't "go back" to the loading screen
      navigate(`/${role}`, { replace: true });
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Verifying your account...</p>
        <p className="text-sm text-gray-400">Preparing your dashboard</p>
      </div>
    </div>
  );
}