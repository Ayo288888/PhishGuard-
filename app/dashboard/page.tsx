"use client";

import { Navbar } from "@/components/navbar";
import { ChatContainer } from "@/components/chat-container";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <ChatContainer />
      </main>
    </div>
  );
}
