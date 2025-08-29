import { type User, type InsertUser, type Faq, type InsertFaq, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // FAQ operations
  getAllFaqs(): Promise<Faq[]>;
  getFaqById(id: string): Promise<Faq | undefined>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: string, faq: Partial<InsertFaq>): Promise<Faq | undefined>;
  deleteFaq(id: string): Promise<boolean>;
  searchFaqs(query: string): Promise<Faq[]>;
  incrementFaqUsage(id: string): Promise<void>;
  
  // Chat operations
  getAllChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getRecentChatMessages(limit?: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private faqs: Map<string, Faq>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.faqs = new Map();
    this.chatMessages = new Map();
    
    // Initialize with some default FAQs
    this.initializeDefaultFaqs();
  }

  private initializeDefaultFaqs() {
    const defaultFaqs: InsertFaq[] = [
      {
        question: "What are your business hours?",
        answer: "Our business hours are Monday through Friday, 9:00 AM to 6:00 PM EST. We also offer limited weekend support on Saturdays from 10:00 AM to 2:00 PM EST.",
        category: "General"
      },
      {
        question: "How do I reset my password?",
        answer: "To reset your password, click on the 'Forgot Password' link on the login page and follow the instructions sent to your email address.",
        category: "Technical"
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.",
        category: "Billing"
      }
    ];

    defaultFaqs.forEach(faq => {
      const id = randomUUID();
      const now = new Date();
      this.faqs.set(id, {
        id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || "General",
        usage_count: Math.floor(Math.random() * 150),
        created_at: now,
        updated_at: now
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllFaqs(): Promise<Faq[]> {
    return Array.from(this.faqs.values()).sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  async getFaqById(id: string): Promise<Faq | undefined> {
    return this.faqs.get(id);
  }

  async createFaq(insertFaq: InsertFaq): Promise<Faq> {
    const id = randomUUID();
    const now = new Date();
    const faq: Faq = {
      id,
      question: insertFaq.question,
      answer: insertFaq.answer,
      category: insertFaq.category || "General",
      usage_count: 0,
      created_at: now,
      updated_at: now
    };
    this.faqs.set(id, faq);
    return faq;
  }

  async updateFaq(id: string, updateData: Partial<InsertFaq>): Promise<Faq | undefined> {
    const existingFaq = this.faqs.get(id);
    if (!existingFaq) return undefined;

    const updatedFaq: Faq = {
      ...existingFaq,
      ...updateData,
      updated_at: new Date()
    };
    this.faqs.set(id, updatedFaq);
    return updatedFaq;
  }

  async deleteFaq(id: string): Promise<boolean> {
    return this.faqs.delete(id);
  }

  async searchFaqs(query: string): Promise<Faq[]> {
    const allFaqs = await this.getAllFaqs();
    if (!query.trim()) return allFaqs;

    const searchTerm = query.toLowerCase();
    return allFaqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.category.toLowerCase().includes(searchTerm)
    );
  }

  async incrementFaqUsage(id: string): Promise<void> {
    const faq = this.faqs.get(id);
    if (faq) {
      faq.usage_count += 1;
      faq.updated_at = new Date();
      this.faqs.set(id, faq);
    }
  }

  async getAllChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      id,
      user_message: insertMessage.user_message,
      ai_response: insertMessage.ai_response,
      confidence: insertMessage.confidence || null,
      resolved: insertMessage.resolved || "true",
      created_at: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getRecentChatMessages(limit: number = 10): Promise<ChatMessage[]> {
    const allMessages = await this.getAllChatMessages();
    return allMessages.slice(0, limit);
  }
}

export const storage = new MemStorage();
