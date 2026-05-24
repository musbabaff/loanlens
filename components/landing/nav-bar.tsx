"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 64);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center bg-white/5 relative">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-accent)] absolute"></div>
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">LoanLens</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#agents" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">
            Agents
          </Link>
          <Link href="#architecture" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">
            Architecture
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-accent)] transition-colors">
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium px-4 py-2 border border-[var(--border-subtle)] rounded-md hover:bg-[var(--bg-surface)] hover:text-white transition-all"
          >
            Console &rarr;
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[var(--text-muted)] hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-6 py-4 flex flex-col gap-4">
          <Link href="#agents" className="text-sm font-medium text-[var(--text-muted)]" onClick={() => setMobileMenuOpen(false)}>
            Agents
          </Link>
          <Link href="#architecture" className="text-sm font-medium text-[var(--text-muted)]" onClick={() => setMobileMenuOpen(false)}>
            Architecture
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-[var(--text-muted)]" onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </Link>
          <div className="h-[1px] bg-[var(--border-subtle)] my-2"></div>
          <Link href="/login" className="text-sm font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--brand-accent)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Console &rarr;
          </Link>
        </div>
      )}
    </nav>
  );
}
