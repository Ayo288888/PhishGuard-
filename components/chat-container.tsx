"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";

export interface Message {
  id: string;
  type: "user" | "bot";
  content?: string;
  url?: string;
  analysis?: {
    status: "safe" | "suspicious" | "malicious";
    confidence: number;
    ip?: string;
    domainAge?: string;
    redirects?: number;
  };
  data?: any;
  timestamp: Date;
}

// --- THE TOP 100+ WHITELIST ---
const WHITELISTED_DOMAINS = [
  "google.com",
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "x.com",
  "instagram.com",
  "linkedin.com",
  "wikipedia.org",
  "yahoo.com",
  "amazon.com",
  "reddit.com",
  "netflix.com",
  "microsoft.com",
  "apple.com",
  "github.com",
  "stackoverflow.com",
  "bing.com",
  "twitch.tv",
  "discord.com",
  "whatsapp.com",
  "zoom.us",
  "tiktok.com",
  "pinterest.com",
  "ebay.com",
  "paypal.com",
  "quora.com",
  "imdb.com",
  "yelp.com",
  "craigslist.org",
  "zillow.com",
  "adobe.com",
  "wordpress.com",
  "blogspot.com",
  "tumblr.com",
  "vimeo.com",
  "soundcloud.com",
  "spotify.com",
  "nytimes.com",
  "cnn.com",
  "bbc.com",
  "theguardian.com",
  "washingtonpost.com",
  "foxnews.com",
  "forbes.com",
  "bloomberg.com",
  "wsj.com",
  "reuters.com",
  "espn.com",
  "nfl.com",
  "nba.com",
  "weather.com",
  "outbrain.com",
  "taboola.com",
  "cnbc.com",
  "hulu.com",
  "disneyplus.com",
  "hbomax.com",
  "canva.com",
  "dropbox.com",
  "box.com",
  "slack.com",
  "asana.com",
  "trello.com",
  "jira.com",
  "salesforce.com",
  "hubspot.com",
  "shopify.com",
  "stripe.com",
  "squareup.com",
  "zendesk.com",
  "intercom.com",
  "aws.amazon.com",
  "azure.microsoft.com",
  "cloudflare.com",
  "fastly.com",
  "akamai.com",
  "github.io",
  "medium.com",
  "substack.com",
  "patreon.com",
  "kickstarter.com",
  "indiegogo.com",
  "etsy.com",
  "wayfair.com",
  "homedepot.com",
  "lowes.com",
  "target.com",
  "walmart.com",
  "bestbuy.com",
  "costco.com",
  "ikea.com",
  "alibaba.com",
  "aliexpress.com",
  "jd.com",
  "baidu.com",
  "qq.com",
  "wechat.com",
  "weibo.com",
  "bilibili.com",
  "zhihu.com",
  "duckduckgo.com",
  "openai.com",
  "chatgpt.com",
  "anthropic.com",
];

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "dashboard">("chat");

  useEffect(() => {
    const savedHistory = localStorage.getItem("phishguard_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsed);
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("phishguard_history", JSON.stringify(messages));
    }
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem("phishguard_history");
  };

  const handleSendMessage = async (rawUrl: string) => {
    const url = rawUrl.trim();
    if (!url) return;

    // --- 1. STRICT URL VALIDATION ---
    const strictUrlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/;

    if (!strictUrlPattern.test(url) || url.includes(" ")) {
      const userMsg: Message = {
        id: Date.now().toString(),
        type: "user",
        content: url,
        timestamp: new Date(),
      };
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "⚠️ Invalid Input. Please enter a properly formatted URL (e.g., example.com or https://example.com).",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg, errorMsg]);
      return;
    }

    // Add user message to UI
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      url: url,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // --- 2. WHITELIST INTERCEPTION ---
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      const hostname = urlObj.hostname.toLowerCase();

      const isWhitelisted = WHITELISTED_DOMAINS.some(
        (domain) => hostname === domain || hostname.endsWith("." + domain),
      );

      if (isWhitelisted) {
        setTimeout(() => {
          const safeBotMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "bot",
            url: url,
            analysis: { status: "safe", confidence: 99.99 },
            data: {
              target_url: url,
              verdict: "safe",
              status: "safe",
              confidence: 99.99,
              threat_level: "LOW (Verified Whitelist)",
            },
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, safeBotMessage]);
          setIsLoading(false);
        }, 600);
        return;
      }
    } catch (e) {
      console.log("Failed to parse hostname for whitelist check");
    }

    // --- 3. PROCEED TO BACKEND SCAN ---
    try {
      // ---> THE DEPLOYMENT FIX IS HERE <---
      // It looks for a Vercel variable first, then defaults to localhost.
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

      const response = await fetch(`${apiUrl}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Scan failed");
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        url: url,
        analysis: {
          status: data.status,
          confidence: data.confidence,
        },
        data: data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: error.message || "Unable to connect to the scanning server.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[600px] w-full bg-background rounded-xl overflow-hidden border shadow-2xl">
      <div className="w-64 border-r bg-muted/30 hidden md:block">
        <Header
          messages={messages}
          onClearChat={handleClearChat}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 relative bg-chat-pattern">
        {activeTab === "chat" ? (
          <>
            <div className="flex-1 overflow-hidden">
              <ChatMessages messages={messages} isLoading={isLoading} />
            </div>
            <div className="p-4 border-t bg-background/80 backdrop-blur-md">
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
          </>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">
                Scan Statistics
              </h2>
              <div className="grid gap-4">
                {messages
                  .filter((m) => m.type === "bot" && m.analysis)
                  .map((scan) => (
                    <div
                      key={scan.id}
                      className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${
                        scan.analysis?.status === "malicious"
                          ? "bg-red-500/5 border-red-500/20"
                          : "bg-green-500/5 border-green-500/20"
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            scan.analysis?.status === "malicious"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {scan.analysis?.status === "malicious"
                            ? "Phishing Detected"
                            : "Verified Safe"}
                        </span>
                        <span className="text-sm font-medium truncate opacity-90">
                          {scan.url}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold bg-muted px-2 py-1 rounded">
                          {scan.analysis?.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                {messages.filter((m) => m.type === "bot" && m.analysis)
                  .length === 0 && (
                  <p className="text-center text-muted-foreground py-20 italic">
                    No scan data found.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
