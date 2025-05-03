import React, { useState, useRef, useEffect } from "react";
import { X, Send, Cpu } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { SendMoneyConfirmation } from "./SendMoneyConfirmation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "system";
  content: string;
  timestamp: Date;
}

interface ChatbotInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TransferDetails {
  amount?: string;
  currency?: string;
  recipient?: string;
}

export function ChatbotInterface({ isOpen, onClose }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content: "Hello! I'm your bunq assistant powered by NVIDIA AI. How can I help you with your banking today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSendMoneyConfirmation, setShowSendMoneyConfirmation] = useState(false);
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  // Parse SM response format: SM;amount;currency;recipient
  const parseSendMoneyResponse = (response: string): TransferDetails | null => {
    if (!response.startsWith("SM;")) return null;
    
    const parts = response.split(";");
    if (parts.length !== 4) return null;
    
    return {
      amount: parts[1],
      currency: parts[2],
      recipient: parts[3]
    };
  };
  
  const handleConfirmTransfer = () => {
    toast({
      title: "Transfer Successful",
      description: `Sent ${transferDetails.amount} ${transferDetails.currency} to ${transferDetails.recipient}`,
      variant: "default"
    });
    setShowSendMoneyConfirmation(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chatbot", {
        message: input,
      });
      
      const data = await response.json();
      
      // Add the AI response to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "system",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
      
      // Check if the response contains a money transfer request
      if (data.response.includes("SM;")) {
        const details = parseSendMoneyResponse(data.response);
        if (details) {
          setTransferDetails(details);
          setShowSendMoneyConfirmation(true);
        }
      }
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "system",
          content: "Sorry, I'm having trouble connecting to my AI service. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-white">bunq Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full flex items-center">
              <span className="w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
              NVIDIA AI
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full mx-1"></div>
              <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full mx-1 [animation-delay:0.2s]"></div>
              <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full mx-1 [animation-delay:0.4s]"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me about bunq banking..."
              className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-xs text-gray-500">Powered by NVIDIA AI</p>
          </div>
        </form>
      </div>
      
      {/* Send Money Confirmation Dialog */}
      <SendMoneyConfirmation
        isOpen={showSendMoneyConfirmation}
        onClose={() => setShowSendMoneyConfirmation(false)}
        onConfirm={handleConfirmTransfer}
        transferDetails={transferDetails}
      />
    </div>
  );
}
