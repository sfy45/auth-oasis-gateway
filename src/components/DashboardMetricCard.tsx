
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardMetricCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  borderColor?: string;
  trendValue?: string;
  trendDirection?: "up" | "down" | "neutral";
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  icon,
  borderColor = "border-gray-200",
  trendValue,
  trendDirection
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border ${borderColor} p-4 flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <button className="hover:bg-gray-100 rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex items-center mt-2">
        {icon && (
          <div className="mr-3 p-2 bg-gray-50 rounded-full">
            {icon}
          </div>
        )}
        <span className="text-2xl md:text-3xl font-bold">{value}</span>
      </div>
      
      {trendValue && (
        <div className="mt-3 flex items-center">
          {trendDirection === "up" ? (
            <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : trendDirection === "down" ? (
            <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          )}
          <span className={`text-xs font-medium ${
            trendDirection === "up" 
            ? "text-green-500" 
            : trendDirection === "down" 
            ? "text-red-500" 
            : "text-gray-500"
          }`}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardMetricCard;
