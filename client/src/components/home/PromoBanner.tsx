import React from "react";
import { Rocket, ChevronRight } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Rocket className="text-white h-5 w-5" />
        <p className="font-medium">
          Enjoy bunq Demo and finish signing up for the full experience!
        </p>
      </div>
      <button>
        <ChevronRight className="text-white h-5 w-5" />
      </button>
    </div>
  );
}
