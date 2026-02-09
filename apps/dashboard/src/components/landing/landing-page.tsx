import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { TrustBar } from "@/components/landing/trust-bar";
import { Footer } from "@/components/landing/footer";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <HeroSection />
      <HowItWorks />
      <FeatureGrid />
      <TrustBar />
      <Footer />
    </main>
  );
}
