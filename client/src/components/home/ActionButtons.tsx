import React from "react";
import { ArrowUp, ArrowDown, Plus } from "lucide-react";

export function ActionButtons() {
  const actions = [
    { 
      icon: ArrowUp, 
      label: "Pay", 
      color: "bg-orange-600", 
      textColor: "text-orange-600" 
    },
    { 
      icon: ArrowDown, 
      label: "Request", 
      color: "bg-blue-600", 
      textColor: "text-blue-600" 
    },
    { 
      icon: Plus, 
      label: "Add", 
      color: "bg-purple-600", 
      textColor: "text-purple-600" 
    },
  ];

  return (
    <div className="flex justify-center gap-10 mt-4 mb-6 px-4">
      {actions.map((action) => (
        <button key={action.label} className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-1`}>
            <action.icon className="text-white h-5 w-5" />
          </div>
          <span className={`${action.textColor} text-sm`}>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
