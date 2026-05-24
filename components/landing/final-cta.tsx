import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-24 bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)] relative z-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[400px] bg-[var(--brand-accent)]/10 blur-[100px] rounded-[100%] pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-6">
          READY?
        </div>
        
        <h2 className="text-3xl md:text-[48px] font-semibold tracking-tight text-white mb-10 leading-[1.1]">
          Let's see the next memo write itself.
        </h2>
        
        <div className="flex flex-col items-center">
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center bg-[var(--brand-accent)] text-[var(--brand-accent-foreground)] h-12 px-8 rounded-md font-semibold hover:bg-[var(--brand-accent)]/90 transition-all text-[15px] mb-6"
            style={{ boxShadow: '0 0 0 1px rgba(0,212,255,0.2), 0 0 24px rgba(0,212,255,0.15)' }}
          >
            Deploy Your First Agent
          </Link>
          
          <p className="text-[13px] text-[var(--text-muted)] font-mono">
            No credit card. Sandbox environment provisioned in seconds.
          </p>
        </div>
      </div>
    </section>
  );
}
