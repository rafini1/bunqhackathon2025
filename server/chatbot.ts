import axios from "axios";

// Simple bot responses for demo when NVIDIA API is not available
const fallbackResponses = {
  addMoney: "You can add money to your bunq account by making a bank transfer from another account, requesting money from a friend, or depositing cash at certain locations.",
  accountTypes: "bunq offers several account types: Main account for everyday banking, Savings account for earning interest, and Joint accounts for sharing with others. You can also have sub-accounts for specific purposes.",
  fees: "bunq offers different subscription plans with varying fees. The basic plan starts at €2.99/month, while premium plans offer more features and accounts for €8.99/month. There are no hidden fees for basic transactions.",
  cardInfo: "bunq offers both physical and virtual debit and credit cards. You can customize your card design, set spending limits, and freeze/unfreeze your cards instantly via the app.",
  investment: "bunq offers investment options through the Easy Investments feature. You can invest in various ETFs and manage your portfolio directly from the app.",
  travel: "bunq is great for travel! You can spend abroad with no markup on exchange rates, withdraw cash worldwide, and even get travel insurance with premium plans.",
  security: "bunq takes security seriously with features like biometric authentication, instant card blocking, transaction notifications, and secure chat support.",
  default: "I'm your bunq banking assistant. I can help you with account information, transactions, and general banking questions. What would you like to know about?"
};

// Function to determine best response from fallback options
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("add money") || lowerMessage.includes("deposit")) {
    return fallbackResponses.addMoney;
  } else if (lowerMessage.includes("account type") || lowerMessage.includes("account options")) {
    return fallbackResponses.accountTypes;
  } else if (lowerMessage.includes("fee") || lowerMessage.includes("cost") || lowerMessage.includes("price") || lowerMessage.includes("subscription")) {
    return fallbackResponses.fees;
  } else if (lowerMessage.includes("card") || lowerMessage.includes("credit card") || lowerMessage.includes("debit card")) {
    return fallbackResponses.cardInfo;
  } else if (lowerMessage.includes("invest") || lowerMessage.includes("etf") || lowerMessage.includes("stock")) {
    return fallbackResponses.investment;
  } else if (lowerMessage.includes("travel") || lowerMessage.includes("abroad") || lowerMessage.includes("foreign")) {
    return fallbackResponses.travel;
  } else if (lowerMessage.includes("secure") || lowerMessage.includes("security") || lowerMessage.includes("safe")) {
    return fallbackResponses.security;
  } else {
    return fallbackResponses.default;
  }
}

// Handler for chatbot messages
export async function handleChatbotMessage(message: string): Promise<string> {
  try {
    // In a real implementation, this would connect to NVIDIA API
    // For example using the NVIDIA API key from environment variables
    const apiKey = process.env.NVIDIA_API_KEY;
    
    if (!apiKey) {
      // Fall back to simple responses if no API key is available
      console.log("NVIDIA API key not found, using fallback responses");
      return getFallbackResponse(message);
    }
    
    try {
      // This is where the actual NVIDIA API call would go
      // const response = await axios.post(
      //   'https://api.nvidia.com/ai/endpoint',
      //   {
      //     prompt: message,
      //     max_tokens: 150,
      //   },
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${apiKey}`,
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );
      
      // return response.data.choices[0].text;
      
      // For now, return fallback responses since we don't have real API access
      return getFallbackResponse(message);
    } catch (apiError) {
      console.error("Error calling NVIDIA API:", apiError);
      return getFallbackResponse(message);
    }
  } catch (error) {
    console.error("Error in chatbot message handler:", error);
    return "I'm sorry, I'm having trouble understanding right now. Please try again later.";
  }
}
