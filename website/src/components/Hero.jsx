import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleBackground from "./ParticleBackground";
import { ArrowDown, Play } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const heroRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".hero-badge", {
                opacity: 0,
                y: 50,
                duration: 0.9,
                ease: "power3.out",
            })
                .from(
                    ".hero-line",
                    {
                        opacity: 0,
                        y: 90,
                        duration: 1.15,
                        stagger: 0.14,
                        ease: "power4.out",
                    },
                    "-=0.25"
                )
                .from(
                    ".hero-sub",
                    {
                        opacity: 0,
                        y: 35,
                        duration: 0.9,
                        ease: "power3.out",
                    },
                    "-=0.45"
                )
                .from(
                    ".hero-actions",
                    {
                        opacity: 0,
                        y: 35,
                        duration: 0.8,
                        ease: "power3.out",
                    },
                    "-=0.45"
                )
                .from(
                    ".hero-meta",
                    {
                        opacity: 0,
                        y: 20,
                        duration: 0.8,
                    },
                    "-=0.35"
                );

            gsap.to(".hero-content", {
                y: -90,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            gsap.to(".hero-bg", {
                scale: 1.08,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="hero"
            ref={heroRef}
            className="relative min-h-screen flex items-center overflow-hidden"
        >
            {/* Background */}
            <div className="hero-bg absolute inset-0">
                <ParticleBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-black" />
            </div>

            {/* Main Content */}
            <div className="hero-content relative z-20 w-full max-w-screen-2xl mx-auto px-6 md:px-8 pt-28 md:pt-24">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Badge */}
                    <div className="hero-badge inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl text-neon-blue text-xs md:text-sm tracking-[0.28em] mb-8">
                        <span className="relative flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75 animate-ping" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-neon-blue" />
                        </span>
                        NOW IN OPEN BETA
                    </div>

                    {/* Headline */}
                    <h1 className="mb-8 leading-[0.88]">
                        <div className="hero-line section-header">YOUR CODE.</div>

                        <div className="hero-line section-header">YOUR MACHINE.</div>

                        <div className="hero-line section-header bg-gradient-to-r from-neon-blue via-electric-purple to-neon-blue bg-clip-text text-transparent">
                            YOUR POWER.
                        </div>
                    </h1>

                    {/* Subtext */}
                    <p className="hero-sub max-w-3xl mx-auto text-xl md:text-3xl text-white/65 font-light tracking-tight mb-12">
                        Senior-level code reviews.
                        <br className="hidden md:block" />
                        <span className="text-neon-blue">
                            {" "}
                            100% local. Zero cloud.
                        </span>
                    </p>

                    {/* Buttons */}
                    <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
                        <button
                            onClick={() =>
                                document
                                    .getElementById("cta")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="neon-button text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 rounded-2xl flex items-center gap-3 group"
                        >
                            <span>Download Free Forever</span>

                            <ArrowDown className="transition-transform duration-300 group-hover:translate-y-1" />
                        </button>

                        <button className="px-8 md:px-10 py-5 md:py-6 rounded-2xl border border-white/20 hover:border-white/45 transition-all duration-300 text-lg md:text-xl flex items-center gap-3 text-white/90">
                            <Play size={20} />
                            <span>Watch 47-sec Demo</span>
                        </button>
                    </div>

                    {/* Meta */}
                    <div className="hero-meta mt-20 md:mt-24 flex flex-col items-center text-white/35 text-xs md:text-sm tracking-[0.28em]">
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                            <span>WORKS OFFLINE</span>

                            <span className="hidden md:block w-px h-3 bg-white/20" />

                            <span>NO API KEYS</span>

                            <span className="hidden md:block w-px h-3 bg-white/20" />

                            <span>CODE STAYS PRIVATE</span>
                        </div>

                        <ArrowDown className="mt-10 animate-bounce text-white/25" />
                    </div>
                </div>
            </div>

            {/* Bottom Divider */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent z-20" />
        </section>
    );
}