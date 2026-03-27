'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { ChatMessages } from '@/components/chat-messages';
import { ChatInput } from '@/components/chat-input';

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

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSendMessage = async (url: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      url,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const analysisMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        url,
        analysis: {
          status: Math.random() > 0.5 ? 'safe' : Math.random() > 0.5 ? 'suspicious' : 'malicious',
          confidence: Math.floor(Math.random() * 30) + 70,
          ip: '192.168.1.1',
          domainAge: '45 days',
          redirects: Math.floor(Math.random() * 3),
        },
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, analysisMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header onClearChat={handleClearChat} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
