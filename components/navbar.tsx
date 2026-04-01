"use client";

import Link from "next/link";
import { Shield, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="text-[#DB333D]" size={28} />
          <span className="text-xl sm:text-2xl font-bold">
            <span className="text-[#DB333D]">Phishing</span>
            <span className="text-[#000129]">Guard</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#DB333D] flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <span className="text-sm font-semibold text-[#000129] pr-1">
              {user?.fullName || "User"}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={logout}
            className="text-gray-500 hover:text-[#DB333D] gap-2"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </nav>
    </header>
  );
}
