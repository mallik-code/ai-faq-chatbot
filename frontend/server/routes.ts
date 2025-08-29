import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFaqSchema, insertChatMessageSchema } from "@shared/schema";
import { generateChatResponse } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // FAQ Routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const { search, category } = req.query;
      let faqs;
      
      if (search) {
        faqs = await storage.searchFaqs(search as string);
      } else {
        faqs = await storage.getAllFaqs();
      }
      
      if (category && category !== "All Categories") {
        faqs = faqs.filter(faq => faq.category === category);
      }
      
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  app.get("/api/faqs/:id", async (req, res) => {
    try {
      const faq = await storage.getFaqById(req.params.id);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQ" });
    }
  });

  app.post("/api/faqs", async (req, res) => {
    try {
      const validatedData = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(validatedData);
      res.status(201).json(faq);
    } catch (error) {
      res.status(400).json({ message: "Invalid FAQ data", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.put("/api/faqs/:id", async (req, res) => {
    try {
      const validatedData = insertFaqSchema.partial().parse(req.body);
      const faq = await storage.updateFaq(req.params.id, validatedData);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.json(faq);
    } catch (error) {
      res.status(400).json({ message: "Invalid FAQ data", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.delete("/api/faqs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFaq(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete FAQ" });
    }
  });

  // Chat Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get all FAQs to provide context to AI
      const faqs = await storage.getAllFaqs();
      const faqContext = faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer
      }));

      // Generate AI response
      const aiResponse = await generateChatResponse(message.trim(), faqContext);
      
      // If AI used a specific FAQ, increment its usage
      if (aiResponse.suggestedFaq) {
        await storage.incrementFaqUsage(aiResponse.suggestedFaq);
      }

      // Save chat message
      const chatMessage = await storage.createChatMessage({
        user_message: message.trim(),
        ai_response: aiResponse.response,
        confidence: aiResponse.confidence,
        resolved: "true"
      });

      res.json({
        id: chatMessage.id,
        response: aiResponse.response,
        confidence: aiResponse.confidence,
        timestamp: chatMessage.created_at
      });

    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getRecentChatMessages(limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Stats Route
  app.get("/api/stats", async (req, res) => {
    try {
      const faqs = await storage.getAllFaqs();
      const chatMessages = await storage.getAllChatMessages();
      
      const totalFaqs = faqs.length;
      const monthlyQueries = chatMessages.filter(msg => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return new Date(msg.created_at) > monthAgo;
      }).length;
      
      const resolvedQueries = chatMessages.filter(msg => msg.resolved === "true").length;
      const resolutionRate = chatMessages.length > 0 ? 
        Math.round((resolvedQueries / chatMessages.length) * 100) : 100;

      res.json({
        totalFaqs,
        monthlyQueries,
        resolutionRate: `${resolutionRate}%`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
