// app/page.tsx
import FrontHero from "@/components/front/home/FrontHero";
import LiveTickerMarquee from "@/components/front/home/LiveTickerMarquee";
import FrontAbout from "@/components/front/home/FrontAbout";
import PageEntrance from "@/components/animation/PageEntrance";
import FeatureCardsSection from "@/components/front/home/FeatureCardsSection";
import HomeFaq from "@/components/front/home/HomeFaq";
import CTASection from "@/components/front/home/CTASection";
export default function Home() {
  return (
    <PageEntrance>
      <div className="">
        {/* Background Ambient Glows */}
        <div className="gsap-reveal-target gsap-bg-glow absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#6E5CFF]/15 blur-[120px] pointer-events-none rounded-full scale-75" />
        <div className="gsap-reveal-target gsap-bg-glow absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#2B3164]/30 blur-[150px] pointer-events-none rounded-full scale-75" />

        {/* Hero Section */}
        <main className="max-w-full mx-auto">
          <div className="gsap-reveal-target gsap-hero-wrapper">
            <FrontHero />
          </div>
          <div className="gsap-reveal-target gsap-ticker-wrapper">
            <LiveTickerMarquee />
          </div>

          {/* Note: FrontCallToAction manages its own ScrollTrigger when scrolled into view */}
          <FrontAbout />
          <FeatureCardsSection />
          <HomeFaq />
          <CTASection />
        </main>
      </div>
    </PageEntrance>
  );
}
