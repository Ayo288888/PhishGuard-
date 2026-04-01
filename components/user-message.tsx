"use client";

import { Copy, Check, User } from "lucide-react";
import { useState } from "react";

interface UserMessageProps {
  url: string;
}

export function UserMessage({ url }: UserMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-end items-start gap-3 group animate-in slide-in-from-right-4 duration-300">
      <div className="max-w-[85%] sm:max-w-md">
        <div className="bg-[#000129] text-white p-4 rounded-2xl rounded-tr-none shadow-lg shadow-blue-900/10">
          <div className="flex items-center justify-between gap-4 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              URL to Scan
            </span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} className="text-blue-400" />
              )}
            </button>
          </div>
          <p className="break-all font-mono text-sm leading-relaxed border-t border-white/5 pt-2 mt-1">
            {url}
          </p>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-right font-medium">
          Sent by you
        </p>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0 mt-1 shadow-sm">
        <User size={16} className="text-gray-500" />
      </div>
    </div>
  );
}
