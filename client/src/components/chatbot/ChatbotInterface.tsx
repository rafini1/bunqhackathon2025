import React, { useState, useRef, useEffect } from "react";
import { X, Send, Cpu, Mic, MicOff } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { SendMoneyConfirmation } from "./SendMoneyConfirmation";
import { ActionConfirmation, ActionType } from "./ActionConfirmation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// TypeScript definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: Event) => void;
  onstart: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

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
  const [showActionConfirmation, setShowActionConfirmation] = useState(false);
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({});
  const [isListening, setIsListening] = useState(false);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  const [actionDetails, setActionDetails] = useState<{
    type: ActionType;
    destination?: string;
    accountName?: string;
    amount?: string;
    currency?: string;
    recipient?: string;
  }>({ type: 'block' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setHasRecognitionSupport(true);
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      // Handle recognition results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        // Set input value to the transcript
        setInput(prev => prev + ' ' + transcript.trim());
      };
      
      // Handle end of speech recognition
      recognition.onend = () => {
        setIsListening(false);
      };
      
      // Store recognition instance in ref
      recognitionRef.current = recognition;
    } else {
      console.log('Speech recognition not supported in this browser');
    }
    
    // Clean up
    return () => {
      if (recognitionRef.current) {
        try {
          if (isListening) {
            recognitionRef.current.stop();
          }
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    };
  }, [isListening]);
  
  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Fallback for browsers without speech recognition
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition. Try Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Microphone Error",
          description: "Unable to access microphone. Please check permissions.",
          variant: "destructive"
        });
      }
    }
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
  
  // Parse BC response (Block Card)
  const parseBlockCardResponse = (response: string): boolean => {
    return response === "BC" || response.startsWith("BC;");
  };
  
  // Parse UC response (Unblock Card)
  const parseUnblockCardResponse = (response: string): boolean => {
    return response === "UC" || response.startsWith("UC;");
  };
  
  // Parse SMR response format: SMR;amount;currency;recipient
  const parseMoneyRequestResponse = (response: string): TransferDetails | null => {
    if (!response.startsWith("SMR;")) return null;
    
    const parts = response.split(";");
    if (parts.length !== 4) return null;
    
    return {
      amount: parts[1],
      currency: parts[2],
      recipient: parts[3]
    };
  };
  
  // Parse SA response format: SA;accountName
  const parseSavingsAccountResponse = (response: string): { accountName: string } | null => {
    if (!response.startsWith("SA;")) return null;
    
    const parts = response.split(";");
    if (parts.length !== 2) return null;
    
    return {
      accountName: parts[1]
    };
  };
  
  // Parse NAV response format: NAV;destination
  const parseNavigationResponse = (response: string): { destination: string } | null => {
    if (!response.startsWith("NAV;")) return null;
    
    const parts = response.split(";");
    
    // If it's just "NAV" without a destination
    if (parts.length === 1) {
      return { destination: "requested page" };
    }
    
    if (parts.length !== 2) return null;
    
    return {
      destination: parts[1]
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
  
  const handleConfirmAction = () => {
    let title = "";
    let description = "";
    
    switch (actionDetails.type) {
      case 'block':
        title = "Card Blocked";
        description = "Your card has been successfully blocked.";
        break;
      case 'unblock':
        title = "Card Unblocked";
        description = "Your card has been successfully unblocked.";
        break;
      case 'request':
        title = "Money Request Sent";
        description = `Requested ${actionDetails.amount} ${actionDetails.currency} from ${actionDetails.recipient}`;
        break;
      case 'savings':
        title = "Savings Account Created";
        description = `New savings account "${actionDetails.accountName}" has been created.`;
        break;
      case 'navigate':
        title = "Navigation";
        description = `Navigating to ${actionDetails.destination}`;
        break;
    }
    
    toast({
      title,
      description,
      variant: "default"
    });
    
    setShowActionConfirmation(false);
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
      const apiResponse = await apiRequest("POST", "/api/chatbot", {
        message: input,
      });
      
      const data = await apiResponse.json();
      
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
      
      // Check for different response types
      const responseText = data.response;
      
      // Send Money (SM) - Transfer
      if (responseText.includes("SM;")) {
        const details = parseSendMoneyResponse(responseText);
        if (details) {
          setTransferDetails(details);
          setShowSendMoneyConfirmation(true);
          return;
        }
      }
      
      // Block Card (BC)
      if (parseBlockCardResponse(responseText)) {
        setActionDetails({ type: 'block' });
        setShowActionConfirmation(true);
        return;
      }
      
      // Unblock Card (UC)
      if (parseUnblockCardResponse(responseText)) {
        setActionDetails({ type: 'unblock' });
        setShowActionConfirmation(true);
        return;
      }
      
      // Send Money Request (SMR)
      if (responseText.includes("SMR;")) {
        const details = parseMoneyRequestResponse(responseText);
        if (details) {
          setActionDetails({ 
            type: 'request', 
            amount: details.amount, 
            currency: details.currency, 
            recipient: details.recipient 
          });
          setShowActionConfirmation(true);
          return;
        }
      }
      
      // Savings Account (SA)
      if (responseText.includes("SA;")) {
        const details = parseSavingsAccountResponse(responseText);
        if (details) {
          setActionDetails({ 
            type: 'savings', 
            accountName: details.accountName 
          });
          setShowActionConfirmation(true);
          return;
        }
      }
      
      // Navigation (NAV)
      if (responseText.includes("NAV")) {
        const details = parseNavigationResponse(responseText);
        if (details) {
          setActionDetails({ 
            type: 'navigate', 
            destination: details.destination 
          });
          setShowActionConfirmation(true);
          return;
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
            
            {/* Microphone button for speech-to-text */}
            <button
              type="button"
              onClick={toggleListening}
              className={`rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
                isListening 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              disabled={isLoading || !hasRecognitionSupport}
              title={!hasRecognitionSupport 
                ? "Speech recognition not supported in this browser" 
                : isListening 
                  ? "Stop listening" 
                  : "Start voice input"
              }
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            
            <button
              type="submit"
              className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          
          {isListening && (
            <div className="flex items-center justify-center mt-2 bg-red-500 bg-opacity-10 py-1 px-2 rounded text-xs text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping"></span>
              Listening... Speak now
            </div>
          )}
          
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
      
      {/* Generic Action Confirmation Dialog */}
      <ActionConfirmation
        isOpen={showActionConfirmation}
        onClose={() => setShowActionConfirmation(false)}
        onConfirm={handleConfirmAction}
        actionDetails={actionDetails}
      />
    </div>
  );
}
