
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

// Redirect URL updated to the new IP address
const EXTERNAL_REDIRECT_URL = "http://34.45.239.136:8501/";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Immediately redirect to external URL regardless of auth state
  // This ensures no dashboard is shown while redirecting
  useEffect(() => {
    console.log("ProtectedRoute: Redirecting to external IP directly");
    window.location.replace(EXTERNAL_REDIRECT_URL);
  }, []);

  // Show loading spinner while redirect happens
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default ProtectedRoute;
