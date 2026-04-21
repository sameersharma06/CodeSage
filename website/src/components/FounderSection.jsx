import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Code2, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FounderSection() {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".founder-card", {
                opacity: 0,
                y: 70,
            });

            gsap.set(".founder-copy", {
                opacity: 0,
                y: 50,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    end: "bottom 78%",
                    scrub: 1,
                },
            });

            tl.to(".founder-card", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
            });

            tl.to(
                ".founder-copy",
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                },
                "-=0.55"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative cinematic-section bg-black border-y border-white/10 overflow-hidden"
        >
            {/* ambient glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-electric-purple/10 blur-[180px]" />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="glass p-8 md:p-12 xl:p-16 founder-card">
                        <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-14 items-center">
                            {/* Avatar / Identity */}
                            <div className="flex flex-col items-center lg:items-start">
                                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[32px] bg-gradient-to-br from-neon-blue to-electric-purple flex items-center justify-center text-6xl md:text-7xl shadow-neon mb-6">
                                    👨‍💻
                                </div>

                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-xs tracking-[0.28em] text-white/65">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    SHIPPING FROM INDIA
                                </div>
                            </div>

                            {/* Copy */}
                            <div className="founder-copy">
                                <div className="text-neon-blue text-xs md:text-sm tracking-[0.35em] mb-4">
                                    BUILT BY THE FOUNDER
                                </div>

                                <h2 className="section-header mb-6">
                                    Built by Sameer Sharma
                                </h2>

                                <p className="text-xl md:text-3xl text-white/75 leading-snug mb-8 max-w-3xl">
                                    First-year CS & AI student from Haryana, India.
                                    Obsessed with sovereign AI systems that put developers back in control.
                                </p>

                                {/* Signals */}
                                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                        <Code2 className="w-5 h-5 text-neon-blue mb-3" />
                                        <div className="text-sm tracking-[0.18em] text-white/55 uppercase">
                                            Engineering First
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                        <Sparkles className="w-5 h-5 text-neon-blue mb-3" />
                                        <div className="text-sm tracking-[0.18em] text-white/55 uppercase">
                                            Product Obsessed
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                                        <Globe className="w-5 h-5 text-neon-blue mb-3" />
                                        <div className="text-sm tracking-[0.18em] text-white/55 uppercase">
                                            Global Ambition
                                        </div>
                                    </div>
                                </div>

                                <p className="text-white/45 leading-relaxed max-w-2xl">
                                    No VC deck. No giant team. No empty hype.
                                    Just relentless execution for developers who believe their code should stay theirs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}