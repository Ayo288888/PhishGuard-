"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (url: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
    } catch {
      console.error("Failed to read clipboard");
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 w-full">
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Paste a URL to scan for phishing..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="w-full h-12 pl-4 pr-12 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#DB333D] transition-all text-[#000129] placeholder:text-gray-400 shadow-sm group-hover:border-gray-200"
          />
          <button
            onClick={handlePaste}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#DB333D] transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard size={18} />
          </button>
        </div>
        <Button
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          className="h-12 px-6 gap-2 bg-[#DB333D] hover:bg-[#b02a32] text-white rounded-xl shadow-lg shadow-[#DB333D]/20 transition-all active:scale-95"
        >
          <Send size={18} />
          <span className="font-bold">Scan URL</span>
        </Button>
      </div>
    </div>
  );
}
