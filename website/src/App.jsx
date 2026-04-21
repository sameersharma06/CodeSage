import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import WhyCodeSage from "./components/WhyCodeSage";
import HowItWorks from "./components/HowItWorks";
import ComparisonSection from "./components/ComparisonSection";
import PerformanceSection from "./components/PerformanceSection";
import FounderSection from "./components/FounderSection";
import FinalCTA from "./components/FinalCTA";

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.2,
      lerp: 0.08,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener("resize", refresh);

    ScrollTrigger.defaults({
      markers: false,
    });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", refresh);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative bg-black text-white overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-neon-blue/10 blur-[180px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-electric-purple/10 blur-[180px]" />
      </div>

      {/* UI Layer */}
      <div className="relative z-10">
        <Navbar />

        <main>
          <Hero />
          <ProblemSection />
          <WhyCodeSage />
          <HowItWorks />
          <ComparisonSection />
          <PerformanceSection />
          <FounderSection />
          <FinalCTA />
        </main>
      </div>
    </div>
  );
}

export default App;
