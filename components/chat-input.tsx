'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, Send } from 'lucide-react';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';

interface ChatInputProps {
  onSendMessage: (url: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
    } catch {
      console.error('Failed to read clipboard');
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
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
              disabled={isLoading}
              className="placeholder:text-muted-foreground"
            />
            <InputGroupAddon>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePaste}
                disabled={isLoading}
                className="h-full rounded-r-none border-0"
                title="Paste from clipboard"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
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
