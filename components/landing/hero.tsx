import { ArrowRight } from "lucide-react";
import { TerminalLog } from "./terminal-log";
import Link from "next/link";

export function Hero() {
  return (
    <header className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--brand-accent)]/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-default)] bg-transparent text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-accent)]"></span>
            v2.0 Execution Engine
          </div>
          
          <h1 className="text-4xl md:text-[56px] lg:text-[72px] font-semibold tracking-[-0.02em] leading-[1.05] mb-6 text-white">
            See through every loan application.
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 leading-[1.55] max-w-[540px]">
            Multi-agent AI reads documents, detects fraud, and writes audit-ready credit memos in 3 minutes instead of 4 hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)] h-10 px-6 rounded-md font-medium hover:bg-[var(--brand-accent)]/90 transition-all text-sm"
              style={{ boxShadow: '0 0 0 1px rgba(0,212,255,0.2), 0 0 24px rgba(0,212,255,0.15)' }}
            >
              Deploy Agents
            </Link>
            <Link 
              href="#architecture"
              className="inline-flex items-center justify-center bg-transparent text-white h-10 px-6 rounded-md font-medium hover:bg-[var(--bg-surface)] transition-all text-sm gap-2"
            >
              View Architecture <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <div>
              <div className="font-mono text-white text-lg md:text-xl font-medium mb-1 tracking-tight">3 min</div>
              <div className="text-[12px] text-[var(--text-muted)]">avg memo time</div>
            </div>
            <div className="w-[1px] h-8 bg-[var(--border-subtle)]"></div>
            <div>
              <div className="font-mono text-white text-lg md:text-xl font-medium mb-1 tracking-tight">99.8%</div>
              <div className="text-[12px] text-[var(--text-muted)]">extraction accuracy</div>
            </div>
            <div className="w-[1px] h-8 bg-[var(--border-subtle)]"></div>
            <div>
              <div className="font-mono text-white text-lg md:text-xl font-medium mb-1 tracking-tight">&lt;200ms</div>
              <div className="text-[12px] text-[var(--text-muted)]">agent latency</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 relative">
          <TerminalLog />
        </div>
      </div>
    </header>
  );
}
