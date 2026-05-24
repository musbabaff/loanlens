export function TrustStrip() {
  const partners = [
    "AccessBank",
    "CB Azerbaijan",
    "Tier 1 Pilot",
    "Compliance: CBAR-ready"
  ];

  return (
    <section className="py-16 bg-[var(--bg-base)] border-t border-[var(--border-subtle)] relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-8 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
          BUILT FOR ENTERPRISE BANKING
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner, i) => (
            <div 
              key={i} 
              className="font-mono text-sm md:text-base text-[var(--text-secondary)] opacity-50 hover:opacity-100 hover:text-white transition-all duration-300 grayscale cursor-default"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
