"use client";

import { Shield, ShieldAlert, ShieldCheck, Globe, Calendar, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "./chat-container";

interface HistoryViewProps {
  type: "phishing" | "non-phishing";
  messages: Message[];
}

export function HistoryView({ type, messages }: HistoryViewProps) {
  const filteredHistory = messages.filter(m => {
    if (m.type !== "bot" || !m.analysis) return false;
    if (type === "phishing") return m.analysis.status === "malicious" || m.analysis.status === "suspicious";
    return m.analysis.status === "safe";
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[#000129] flex items-center gap-3">
          {type === "phishing" ? (
            <>
              <ShieldAlert className="text-[#DB333D]" size={28} />
              Phishing Detection History
            </>
          ) : (
            <>
              <ShieldCheck className="text-green-500" size={28} />
              Safe URL History
            </>
          )}
        </h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Viewing all {type === "phishing" ? "malicious and suspicious" : "verified safe"} URLs detected by the system.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">URL Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    No history found for this category.
                  </td>
                </tr>
              ) : (
                filteredHistory.slice().reverse().map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          item.analysis?.status === "safe" ? "bg-green-50" : "bg-red-50"
                        )}>
                          <Globe size={18} className={item.analysis?.status === "safe" ? "text-green-600" : "text-[#DB333D]"} />
                        </div>
                        <div className="max-w-md">
                          <p className="text-sm font-semibold text-[#000129] truncate">{item.url}</p>
                          <p className="text-xs text-gray-400">Scan ID: {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        item.analysis?.status === "safe" ? "bg-green-100 text-green-800" : 
                        item.analysis?.status === "malicious" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      )}>
                        {item.analysis?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Percent size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {item.analysis?.confidence.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        <span className="text-sm">
                          {item.timestamp.toLocaleString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
