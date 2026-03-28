import { Shield, Trash2, MessageSquare, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

// Define the Message interface locally to match your ChatContainer
interface Message {
  id: string;
  type: "user" | "bot";
  content?: string;
  url?: string;
  analysis?: any;
  timestamp: Date;
}

interface HeaderProps {
  onClearChat: () => void;
  messages: Message[];
  activeTab: "chat" | "dashboard";
  setActiveTab: (tab: "chat" | "dashboard") => void;
}

export function Header({
  onClearChat,
  messages,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const userMessages = messages.filter((m) => m.type === "user" && m.url);

  return (
    <header className="flex h-full flex-col justify-between p-4 bg-sidebar text-sidebar-foreground">
      {/* --- TOP SECTION: Branding & Navigation --- */}
      <div className="flex flex-col gap-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              PhishGuard
            </h1>
            <p className="text-xs font-medium text-muted-foreground">
              URL Detection
            </p>
          </div>
        </div>

        {/* Main View Navigation */}
        <div className="space-y-2">
          <Button
            onClick={() => setActiveTab("chat")}
            variant={activeTab === "chat" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            URL Scanner
          </Button>
          <Button
            onClick={() => setActiveTab("dashboard")}
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Live Dashboard
          </Button>
        </div>
      </div>

      {/* --- MIDDLE SECTION: Scan History --- */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto py-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
          Scan History
        </h3>
        <div className="flex-1 overflow-y-auto space-y-1 pr-2">
          {userMessages.length > 0 ? (
            userMessages
              .slice()
              .reverse()
              .map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setActiveTab("chat")}
                  className="text-sm truncate px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors border border-transparent hover:border-border"
                  title={msg.url || msg.content}
                >
                  {msg.url || msg.content}
                </div>
              ))
          ) : (
            <div className="text-sm text-muted-foreground text-center mt-6 px-2">
              No scans yet.
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM SECTION: Actions & Settings --- */}
      <div className="flex flex-col gap-4 border-t border-border pt-4">
        {/* Theme Toggle Row */}
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-muted-foreground">
            Theme
          </span>
          <ThemeToggle />
        </div>

        {/* Clear Chat Button */}
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={onClearChat}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear History
        </Button>
      </div>
    </header>
  );
}
