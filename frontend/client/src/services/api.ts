import { apiRequest } from "@/lib/queryClient";
import type { Faq, InsertFaq, ChatMessage } from "@shared/schema";

export interface ChatResponse {
  id: string;
  response: string;
  confidence: number;
  timestamp: string;
}

export interface StatsResponse {
  totalFaqs: number;
  monthlyQueries: number;
  resolutionRate: string;
}

// FAQ API functions
export async function getFaqs(search?: string, category?: string): Promise<Faq[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  
  const response = await apiRequest('GET', `/api/faqs?${params.toString()}`);
  return response.json();
}

export async function createFaq(faq: InsertFaq): Promise<Faq> {
  const response = await apiRequest('POST', '/api/faqs', faq);
  return response.json();
}

export async function updateFaq(id: string, faq: Partial<InsertFaq>): Promise<Faq> {
  const response = await apiRequest('PUT', `/api/faqs/${id}`, faq);
  return response.json();
}

export async function deleteFaq(id: string): Promise<void> {
  await apiRequest('DELETE', `/api/faqs/${id}`);
}

// Chat API functions
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await apiRequest('POST', '/api/chat', { message });
  return response.json();
}

export async function getChatHistory(limit?: number): Promise<ChatMessage[]> {
  const params = limit ? `?limit=${limit}` : '';
  const response = await apiRequest('GET', `/api/chat/history${params}`);
  return response.json();
}

// Stats API function
export async function getStats(): Promise<StatsResponse> {
  const response = await apiRequest('GET', '/api/stats');
  return response.json();
}
