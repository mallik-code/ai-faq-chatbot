import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { FaqTable } from "@/components/faq-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { getStats, getChatHistory } from "@/services/api";
import { HelpCircle, TrendingUp, CheckCircle, User } from "lucide-react";

export default function Admin() {
  const isMobile = useIsMobile();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: getStats,
  });

  const { data: recentChats = [] } = useQuery({
    queryKey: ["/api/chat/history"],
    queryFn: () => getChatHistory(5),
  });

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && <Sidebar />}
            <div>
              <h2 className="font-semibold text-lg">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">Manage FAQs and monitor chat activity</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Admin Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">FAQ Management</h2>
                <p className="text-muted-foreground">Manage your knowledge base and chatbot responses</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total FAQs</p>
                      <p className="text-2xl font-bold" data-testid="text-total-faqs">
                        {stats?.totalFaqs || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Queries</p>
                      <p className="text-2xl font-bold" data-testid="text-monthly-queries">
                        {stats?.monthlyQueries || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Resolution Rate</p>
                      <p className="text-2xl font-bold" data-testid="text-resolution-rate">
                        {stats?.resolutionRate || "0%"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Management Table */}
            <FaqTable />

            {/* Recent Chat Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Chat Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentChats.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No recent chat activity
                    </p>
                  ) : (
                    recentChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                        data-testid={`chat-activity-${chat.id}`}
                      >
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-secondary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              User asked: {chat.user_message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(chat.created_at)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            AI: {chat.ai_response.length > 100 
                              ? `${chat.ai_response.substring(0, 100)}...` 
                              : chat.ai_response
                            }
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                              {chat.resolved === "true" ? "Resolved" : "Pending"}
                            </span>
                            {chat.confidence && (
                              <span className="text-xs text-muted-foreground">
                                Confidence: {chat.confidence}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
