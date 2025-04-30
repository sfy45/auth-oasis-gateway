
import React from "react";
import { 
  ShieldAlert, 
  LineChart, 
  CheckSquare, 
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight
} from "lucide-react";

interface DashboardInsightCardProps {
  title: string;
  description: string;
  icon: "risk" | "outlier" | "compliance" | "process";
}

const DashboardInsightCard: React.FC<DashboardInsightCardProps> = ({
  title,
  description,
  icon
}) => {
  const getIcon = () => {
    switch (icon) {
      case "risk":
        return <ShieldAlert className="h-6 w-6 text-blue-500" />;
      case "outlier":
        return <LineChart className="h-6 w-6 text-purple-500" />;
      case "compliance":
        return <CheckSquare className="h-6 w-6 text-green-500" />;
      case "process":
        return <Activity className="h-6 w-6 text-blue-500" />;
      default:
        return <ShieldAlert className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {getIcon()}
            <div className="ml-3">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800">
            <span className="text-xs font-medium">Info</span>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              {icon === "risk" ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Open Risks</span>
                </>
              ) : icon === "outlier" ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Sequence Fails</span>
                </>
              ) : icon === "compliance" ? (
                <>
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  <span>Compliance Score</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  <span>Events</span>
                </>
              )}
            </div>
            <span className="font-medium">0</span>
          </div>
          
          {/* Add more metrics specific to each card type */}
          {icon === "risk" && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  <span>High Severity</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <span>Medium Severity</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  <span>Low Severity</span>
                </div>
                <span className="font-medium">0</span>
              </div>
            </>
          )}
          
          {icon === "outlier" && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <span>Timing Fails</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  <span>Rework Fails</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  <span>Resource Outliers</span>
                </div>
                <span className="font-medium">0</span>
              </div>
            </>
          )}
          
          {icon === "compliance" && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <span>Critical Gaps</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  <span>Controls</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  <span>Frameworks</span>
                </div>
                <span className="font-medium">0%</span>
              </div>
            </>
          )}
          
          {icon === "process" && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <span>Critical Activities</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  <span>Objects</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  <span>Cases</span>
                </div>
                <span className="font-medium">0</span>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600">
          {icon === "risk" && (
            <p>No risk data available yet<br />Upload a file to see risk insights</p>
          )}
          {icon === "outlier" && (
            <p>No risk analytics data available yet<br />Upload a file to see risk predictions</p>
          )}
          {icon === "compliance" && (
            <p>No compliance data available yet<br />Upload a file to see compliance insights</p>
          )}
          {icon === "process" && (
            <p>No process data available yet<br />Upload a file to see process insights</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardInsightCard;
