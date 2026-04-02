"use client";

import { useState, useEffect } from "react";
import { Terminal, User, Activity, Clock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  timestamp: string;
  type: string;
  email: string;
  details: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export function SystemLogsView() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${API_URL}/system-logs`);
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#000129] flex items-center gap-3">
          <Terminal className="text-[#DB333D]" size={28} />
          System Logs
        </h2>
        <p className="text-gray-500 mt-1">
          Detailed audit trail of user logins, URL detections, and session activities.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DB333D] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading system logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Event Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Activity Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                      No system logs available.
                    </td>
                  </tr>
                ) : (
                  logs.slice().reverse().map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock size={14} />
                          <span className="text-sm">{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          log.type === "LOGIN" ? "bg-blue-100 text-blue-800" : 
                          log.type === "DETECTION" ? "bg-purple-100 text-purple-800" :
                          "bg-gray-100 text-gray-800"
                        )}>
                          {log.type === "LOGIN" ? <User size={12} className="mr-1" /> : <Activity size={12} className="mr-1" />}
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">{log.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 font-mono text-xs">{log.details}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
