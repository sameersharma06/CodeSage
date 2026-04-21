import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Cpu,
    WifiOff,
    KeyRound,
    Target,
    Shield,
    Gauge,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function WhyCodeSage() {
    const sectionRef = useRef(null);

    const features = [
        {
            icon: Cpu,
            title: "Local AI",
            desc: "Runs entirely on your own hardware.",
        },
        {
            icon: WifiOff,
            title: "Offline Ready",
            desc: "No internet required. Ever.",
        },
        {
            icon: KeyRound,
            title: "Zero API Keys",
            desc: "No accounts. No billing. No friction.",
        },
        {
            icon: Target,
            title: "Exact Detection",
            desc: "File, line, and code-level precision.",
        },
        {
            icon: Shield,
            title: "Security First",
            desc: "Secrets, OWASP risks, vulnerable patterns.",
        },
        {
            icon: Gauge,
            title: "Performance Review",
            desc: "Big-O, memory, architecture, refactors.",
        },
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".why-visual", {
                opacity: 0,
                scale: 0.88,
            });

            gsap.set(".why-copy", {
                opacity: 0,
                x: 70,
            });

            gsap.set(".why-feature", {
                opacity: 0,
                y: 45,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 72%",
                    end: "bottom 72%",
                    scrub: 1,
                },
            });

            tl.to(".why-visual", {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out",
            });

            tl.to(
                ".why-copy",
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power3.out",
                },
                "-=0.55"
            );

            tl.to(
                ".why-feature",
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.08,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.55"
            );

            gsap.to(".scanner-line", {
                xPercent: 220,
                duration: 3,
                repeat: -1,
                ease: "none",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="why"
            ref={sectionRef}
            className="relative cinematic-section bg-black overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[700px] bg-neon-blue/10 blur-[180px]" />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
                <div className="grid xl:grid-cols-12 gap-14 xl:gap-20 items-center">
                    {/* Left Visual */}
                    <div className="xl:col-span-5 why-visual">
                        <div className="glass p-3 shadow-2xl shadow-neon-blue/10">
                            <div className="relative min-h-[520px] rounded-3xl bg-zinc-950 overflow-hidden flex flex-col items-center justify-center px-8">
                                {/* background grid glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-electric-purple/10" />

                                {/* logo core */}
                                <div className="relative z-10 w-72 h-72 rounded-[42px] border border-white/10 bg-white/[0.03] flex items-center justify-center text-[140px] shadow-2xl">
                                    ⚡
                                </div>

                                {/* scanning line */}
                                <div className="absolute left-[-40%] bottom-24 w-[60%] h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent scanner-line" />

                                {/* text */}
                                <div className="relative z-10 text-center mt-10">
                                    <div className="text-neon-blue text-2xl md:text-3xl tracking-[0.3em] mb-2">
                                        CODESAGE
                                    </div>

                                    <div className="text-white/70 text-lg md:text-xl">
                                        Your private AI senior engineer
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="xl:col-span-7">
                        <div className="why-copy mb-12">
                            <div className="text-neon-blue text-xs md:text-sm tracking-[0.35em] mb-4">
                                INTRODUCING
                            </div>

                            <h2 className="section-header mb-6">
                                Meet CodeSage ⚡
                            </h2>

                            <p className="text-xl md:text-3xl text-white/75 max-w-2xl leading-snug">
                                The AI code reviewer that never sends your code to the cloud.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                            {features.map((feature, i) => {
                                const Icon = feature.icon;

                                return (
                                    <div
                                        key={i}
                                        className="why-feature flex gap-5"
                                    >
                                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-neon-blue" />
                                        </div>

                                        <div>
                                            <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-2">
                                                {feature.title}
                                            </h3>

                                            <p className="text-white/55 leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}