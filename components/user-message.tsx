'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="flex justify-end">
      <div className="max-w-xs rounded-xl bg-muted px-4 py-3 sm:max-w-md">
        <div className="flex items-start justify-between gap-2">
          <p className="break-all font-mono text-sm text-foreground">{url}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 w-6 flex-shrink-0 p-0"
            title="Copy URL"
          >
            {copied ? <Check className="h-4 w-4 text-safe" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
