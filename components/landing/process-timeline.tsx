export function ProcessTimeline() {
  const steps = [
    {
      num: "01",
      title: "Ingest",
      desc: "Upload PDFs or initiate voice intake. Documents stream to extraction agents.",
    },
    {
      num: "02",
      title: "Verify",
      desc: "Five parallel agents reconcile claims against forensic metadata, industry benchmarks, and cross-document consistency.",
    },
    {
      num: "03",
      title: "Synthesize",
      desc: "Risk scoring, condition recommendations, and a structured credit memo are generated with full citations.",
    },
    {
      num: "04",
      title: "Deliver",
      desc: "Memo, decision letter, and audit package — exportable as PDF, DOCX, or signed compliance bundle.",
    },
  ];

  return (
    <section className="py-24 bg-[var(--bg-base)] border-t border-[var(--border-subtle)] relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-[36px] font-semibold tracking-tight text-white">
            From PDF to decision in four passes.
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[11px] left-[10%] right-[10%] h-[1px] border-t border-dashed border-[var(--brand-accent)]/30 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* Mobile vertical line */}
                {i !== steps.length - 1 && (
                  <div className="md:hidden absolute top-[24px] left-[11px] bottom-[-48px] w-[1px] border-l border-dashed border-[var(--brand-accent)]/30 -z-10"></div>
                )}
                
                <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-6 flex items-center gap-3">
                  <div className="w-[22px] h-[22px] rounded-full bg-[var(--bg-surface)] border border-[var(--brand-accent)]/50 flex items-center justify-center text-[var(--brand-accent)] flex-shrink-0 shadow-[0_0_10px_rgba(0,212,255,0.1)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-accent)]"></div>
                  </div>
                  STEP {step.num}
                </div>
                
                <h3 className="text-[18px] font-semibold text-white mb-3">
                  {step.title}
                </h3>
                
                <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
