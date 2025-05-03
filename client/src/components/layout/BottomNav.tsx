import React from "react";
import { useLocation, Link } from "wouter";
import { Home, Plane, PieChart, TrendingUp, Coins } from "lucide-react";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/", notifications: 1 },
    { icon: Plane, label: "Travel", path: "/travel" },
    { icon: PieChart, label: "Budgeting", path: "/budgeting" },
    { icon: TrendingUp, label: "Stocks", path: "/stocks" },
    { icon: Coins, label: "Crypto", path: "/crypto" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <div className="grid grid-cols-5 border-t border-gray-800 bg-black">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className="flex flex-col items-center py-2 relative"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center ${
                  isActive ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.notifications && (
                  <span className="notification-dot">{item.notifications}</span>
                )}
              </div>
              <span
                className={`text-xs ${
                  isActive ? "text-blue-500" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
