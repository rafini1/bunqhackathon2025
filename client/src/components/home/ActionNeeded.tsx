import React from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { IdCard } from "@/lib/icons";

interface ActionItem {
  id: number;
  title: string;
  status: string;
  icon: string;
}

export function ActionNeeded() {
  const { data: actionItems, isLoading } = useQuery<ActionItem[]>({
    queryKey: ['/api/actions-needed'],
  });

  if (isLoading) {
    return (
      <div className="px-4 mb-3">
        <h2 className="text-white font-semibold text-lg mb-2">Action Needed</h2>
        <Card className="bg-gray-800 rounded-lg p-4 animate-pulse h-16"></Card>
      </div>
    );
  }

  if (!actionItems || actionItems.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mb-3">
      <h2 className="text-white font-semibold text-lg mb-2">Action Needed</h2>
      {actionItems.map((item) => (
        <Card key={item.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
          <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
            <IdCard className="text-white h-5 w-5" />
          </div>
          <div>
            <h3 className="text-white font-medium">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.status}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
