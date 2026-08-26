import { Approach } from "@/components/approach";
import { Capabilities } from "@/components/capabilities";
import { FaqSection } from "@/components/faq-section";
import { Hero } from "@/components/hero";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Approach />
      <Capabilities />
      <FaqSection />
    </main>
  );
}
