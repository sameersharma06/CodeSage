import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Github, Download } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".cta-badge", {
                opacity: 0,
                y: 40,
            });

            gsap.set(".cta-line", {
                opacity: 0,
                y: 90,
            });

            gsap.set(".cta-sub", {
                opacity: 0,
                y: 35,
            });

            gsap.set(".cta-actions", {
                opacity: 0,
                y: 35,
            });

            gsap.set(".cta-meta", {
                opacity: 0,
                y: 20,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 72%",
                    end: "bottom 80%",
                    scrub: 1,
                },
            });

            tl.to(".cta-badge", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
            });

            tl.to(
                ".cta-line",
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.12,
                    duration: 1,
                    ease: "power4.out",
                },
                "-=0.25"
            );

            tl.to(
                ".cta-sub",
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.45"
            );

            tl.to(
                ".cta-actions",
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.4"
            );

            tl.to(
                ".cta-meta",
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                },
                "-=0.35"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="cta"
            ref={sectionRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-black"
        >
            {/* ambient glows */}
            <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-neon-blue/10 blur-[180px]" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-electric-purple/10 blur-[180px]" />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8 w-full">
                <div className="max-w-6xl mx-auto text-center">
                    {/* badge */}
                    <div className="cta-badge inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/[0.04] text-neon-blue text-xs md:text-sm tracking-[0.32em] mb-8">
                        READY TO OWN YOUR STACK
                    </div>

                    {/* headline */}
                    <h2 className="mb-8 leading-[0.88]">
                        <div className="cta-line section-header">
                            THE FUTURE
                        </div>

                        <div className="cta-line section-header">
                            OF CODE REVIEW
                        </div>

                        <div className="cta-line section-header bg-gradient-to-r from-neon-blue via-electric-purple to-neon-blue bg-clip-text text-transparent">
                            IS LOCAL.
                        </div>
                    </h2>

                    {/* sub */}
                    <p className="cta-sub max-w-3xl mx-auto text-xl md:text-3xl text-white/70 leading-snug mb-12">
                        Your machine.
                        Your rules.
                        Your power.
                    </p>

                    {/* actions */}
                    <div className="cta-actions flex flex-col md:flex-row gap-4 md:gap-5 justify-center">
                        <button
                            onClick={() =>
                                alert("🎉 Replace this with your real download flow.")
                            }
                            className="neon-button text-lg md:text-2xl px-10 md:px-14 py-5 md:py-7 rounded-2xl flex items-center justify-center gap-3"
                        >
                            <Download size={22} />
                            GET CODESAGE FREE
                        </button>

                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="px-10 md:px-14 py-5 md:py-7 rounded-2xl border border-white/20 hover:border-white/45 transition-all duration-300 text-lg md:text-2xl flex items-center justify-center gap-3"
                        >
                            <Github size={22} />
                            VIEW ON GITHUB
                            <ArrowRight size={20} />
                        </a>
                    </div>

                    {/* meta */}
                    <div className="cta-meta mt-12 text-white/35 text-sm tracking-[0.22em] leading-relaxed">
                        AVAILABLE FOR macOS • WINDOWS • LINUX
                        <br className="hidden md:block" />
                        RUNS ON MOST LAPTOPS WITH 8GB+ RAM
                    </div>
                </div>
            </div>
        </section>
    );
}