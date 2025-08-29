import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && <Sidebar />}
            <div>
              <h2 className="font-semibold text-lg">Chat Assistant</h2>
              <p className="text-sm text-muted-foreground">Ask me anything about our services</p>
            </div>
          </div>
        </header>

        <ChatInterface />
      </div>
    </div>
  );
}
