import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    GitBranch,
    ArrowDown,
    Zap,
    Brain,
    FileText,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
    const sectionRef = useRef(null);

    const stages = [
        {
            icon: GitBranch,
            title: "GitHub Repo URL",
            desc: "Paste any public repository link.",
            color: "text-neon-blue",
        },
        {
            icon: ArrowDown,
            title: "Smart Ingestion",
            desc: "Maps files, dependencies, architecture.",
            color: "text-white",
        },
        {
            icon: Zap,
            title: "Rule Engine",
            desc: "Finds bugs, smells, anti-patterns instantly.",
            color: "text-neon-blue",
        },
        {
            icon: Brain,
            title: "Fast Pass AI",
            desc: "Immediate first-layer review and signals.",
            color: "text-electric-purple",
        },
        {
            icon: Brain,
            title: "Deep Pass AI",
            desc: "Context-aware reasoning across codebase.",
            color: "text-electric-purple",
        },
        {
            icon: FileText,
            title: "Structured Report",
            desc: "Precise fixes, severity, priorities, next steps.",
            color: "text-neon-blue",
        },
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".pipeline-head", {
                opacity: 0,
                y: 50,
            });

            gsap.set(".pipeline-step", {
                opacity: 0,
                y: 80,
            });

            gsap.set(".pipeline-line", {
                scaleY: 0,
                transformOrigin: "top center",
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 72%",
                    end: "bottom 72%",
                    scrub: 1,
                },
            });

            tl.to(".pipeline-head", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
            });

            tl.to(
                ".pipeline-step",
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.14,
                    duration: 1,
                    ease: "power3.out",
                },
                "-=0.45"
            );

            tl.to(
                ".pipeline-line",
                {
                    scaleY: 1,
                    stagger: 0.12,
                    duration: 0.7,
                    ease: "power2.out",
                },
                "-=0.9"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="how"
            ref={sectionRef}
            className="relative cinematic-section bg-zinc-950 text-white overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-neon-blue/10 blur-[180px]" />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
                {/* Header */}
                <div className="pipeline-head text-center max-w-5xl mx-auto mb-24">
                    <div className="text-neon-blue text-xs md:text-sm tracking-[0.35em] mb-4">
                        THE PIPELINE
                    </div>

                    <h2 className="section-header mb-6">
                        How CodeSage turns your repo into insight in seconds
                    </h2>

                    <p className="section-subtext mx-auto">
                        A multi-stage review engine built for speed, precision,
                        and private intelligence.
                    </p>
                </div>

                {/* Steps */}
                <div className="flex flex-col items-center max-w-5xl mx-auto">
                    {stages.map((stage, i) => {
                        const Icon = stage.icon;

                        return (
                            <div
                                key={i}
                                className={`pipeline-step w-full max-w-md flex flex-col items-center ${i !== stages.length - 1 ? "mb-16" : ""
                                    }`}
                            >
                                {/* Icon */}
                                <div className="w-24 h-24 rounded-[28px] bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl mb-6">
                                    <Icon size={42} className={stage.color} />
                                </div>

                                {/* Copy */}
                                <div className="text-center">
                                    <div className="text-xs text-white/35 tracking-[0.3em] mb-2">
                                        STEP {i + 1}
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
                                        {stage.title}
                                    </h3>

                                    <p className="text-white/55 max-w-sm mx-auto leading-relaxed">
                                        {stage.desc}
                                    </p>
                                </div>

                                {/* Connector */}
                                {i !== stages.length - 1 && (
                                    <div className="pipeline-line mt-8 w-px h-20 bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}