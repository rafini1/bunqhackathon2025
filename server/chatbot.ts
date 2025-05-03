import axios from "axios";
import OpenAI from 'openai';

// Simple bot responses for backup when NVIDIA API is not available or has issues
const fallbackResponses = {
  block: "BC",
  unblock: "UC",
  send: "To send money I need to know: the amount, currency, and contact name. Please provide this information.",
  request: "SMR",
  savings: "To open a savings account I need to know what name you want for the account. Please provide this information.",
  navigation: "NAV",
  default: "Finn will answer this"
};

// Function to determine best response from fallback options based on specific commands
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("block") && !lowerMessage.includes("unblock")) {
    return fallbackResponses.block;
  } else if (lowerMessage.includes("unblock")) {
    return fallbackResponses.unblock;
  } else if (lowerMessage.includes("send money") || lowerMessage.includes("transfer") || lowerMessage.includes("pay")) {
    return fallbackResponses.send;
  } else if (lowerMessage.includes("request money") || lowerMessage.includes("ask for payment")) {
    return fallbackResponses.request;
  } else if (lowerMessage.includes("savings") || lowerMessage.includes("save") || lowerMessage.includes("open account")) {
    return fallbackResponses.savings;
  } else if (lowerMessage.includes("find") || lowerMessage.includes("where") || lowerMessage.includes("how to") || lowerMessage.includes("navigate")) {
    return fallbackResponses.navigation;
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
      const systemMessage = "You are a bot with a specific process for customers for a banking app. First you need to identify the question. You only answer certain questions within a specific domain. Block/unblock an account/card code: BC/UC. Send money code: SM. Send a money request code: SMR. Open a savings account code: SA. Navigation through the app or when the user is trying to find something within the app code: NAV. If the question of the customer does not apply to any of the before mentioned domains, then say 'Finn will answer this'. If it does apply every domain needs different information. for BC/UC it does not need anything and the output must be the code. For SM it needs to know the amount that needs to be sent, the currency and the contact name. if any of the variables is not mentioned, ask that what is missing and never fill in information yourself but you are allowed to change the amount needed to the right format and currency to the right format. if all is good then give the output {Code};{amount};{currency};{name}. amount in format ##.## currency in shortcut of 3 characters. and name just a string. For code SA, it needs to know what name the savings account should be. if any of the variables is not mentioned, ask that what is missing and never fill in information yourself. if all is good then give the output {Code};{name}. For code NAV: just give output {code}";
      
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
      
      // Add a simple fallback response when API is unavailable
      const errorResponse = getFallbackResponse(message);
      
      return errorResponse;
    }
  } catch (error: any) {
    console.error("Error in chatbot message handler:", error?.message || "Unknown error");
    return "Finn will answer this";
  }
}
