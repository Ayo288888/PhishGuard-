'use client';

import { useEffect, useRef } from 'react';
import { UserMessage } from '@/components/user-message';
import { BotAnalysis } from '@/components/bot-analysis';
import { LoadingState } from '@/components/loading-state';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content?: string;
  url?: string;
  analysis?: {
    status: 'safe' | 'suspicious' | 'malicious';
    confidence: number;
    ip?: string;
    domainAge?: string;
    redirects?: number;
  };
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Start Scanning URLs</h2>
            <p className="max-w-sm text-muted-foreground">
              Paste a URL below to check if it's safe, suspicious, or potentially malicious. Get instant analysis with detailed insights.
            </p>
          </div>
        )}

        {messages.map((message) =>
          message.type === 'user' ? (
            <UserMessage key={message.id} url={message.url || ''} />
          ) : (
            <BotAnalysis key={message.id} analysis={message.analysis} url={message.url || ''} />
          )
        )}

        {isLoading && <LoadingState />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
