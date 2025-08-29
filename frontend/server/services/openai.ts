import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ChatResponse {
  response: string;
  confidence: number;
  suggestedFaq?: string;
}

export async function generateChatResponse(
  userMessage: string, 
  availableFaqs: Array<{question: string; answer: string; id: string}>
): Promise<ChatResponse> {
  try {
    // Create context from available FAQs
    const faqContext = availableFaqs.map(faq => 
      `Q: ${faq.question}\nA: ${faq.answer}`
    ).join('\n\n');

    const prompt = `You are a helpful AI assistant for customer support. Use the following FAQ knowledge base to answer user questions accurately and helpfully.

FAQ Knowledge Base:
${faqContext}

User Question: ${userMessage}

Instructions:
1. If the question is directly answered in the FAQ, use that information
2. If the question is related but not exactly covered, provide a helpful response based on the available information
3. If the question is completely outside the scope of the FAQs, politely indicate that and offer to help with topics you can assist with
4. Always be friendly, professional, and concise
5. Respond with JSON in this exact format: {"response": "your answer here", "confidence": 85, "suggestedFaq": "faq_id_if_applicable"}

The confidence should be 0-100 representing how confident you are in your answer.
Only include suggestedFaq if you used a specific FAQ to answer the question.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system", 
          content: "You are a helpful customer support AI assistant. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || '{"response": "I apologize, but I encountered an error processing your request.", "confidence": 0}');
    
    return {
      response: result.response || "I apologize, but I encountered an error processing your request.",
      confidence: Math.max(0, Math.min(100, result.confidence || 0)),
      suggestedFaq: result.suggestedFaq
    };

  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      response: "I apologize, but I'm experiencing technical difficulties. Please try again later or contact our support team directly.",
      confidence: 0
    };
  }
}

export async function generateFaqSuggestions(userMessage: string): Promise<string[]> {
  try {
    const prompt = `Based on this user message: "${userMessage}", suggest 3-5 potential FAQ questions that might be relevant. Return as JSON array of strings.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Generate relevant FAQ suggestions. Respond with JSON array of strings."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 200
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];

  } catch (error) {
    console.error("Error generating FAQ suggestions:", error);
    return [];
  }
}
