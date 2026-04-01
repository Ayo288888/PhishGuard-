"use client";

import { Message } from "@/components/chat-container";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Shield, ShieldAlert, ShieldCheck, Activity } from "lucide-react";

interface AnalyticsViewProps {
  messages: Message[];
}

export function AnalyticsView({ messages }: AnalyticsViewProps) {
  const scans = messages.filter((m) => m.type === "bot" && m.analysis);
  const total = scans.length;
  const safe = scans.filter((s) => s.analysis?.status === "safe").length;
  const malicious = scans.filter((s) => s.analysis?.status === "malicious").length;
  const suspicious = scans.filter((s) => s.analysis?.status === "suspicious").length;

  const pieData = [
    { name: "Safe", value: safe, color: "#22c55e" },
    { name: "Malicious", value: malicious, color: "#ef4444" },
    { name: "Suspicious", value: suspicious, color: "#f59e0b" },
  ].filter(d => d.value > 0);

  // Stats for bar chart (last 7 scans or similar)
  const barData = scans.slice(-7).map((s, i) => ({
    name: `Scan ${total - scans.slice(-7).length + i + 1}`,
    confidence: s.analysis?.confidence || 0,
    status: s.analysis?.status,
  }));

  // Timeline data (by hour/day if we had more info, but let's just use indices for now)
  const timelineData = scans.map((s, i) => ({
    time: i + 1,
    confidence: s.analysis?.confidence || 0,
  }));

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Activity size={40} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-[#000129] mb-2">No Data Available</h3>
        <p className="text-gray-500 max-w-sm">
          Start scanning URLs in the Chat Assistant to see real-time analytics and threat patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#000129]">Security Analytics</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1">
            <ShieldCheck size={14} /> {safe} Safe
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200 flex items-center gap-1">
            <ShieldAlert size={14} /> {malicious} Malicious
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Scans</p>
          <p className="text-4xl font-bold text-[#000129]">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Avg Confidence</p>
          <p className="text-4xl font-bold text-[#DB333D]">
            {(scans.reduce((acc, s) => acc + (s.analysis?.confidence || 0), 0) / total).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Threat Ratio</p>
          <p className="text-4xl font-bold text-red-500">
            {((malicious / total) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-lg font-bold text-[#000129] mb-6">Threat Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-lg font-bold text-[#000129] mb-6">Recent Scan Confidence</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="confidence" fill="#DB333D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] lg:col-span-2">
          <h3 className="text-lg font-bold text-[#000129] mb-6">Detection Accuracy Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DB333D" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#DB333D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" label={{ value: 'Scan Sequential', position: 'insideBottom', offset: -5 }} />
                <YAxis unit="%" />
                <Tooltip />
                <Area type="monotone" dataKey="confidence" stroke="#DB333D" fillOpacity={1} fill="url(#colorConf)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
