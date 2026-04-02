"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Facebook,
  Menu,
  X,
  ArrowRight,
  User,
  LogOut,
  Link2,
  Cpu,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Lock,
  Search,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const HERO_SLIDES = [
  {
    image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Phishing Detection With Advanced AI",
    subtitle: "Protect yourself from phishing attacks with PhishGuard. Real-time URL analysis and actionable insights in seconds."
  },
  {
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Secure Your Digital Identity",
    subtitle: "Advanced algorithms trained on millions of malicious patterns to keep your credentials safe from hackers."
  },
  {
    image: "https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Enterprise-Grade URL Scanning",
    subtitle: "Our hybrid model combines structural analysis with machine learning for industry-leading accuracy."
  }
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]); // Dependency is constant currentSlide

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* --- TOP BAR --- */}
      <div className="bg-[#2c3e50] text-white py-3 px-4 sm:px-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 sm:gap-8">
          <a
            href="mailto:info@phishingdetector.com"
            className="flex items-center gap-2 hover:opacity-80"
          >
            <Mail size={16} />
            <span className="hidden sm:inline">info@phishingdetector.com</span>
          </a>
          <a
            href="tel:+234800000000"
            className="flex items-center gap-2 hover:opacity-80"
          >
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

      {/* --- HEADER NAVIGATION --- */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="text-[#DB333D]" size={28} />
            <span className="text-xl sm:text-2xl font-bold">
              <span className="text-[#DB333D]">Phishing</span>
              <span className="text-[#000129]">Guard</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[#DB333D] font-semibold hover:opacity-80"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-[#000129] hover:text-[#DB333D]"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-4 border-l pl-8 ml-4">
                  <div className="flex items-center gap-2 text-[#000129]">
                    <User size={18} className="text-[#DB333D]" />
                    <span className="font-semibold">{user?.fullName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-gray-500 hover:text-[#DB333D]"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-[#000129] hover:text-[#DB333D]"
                >
                  Sign In
                </Link>
                <Link href="/auth?mode=signup">
                  <Button className="bg-[#DB333D] hover:bg-[#b02a32] text-white px-6">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-3">
            <Link href="/" className="block text-[#DB333D] font-semibold">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block text-[#000129]">
                  Dashboard
                </Link>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-semibold">{user?.fullName}</span>
                  <button onClick={logout} className="text-[#DB333D]">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth" className="block text-[#000129]">
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="block w-full bg-[#DB333D] text-white px-6 py-2 rounded font-semibold text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* --- HERO SECTION (Slider) --- */}
      <section className="relative h-[650px] overflow-hidden bg-black">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              currentSlide === index ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
              style={{
                backgroundImage: `url("${slide.image}")`,
                filter: "brightness(0.35)",
                transform: currentSlide === index ? "scale(1.1)" : "scale(1)"
              }}
            />
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl">
                <div className="mb-6 inline-block animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="px-4 py-2 rounded-full bg-[#DB333D]/20 text-[#DB333D] text-sm font-medium border border-[#DB333D]/30 backdrop-blur-md">
                    Advanced URL Protection
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-[#DB333D] hover:bg-[#b02a32] gap-2 h-12 px-8 text-lg"
                    >
                      Start Scanning <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-black h-12 px-8 text-lg"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
        >
          <ChevronRight size={32} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                currentSlide === i ? "bg-[#DB333D] w-8" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-black">
          {[
            { label: "Total URLs Analyzed", value: "13" },
            { label: "Phishing Detected", value: "3" },
            { label: "Safe URLs Verified", value: "10" },
            { label: "Registered Users", value: "1" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-md transition border border-gray-100"
            >
              <div className="text-4xl font-bold text-[#DB333D] mb-2">
                {stat.value}
              </div>
              <p className="text-gray-700 font-semibold text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="features" className="bg-[#000129] py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            How It Works
          </h2>
          <div className="flex justify-center mb-16">
            <div className="w-16 h-1 bg-[#DB333D]"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                num: 1,
                icon: <Link2 size={32} className="text-white" />,
                title: "Submit URL",
                desc: "Paste any suspicious link into our secure portal for immediate validation.",
              },
              {
                num: 2,
                icon: <Cpu size={32} className="text-white" />,
                title: "ML Analysis",
                desc: "Our AI examines domain reputation, SSL status, and heuristic patterns.",
              },
              {
                num: 3,
                icon: <ShieldCheck size={32} className="text-white" />,
                title: "Get Result",
                desc: "Receive a comprehensive safety report with actionable security insights.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center group">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#DB333D] rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-lg shadow-[#DB333D]/20">
                      {step.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-white text-[#000129] rounded-full flex items-center justify-center font-bold border-4 border-[#000129] z-20 shadow-sm">
                      {step.num}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Technical Breakdown) --- */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#000129] mb-6">
                How It Works: <span className="text-[#DB333D]">Technical Breakdown</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                PhishGuard uses a multi-layered detection engine that combines lexical analysis with deep learning models to achieve 99% accuracy.
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: <Search className="text-[#DB333D]" />,
                    title: "16+ Feature Extraction",
                    desc: "We analyze URL length, entropy, HTTPS flags, dot counts, and TLD popularity to build a comprehensive risk profile."
                  },
                  {
                    icon: <Cpu className="text-[#DB333D]" />,
                    title: "Hybrid ML Engine",
                    desc: "Our system combines Random Forest models with heuristic logic to minimize false positives while maintaining high sensitivity."
                  },
                  {
                    icon: <Zap className="text-[#DB333D]" />,
                    title: "Real-time Verification",
                    desc: "Using lightweight Flask microservices and optimized model weights, we provide a security verdict in under 2 seconds."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 text-black">
                    <div className="mt-1 bg-[#DB333D]/10 p-3 rounded-lg h-fit">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#000129]">{item.title}</h4>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#000129] rounded-2xl p-8 shadow-2xl relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-white/40 text-xs ml-2 font-mono">phishguard-engine --v2.4.0</span>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="text-blue-400"># Initializing Live Scan...</div>
                  <div className="text-white/70 flex justify-between">
                    <span>- Lexical Analysis:</span>
                    <span className="text-green-400">COMPLETE</span>
                  </div>
                  <div className="text-white/70 flex justify-between">
                    <span>- Domain Entropy (3.42):</span>
                    <span className="text-green-400">VERIFIED</span>
                  </div>
                  <div className="text-white/70 flex justify-between">
                    <span>- SSL/TLS Flag:</span>
                    <span className="text-green-400">SECURE</span>
                  </div>
                  <div className="text-white/70 flex justify-between">
                    <span>- ML Verdict Score:</span>
                    <span className="text-yellow-400">98.5% SAFE</span>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 text-white font-bold">
                    RESULT: <span className="text-green-400">URL CLEAN</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#DB333D]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1a3a52] text-white py-12 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-[#DB333D]" size={24} />
              <span className="text-xl font-bold text-white">
                PhishingGuard
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              An AI-powered platform to detect phishing URLs and protect
              organizations from cyber threats.
            </p>
            <div className="flex gap-4">
              <Twitter
                size={20}
                className="cursor-pointer hover:text-[#DB333D]"
              />
              <Linkedin
                size={20}
                className="cursor-pointer hover:text-[#DB333D]"
              />
              <Facebook
                size={20}
                className="cursor-pointer hover:text-[#DB333D]"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 pb-2 border-b border-[#DB333D] w-fit pr-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#DB333D]">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/auth?mode=signup"
                  className="text-gray-300 hover:text-[#DB333D]"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="text-gray-300 hover:text-[#DB333D]"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-[#DB333D]"
                >
                  Detect
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 pb-2 border-b border-[#DB333D] w-fit pr-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">📍 Abuja, Nigeria</li>
              <li className="flex items-center gap-2">
                ✉️ info@phishingdetector.com
              </li>
              <li className="flex items-center gap-2">📞 +234 800 000 0000</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 pb-2 border-b border-[#DB333D] w-fit pr-4">
              Newsletter
            </h3>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-white text-sm focus:ring-1 focus:ring-[#DB333D] outline-none"
              />
              <Button className="w-full bg-[#DB333D] hover:bg-[#b02a32] text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; 2026 PhishingGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
