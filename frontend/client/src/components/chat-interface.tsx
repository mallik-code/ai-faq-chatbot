import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Send } from "lucide-react";
import { sendChatMessage } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  confidence?: number;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm your AI assistant. I can help answer questions about our services, policies, and procedures. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (response) => {
      setMessages(prev => [
        ...prev,
        {
          id: response.id,
          type: "assistant",
          content: response.response,
          timestamp: new Date(response.timestamp),
          confidence: response.confidence,
        },
      ]);
      
      // Invalidate stats to update admin panel
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const message = inputMessage.trim();
    if (!message || chatMutation.isPending) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Auto-resize textarea back to single line
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Send to API
    chatMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.round((date.getTime() - Date.now()) / 60000),
      "minute"
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 max-w-3xl message-enter ${
              message.type === "user" ? "ml-auto" : ""
            }`}
          >
            {message.type === "assistant" && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            
            <div className={`flex-1 ${message.type === "user" ? "text-right" : ""}`}>
              <div
                className={`inline-block p-4 rounded-lg shadow-sm ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>
                  {message.type === "user" ? "You" : "AI Assistant"} • {formatTime(message.timestamp)}
                </span>
                {message.confidence && (
                  <span className="text-xs">
                    Confidence: {message.confidence}%
                  </span>
                )}
              </div>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {chatMutation.isPending && (
          <div className="flex items-start gap-3 max-w-3xl">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  autoResize();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here..."
                className="resize-none min-h-[44px] max-h-32"
                rows={1}
                data-testid="input-chat-message"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              size="default"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
