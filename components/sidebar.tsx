"use client";

import { MessageSquare, BarChart3, History, Trash2, Shield, ExternalLink, ChevronDown, ChevronRight, Terminal, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Message } from "./chat-container";

export type DashboardTab = "chat" | "analytics" | "history-phishing" | "history-non-phishing" | "system-logs";

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onClearHistory: () => void;
  messages: Message[];
}

export function Sidebar({ activeTab, setActiveTab, onClearHistory, messages }: SidebarProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const scanHistory = messages.filter(m => m.type === "bot" && m.analysis);
  const historyCount = scanHistory.length;

  return (
    <div className="w-64 border-r bg-[#000129] text-white flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="text-[#DB333D]" size={24} />
          <span className="text-lg font-bold">PhishGuard</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
              activeTab === "chat" 
                ? "bg-[#DB333D] text-white shadow-lg shadow-[#DB333D]/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <MessageSquare size={20} />
            <span className="font-medium">Chat Assistant</span>
          </button>

          {/* Detection History Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <History size={20} />
                <span className="font-medium">Detection History</span>
              </div>
              {isHistoryOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {isHistoryOpen && (
              <div className="pl-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => setActiveTab("history-phishing")}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm text-left",
                    activeTab === "history-phishing"
                      ? "bg-[#DB333D]/20 text-[#DB333D] font-bold"
                      : "text-gray-500 hover:text-white"
                  )}
                >
                  <ShieldAlert size={16} />
                  <span>Phishing URLs</span>
                </button>
                <button
                  onClick={() => setActiveTab("history-non-phishing")}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm text-left",
                    activeTab === "history-non-phishing"
                      ? "bg-[#DB333D]/20 text-[#DB333D] font-bold"
                      : "text-gray-500 hover:text-white"
                  )}
                >
                  <ShieldCheck size={16} />
                  <span>Non-Phishing URLs</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
              activeTab === "analytics" 
                ? "bg-[#DB333D] text-white shadow-lg shadow-[#DB333D]/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("system-logs")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
              activeTab === "system-logs" 
                ? "bg-[#DB333D] text-white shadow-lg shadow-[#DB333D]/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Terminal size={20} />
            <span className="font-medium">System Logs</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <History size={14} />
            Recent Activity ({historyCount})
          </h3>
        </div>
        
        <div className="space-y-2">
          {scanHistory.length === 0 ? (
            <p className="text-xs text-gray-600 italic px-2">No recent scans</p>
          ) : (
            scanHistory.slice().reverse().map((msg) => (
              <div 
                key={msg.id}
                className="group flex flex-col gap-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-default"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded",
                    msg.analysis?.status === "safe" ? "bg-green-500/20 text-green-400" :
                    msg.analysis?.status === "malicious" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {msg.analysis?.status}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {msg.analysis?.confidence.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden">
                  <p className="text-xs text-gray-300 truncate font-mono">
                    {msg.url}
                  </p>
                  <button 
                    onClick={() => {
                      if (msg.url) window.open(msg.url.startsWith('http') ? msg.url : `https://${msg.url}`, '_blank');
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Open URL"
                  >
                    <ExternalLink size={10} className="text-gray-500 hover:text-white" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={onClearHistory}
          className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-400/10 gap-2"
        >
          <Trash2 size={18} />
          Clear History
        </Button>
      </div>
    </div>
  );
}
