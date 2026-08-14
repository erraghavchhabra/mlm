"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Cpu, Sparkles, ArrowUpRight, LayoutDashboard } from "lucide-react";

export default function FrontNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); // Tracks current active page route

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check login state from localStorage token/user
    const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!(token || user));
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "FAQ's", href: "/faq" },
    { name: "Packages", href: "/packages" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "pt-2 px-4 sm:px-8" : "pt-4 px-4 sm:px-8"
      }`}
    >
      {/* Container constrained to max 1400px */}
      <div className="max-w-[1400px] mx-auto">
        <nav className="h-20 px-6 flex items-center justify-between rounded-2xl bg-[#0b0e26]/60 backdrop-blur-xl border border-[#2d356b]/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          {/* 1. Left Side: Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#6E5CFF] via-[#5D72FF] to-[#3B488D] p-[1px] shadow-[0_0_20px_rgba(110,92,255,0.4)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0b0e26] rounded-[11px] flex items-center justify-center">
                <Cpu className="h-5 w-5 text-[#8B94FF] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-tech text-lg font-bold tracking-wider text-white flex items-center gap-1">
                AURA<span className="text-[#8B94FF]">.AI</span>
              </span>
              <span className="font-mono-tech text-[9px] text-[#6E5CFF] tracking-widest uppercase -mt-1">
                v2.0 Active
              </span>
            </div>
          </Link>

          {/* 2. Center: Floating Nav Pills */}
          <div className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#12163b]/80 border border-[#2B3164]/50 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-xs font-mono-tech uppercase tracking-wider transition-all duration-300 rounded-full ${
                    isActive
                      ? "text-white font-semibold bg-[#6E5CFF]/20 border border-[#6E5CFF]/40 shadow-[0_0_12px_rgba(110,92,255,0.3)]"
                      : "text-[#A6ABC9] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* 3. Right Side: Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/user/dashboard"
                className="group font-tech relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white overflow-hidden bg-gradient-to-r from-[#5D72FF] via-[#6E5CFF] to-[#8B94FF] shadow-[0_0_20px_rgba(93,114,255,0.4)] hover:shadow-[0_0_28px_rgba(93,114,255,0.6)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="group font-tech relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white overflow-hidden bg-gradient-to-r from-[#5D72FF] via-[#6E5CFF] to-[#8B94FF] shadow-[0_0_20px_rgba(93,114,255,0.4)] hover:shadow-[0_0_28px_rgba(93,114,255,0.6)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Sign In</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-[#181B42] text-[#A6ABC9] hover:text-white border border-[#2B3164] transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 bg-[#0b0e26]/95 backdrop-blur-2xl border border-[#2B3164] rounded-2xl p-6 flex flex-col gap-3 md:hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B3164]/50">
              <span className="font-mono-tech text-xs text-[#8B94FF]">
                [ NAVIGATION MENU ]
              </span>
              <span className="flex items-center gap-1.5 font-mono-tech text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-tech text-sm tracking-wide text-[#A6ABC9] hover:text-white py-2.5 px-4 rounded-xl hover:bg-[#181B42] transition-all flex items-center justify-between group"
              >
                <span>{link.name}</span>
                <Sparkles className="w-4 h-4 text-[#6E5CFF] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}

            {isLoggedIn ? (
              <Link
                href="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 w-full text-center py-3.5 rounded-xl font-tech text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#5D72FF] to-[#7B84FF] shadow-lg flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 w-full text-center py-3.5 rounded-xl font-tech text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#5D72FF] to-[#7B84FF] shadow-lg flex items-center justify-center gap-2"
              >
                Sign In
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}