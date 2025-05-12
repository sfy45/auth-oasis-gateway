
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { NotificationsProvider } from "@/hooks/useNotifications";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Redirect URL updated to the new IP address
const EXTERNAL_REDIRECT_URL = "http://34.45.239.136:8501/";

const queryClient = new QueryClient();

const App = () => {
  // Check for auth hash in URL and redirect if needed
  const hasAuthHash = window.location.hash && window.location.hash.includes("access_token");
  
  if (hasAuthHash) {
    console.log("Auth hash detected in URL, redirecting to external IP");
    window.location.replace(EXTERNAL_REDIRECT_URL);
    return null;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Redirect root to auth page by default */}
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="/auth" element={<Auth />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
