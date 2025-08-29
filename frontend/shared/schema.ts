import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull().default("General"),
  usage_count: integer("usage_count").notNull().default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const chat_messages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_message: text("user_message").notNull(),
  ai_response: text("ai_response").notNull(),
  confidence: integer("confidence"), // 0-100
  resolved: text("resolved").notNull().default("true"), // "true" or "false"
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  usage_count: true,
  created_at: true,
  updated_at: true,
});

export const insertChatMessageSchema = createInsertSchema(chat_messages).omit({
  id: true,
  created_at: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chat_messages.$inferSelect;
