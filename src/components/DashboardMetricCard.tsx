
import React from "react";

interface DashboardMetricCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  borderColor?: string;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  icon,
  borderColor = "border-gray-200"
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border ${borderColor} p-4 flex flex-col`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex items-center mt-2">
        {icon && <div className="mr-3">{icon}</div>}
        <span className="text-3xl font-bold">{value}</span>
      </div>
    </div>
  );
};

export default DashboardMetricCard;
