
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

// Redirect URL updated to the new IP address
const EXTERNAL_REDIRECT_URL = "http://34.45.239.136:8501/";

const Index = () => {
  const { user, isLoading } = useAuth();

  // Immediately redirect to external URL regardless of auth state
  // This ensures no dashboard is shown while redirecting
  useEffect(() => {
    console.log("Index page: Redirecting to external IP directly");
    window.location.replace(EXTERNAL_REDIRECT_URL);
  }, []);

  // Show loading spinner while redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;
