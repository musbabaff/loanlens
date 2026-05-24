import { FileSearch, ShieldAlert, FileCheck } from "lucide-react";

export function Capabilities() {
  return (
    <section id="agents" className="py-24 bg-[var(--bg-base)] border-t border-[var(--border-subtle)] relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-4">
            CAPABILITIES
          </div>
          <h2 className="text-3xl md:text-[36px] font-semibold tracking-tight text-white mb-4">
            Five specialized agents. One audit-ready output.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-8 transition-all duration-300 hover:-translate-y-[2px] hover:border-[var(--border-default)] group flex flex-col h-full" style={{ hover: { boxShadow: '0 0 0 1px rgba(0,212,255,0.1), 0 0 24px rgba(0,212,255,0.1)' } } as any}>
            <style>{`
              .cap-card:hover {
                box-shadow: 0 0 0 1px rgba(0,212,255,0.1), 0 0 24px rgba(0,212,255,0.1);
              }
            `}</style>
            <div className="cap-card absolute inset-0 rounded-lg pointer-events-none transition-shadow opacity-0 group-hover:opacity-100"></div>
            
            <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase mb-6">
              01 / EXTRACTION
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 flex-grow-0">
              Parses every document, no manual entry
            </h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-8 flex-grow">
              Upload hundreds of pages of unstructured bank statements, tax returns, and operating agreements. Our agents extract every line item and entity automatically.
            </p>
            <div className="mt-auto">
              <FileSearch size={24} strokeWidth={1.5} className="text-[var(--brand-accent)]" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-8 transition-all duration-300 hover:-translate-y-[2px] hover:border-[var(--border-default)] group flex flex-col h-full relative">
            <div className="cap-card absolute inset-0 rounded-lg pointer-events-none transition-shadow opacity-0 group-hover:opacity-100"></div>
            
            <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase mb-6">
              02 / VERIFICATION
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 flex-grow-0">
              Cross-references claims against PDF forensics
            </h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-8 flex-grow">
              Numeric verification across independent sources highlights manipulations, mathematical impossibilities, or human data entry errors instantly.
            </p>
            <div className="mt-auto">
              <ShieldAlert size={24} strokeWidth={1.5} className="text-[var(--brand-accent)]" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-8 transition-all duration-300 hover:-translate-y-[2px] hover:border-[var(--border-default)] group flex flex-col h-full relative">
            <div className="cap-card absolute inset-0 rounded-lg pointer-events-none transition-shadow opacity-0 group-hover:opacity-100"></div>
            
            <div className="font-mono text-[11px] text-[var(--text-muted)] uppercase mb-6">
              03 / SYNTHESIS
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 flex-grow-0">
              Every claim cited to source page and line
            </h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-8 flex-grow">
              All extracted context and verified anomalies are compiled into a deterministic credit memo, fully traceable back to the raw source documents.
            </p>
            <div className="mt-auto">
              <FileCheck size={24} strokeWidth={1.5} className="text-[var(--brand-accent)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
