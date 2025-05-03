import React from "react";
import { MessageSquareDot } from "lucide-react";

interface ChatbotButtonProps {
  onClick: () => void;
}

export function ChatbotButton({ onClick }: ChatbotButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="fixed right-4 bottom-20 w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center shadow-lg shine"
    >
      <MessageSquareDot className="text-white h-6 w-6" />
    </button>
  );
}
