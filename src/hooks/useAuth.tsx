
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Redirect URL updated to the IP address
const EXTERNAL_REDIRECT_URL = "http://34.45.239.136:8501/";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for auth hash in URL and redirect if needed
    const hasAuthHash = window.location.hash && window.location.hash.includes("access_token");
    
    if (hasAuthHash) {
      console.log("Auth hash detected in URL, redirecting to external IP");
      // Show a notification toast before redirecting
      toast({
        title: "Authentication successful",
        description: "Redirecting to your dashboard...",
      });
      
      // Add a small delay before redirect to allow toast to show
      setTimeout(() => {
        window.location.replace(EXTERNAL_REDIRECT_URL);
      }, 1500);
      return;
    }
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        console.log("Auth state changed:", _event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        // Redirect authenticated users to external URL
        if (currentSession?.user) {
          console.log("Auth state change: Redirecting to external IP");
          
          // Show a notification toast before redirecting
          toast({
            title: "Authentication successful",
            description: "Redirecting to your dashboard...",
          });
          
          // Add a small delay before redirect to allow toast to show
          setTimeout(() => {
            window.location.replace(EXTERNAL_REDIRECT_URL);
          }, 1500);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session check:", session ? "Session exists" : "No session");
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Redirect authenticated users to external URL
      if (session?.user) {
        console.log("Existing session: Redirecting to external IP");
        
        // Show a notification toast before redirecting
        toast({
          title: "Authentication successful",
          description: "Redirecting to your dashboard...",
        });
        
        // Add a small delay before redirect to allow toast to show
        setTimeout(() => {
          window.location.replace(EXTERNAL_REDIRECT_URL);
        }, 1500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const value = {
    user,
    session,
    isLoading,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
