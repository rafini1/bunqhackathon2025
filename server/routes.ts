import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { handleChatbotMessage } from "./chatbot";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API routes
  app.get("/api/accounts", async (req, res) => {
    try {
      // For demonstration, we'll return default accounts
      // In a real app, this would check the session and get user-specific accounts
      const userId = 1; // Default user ID for demo
      const accounts = await storage.getAccountsByUserId(userId);
      return res.status(200).json(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return res.status(500).json({ message: "Error fetching accounts" });
    }
  });

  app.get("/api/actions-needed", async (req, res) => {
    try {
      const userId = 1; // Default user ID for demo
      const actions = await storage.getActionsByUserId(userId);
      return res.status(200).json(actions);
    } catch (error) {
      console.error("Error fetching actions needed:", error);
      return res.status(500).json({ message: "Error fetching actions needed" });
    }
  });

  // Chatbot API endpoint
  app.post("/api/chatbot", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Invalid message format" });
      }
      
      const userId = 1; // Default user ID for demo
      
      // Store user message
      await storage.insertChatMessage({
        userId,
        role: "user",
        content: message,
      });
      
      // Get response from NVIDIA API via the chatbot handler
      const response = await handleChatbotMessage(message);
      
      // Store system response
      await storage.insertChatMessage({
        userId,
        role: "system",
        content: response,
      });
      
      return res.status(200).json({ response });
    } catch (error) {
      console.error("Error processing chatbot message:", error);
      return res.status(500).json({ 
        message: "Error processing your message",
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again later."
      });
    }
  });

  app.get("/api/chat-history", async (req, res) => {
    try {
      const userId = 1; // Default user ID for demo
      const chatHistory = await storage.getChatHistoryByUserId(userId);
      return res.status(200).json(chatHistory);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return res.status(500).json({ message: "Error fetching chat history" });
    }
  });

  return httpServer;
}
