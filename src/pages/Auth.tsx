
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "signin" | "signup" | "magic" | "reset" | "update-password";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Extract token from URL for password reset
  useEffect(() => {
    const getResetToken = () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        setMode("update-password");
        return token;
      }
      return null;
    };
    
    getResetToken();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;
        
        toast({
          title: "Magic link sent",
          description: "Check your email for the login link",
        });
      } else if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Add notification if we have user data
        if (data.user) {
          try {
            // We can't use the hook here since we're not in the provider context yet
            await supabase.from("notifications").insert({
              user_id: data.user.id,
              message: "You have successfully signed in",
              type: "success",
              read: false,
            });
          } catch (notifError) {
            console.error("Error adding signin notification:", notifError);
          }
        }
        
        navigate("/");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              full_name: name || "",
              avatar_url: "",
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created",
          description: "Please check your email to verify your account",
        });
        
        // Send welcome email
        if (data.user) {
          try {
            const { error: emailError } = await supabase.functions.invoke("send-email", {
              body: {
                type: "welcome",
                recipients: [{ email: email }],
                data: { email: email }
              }
            });
            
            if (emailError) console.error("Error sending welcome email:", emailError);
          } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
          }
        }
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });

        if (error) throw error;

        toast({
          title: "Password reset email sent",
          description: "Check your email for the password reset link",
        });
        
        // Send password reset email
        try {
          const { error: emailError } = await supabase.functions.invoke("send-email", {
            body: {
              type: "password-reset",
              recipients: [{ email: email }],
              data: { email: email }
            }
          });
          
          if (emailError) console.error("Error sending reset email:", emailError);
        } catch (emailError) {
          console.error("Error sending reset email:", emailError);
        }
      } else if (mode === "update-password") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        const { error } = await supabase.auth.updateUser({
          password: password,
        });

        if (error) throw error;

        toast({
          title: "Password updated",
          description: "Your password has been updated successfully",
        });

        // Add a small delay to show the toast before redirecting
        setTimeout(() => {
          setMode("signin");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fix for TypeScript error - Define a function to check mode safely
  const isSignInMode = () => mode === "signin";
  const isSignUpMode = () => mode === "signup";
  const isMagicLinkMode = () => mode === "magic";
  const isResetMode = () => mode === "reset";
  const isUpdatePasswordMode = () => mode === "update-password";

  const renderAuthContent = () => {
    if (isSignUpMode()) {
      return (
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/ff1eabe6-7fde-4229-8d7f-5e5d7e495d5b.png" 
              alt="IRMAI Logo" 
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to IRMAI</h1>
            <p className="text-gray-500">Secure access to your dashboard</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex mb-6">
              <button 
                className={`flex-1 py-3 ${!isSignUpMode() ? 'text-gray-500 bg-gray-50' : 'bg-gray-100 font-medium'}`}
                onClick={() => setMode("signin")}
              >
                Login
              </button>
              <button 
                className={`flex-1 py-3 ${isSignUpMode() ? 'text-gray-500 bg-gray-50' : 'bg-gray-100 font-medium'}`}
                onClick={() => setMode("signup")}
              >
                Register
              </button>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full"
                />
              </div>
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full"
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign up"}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="mt-4 w-full h-12"
                onClick={signInWithGoogle}
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign in with Google
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center">
                <Shield className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">PROTECTED BY IRMAI SECURITY</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (isMagicLinkMode()) {
      return (
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/ff1eabe6-7fde-4229-8d7f-5e5d7e495d5b.png" 
              alt="IRMAI Logo" 
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Magic Link Login</h1>
            <p className="text-gray-500">Enter your email to receive a sign in link</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setMode("signin")}
              >
                Back to login
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center">
                <Shield className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">PROTECTED BY IRMAI SECURITY</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (isResetMode()) {
      return (
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/ff1eabe6-7fde-4229-8d7f-5e5d7e495d5b.png" 
              alt="IRMAI Logo" 
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-500">Enter your email to receive a password reset link</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setMode("signin")}
              >
                Back to login
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center">
                <Shield className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">PROTECTED BY IRMAI SECURITY</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (isUpdatePasswordMode()) {
      return (
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/ff1eabe6-7fde-4229-8d7f-5e5d7e495d5b.png" 
              alt="IRMAI Logo" 
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Password</h1>
            <p className="text-gray-500">Create a new password for your account</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  placeholder="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 w-full"
                  required
                  minLength={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center">
                <Shield className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">PROTECTED BY IRMAI SECURITY</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Default is sign in mode
    return (
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/ff1eabe6-7fde-4229-8d7f-5e5d7e495d5b.png" 
            alt="IRMAI Logo" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to IRMAI</h1>
          <p className="text-gray-500">Secure access to your dashboard</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex mb-6">
            <button 
              className={`flex-1 py-3 ${isSignInMode() ? 'bg-gray-100 font-medium' : 'text-gray-500 bg-gray-50'}`}
              onClick={() => setMode("signin")}
            >
              Login
            </button>
            <button 
              className={`flex-1 py-3 ${!isSignInMode() ? 'bg-gray-100 font-medium' : 'text-gray-500 bg-gray-50'}`}
              onClick={() => setMode("signup")}
            >
              Register
            </button>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full"
                required
              />
            </div>
            <div>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign in"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setMode("magic")}
            >
              Sign in with Magic Link
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                className="text-blue-500 hover:underline text-sm"
                onClick={() => setMode("reset")}
              >
                Forgot password?
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="mt-4 w-full h-12"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign in with Google
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center">
              <Shield className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-xs text-gray-400">PROTECTED BY IRMAI SECURITY</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {renderAuthContent()}
    </div>
  );
};

export default Auth;
