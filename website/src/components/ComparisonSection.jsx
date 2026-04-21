import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ComparisonSection() {
    const sectionRef = useRef(null);

    const rows = [
        { label: "Code stays on your machine", cloud: false, sage: true },
        { label: "Requires internet access", cloud: true, sage: false },
        { label: "Monthly subscription costs", cloud: true, sage: false },
        { label: "Exact file + line references", cloud: false, sage: true },
        { label: "Works completely offline", cloud: false, sage: true },
        { label: "Private by default", cloud: false, sage: true },
        { label: "Instant local feedback", cloud: false, sage: true },
        { label: "No API keys required", cloud: false, sage: true },
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".compare-head", {
                opacity: 0,
                y: 50,
            });

            gsap.set(".compare-table", {
                opacity: 0,
                y: 80,
            });

            gsap.set(".compare-row", {
                opacity: 0,
                x: -40,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 72%",
                    end: "bottom 75%",
                    scrub: 1,
                },
            });

            tl.to(".compare-head", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
            });

            tl.to(
                ".compare-table",
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                },
                "-=0.45"
            );

            tl.to(
                ".compare-row",
                {
                    opacity: 1,
                    x: 0,
                    stagger: 0.08,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.55"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="compare"
            ref={sectionRef}
            className="relative cinematic-section bg-black overflow-hidden"
        >
            {/* ambient glow */}
            <div className="absolute top-32 right-0 w-[600px] h-[600px] bg-electric-purple/10 blur-[180px]" />

            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8">
                {/* Header */}
                <div className="compare-head text-center max-w-5xl mx-auto mb-20">
                    <div className="text-neon-blue text-xs md:text-sm tracking-[0.35em] mb-4">
                        THE DIFFERENCE
                    </div>

                    <h2 className="section-header mb-6">
                        One is cloud.
                        <br />
                        One is sovereign.
                    </h2>

                    <p className="section-subtext mx-auto">
                        Most tools rent intelligence back to you.
                        CodeSage keeps power where it belongs.
                    </p>
                </div>

                {/* Table */}
                <div className="compare-table glass overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-8 py-7 text-white/50 font-medium text-sm tracking-[0.18em]">
                                        FEATURE
                                    </th>

                                    <th className="px-8 py-7 text-center text-red-400 text-sm tracking-[0.18em] font-medium">
                                        CLOUD AI TOOLS
                                    </th>

                                    <th className="px-8 py-7 text-center text-neon-blue text-sm tracking-[0.18em] font-medium">
                                        CODESAGE ⚡
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="compare-row border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-8 py-7 text-lg font-medium text-white">
                                            {row.label}
                                        </td>

                                        <td className="px-8 py-7">
                                            <div className="flex justify-center">
                                                {row.cloud ? (
                                                    <X className="text-red-400" size={24} />
                                                ) : (
                                                    <Check className="text-white/25" size={24} />
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-8 py-7">
                                            <div className="flex justify-center">
                                                {row.sage ? (
                                                    <Check className="text-neon-blue" size={24} />
                                                ) : (
                                                    <X className="text-white/25" size={24} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="mt-8 text-center text-white/35 text-sm tracking-[0.22em]">
                    PRIVATE • FAST • OFFLINE • YOURS
                </div>
            </div>
        </section>
    );
}