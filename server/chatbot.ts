import axios from "axios";
import OpenAI from 'openai';

// Simple bot responses for backup when NVIDIA API is not available or has issues
const fallbackResponses = {
  addMoney: "You can add money to your bunq account by making a bank transfer from another account, requesting money from a friend, or depositing cash at certain locations.",
  accountTypes: "bunq offers several account types: Main account for everyday banking, Savings account for earning interest, and Joint accounts for sharing with others. You can also have sub-accounts for specific purposes.",
  fees: "bunq offers different subscription plans with varying fees. The basic plan starts at €2.99/month, while premium plans offer more features and accounts for €8.99/month. There are no hidden fees for basic transactions.",
  cardInfo: "bunq offers both physical and virtual debit and credit cards. You can customize your card design, set spending limits, and freeze/unfreeze your cards instantly via the app.",
  investment: "bunq offers investment options through the Easy Investments feature. You can invest in various ETFs and manage your portfolio directly from the app.",
  travel: "bunq is great for travel! You can spend abroad with no markup on exchange rates, withdraw cash worldwide, and even get travel insurance with premium plans.",
  security: "bunq takes security seriously with features like biometric authentication, instant card blocking, transaction notifications, and secure chat support.",
  default: "Hi there! I'm your bunq AI assistant. I can help you manage your finances, explore banking options, and provide personalized advice. How can I assist you today with your banking needs?"
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
    // Get NVIDIA API key from environment variables
    const apiKey = process.env.NVIDIA_API_KEY;
    
    if (!apiKey) {
      // Fall back to simple responses if no API key is available
      console.log("NVIDIA API key not found, using fallback responses");
      return getFallbackResponse(message);
    }
    
    try {
      console.log("Calling NVIDIA API with message:", message);
      
      // Prepare the system message to provide context for the AI
      const systemMessage = "You are an advanced AI assistant integrated with bunq bank's services. You can help users manage their finances, understand banking products, and provide personalized financial advice. Be friendly, professional, and use a conversational tone. When possible, suggest relevant bunq features that might help the customer based on their questions.";
      
      // Create OpenAI client with NVIDIA API configuration
      const openai = new OpenAI({
        apiKey: apiKey, // Use the NVIDIA API key from environment variables
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });

      // Make the API call using OpenAI client format
      console.log("Making request to NVIDIA API using OpenAI client");
      const completion = await openai.chat.completions.create({
        model: "nvidia/llama-3.3-nemotron-super-49b-v1",
        messages: [
          {role: "system", content: systemMessage},
          {role: "user", content: message}
        ],
        temperature: 0.6,
        top_p: 0.95,
        max_tokens: 1000,
        stream: false,
      });
      
      console.log("NVIDIA API response received successfully");
      
      // Extract the response content
      if (completion && completion.choices && completion.choices.length > 0) {
        const choice = completion.choices[0];
        
        // Log the choice structure for debugging
        console.log("NVIDIA API choice structure:", Object.keys(choice).join(', '));
        
        if (choice.message && choice.message.content) {
          console.log("Received valid response from NVIDIA API");
          return choice.message.content;
        }
      }
      
      console.log("Unexpected API response format, using fallback");
      return getFallbackResponse(message);
    } catch (error: any) {
      console.error("Error calling NVIDIA API:", error?.message || "Unknown error");
      
      // Add detailed error logging
      if (error.response) {
        console.error("NVIDIA API error status:", error.response.status);
        console.error("NVIDIA API error details:", JSON.stringify(error.response.data, null, 2));
      } else {
        console.error("No response object in error");
      }
      
      // Add a more specific fallback response for API errors
      const errorResponse = "I'm having trouble connecting to my advanced AI service right now. As your bunq financial assistant, I can still help with common banking questions. " + getFallbackResponse(message);
      
      return errorResponse;
    }
  } catch (error: any) {
    console.error("Error in chatbot message handler:", error?.message || "Unknown error");
    return "I'm sorry, I'm having trouble understanding right now. Please try again later.";
  }
}
