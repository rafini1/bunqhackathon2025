import React from "react";
import { Signal, Battery } from "@/lib/icons";

export function StatusBar() {
  const [time, setTime] = React.useState<string>(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex justify-between items-center p-2 bg-black text-white">
      <span className="text-sm font-medium">{time}</span>
      <div className="flex items-center gap-1">
        <Signal className="h-4 w-4" />
        <span className="text-xs">5G</span>
        <div className="bg-white text-black text-xs px-1 rounded text-center ml-1">
          95
        </div>
      </div>
    </div>
  );
}
