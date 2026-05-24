import Link from "next/link";

export function Footer() {
  const footerLinks = {
    PRODUCT: ["Architecture", "Pricing", "Changelog", "Roadmap"],
    COMPANY: ["About", "Careers", "Press"],
    RESOURCES: ["Docs", "API", "Compliance", "Security"],
  };

  return (
    <footer className="bg-[var(--bg-base)] border-t border-[var(--border-subtle)] pt-20 pb-8 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 rounded-full border border-[var(--border-default)] flex items-center justify-center bg-[var(--bg-surface)] relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-accent)] absolute"></div>
              </div>
              <span className="font-semibold text-lg tracking-tight text-white">LoanLens</span>
            </div>
            
            <p className="text-[15px] text-[var(--text-secondary)] mb-6 max-w-[280px]">
              Credit infrastructure for AI-native banks.
            </p>
            
            <p className="text-[13px] text-[var(--text-muted)]">
              &copy; 2026 LoanLens. A Sydnar Technologies product.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-6">
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link}>
                      <Link 
                        href="#" 
                        className="text-[14px] text-[var(--text-secondary)] hover:text-white transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[12px] text-[var(--text-muted)] flex items-center gap-2">
            system status: operational 
            <span className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="font-mono text-[12px] text-[var(--text-muted)] hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="font-mono text-[12px] text-[var(--text-muted)] hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="font-mono text-[12px] text-[var(--text-muted)] hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
