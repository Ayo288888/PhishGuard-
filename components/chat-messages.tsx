"use client";

import { Message } from "@/components/chat-container";
import { UserMessage } from "./user-message";
import { BotAnalysis } from "./bot-analysis";
import { Loader2, AlertCircle, ShieldAlert } from "lucide-react";
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
      className="flex flex-col gap-8 p-8 overflow-y-auto h-full scroll-smooth bg-white"
    >
      {messages.length === 0 && !isLoading && (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
          <div className="p-4 bg-gray-50 rounded-full">
            <ShieldAlert size={40} className="text-gray-200" />
          </div>
          <p className="italic font-medium">No scan history in this session. Start by pasting a URL.</p>
        </div>
      )}

      {messages.map((msg) => {
        if (msg.type === "user") {
          return (
            <UserMessage
              key={msg.id}
              url={msg.url || msg.content || ""}
            />
          );
        }

        if (msg.type === "bot") {
          // If valid scan result exists
          if (msg.analysis) {
            return (
              <BotAnalysis
                key={msg.id}
                analysis={msg.analysis as any}
                url={msg.url || ""}
              />
            );
          }

          // IF TEXT MESSAGE or ERROR
          return (
            <div key={msg.id} className="flex justify-start items-start gap-3 animate-in fade-in duration-300">
               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                <AlertCircle size={16} className="text-[#DB333D]" />
              </div>
              <div className="bg-gray-50 text-[#000129] border border-gray-100 p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm">
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          );
        }
        return null;
      })}

      {isLoading && (
        <div className="flex items-center gap-3 text-[#DB333D] animate-pulse pl-2 font-bold py-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm tracking-wide">
            PHISHGUARD AI ANALYZING URL...
          </span>
        </div>
      )}
    </div>
  );
}
