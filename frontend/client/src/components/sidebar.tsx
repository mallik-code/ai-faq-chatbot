import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MessageCircle, Settings, BarChart3, Bot, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Chat", href: "/", icon: MessageCircle },
  { name: "Admin Panel", href: "/admin", icon: Settings },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

function SidebarContent() {
  const [location] = useLocation();

  return (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">FAQ Assistant</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Support</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-secondary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" data-testid="button-sidebar-toggle">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className={`w-64 bg-card border-r border-border ${className || ""}`}>
      <SidebarContent />
    </div>
  );
}
