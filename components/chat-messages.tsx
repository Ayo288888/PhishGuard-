"use client";

import { Message } from "@/components/chat-container";
import { UserMessage } from "./user-message";
import { BotAnalysis } from "./bot-analysis";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";

export function ChatMessages({
  messages,
  isLoading,
}: {
  messages: (Message & { data?: any })[];
  isLoading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col gap-6 p-6 overflow-y-auto h-full scroll-smooth"
    >
      {messages.length === 0 && !isLoading && (
        <div className="h-full flex items-center justify-center text-muted-foreground italic">
          Enter a URL to check its safety status.
        </div>
      )}

      {messages.map((msg) => {
        if (msg.type === "user") {
          return (
            <UserMessage
              key={msg.id}
              url={msg.data?.url || msg.content || ""}
            />
          );
        }

        if (msg.type === "bot") {
          // If valid scan result exists
          if (msg.data && msg.data.verdict) {
            return (
              <BotAnalysis
                key={msg.id}
                analysis={msg.data}
                url={msg.data.target_url || ""}
              />
            );
          }

          // IF ERROR MESSAGE (This was the missing piece!)
          return (
            <div key={msg.id} className="flex justify-start">
              <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-2xl rounded-tl-none max-w-[85%] flex items-start gap-3 shadow-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Validation Error</p>
                  <p className="text-sm opacity-90">{msg.content}</p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}

      {isLoading && (
        <div className="flex items-center gap-3 text-muted-foreground animate-pulse pl-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium">
            Scanning with PhishGuard AI...
          </span>
        </div>
      )}
    </div>
  );
}
