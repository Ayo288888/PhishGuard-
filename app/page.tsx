"use client";
import HeroSection from "@/components/homepage";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  );
}
