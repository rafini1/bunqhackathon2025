import React from "react";
import { MessageSquareDot, Cpu } from "lucide-react";

interface ChatbotButtonProps {
  onClick: () => void;
}

export function ChatbotButton({ onClick }: ChatbotButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="fixed right-6 bottom-6 w-16 h-16 z-50 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg shine transition-transform hover:scale-110"
      aria-label="Open Finn - NVIDIA AI chatbot"
    >
      <div className="relative">
        <MessageSquareDot className="text-white h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </div>
      <span className="absolute -top-2 -right-2 text-xs bg-black text-white px-1.5 py-0.5 rounded-full flex items-center gap-1">
        <Cpu className="h-3 w-3" />
        <span className="font-semibold">AI</span>
      </span>
    </button>
  );
}
