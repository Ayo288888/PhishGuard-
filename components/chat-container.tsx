"use client";

import { useState, useEffect } from "react";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { Sidebar } from "@/components/sidebar";
import { AnalyticsView } from "@/components/analytics-view";
import { useAuth } from "@/context/AuthContext";

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

const WHITELISTED_DOMAINS = [
  "google.com", "youtube.com", "facebook.com", "twitter.com", "x.com",
  "instagram.com", "linkedin.com", "wikipedia.org", "yahoo.com", "amazon.com",
  "reddit.com", "netflix.com", "microsoft.com", "apple.com", "github.com",
  "stackoverflow.com", "bing.com", "twitch.tv", "discord.com", "whatsapp.com",
  "zoom.us", "tiktok.com", "pinterest.com", "ebay.com", "paypal.com",
  "quora.com", "imdb.com", "yelp.com", "craigslist.org", "zillow.com",
  "adobe.com", "wordpress.com", "blogspot.com", "tumblr.com", "vimeo.com",
  "soundcloud.com", "spotify.com", "nytimes.com", "cnn.com", "bbc.com",
  "theguardian.com", "washingtonpost.com", "foxnews.com", "forbes.com",
  "bloomberg.com", "wsj.com", "reuters.com", "espn.com", "nfl.com",
  "nba.com", "weather.com", "outbrain.com", "taboola.com", "cnbc.com",
  "hulu.com", "disneyplus.com", "hbomax.com", "canva.com", "dropbox.com",
  "box.com", "slack.com", "asana.com", "trello.com", "jira.com",
  "salesforce.com", "hubspot.com", "shopify.com", "stripe.com", "squareup.com",
  "zendesk.com", "intercom.com", "aws.amazon.com", "azure.microsoft.com",
  "cloudflare.com", "fastly.com", "akamai.com", "github.io", "medium.com",
  "substack.com", "patreon.com", "kickstarter.com", "indiegogo.com",
  "etsy.com", "wayfair.com", "homedepot.com", "lowes.com", "target.com",
  "walmart.com", "bestbuy.com", "costco.com", "ikea.com", "alibaba.com",
  "aliexpress.com", "jd.com", "baidu.com", "qq.com", "wechat.com",
  "weibo.com", "bilibili.com", "zhihu.com", "duckduckgo.com", "openai.com",
  "chatgpt.com", "anthropic.com", "eosc-synergy.eu"
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "analytics">("chat");
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.email) return;
      try {
        const response = await fetch(
          `${API_URL}/history?email=${encodeURIComponent(user.email)}`,
        );

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid server response");
        }

        const data = await response.json();
        if (response.ok && Array.isArray(data) && data.length > 0) {
          const historyMessages: Message[] = data.map((item, index) => ({
            id: `history-bot-${index}`,
            type: "bot",
            url: item.target_url,
            analysis: {
              status: item.status,
              confidence: item.confidence,
            },
            data: item,
            timestamp: new Date(),
          }));
          setMessages(historyMessages);
        } else {
          // No history found, show welcome message
          setWelcomeMessage();
        }
      } catch (e) {
        console.error("History fetch failed:", e);
        setWelcomeMessage();
      }
    };

    const setWelcomeMessage = () => {
      if (user) {
        const welcomeMsg: Message = {
          id: "welcome",
          type: "bot",
          content: `Hello ${user.fullName.split(" ")[0]}! 👋 I'm your PhishGuard assistant. Paste any URL below for analysis.`,
          timestamp: new Date(),
        };
        setMessages([welcomeMsg]);
      }
    };

    fetchHistory();
  }, [user?.email]); // Use user?.email as dependency for better stability

  const handleSendMessage = async (rawUrl: string) => {
    const url = rawUrl.trim();
    if (!url) return;

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
          "⚠️ Invalid Input. Please enter a properly formatted URL (e.g., example.com).",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg, errorMsg]);
      return;
    }

    // 1. Add User Message to UI
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      url: url,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      const hostname = urlObj.hostname.toLowerCase();
      const isWhitelisted = WHITELISTED_DOMAINS.some(
        (d) => hostname === d || hostname.endsWith("." + d),
      );

      if (isWhitelisted) {
        setTimeout(() => {
          const safeBotMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "bot",
            url: url,
            analysis: { status: "safe", confidence: 99.99 },
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, safeBotMessage]);
          setIsLoading(false);
        }, 600);
        return;
      }
    } catch (e) {}

    try {
      // 2. Fetch from Backend
      const response = await fetch(`${API_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email: user?.email }),
      });

      // 3. FIX: Check if response is actually JSON to avoid "Unexpected token <"
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorBody = await response.text();
        console.error("Backend Error Body:", errorBody);
        throw new Error(
          "Server sent back HTML instead of JSON. Check if Flask is running on port 5000.",
        );
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Scan failed");

      // 4. Update UI with Bot Results
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
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: `❌ Error: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    if (user) {
      setMessages([
        {
          id: "welcome-" + Date.now(),
          type: "bot",
          content: `History cleared. Ready for a new scan!`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#f8fafc] overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClearHistory={handleClearHistory}
        messages={messages}
      />
      <main className="flex-1 flex flex-col min-w-0 relative">
        {activeTab === "chat" ? (
          <div className="flex-1 flex flex-col h-full bg-white shadow-inner">
            <div className="flex-1 overflow-hidden">
              <ChatMessages messages={messages} isLoading={isLoading} />
            </div>
            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
              <div className="max-w-4xl mx-auto">
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
                <p className="text-[10px] text-gray-400 mt-3 text-center">
                  PhishGuard AI can make mistakes. Verify important information.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto bg-gray-50/50">
            <div className="max-w-6xl mx-auto">
              <AnalyticsView messages={messages} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
