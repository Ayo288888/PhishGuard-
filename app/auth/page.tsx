"use client";

import { Shield, Mail, Phone, Twitter, Linkedin, Facebook, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { login, signup, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    try {
      if (isSignIn) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          setLocalError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        await signup({ email, fullName, password });
      }
    } catch (err: any) {
      // Error handled by AuthContext or caught here
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-[#2c3e50] text-white py-3 px-4 sm:px-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 sm:gap-8">
          <a href="mailto:info@phishingdetector.com" className="flex items-center gap-2 hover:opacity-80">
            <Mail size={16} />
            <span className="hidden sm:inline">info@phishingdetector.com</span>
          </a>
          <a href="tel:+234800000000" className="flex items-center gap-2 hover:opacity-80">
            <Phone size={16} />
            <span className="hidden sm:inline">+234 800 000 0000</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Twitter size={18} className="cursor-pointer hover:opacity-80" />
          <Linkedin size={18} className="cursor-pointer hover:opacity-80" />
          <Facebook size={18} className="cursor-pointer hover:opacity-80" />
        </div>
      </div>

      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="text-[#DB333D]" size={28} />
            <span className="text-xl sm:text-2xl font-bold">
              <span className="text-[#DB333D]">Phishing</span>
              <span className="text-[#000129]">Guard</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-[#000129] hover:text-[#DB333D] font-semibold transition">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Auth Form Section */}
      <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 bg-gray-50/50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#000129] mb-2">
                {isSignIn ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-600">
                {isSignIn 
                  ? "Access your phishing detection dashboard" 
                  : "Join us to detect phishing URLs and stay safe"}
              </p>
            </div>

            {displayError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded animate-in fade-in duration-300">
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignIn && (
                <div>
                  <label className="block text-sm font-semibold text-[#000129] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB333D] text-black"
                    required={!isSignIn}
                    disabled={isLoading}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#000129] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB333D] text-black"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#000129] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB333D] text-black"
                  required
                  disabled={isLoading}
                />
              </div>

              {!isSignIn && (
                <div>
                  <label className="block text-sm font-semibold text-[#000129] mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB333D] text-black"
                    required={!isSignIn}
                    disabled={isLoading}
                  />
                </div>
              )}

              {isSignIn && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#DB333D] focus:ring-[#DB333D]" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-[#DB333D] hover:opacity-80 font-medium">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#DB333D] hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-lg font-bold transition mt-6 shadow-lg shadow-[#DB333D]/20 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
                {isSignIn ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="text-center mt-8">
              <p className="text-gray-600">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignIn(!isSignIn);
                    setLocalError(null);
                  }}
                  className="text-[#DB333D] font-bold hover:underline ml-1"
                  disabled={isLoading}
                >
                  {isSignIn ? "Sign up here" : "Sign in here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1a3a52] text-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
          <p>&copy; 2026 PhishingGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
