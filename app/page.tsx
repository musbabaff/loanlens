import { NavBar } from "@/components/landing/nav-bar";
import { Hero } from "@/components/landing/hero";
import { Capabilities } from "@/components/landing/capabilities";
import { EditorialMemo } from "@/components/landing/editorial-memo";
import { ProcessTimeline } from "@/components/landing/process-timeline";
import { TrustStrip } from "@/components/landing/trust-strip";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--brand-accent)]/20 selection:text-white font-sans">
      <NavBar />
      <main>
        <Hero />
        <Capabilities />
        <EditorialMemo />
        <ProcessTimeline />
        <TrustStrip />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
