import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface MessageProps {
  message: {
    id: string;
    role: "user" | "system";
    content: string;
    timestamp: Date;
  };
}

export function ChatMessage({ message }: MessageProps) {
  const isUser = message.role === "user";

  // Function to format message content with bullet points
  const formatMessage = (content: string) => {
    // Split content by newlines to identify bullet points
    const lines = content.split("\n");
    return lines.map((line, i) => {
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={i} className="ml-5">
            {line.trim().substring(2)}
          </li>
        );
      }
      return <p key={i}>{line}</p>;
    });
  };

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0 rainbow-avatar">
          <AvatarFallback className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            <Bot className="text-white h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          isUser ? "bg-blue-600" : 
          message.content.includes("completed successfully") || message.content.includes("has been created successfully") || message.content.includes("has been successfully") ? 
            "bg-gradient-to-r from-green-500 to-emerald-600" : 
            "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500"
        }`}
      >
        <div className="text-white">{formatMessage(message.content)}</div>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 bg-gray-600 flex-shrink-0">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
