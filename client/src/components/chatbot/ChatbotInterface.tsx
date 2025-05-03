import React, { useState, useRef, useEffect } from "react";
import { X, Send, Cpu, Mic, MicOff } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { SendMoneyConfirmation } from "./SendMoneyConfirmation";
import { ActionConfirmation, ActionType } from "./ActionConfirmation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useBalance } from "../../contexts/BalanceContext";

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
  const { updateBalances, totalBalance } = useBalance();
  
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
  const parseSendMoneyResponse = (responseStr: string): TransferDetails | null => {
    if (!responseStr.startsWith("SM;")) return null;
    
    const parts = responseStr.split(";");
    if (parts.length !== 4) return null;
    
    return {
      amount: parts[1],
      currency: parts[2],
      recipient: parts[3]
    };
  };
  
  // Parse BC response (Block Card)
  const parseBlockCardResponse = (responseStr: string): boolean => {
    return responseStr === "BC" || responseStr.startsWith("BC;");
  };
  
  // Parse UC response (Unblock Card)
  const parseUnblockCardResponse = (responseStr: string): boolean => {
    return responseStr === "UC" || responseStr.startsWith("UC;");
  };
  
  // Parse SMR response format: SMR;amount;currency;recipient
  const parseMoneyRequestResponse = (responseStr: string): TransferDetails | null => {
    if (!responseStr.startsWith("SMR;")) return null;
    
    const parts = responseStr.split(";");
    if (parts.length !== 4) return null;
    
    return {
      amount: parts[1],
      currency: parts[2],
      recipient: parts[3]
    };
  };
  
  // Parse SA response format: SA;accountName
  const parseSavingsAccountResponse = (responseStr: string): { accountName: string } | null => {
    if (!responseStr.startsWith("SA;")) return null;
    
    const parts = responseStr.split(";");
    if (parts.length !== 2) return null;
    
    return {
      accountName: parts[1]
    };
  };
  
  // Parse NAV response format: NAV;destination
  const parseNavigationResponse = (responseStr: string): { destination: string } | null => {
    if (!responseStr.startsWith("NAV;")) return null;
    
    const parts = responseStr.split(";");
    
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
    // Check if we have sufficient balance
    if (transferDetails.amount) {
      const amountToDeduct = parseFloat(transferDetails.amount);
      if (!isNaN(amountToDeduct) && amountToDeduct <= totalBalance) {
        // Process the transfer
        toast({
          title: "Transfer Successful",
          description: `Sent ${transferDetails.amount} ${transferDetails.currency} to ${transferDetails.recipient}`,
          variant: "default"
        });
        
        // Deduct the amount from the balance
        updateBalances(amountToDeduct);
        
        // Add confirmation message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "system",
            content: `Transfer completed successfully. ${transferDetails.amount} ${transferDetails.currency} has been sent to ${transferDetails.recipient}.`,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Handle insufficient balance
        toast({
          title: "Transfer Failed",
          description: "You don't have enough funds to complete this transfer.",
          variant: "destructive"
        });
        
        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "system",
            content: `I'm sorry, but you don't have enough funds to send ${transferDetails.amount} ${transferDetails.currency}. Your current balance is €${totalBalance.toFixed(2).replace('.', ',')}.`,
            timestamp: new Date(),
          },
        ]);
      }
    }
    
    setShowSendMoneyConfirmation(false);
  };
  
  const handleConfirmAction = () => {
    let title = "";
    let description = "";
    let chatMessage = "";
    
    switch (actionDetails.type) {
      case 'block':
        title = "Card Blocked";
        description = "Your card has been successfully blocked.";
        chatMessage = "Your card has been successfully blocked. If you need to unblock it later, just ask me.";
        break;
      case 'unblock':
        title = "Card Unblocked";
        description = "Your card has been successfully unblocked.";
        chatMessage = "Your card has been successfully unblocked. You can now use it for transactions.";
        break;
      case 'request':
        title = "Money Request Sent";
        description = `Requested ${actionDetails.amount} ${actionDetails.currency} from ${actionDetails.recipient}`;
        chatMessage = `Money request completed. You've requested ${actionDetails.amount} ${actionDetails.currency} from ${actionDetails.recipient}. They'll be notified shortly.`;
        break;
      case 'savings':
        title = "Savings Account Created";
        description = `New savings account "${actionDetails.accountName}" has been created.`;
        chatMessage = `Your new savings account "${actionDetails.accountName}" has been created successfully. You can start adding funds to it right away.`;
        break;
      case 'navigate':
        title = "Navigation";
        description = `Navigating to ${actionDetails.destination}`;
        chatMessage = `Navigating to ${actionDetails.destination} page. Is there anything specific you'd like to do there?`;
        break;
    }
    
    toast({
      title,
      description,
      variant: "default"
    });
    
    // Add confirmation message to chat
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "system",
        content: chatMessage,
        timestamp: new Date(),
      },
    ]);
    
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
      
      // Check for different response types before adding to chat
      const responseText = data.response;
      let displayResponse = responseText;
      let showActionCompleted = false;
      
      // Send Money (SM) - Transfer
      if (responseText.includes("SM;")) {
        const details = parseSendMoneyResponse(responseText);
        if (details) {
          setTransferDetails(details);
          setShowSendMoneyConfirmation(true);
          displayResponse = "I'll help you send money. Please confirm the details.";
          showActionCompleted = true;
        }
      }
      
      // Block Card (BC)
      else if (parseBlockCardResponse(responseText)) {
        setActionDetails({ type: 'block' });
        setShowActionConfirmation(true);
        displayResponse = "I'll help you block your card. Please confirm this action.";
        showActionCompleted = true;
      }
      
      // Unblock Card (UC)
      else if (parseUnblockCardResponse(responseText)) {
        setActionDetails({ type: 'unblock' });
        setShowActionConfirmation(true);
        displayResponse = "I'll help you unblock your card. Please confirm this action.";
        showActionCompleted = true;
      }
      
      // Send Money Request (SMR)
      else if (responseText.includes("SMR;")) {
        const details = parseMoneyRequestResponse(responseText);
        if (details) {
          setActionDetails({ 
            type: 'request', 
            amount: details.amount, 
            currency: details.currency, 
            recipient: details.recipient 
          });
          setShowActionConfirmation(true);
          displayResponse = "I'll help you request money. Please confirm the details.";
          showActionCompleted = true;
        }
      }
      
      // Savings Account (SA)
      else if (responseText.includes("SA;")) {
        const details = parseSavingsAccountResponse(responseText);
        if (details) {
          setActionDetails({ 
            type: 'savings', 
            accountName: details.accountName 
          });
          setShowActionConfirmation(true);
          displayResponse = "I'll help you create a savings account. Please confirm the details.";
          showActionCompleted = true;
        }
      }
      
      // Navigation (NAV)
      else if (responseText.includes("NAV")) {
        const details = parseNavigationResponse(responseText);
        if (details) {
          setActionDetails({ 
            type: 'navigate', 
            destination: details.destination 
          });
          setShowActionConfirmation(true);
          displayResponse = "I'll help you navigate to the requested page. Please confirm this action.";
          showActionCompleted = true;
        }
      }
      
      // Add the AI response to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "system",
          content: displayResponse,
          timestamp: new Date(),
        },
      ]);
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
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Finn</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-black bg-opacity-30 text-white px-2 py-0.5 rounded-full flex items-center">
              <span className="w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
              NVIDIA AI
            </span>
            <button onClick={onClose} className="text-white hover:text-gray-200">
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
              placeholder="Ask Finn about bunq banking..."
              className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
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
                  : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
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
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
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
