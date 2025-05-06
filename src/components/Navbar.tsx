
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Upload, 
  AlertTriangle, 
  Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberLoading, setSubscriberLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    // Check subscription status
    const checkSubscription = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') throw error;
        setIsSubscribed(!!data);
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };
    
    if (user) {
      fetchProfile();
      checkSubscription();
    }
  }, [user]);

  const handleSubscribe = async () => {
    if (!user) return;
    
    setSubscriberLoading(true);
    try {
      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from('subscribers')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "Unsubscribed",
          description: "You have been unsubscribed from updates",
        });

        addNotification("Unsubscription", "You have unsubscribed from updates", "info");
        
        setIsSubscribed(false);
      } else {
        // Subscribe
        const { error } = await supabase
          .from('subscribers')
          .insert({ 
            user_id: user.id, 
            email: user.email 
          });
          
        if (error) throw error;
        
        toast({
          title: "Subscribed",
          description: "You have been subscribed to updates",
        });

        addNotification("Subscription", "You have subscribed to updates", "subscription");
        
        // Call send-email function
        try {
          const { data: emailData, error: emailError } = await supabase.functions.invoke("send-email", {
            body: {
              type: "subscription",
              recipients: [{ email: user.email }],
              data: { email: user.email }
            }
          });
          
          if (emailError) console.error("Email error:", emailError);
          else console.log("Email sent:", emailData);
        } catch (emailError) {
          console.error("Error sending subscription email:", emailError);
        }
        
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    } finally {
      setSubscriberLoading(false);
    }
  };

  const handleSignOut = async () => {
    // Add notification before signing out
    if (user) {
      try {
        await addNotification("Sign Out", "You have been signed out", "info");
      } catch (error) {
        console.error("Error adding sign out notification:", error);
      }
    }
    
    await signOut();
    navigate("/auth");
  };

  const getInitials = (email: string) => {
    if (!email) return '';
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="border-b border-gray-200 py-3 px-6 bg-white">
      <div className="max-w-full mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <span className="font-bold text-xl">IRMAI</span>
          </Link>
          
          <div className="relative hidden lg:block w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search risks, processes, controls..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center space-x-2" size="sm">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Event Log</span>
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2" size="sm">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Report Incident</span>
          </Button>
          
          {user && (
            <div className="flex items-center">
              <NotificationDropdown />
              
              <Button
                variant="outline" 
                size="sm"
                onClick={handleSubscribe}
                disabled={subscriberLoading}
                className="ml-2"
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe to Updates"}
              </Button>
            </div>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 w-9 p-0 font-semibold"
                >
                  <Avatar className="h-full w-full">
                    <AvatarImage 
                      src={profile?.avatar_url} 
                      alt={user.email || ''} 
                      className="h-full w-full rounded-full object-cover" 
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(user.email || '')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{profile?.full_name || "User"}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
