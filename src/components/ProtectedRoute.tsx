
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Domain-based URL for redirection instead of IP address
const EXTERNAL_REDIRECT_URL = "https://app.irmai.io/";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to external URL if authenticated
    if (user && !isLoading) {
      console.log("ProtectedRoute: Redirecting authenticated user to external domain");
      window.location.replace(EXTERNAL_REDIRECT_URL);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
