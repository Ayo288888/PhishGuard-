"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, Send } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

// 1. Updated interface to match what ChatContainer is passing
interface ChatInputProps {
  onSend: (url: string) => void;
  disabled: boolean;
}

// 2. Updated the destructured props here
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
      onSend(inputValue.trim()); // 3. Updated function call
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 4. Updated to use 'disabled' instead of 'isLoading'
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background">
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 w-full">
          <InputGroup className="flex-1">
            <InputGroupInput
              placeholder="Paste a URL to scan for phishing..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled} // 5. Updated prop
              className="placeholder:text-muted-foreground"
            />
            <InputGroupAddon>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePaste}
                disabled={disabled} // 6. Updated prop
                className="h-full rounded-r-none border-0"
                title="Paste from clipboard"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <Button
            onClick={handleSend}
            disabled={disabled || !inputValue.trim()} // 7. Updated prop
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Scan</span>
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Enter a URL and press Enter or click Scan to check its safety
        </p>
      </div>
    </div>
  );
}
