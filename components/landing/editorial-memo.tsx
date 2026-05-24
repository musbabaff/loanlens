import Link from "next/link";

export function EditorialMemo() {
  return (
    <section className="py-24 bg-[var(--bg-elevated)] relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column - Text Content */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-4 bg-[var(--brand-accent)] rounded-full"></div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
              OUTPUT
            </div>
          </div>
          
          <h2 className="text-3xl md:text-[36px] font-semibold tracking-tight text-white mb-6 leading-[1.1]">
            The memo your committee actually reads.
          </h2>
          
          <p className="text-[16px] text-[var(--text-secondary)] leading-[1.55] mb-10 max-w-[380px]">
            LoanLens doesn't just extract data. It synthesizes complex financial narratives into formal, structured, cite-rich documents that are immediately ready for credit committee review.
          </p>
          
          <ul className="space-y-4 font-mono text-[13px]">
            <li>
              <Link href="#" className="text-[var(--text-muted)] hover:text-[var(--brand-accent)] transition-colors flex items-center gap-2">
                <span className="text-[var(--brand-accent)]">→</span> Sample memo (PDF)
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[var(--text-muted)] hover:text-[var(--brand-accent)] transition-colors flex items-center gap-2">
                <span className="text-[var(--brand-accent)]">→</span> Citation methodology
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[var(--text-muted)] hover:text-[var(--brand-accent)] transition-colors flex items-center gap-2">
                <span className="text-[var(--brand-accent)]">→</span> Audit trail format
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column - The Memo Card */}
        <div className="lg:col-span-7 relative">
          {/* Subtle background element */}
          <div className="absolute -inset-4 bg-[var(--brand-primary)]/20 blur-xl rounded-full opacity-50 -z-10"></div>
          
          <div className="bg-[#F5F7FA] border border-gray-200 shadow-2xl rounded-md p-8 md:p-10 max-w-[540px] mx-auto lg:mx-0 lg:-rotate-1 lg:origin-bottom-right transition-transform hover:rotate-0 duration-500 text-[#0A2540]">
            <div className="text-center border-b-2 border-gray-200 pb-6 mb-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">
                Internal Memorandum
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#0A2540]">
                Credit Committee Review
              </h3>
            </div>
            
            <div className="mb-6 grid grid-cols-2 gap-y-6 gap-x-4 font-mono text-xs border-b border-gray-200 pb-8">
              <div>
                <div className="text-gray-500 uppercase mb-1">Entity</div>
                <div className="font-semibold text-[#0A2540]">Acme Logistics</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase mb-1">Risk Score</div>
                <div className="font-semibold text-emerald-600">A2 - Prime</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase mb-1">Amount</div>
                <div className="font-semibold text-[#0A2540]">$1,500,000</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase mb-1">Generated</div>
                <div className="font-semibold text-[#0A2540]">03:14 min</div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[14px] leading-[1.6] text-gray-700">
                <span className="font-semibold text-[#0A2540]">Executive Summary: </span> 
                AI agents have reconciled 3 years of 1120S tax returns against 24 months of operating bank statements. Zero material variances detected in stated revenue across 14 independent cross-checks.
              </p>
              
              <div className="bg-white p-5 border-l-2 border-[var(--brand-accent)] text-[14px] text-gray-600 italic shadow-sm rounded-r">
                "Automated cross-referencing flagged a minor discrepancy in self-reported income, resolved via secondary document parsing. No manual intervention required."
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
