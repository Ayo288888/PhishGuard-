"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Copy,
  Check,
  Shield,
} from "lucide-react";

interface BotAnalysisProps {
  analysis:
    | {
        status: "safe" | "suspicious" | "malicious";
        confidence: number;
        ip?: string;
        domainAge?: string;
        redirects?: number;
      }
    | undefined;
  url: string;
}

export function BotAnalysis({ analysis, url }: BotAnalysisProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!analysis) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfig = {
    safe: {
      bg: "bg-green-50",
      border: "border-green-200",
      accent: "bg-green-500",
      text: "text-green-700",
      icon: CheckCircle2,
      label: "Verified Safe",
      description: "This URL appears to be legitimate and safe to visit.",
    },
    suspicious: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      accent: "bg-amber-500",
      text: "text-amber-700",
      icon: AlertTriangle,
      label: "Suspicious Activity",
      description: "This URL shows signs of being potentially malicious. Proceed with caution.",
    },
    malicious: {
      bg: "bg-red-50",
      border: "border-red-200",
      accent: "bg-red-500",
      text: "text-red-700",
      icon: XCircle,
      label: "Phishing Detected",
      description: "This URL is likely to be phishing or malware. Do not visit.",
    },
  };

  const config = statusConfig[analysis.status];
  const IconComponent = config.icon;

  return (
    <div className="flex justify-start items-start gap-3 group animate-in slide-in-from-left-4 duration-300">
      <div className="w-8 h-8 rounded-full bg-[#DB333D] flex items-center justify-center shrink-0 mt-1 shadow-md shadow-[#DB333D]/20">
        <Shield size={16} className="text-white" />
      </div>
      
      <div className="w-full max-w-xl">
        <div className={`bg-white border ${config.border} rounded-2xl overflow-hidden shadow-xl shadow-black/5`}>
          {/* Status Header */}
          <div className={`${config.bg} px-6 py-4 border-b ${config.border}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.accent} text-white`}>
                <IconComponent size={20} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${config.text}`}>{config.label}</h3>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed font-medium italic">
              "{config.description}"
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 bg-white">
            {/* Confidence Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  AI Confidence
                </p>
                <span className={`text-sm font-black ${config.text}`}>
                  {analysis.confidence}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${config.accent} transition-all duration-1000 ease-out`}
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
            </div>

            {/* Technical Details */}
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-t border-gray-100 pt-4">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-xs font-bold text-gray-500 hover:text-[#000129] transition-colors group/trigger">
                  VIEW SCAN METADATA
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Target IP</p>
                    <code className="text-xs font-mono font-bold text-[#000129]">{analysis.ip || "N/A"}</code>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Domain Age</p>
                    <p className="text-xs font-bold text-[#000129]">{analysis.domainAge || "New Domain"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Redirects</p>
                    <p className="text-xs font-bold text-[#000129]">{analysis.redirects || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Scan Status</p>
                    <p className="text-xs font-bold text-green-600">Complete</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 font-medium">
          PhishGuard AI Analysis • Real-time Scan
        </p>
      </div>
    </div>
  );
}
