import React, { useState } from "react";
import { AccountsSection } from "@/components/home/AccountsSection";
import { ActionNeeded } from "@/components/home/ActionNeeded";
import { ActionButtons } from "@/components/home/ActionButtons";
import { PromoBanner } from "@/components/home/PromoBanner";
import { ChatbotButton } from "@/components/chatbot/ChatbotButton";
import { ChatbotInterface } from "@/components/chatbot/ChatbotInterface";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-full flex flex-col">
      <ActionNeeded />
      <AccountsSection />
      <ActionButtons />
      <div className="mt-auto">
        <PromoBanner />
      </div>
      <ChatbotButton onClick={() => setIsChatOpen(true)} />
      <ChatbotInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}
