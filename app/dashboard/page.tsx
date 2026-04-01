"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ChatContainer } from "@/components/chat-container";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to auth page
    if (!isAuthenticated) {
      // Small delay to ensure localStorage has been checked
      const timer = setTimeout(() => {
        const storedUser = localStorage.getItem("phishguard_user");
        if (!storedUser) {
          router.push("/auth");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DB333D]"></div>
          <p className="text-[#000129] font-semibold animate-pulse">Securing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  );
}
