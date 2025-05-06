
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import DashboardInsightCard from "@/components/DashboardInsightCard";
import { Shield, AlertTriangle, CheckCircle, Activity, DollarSign, FileBarChart } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

// External URL for redirection
const EXTERNAL_REDIRECT_URL = "http://132.196.152.53:8501/";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Add login notification
  useEffect(() => {
    const addLoginNotification = async () => {
      if (user) {
        try {
          await addNotification("Welcome", "Welcome to your dashboard", "success");
        } catch (error) {
          console.error("Error adding login notification:", error);
        }
      }
    };
    
    addLoginNotification();
  }, [user, addNotification]);

  // Redirect to external URL if authenticated
  useEffect(() => {
    if (user && !isLoading) {
      console.log("Redirecting to external URL from Index page");
      window.location.replace(EXTERNAL_REDIRECT_URL);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Real-time insights and analytics for operational risk management</p>
            </div>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              <DashboardMetricCard 
                title="Severity Risks" 
                value="0" 
                icon={<Shield className="text-blue-600" />}
                borderColor="border-red-300"
                trendValue="0% from last month"
                trendDirection="neutral"
              />
              <DashboardMetricCard 
                title="Open Risks" 
                value="0" 
                icon={<AlertTriangle className="text-yellow-500" />}
                borderColor="border-yellow-300"
                trendValue="0% from last month"
                trendDirection="neutral"
              />
              <DashboardMetricCard 
                title="Compliance Score" 
                value="0%" 
                icon={<CheckCircle className="text-green-500" />}
                borderColor="border-green-300"
                trendValue="0% from last month"
                trendDirection="neutral"
              />
              <DashboardMetricCard 
                title="Critical Process Steps" 
                value="0" 
                icon={<Activity className="text-blue-500" />}
                borderColor="border-blue-300"
                trendValue="0% from last month"
                trendDirection="neutral"
              />
              <DashboardMetricCard 
                title="Total Potential Loss" 
                value="$0" 
                icon={<DollarSign className="text-blue-500" />}
                borderColor="border-blue-300"
                trendValue="0% from last month"
                trendDirection="neutral"
              />
              <DashboardMetricCard 
                title="Control Failures" 
                value="0%" 
                icon={<FileBarChart className="text-purple-500" />}
                borderColor="border-purple-300"
                trendValue="0% from last month"
                trendDirection="neutral"
              />
              <DashboardMetricCard 
                title="Scenario Analysis" 
                value="0" 
                icon={<FileBarChart className="text-teal-500" />}
                borderColor="border-teal-300"
                trendValue="0% from last month"
                trendDirection="neutral"
              />
            </div>
            
            {/* Risk Insights Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Risk Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardInsightCard 
                  title="Predictive Risk Analytics"
                  description="Risk Assessment Insights"
                  icon="risk"
                />
                <DashboardInsightCard 
                  title="Outlier Analysis"
                  description="Predictive Risk Analytics"
                  icon="outlier"
                />
                <DashboardInsightCard 
                  title="Compliance Monitoring"
                  description="Regulatory Industry & Internal Policy Gaps"
                  icon="compliance"
                />
                <DashboardInsightCard 
                  title="Process Mining"
                  description="End-End Process Insights"
                  icon="process"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
