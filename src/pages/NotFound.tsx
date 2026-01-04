import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log this locally to your Node.js server later for security monitoring
    console.error("Access Attempt Blocked:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05070A] text-white p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-6xl font-black mb-4 tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-xl font-bold mb-2">Resource Not Found</h2>
        
        <p className="text-slate-400 mb-8">
          The requested path <code className="text-blue-400 px-1 bg-blue-400/10 rounded">{location.pathname}</code> does not exist on the Edusphere local server.
        </p>

        <Link to="/">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            Return to Command Center
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;