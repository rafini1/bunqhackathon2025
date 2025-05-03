import React from "react";
import { StatusBar } from "./StatusBar";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col relative overflow-hidden bg-black">
      <StatusBar />
      <AppHeader />
      <div className="flex-1 overflow-y-auto pb-16">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
