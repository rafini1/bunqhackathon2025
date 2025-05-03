import React from "react";
import { Bell, QrCode, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppHeader() {
  return (
    <div className="flex justify-between items-center p-4 pb-2">
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10 bg-gray-600">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="relative">
          <button className="relative">
            <Bell className="text-white h-6 w-6" />
            <span className="notification-dot">1</span>
          </button>
        </div>
      </div>

      <h1 className="text-xl font-semibold">Home</h1>

      <div className="flex items-center gap-2">
        <button className="w-8 h-8 border border-white rounded flex items-center justify-center">
          <QrCode className="text-white h-4 w-4" />
        </button>
        <Avatar className="w-10 h-10 bg-purple-900">
          <AvatarFallback>R</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
