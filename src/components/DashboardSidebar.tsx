
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Network,
  LineChart,
  ShieldAlert,
  CheckSquare,
  Plug,
  Settings,
  FileBarChart,
  FileStack,
  AlertTriangle,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard (Summary)",
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: "/",
    active: true,
  },
  {
    title: "Process Discovery",
    icon: <Network className="h-5 w-5" />,
    path: "/process-discovery",
    active: false,
  },
  {
    title: "Outlier Analysis",
    icon: <LineChart className="h-5 w-5" />,
    path: "/outlier-analysis",
    active: false,
  },
  {
    title: "Predictive Risk Analytics",
    icon: <ShieldAlert className="h-5 w-5" />,
    path: "/risk-analytics",
    active: false,
  },
  {
    title: "Compliance & Monitoring",
    icon: <CheckSquare className="h-5 w-5" />,
    path: "/compliance",
    active: false,
  },
  {
    title: "API Integrations",
    icon: <Plug className="h-5 w-5" />,
    path: "/integrations",
    active: false,
  },
  {
    title: "Admin & Dependencies",
    icon: <Settings className="h-5 w-5" />,
    path: "/admin",
    active: false,
  }
];

const upcomingItems = [
  {
    title: "Controls Testing",
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    title: "Scenario Analysis",
    icon: <FileBarChart className="h-5 w-5" />,
  },
  {
    title: "Risk Catalog",
    icon: <FileStack className="h-5 w-5" />,
  },
  {
    title: "Incident Management",
    icon: <AlertTriangle className="h-5 w-5" />,
  }
];

const DashboardSidebar = () => {
  return (
    <div className="w-64 hidden md:block bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="py-4">
        <nav className="px-4">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md text-sm ${
                    item.active
                      ? "bg-gray-100 text-primary font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              </li>
            ))}

            <li className="pt-4">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Coming Soon</div>
            </li>

            {upcomingItems.map((item, index) => (
              <li key={`upcoming-${index}`}>
                <span
                  className="flex items-center px-4 py-3 rounded-md text-sm text-gray-400 cursor-not-allowed"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                  <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-8 mt-6 pt-6 border-t">
          <div className="text-xs text-gray-500">
            IRMAI v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
